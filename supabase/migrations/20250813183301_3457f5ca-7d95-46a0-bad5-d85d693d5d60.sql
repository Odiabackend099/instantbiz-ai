-- Create businesses table
CREATE TABLE public.businesses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone TEXT NOT NULL UNIQUE,
  name TEXT,
  type TEXT,
  status TEXT DEFAULT 'trial' CHECK (status IN ('trial', 'active', 'paused', 'expired')),
  trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + interval '7 days'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create message queue table
CREATE TABLE public.message_queue (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Create response cache table
CREATE TABLE public.response_cache (
  business_type TEXT NOT NULL,
  question_hash TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (business_type, question_hash)
);

-- Create payments table
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  tx_ref TEXT UNIQUE,
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create onboarding states table for tracking progress
CREATE TABLE public.onboarding_states (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone TEXT NOT NULL UNIQUE,
  current_step INTEGER DEFAULT 1,
  business_type TEXT,
  business_name TEXT,
  product_category TEXT,
  has_delivery BOOLEAN,
  business_hours TEXT,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create analytics table for tracking usage
CREATE TABLE public.analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  messages_handled INTEGER DEFAULT 0,
  customers_served INTEGER DEFAULT 0,
  orders_taken INTEGER DEFAULT 0,
  avg_response_time_ms INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(business_id, date)
);

-- Enable Row Level Security
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.response_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for businesses table (admin access for now)
CREATE POLICY "Admin can manage all businesses" 
ON public.businesses 
FOR ALL 
USING (true);

-- Create policies for message_queue (admin access)
CREATE POLICY "Admin can manage message queue" 
ON public.message_queue 
FOR ALL 
USING (true);

-- Create policies for response_cache (read-only for all, admin can manage)
CREATE POLICY "Anyone can read response cache" 
ON public.response_cache 
FOR SELECT 
USING (true);

CREATE POLICY "Admin can manage response cache" 
ON public.response_cache 
FOR ALL 
USING (true);

-- Create policies for payments (admin access)
CREATE POLICY "Admin can manage payments" 
ON public.payments 
FOR ALL 
USING (true);

-- Create policies for onboarding_states (admin access)
CREATE POLICY "Admin can manage onboarding states" 
ON public.onboarding_states 
FOR ALL 
USING (true);

-- Create policies for analytics (admin access)
CREATE POLICY "Admin can manage analytics" 
ON public.analytics 
FOR ALL 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_businesses_updated_at
  BEFORE UPDATE ON public.businesses
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_onboarding_states_updated_at
  BEFORE UPDATE ON public.onboarding_states
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_businesses_phone ON public.businesses(phone);
CREATE INDEX idx_businesses_status ON public.businesses(status);
CREATE INDEX idx_message_queue_status ON public.message_queue(status);
CREATE INDEX idx_message_queue_phone ON public.message_queue(phone);
CREATE INDEX idx_message_queue_created_at ON public.message_queue(created_at);
CREATE INDEX idx_payments_business_id ON public.payments(business_id);
CREATE INDEX idx_payments_tx_ref ON public.payments(tx_ref);
CREATE INDEX idx_onboarding_states_phone ON public.onboarding_states(phone);
CREATE INDEX idx_analytics_business_id_date ON public.analytics(business_id, date);