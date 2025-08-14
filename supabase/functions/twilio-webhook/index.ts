import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
    
    console.log(`WhatsApp from ${from}: ${body}`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let responseMessage = "Welcome to ODIA SmartBiz! Send START to begin.";
    
    // Check for existing onboarding state
    const { data: existingState } = await supabase
      .from('onboarding_states')
      .select('*')
      .eq('phone', from)
      .single();

    if (body.toUpperCase() === 'START') {
      // Start new onboarding
      await supabase
        .from('onboarding_states')
        .upsert({
          phone: from,
          step: 1,
          business_type: null,
          business_name: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      responseMessage = `Welcome to ODIA SmartBiz! 🎉

I'll create your AI assistant in 60 seconds.

What type of business do you run?

1️⃣ Fashion/Boutique
2️⃣ Restaurant/Food
3️⃣ Pharmacy
4️⃣ School
5️⃣ Church

Reply with a number`;
    } else if (existingState) {
      // Continue onboarding flow
      if (existingState.step === 1 && ['1', '2', '3', '4', '5'].includes(body)) {
        const businessTypes = {
          '1': 'Fashion/Boutique',
          '2': 'Restaurant/Food',
          '3': 'Pharmacy',
          '4': 'School',
          '5': 'Church'
        };
        
        await supabase
          .from('onboarding_states')
          .update({
            business_type: businessTypes[body as keyof typeof businessTypes],
            step: 2,
            updated_at: new Date().toISOString()
          })
          .eq('phone', from);

        responseMessage = `Great! ${businessTypes[body as keyof typeof businessTypes]} business 👗

What's your business name?`;
      } else if (existingState.step === 2) {
        // Business name provided
        await supabase
          .from('onboarding_states')
          .update({
            business_name: body,
            step: 3,
            updated_at: new Date().toISOString()
          })
          .eq('phone', from);

        responseMessage = `Nice name! ${body}

Do you offer delivery?

Y - Yes
N - No`;
      } else if (existingState.step === 3 && ['Y', 'N', 'y', 'n'].includes(body.toUpperCase())) {
        const hasDelivery = body.toUpperCase() === 'Y';
        
        await supabase
          .from('onboarding_states')
          .update({
            has_delivery: hasDelivery,
            step: 4,
            updated_at: new Date().toISOString()
          })
          .eq('phone', from);

        responseMessage = `${hasDelivery ? 'Perfect! Delivery available' : 'Noted! No delivery'}

What are your business hours?

1. 8am - 6pm
2. 9am - 8pm
3. 10am - 10pm
4. 24/7 online

Reply with number`;
      } else if (existingState.step === 4 && ['1', '2', '3', '4'].includes(body)) {
        const businessHours = {
          '1': '8am - 6pm',
          '2': '9am - 8pm',
          '3': '10am - 10pm',
          '4': '24/7 online'
        };

        // Complete onboarding and create business
        await supabase
          .from('businesses')
          .insert({
            phone: from,
            name: existingState.business_name,
            type: existingState.business_type,
            business_hours: businessHours[body as keyof typeof businessHours],
            has_delivery: existingState.has_delivery,
            status: 'trial',
            trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            created_at: new Date().toISOString()
          });

        // Delete onboarding state
        await supabase
          .from('onboarding_states')
          .delete()
          .eq('phone', from);

        responseMessage = `🚀 DONE! Your AI Assistant 'Lexi' is ready!

✅ Business: ${existingState.business_name}
✅ Type: ${existingState.business_type}
✅ Hours: ${businessHours[body as keyof typeof businessHours]}
✅ Delivery: ${existingState.has_delivery ? 'Available' : 'Not available'}

Your customers can now message this number!

Try it - send 'Hi' to test Lexi

Your 7-day FREE trial starts now
After trial: ₦20,000/month

Commands:
PAUSE - Pause Lexi
RESUME - Resume Lexi
STATS - See today's statistics
HELP - Get support`;
      } else {
        responseMessage = "Please reply with the correct option to continue setup.";
      }
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