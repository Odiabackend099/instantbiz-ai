import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const from = formData.get('From')?.toString().replace('whatsapp:', '') || '';
    const body = formData.get('Body')?.toString().trim() || '';
    
    console.log('Webhook received:', { from, body });

    let responseMessage = "Welcome! Send START to create your AI assistant.";
    
    if (body.toUpperCase() === 'START') {
      responseMessage = `Welcome to ODIA SmartBiz! 🎉

I'll create your AI assistant in 60 seconds.

What type of business do you run?

1️⃣ Fashion/Boutique
2️⃣ Restaurant/Food
3️⃣ Pharmacy
4️⃣ School
5️⃣ Church

Reply with a number`;
    }

    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Message>
          <Body>${responseMessage}</Body>
        </Message>
      </Response>`,
      {
        status: 200,
        headers: { 
          'Content-Type': 'text/xml',
          ...corsHeaders
        }
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Message>
          <Body>Error occurred. Try again.</Body>
        </Message>
      </Response>`,
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'text/xml',
          ...corsHeaders
        } 
      }
    );
  }
})