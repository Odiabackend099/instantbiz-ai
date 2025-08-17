// ODIA WhatsApp Webhook Proxy
// This forwards Twilio WhatsApp messages to n8n

export default async function handler(req, res) {
  console.log('🚀 ODIA Webhook received from Twilio');
  console.log('Method:', req.method);
  console.log('Body:', req.body);
  
  if (req.method !== 'POST') {
    return res.status(405).send('Method not allowed');
  }
  
  try {
    // Forward the webhook to n8n
    const n8nUrl = 'https://odiadev098.app.n8n.cloud/webhook/whatsapp';
    
    const response = await fetch(n8nUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'ODIA-Webhook-Proxy/1.0'
      },
      body: new URLSearchParams(req.body).toString()
    });
    
    const responseText = await response.text();
    console.log('✅ n8n response:', responseText);
    
    // Send success response to Twilio
    res.status(200).send('OK');
    
  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(200).send('OK'); // Always return OK to Twilio
  }
}
