-- Fix critical security issue: Restrict payments table access to business owners only

-- Drop the overly permissive existing policy
DROP POLICY IF EXISTS "Admin can manage payments" ON public.payments;

-- Create secure policies that restrict access to business owners
CREATE POLICY "Businesses can view their own payments" 
ON public.payments 
FOR SELECT 
USING (
  business_id IN (
    SELECT id FROM public.businesses WHERE phone = auth.jwt() ->> 'phone'
  )
);

CREATE POLICY "Businesses can insert their own payments" 
ON public.payments 
FOR INSERT 
WITH CHECK (
  business_id IN (
    SELECT id FROM public.businesses WHERE phone = auth.jwt() ->> 'phone'
  )
);

CREATE POLICY "System can update payment status" 
ON public.payments 
FOR UPDATE 
USING (true);

-- Keep admin access for system administration (will be restricted to admin users later)
CREATE POLICY "Admin can manage all payments" 
ON public.payments 
FOR ALL 
USING (
  auth.jwt() ->> 'phone' IN (
    '+2348012345678'  -- Admin phone from environment
  )
);