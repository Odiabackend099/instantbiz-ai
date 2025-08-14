import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

class VoiceChatManager {
  private openaiWs: WebSocket | null = null;
  private clientWs: WebSocket | null = null;
  private sessionCreated = false;

  constructor() {
    console.log('VoiceChatManager initialized');
  }

  async connectToOpenAI() {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    const url = 'wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01';
    
    this.openaiWs = new WebSocket(url, {
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'OpenAI-Beta': 'realtime=v1'
      }
    });

    return new Promise((resolve, reject) => {
      this.openaiWs!.onopen = () => {
        console.log('Connected to OpenAI Realtime API');
        resolve(true);
      };

      this.openaiWs!.onerror = (error) => {
        console.error('OpenAI WebSocket error:', error);
        reject(error);
      };

      this.openaiWs!.onmessage = (event) => {
        this.handleOpenAIMessage(event.data);
      };

      this.openaiWs!.onclose = () => {
        console.log('OpenAI WebSocket closed');
        this.sessionCreated = false;
      };
    });
  }

  handleOpenAIMessage(data: string) {
    try {
      const message = JSON.parse(data);
      console.log('OpenAI message type:', message.type);

      // Handle session creation
      if (message.type === 'session.created') {
        this.sessionCreated = true;
        console.log('OpenAI session created successfully');
      }

      // Forward all messages to client
      if (this.clientWs && this.clientWs.readyState === WebSocket.OPEN) {
        this.clientWs.send(data);
      }
    } catch (error) {
      console.error('Error handling OpenAI message:', error);
    }
  }

  handleClientMessage(data: string) {
    try {
      const message = JSON.parse(data);
      console.log('Client message type:', message.type);

      // Handle session update after session is created
      if (message.type === 'session.update' && this.sessionCreated) {
        console.log('Forwarding session update to OpenAI');
        if (this.openaiWs && this.openaiWs.readyState === WebSocket.OPEN) {
          this.openaiWs.send(data);
        }
      }
      // Handle audio input
      else if (message.type === 'input_audio_buffer.append') {
        if (this.openaiWs && this.openaiWs.readyState === WebSocket.OPEN) {
          this.openaiWs.send(data);
        }
      }
      // Handle other message types
      else if (this.openaiWs && this.openaiWs.readyState === WebSocket.OPEN) {
        this.openaiWs.send(data);
      }
    } catch (error) {
      console.error('Error handling client message:', error);
    }
  }

  setClientWebSocket(ws: WebSocket) {
    this.clientWs = ws;
  }

  cleanup() {
    if (this.openaiWs) {
      this.openaiWs.close();
      this.openaiWs = null;
    }
    this.clientWs = null;
    this.sessionCreated = false;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Upgrade to WebSocket
  if (req.headers.get('upgrade') !== 'websocket') {
    return new Response('Expected WebSocket upgrade', { status: 400 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  const voiceChatManager = new VoiceChatManager();

  socket.onopen = async () => {
    console.log('Client WebSocket connected');
    voiceChatManager.setClientWebSocket(socket);
    
    try {
      await voiceChatManager.connectToOpenAI();
    } catch (error) {
      console.error('Failed to connect to OpenAI:', error);
      socket.close(1011, 'Failed to connect to OpenAI');
    }
  };

  socket.onmessage = (event) => {
    voiceChatManager.handleClientMessage(event.data);
  };

  socket.onclose = () => {
    console.log('Client WebSocket disconnected');
    voiceChatManager.cleanup();
  };

  socket.onerror = (error) => {
    console.error('Client WebSocket error:', error);
    voiceChatManager.cleanup();
  };

  return response;
});