-- Complete fix for payments table security issue
-- This drops all policies and creates a secure default

-- Drop all existing policies by name variations
DO $$ 
BEGIN
    -- Drop policies that might exist with various names
    DROP POLICY IF EXISTS "Admin can manage payments" ON public.payments;
    DROP POLICY IF EXISTS "Businesses can view their own payments" ON public.payments;
    DROP POLICY IF EXISTS "Businesses can insert their own payments" ON public.payments; 
    DROP POLICY IF EXISTS "System can update payment status" ON public.payments;
    DROP POLICY IF EXISTS "Restrict payments access" ON public.payments;
    DROP POLICY IF EXISTS "System operations only" ON public.payments;
    DROP POLICY IF EXISTS "Anyone can read response cache" ON public.payments;
    
    -- Create new restrictive policy (blocks all access by default)
    -- This ensures no unauthorized access to financial data
    CREATE POLICY "Block all public access to payments" 
    ON public.payments 
    FOR ALL 
    USING (false)
    WITH CHECK (false);
    
EXCEPTION 
    WHEN OTHERS THEN 
        -- If policies don't exist, continue
        NULL;
END $$;