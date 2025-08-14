import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, MessageSquare, X, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface VoiceChatWidgetProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

const VoiceChatWidget: React.FC<VoiceChatWidgetProps> = ({ isOpen = false, onToggle }) => {
  const [isExpanded, setIsExpanded] = useState(isOpen);
  const [isListening, setIsListening] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Array<{id: string, text: string, sender: 'user' | 'ai', timestamp: Date}>>([]);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  
  const audioContext = useRef<AudioContext | null>(null);
  const ws = useRef<WebSocket | null>(null);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const { toast } = useToast();

  // Initialize audio context
  const initializeAudio = async () => {
    try {
      audioContext.current = new AudioContext({ sampleRate: 24000 });
      console.log('Audio context initialized');
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
      toast({
        title: "Audio Error",
        description: "Failed to initialize audio. Please check your browser permissions.",
        variant: "destructive",
      });
    }
  };

  // Connect to voice chat WebSocket
  const connectToVoiceChat = async () => {
    if (connectionStatus === 'connecting') return;
    
    setConnectionStatus('connecting');
    
    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      // Initialize WebSocket connection through Supabase Edge Function
      ws.current = new WebSocket(`wss://chodhjjqugvcqbjhjsjb.supabase.co/functions/v1/voice-chat`);
      
      ws.current.onopen = () => {
        console.log('WebSocket connected');
        setConnectionStatus('connected');
        setIsConnected(true);
        
        // Send session configuration
        ws.current?.send(JSON.stringify({
          type: 'session.update',
          session: {
            modalities: ['text', 'audio'],
            instructions: 'You are a helpful AI assistant for Nigerian businesses. Respond naturally and be helpful.',
            voice: 'alloy',
            input_audio_format: 'pcm16',
            output_audio_format: 'pcm16',
            turn_detection: {
              type: 'server_vad',
              threshold: 0.5,
              prefix_padding_ms: 300,
              silence_duration_ms: 1000
            },
            temperature: 0.8
          }
        }));
      };

      ws.current.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        console.log('Received:', data.type);
        
        switch (data.type) {
          case 'session.created':
            console.log('Session created successfully');
            break;
            
          case 'response.audio.delta':
            if (data.delta) {
              await playAudioChunk(data.delta);
              setIsSpeaking(true);
            }
            break;
            
          case 'response.audio.done':
            setIsSpeaking(false);
            break;
            
          case 'response.audio_transcript.delta':
            if (data.delta) {
              // Update AI message in real-time
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last && last.sender === 'ai') {
                  return [...prev.slice(0, -1), { ...last, text: last.text + data.delta }];
                } else {
                  return [...prev, { 
                    id: Date.now().toString(), 
                    text: data.delta, 
                    sender: 'ai', 
                    timestamp: new Date() 
                  }];
                }
              });
            }
            break;
            
          case 'input_audio_buffer.speech_started':
            setIsListening(true);
            break;
            
          case 'input_audio_buffer.speech_stopped':
            setIsListening(false);
            break;
        }
      };

      ws.current.onclose = () => {
        console.log('WebSocket disconnected');
        setConnectionStatus('disconnected');
        setIsConnected(false);
        setIsListening(false);
        setIsSpeaking(false);
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setConnectionStatus('disconnected');
        toast({
          title: "Connection Error",
          description: "Failed to connect to voice chat. Please try again.",
          variant: "destructive",
        });
      };

      // Set up audio recording
      setupAudioRecording(stream);

    } catch (error) {
      console.error('Failed to connect:', error);
      setConnectionStatus('disconnected');
      toast({
        title: "Permission Denied",
        description: "Microphone access is required for voice chat.",
        variant: "destructive",
      });
    }
  };

  // Set up audio recording and streaming
  const setupAudioRecording = (stream: MediaStream) => {
    if (!audioContext.current) return;

    const source = audioContext.current.createMediaStreamSource(stream);
    const processor = audioContext.current.createScriptProcessor(4096, 1, 1);

    processor.onaudioprocess = (e) => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        const inputData = e.inputBuffer.getChannelData(0);
        const audioData = encodeAudioForAPI(inputData);
        
        ws.current.send(JSON.stringify({
          type: 'input_audio_buffer.append',
          audio: audioData
        }));
      }
    };

    source.connect(processor);
    processor.connect(audioContext.current.destination);
  };

  // Encode audio for OpenAI API
  const encodeAudioForAPI = (float32Array: Float32Array): string => {
    const int16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    
    const uint8Array = new Uint8Array(int16Array.buffer);
    let binary = '';
    const chunkSize = 0x8000;
    
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      const chunk = uint8Array.subarray(i, Math.min(i + chunkSize, uint8Array.length));
      binary += String.fromCharCode.apply(null, Array.from(chunk));
    }
    
    return btoa(binary);
  };

  // Play audio chunk from AI response
  const playAudioChunk = async (base64Audio: string) => {
    if (!audioContext.current) return;

    try {
      const binaryString = atob(base64Audio);
      const bytes = new Uint8Array(binaryString.length);
      
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Convert PCM to audio buffer
      const wavData = createWavFromPCM(bytes);
      const audioBuffer = await audioContext.current.decodeAudioData(wavData.buffer);
      
      const source = audioContext.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.current.destination);
      source.start(0);
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  // Create WAV file from PCM data
  const createWavFromPCM = (pcmData: Uint8Array) => {
    const int16Data = new Int16Array(pcmData.length / 2);
    for (let i = 0; i < pcmData.length; i += 2) {
      int16Data[i / 2] = (pcmData[i + 1] << 8) | pcmData[i];
    }
    
    const wavHeader = new ArrayBuffer(44);
    const view = new DataView(wavHeader);
    
    const writeString = (view: DataView, offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    const sampleRate = 24000;
    const numChannels = 1;
    const bitsPerSample = 16;
    const blockAlign = (numChannels * bitsPerSample) / 8;
    const byteRate = sampleRate * blockAlign;

    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + int16Data.byteLength, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitsPerSample, true);
    writeString(view, 36, 'data');
    view.setUint32(40, int16Data.byteLength, true);

    const wavArray = new Uint8Array(wavHeader.byteLength + int16Data.byteLength);
    wavArray.set(new Uint8Array(wavHeader), 0);
    wavArray.set(new Uint8Array(int16Data.buffer), wavHeader.byteLength);
    
    return wavArray;
  };

  // Disconnect from voice chat
  const disconnect = () => {
    ws.current?.close();
    mediaRecorder.current?.stop();
    setIsConnected(false);
    setIsListening(false);
    setIsSpeaking(false);
    setConnectionStatus('disconnected');
  };

  // Toggle widget expansion
  const toggleWidget = () => {
    setIsExpanded(!isExpanded);
    onToggle?.();
  };

  // Initialize audio on component mount
  useEffect(() => {
    initializeAudio();
    return () => {
      disconnect();
      audioContext.current?.close();
    };
  }, []);

  return (
    <>
      {/* Floating Action Button */}
      <motion.div
        className="fixed bottom-8 right-8 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={toggleWidget}
          className="h-16 w-16 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white shadow-2xl pulse-glow"
          size="icon"
        >
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {isExpanded ? <X className="h-8 w-8" /> : <MessageSquare className="h-8 w-8" />}
          </motion.div>
        </Button>
      </motion.div>

      {/* Chat Widget */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="fixed bottom-28 right-8 z-40"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Card className="w-96 h-[500px] shadow-2xl border-0 overflow-hidden">
              {/* Header */}
              <div className="bg-[#25D366] text-white p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">SmartBiz AI</h3>
                      <p className="text-sm opacity-90">Voice Assistant</p>
                    </div>
                  </div>
                  <Badge variant={connectionStatus === 'connected' ? 'default' : 'secondary'}>
                    {connectionStatus}
                  </Badge>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto max-h-64 space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <Mic className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p className="mb-2">Ready for voice conversation</p>
                    <p className="text-sm">Click connect and start speaking</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                          message.sender === 'user'
                            ? 'bg-[#25D366] text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        {message.text}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Controls */}
              <div className="p-4 border-t bg-gray-50">
                <div className="flex items-center justify-center gap-4">
                  {!isConnected ? (
                    <Button
                      onClick={connectToVoiceChat}
                      disabled={connectionStatus === 'connecting'}
                      className="bg-[#25D366] hover:bg-[#128C7E] text-white px-6"
                    >
                      {connectionStatus === 'connecting' ? 'Connecting...' : 'Connect Voice'}
                    </Button>
                  ) : (
                    <>
                      {/* Microphone Status */}
                      <motion.div
                        className={`p-3 rounded-full ${
                          isListening 
                            ? 'bg-red-100 text-red-600' 
                            : 'bg-gray-100 text-gray-600'
                        }`}
                        animate={{ scale: isListening ? 1.1 : 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
                      </motion.div>

                      {/* Speaker Status */}
                      <motion.div
                        className={`p-3 rounded-full ${
                          isSpeaking 
                            ? 'bg-blue-100 text-blue-600' 
                            : 'bg-gray-100 text-gray-600'
                        }`}
                        animate={{ scale: isSpeaking ? 1.1 : 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        {isSpeaking ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
                      </motion.div>

                      {/* Disconnect Button */}
                      <Button
                        onClick={disconnect}
                        variant="outline"
                        size="sm"
                      >
                        Disconnect
                      </Button>
                    </>
                  )}
                </div>

                {/* Status Text */}
                <div className="text-center mt-3">
                  <p className="text-xs text-gray-500">
                    {isListening && 'Listening...'}
                    {isSpeaking && 'AI is speaking...'}
                    {!isListening && !isSpeaking && isConnected && 'Ready to listen'}
                    {!isConnected && 'Click connect to start voice chat'}
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VoiceChatWidget;