-- Phase 1: Authentication and Database Access Control Security Fixes

-- Create profiles table to link auth users to businesses
CREATE TABLE public.profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id uuid REFERENCES public.businesses(id) ON DELETE CASCADE,
  phone text,
  display_name text,
  role text DEFAULT 'business_owner',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Add business_owner_id to businesses table for proper ownership
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS owner_id uuid REFERENCES public.profiles(user_id);

-- Create index for performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_profiles_business_id ON public.profiles(business_id);
CREATE INDEX idx_businesses_owner_id ON public.businesses(owner_id);

-- Create trigger for profiles timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- SECURITY FIX 1: Replace overly permissive RLS policies

-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Admin can manage all businesses" ON public.businesses;
DROP POLICY IF EXISTS "Admin can manage onboarding states" ON public.onboarding_states;
DROP POLICY IF EXISTS "Admin can manage analytics" ON public.analytics;
DROP POLICY IF EXISTS "Admin can manage message queue" ON public.message_queue;
DROP POLICY IF EXISTS "Admin can manage all payments" ON public.payments;
DROP POLICY IF EXISTS "Block all public access to payments" ON public.payments;

-- PROFILES TABLE POLICIES
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- BUSINESSES TABLE POLICIES - Only business owners can access their business
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

-- ONBOARDING STATES - Only business owners can see their onboarding
CREATE POLICY "Business owners can view their onboarding"
  ON public.onboarding_states FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses b
      JOIN public.profiles p ON p.business_id = b.id
      WHERE p.user_id = auth.uid() AND b.phone = onboarding_states.phone
    )
  );

CREATE POLICY "Business owners can manage their onboarding"
  ON public.onboarding_states FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses b
      JOIN public.profiles p ON p.business_id = b.id
      WHERE p.user_id = auth.uid() AND b.phone = onboarding_states.phone
    )
  );

-- ANALYTICS - Only business owners can see their analytics
CREATE POLICY "Business owners can view their analytics"
  ON public.analytics FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid() AND p.business_id = analytics.business_id
    )
  );

CREATE POLICY "Business owners can manage their analytics"
  ON public.analytics FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid() AND p.business_id = analytics.business_id
    )
  );

-- MESSAGE QUEUE - Only business owners can see their messages
CREATE POLICY "Business owners can view their messages"
  ON public.message_queue FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses b
      JOIN public.profiles p ON p.business_id = b.id
      WHERE p.user_id = auth.uid() AND b.phone = message_queue.phone
    )
  );

CREATE POLICY "Business owners can manage their messages"
  ON public.message_queue FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.businesses b
      JOIN public.profiles p ON p.business_id = b.id
      WHERE p.user_id = auth.uid() AND b.phone = message_queue.phone
    )
  );

-- PAYMENTS - Only business owners can see their payments, admins can see all
CREATE POLICY "Business owners can view their payments"
  ON public.payments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid() AND p.business_id = payments.business_id
    )
  );

CREATE POLICY "Business owners can create payments"
  ON public.payments FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.user_id = auth.uid() AND p.business_id = payments.business_id
    )
  );

-- System admin access (for authorized admin users only)
CREATE POLICY "System admins have full access"
  ON public.businesses FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "System admins access to payments"
  ON public.payments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, phone)
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'display_name',
    new.raw_user_meta_data ->> 'phone'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();