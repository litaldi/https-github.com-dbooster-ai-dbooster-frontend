
-- Fix RLS policies for rate_limit_tracking table
-- Remove overly restrictive policies and add proper user access

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Service role can manage rate limits" ON public.rate_limit_tracking;
DROP POLICY IF EXISTS "No user deletions of rate limits" ON public.rate_limit_tracking;

-- Add policies that allow users to manage their own rate limit records
CREATE POLICY "Users can view their own rate limits" 
  ON public.rate_limit_tracking 
  FOR SELECT 
  USING (identifier = CONCAT('login:', auth.email()) OR identifier = auth.uid()::text);

CREATE POLICY "Users can insert their own rate limits" 
  ON public.rate_limit_tracking 
  FOR INSERT 
  WITH CHECK (identifier = CONCAT('login:', auth.email()) OR identifier = auth.uid()::text);

CREATE POLICY "Users can update their own rate limits" 
  ON public.rate_limit_tracking 
  FOR UPDATE 
  USING (identifier = CONCAT('login:', auth.email()) OR identifier = auth.uid()::text);

-- Allow service role to manage all rate limits for system operations
CREATE POLICY "Service role can manage all rate limits" 
  ON public.rate_limit_tracking 
  FOR ALL 
  USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text)
  WITH CHECK ((auth.jwt() ->> 'role'::text) = 'service_role'::text);

-- Prevent regular users from deleting rate limit records (system integrity)
CREATE POLICY "Prevent user deletions of rate limits" 
  ON public.rate_limit_tracking 
  FOR DELETE 
  USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text);
