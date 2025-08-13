-- Security fixes for existing database structure

-- First, let's check if profiles table has the right structure and update if needed
DO $$
BEGIN
  -- Add missing columns to profiles if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'business_id') THEN
    ALTER TABLE public.profiles ADD COLUMN business_id uuid REFERENCES public.businesses(id) ON DELETE CASCADE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'role') THEN
    ALTER TABLE public.profiles ADD COLUMN role text DEFAULT 'business_owner';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'phone') THEN
    ALTER TABLE public.profiles ADD COLUMN phone text;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'display_name') THEN
    ALTER TABLE public.profiles ADD COLUMN display_name text;
  END IF;
END $$;

-- Add owner_id to businesses table if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'businesses' AND column_name = 'owner_id') THEN
    ALTER TABLE public.businesses ADD COLUMN owner_id uuid REFERENCES auth.users(id);
  END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_business_id ON public.profiles(business_id);
CREATE INDEX IF NOT EXISTS idx_businesses_owner_id ON public.businesses(owner_id);

-- CRITICAL SECURITY FIX: Drop all overly permissive RLS policies
DROP POLICY IF EXISTS "Admin can manage all businesses" ON public.businesses;
DROP POLICY IF EXISTS "Admin can manage onboarding states" ON public.onboarding_states;  
DROP POLICY IF EXISTS "Admin can manage analytics" ON public.analytics;
DROP POLICY IF EXISTS "Admin can manage message queue" ON public.message_queue;
DROP POLICY IF EXISTS "Admin can manage all payments" ON public.payments;
DROP POLICY IF EXISTS "Block all public access to payments" ON public.payments;
DROP POLICY IF EXISTS "Admin can manage response cache" ON public.response_cache;

-- Enable RLS on all tables if not already enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- SECURE PROFILES TABLE POLICIES
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- SECURE BUSINESSES TABLE POLICIES
CREATE POLICY "Business owners can view their business"
  ON public.businesses FOR SELECT
  USING (
    owner_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND business_id = businesses.id
    )
  );

CREATE POLICY "Business owners can update their business"
  ON public.businesses FOR UPDATE
  USING (
    owner_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() AND business_id = businesses.id
    )
  );

CREATE POLICY "Users can create businesses"
  ON public.businesses FOR INSERT
  WITH CHECK (owner_id = auth.uid());

-- SECURE ONBOARDING STATES POLICIES
CREATE POLICY "Business owners can view their onboarding"
  ON public.onboarding_states FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses b
      LEFT JOIN public.profiles p ON p.business_id = b.id
      WHERE (p.user_id = auth.uid() OR b.owner_id = auth.uid()) 
      AND b.phone = onboarding_states.phone
    )
  );

CREATE POLICY "Business owners can manage their onboarding"
  ON public.onboarding_states FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses b
      LEFT JOIN public.profiles p ON p.business_id = b.id
      WHERE (p.user_id = auth.uid() OR b.owner_id = auth.uid()) 
      AND b.phone = onboarding_states.phone
    )
  );

-- SECURE ANALYTICS POLICIES
CREATE POLICY "Business owners can view their analytics"
  ON public.analytics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses b
      LEFT JOIN public.profiles p ON p.business_id = b.id
      WHERE (p.user_id = auth.uid() OR b.owner_id = auth.uid()) 
      AND b.id = analytics.business_id
    )
  );

CREATE POLICY "Business owners can manage their analytics"
  ON public.analytics FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses b
      LEFT JOIN public.profiles p ON p.business_id = b.id
      WHERE (p.user_id = auth.uid() OR b.owner_id = auth.uid()) 
      AND b.id = analytics.business_id
    )
  );

-- SECURE MESSAGE QUEUE POLICIES
CREATE POLICY "Business owners can view their messages"
  ON public.message_queue FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses b
      LEFT JOIN public.profiles p ON p.business_id = b.id
      WHERE (p.user_id = auth.uid() OR b.owner_id = auth.uid()) 
      AND b.phone = message_queue.phone
    )
  );

CREATE POLICY "Business owners can manage their messages"
  ON public.message_queue FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses b
      LEFT JOIN public.profiles p ON p.business_id = b.id
      WHERE (p.user_id = auth.uid() OR b.owner_id = auth.uid()) 
      AND b.phone = message_queue.phone
    )
  );

-- SECURE PAYMENTS POLICIES
CREATE POLICY "Business owners can view their payments"
  ON public.payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses b
      LEFT JOIN public.profiles p ON p.business_id = b.id
      WHERE (p.user_id = auth.uid() OR b.owner_id = auth.uid()) 
      AND b.id = payments.business_id
    )
  );

CREATE POLICY "Business owners can create payments"
  ON public.payments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.businesses b
      LEFT JOIN public.profiles p ON p.business_id = b.id
      WHERE (p.user_id = auth.uid() OR b.owner_id = auth.uid()) 
      AND b.id = payments.business_id
    )
  );

-- Keep response cache readable for performance
CREATE POLICY "Anyone can read response cache"
  ON public.response_cache FOR SELECT
  USING (true);

-- System admin access for authorized personnel only
CREATE POLICY "System admins have full business access"
  ON public.businesses FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "System admins have full payments access"
  ON public.payments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, phone)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'display_name', new.email),
    new.raw_user_meta_data ->> 'phone'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger if it doesn't exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();