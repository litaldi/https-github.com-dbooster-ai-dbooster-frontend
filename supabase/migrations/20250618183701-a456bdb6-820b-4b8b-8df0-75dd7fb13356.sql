
-- Fix critical RLS policy issues by updating existing policies

-- 1. Drop existing policies on security_audit_log and recreate them properly
DROP POLICY IF EXISTS "System can insert audit logs" ON public.security_audit_log;
DROP POLICY IF EXISTS "Users can view their own audit logs" ON public.security_audit_log;
DROP POLICY IF EXISTS "Authenticated users can view system logs" ON public.security_audit_log;

-- Create proper policies for security_audit_log
CREATE POLICY "System can insert audit logs" 
  ON public.security_audit_log 
  FOR INSERT 
  WITH CHECK (true);

-- Policy for users to view their own audit logs (for transparency)
CREATE POLICY "Users can view their own audit logs" 
  ON public.security_audit_log 
  FOR SELECT 
  USING (user_id = auth.uid() OR user_id IS NULL);

-- 2. Fix overly permissive rate_limit_tracking policies
DROP POLICY IF EXISTS "System can manage rate limits" ON public.rate_limit_tracking;
DROP POLICY IF EXISTS "System can insert rate limit records" ON public.rate_limit_tracking;
DROP POLICY IF EXISTS "System can update rate limit records" ON public.rate_limit_tracking;
DROP POLICY IF EXISTS "System can select rate limit records" ON public.rate_limit_tracking;
DROP POLICY IF EXISTS "No user deletions of rate limits" ON public.rate_limit_tracking;

-- Create more specific policies for rate limiting
CREATE POLICY "System can insert rate limit records" 
  ON public.rate_limit_tracking 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "System can update rate limit records" 
  ON public.rate_limit_tracking 
  FOR UPDATE 
  USING (true);

CREATE POLICY "System can select rate limit records" 
  ON public.rate_limit_tracking 
  FOR SELECT 
  USING (true);

-- Users should not be able to delete their rate limit records
CREATE POLICY "No user deletions of rate limits" 
  ON public.rate_limit_tracking 
  FOR DELETE 
  USING (false);
