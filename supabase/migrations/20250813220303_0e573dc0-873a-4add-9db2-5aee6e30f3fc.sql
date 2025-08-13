-- Drop all existing policies first, then recreate secure ones
DO $$
DECLARE
    r RECORD;
BEGIN
    -- Drop all existing policies on our tables
    FOR r IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public' AND tablename IN ('profiles', 'businesses', 'onboarding_states', 'analytics', 'message_queue', 'payments', 'response_cache')) LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON public.' || r.tablename;
    END LOOP;
END $$;

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

-- SECURE BUSINESSES TABLE POLICIES - Only business owners can access their business
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

-- Keep response cache readable for performance but secure for writes
CREATE POLICY "Anyone can read response cache"
  ON public.response_cache FOR SELECT
  USING (true);

CREATE POLICY "Only system can write response cache"
  ON public.response_cache FOR INSERT
  WITH CHECK (false);

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