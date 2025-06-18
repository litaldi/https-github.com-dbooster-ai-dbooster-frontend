
-- Fix critical RLS policy issues by updating existing policies

-- 1. Drop existing policies on queries table and recreate them properly
DROP POLICY IF EXISTS "Users can view queries from their repositories" ON public.queries;
DROP POLICY IF EXISTS "Users can insert queries for their repositories" ON public.queries;
DROP POLICY IF EXISTS "Users can update queries from their repositories" ON public.queries;
DROP POLICY IF EXISTS "Users can delete queries from their repositories" ON public.queries;

-- Enable RLS on queries table
ALTER TABLE public.queries ENABLE ROW LEVEL SECURITY;

-- Create proper policies for queries table
CREATE POLICY "Users can view queries from their repositories" 
  ON public.queries 
  FOR SELECT 
  USING (
    repository_id IN (
      SELECT id FROM public.repositories WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert queries for their repositories" 
  ON public.queries 
  FOR INSERT 
  WITH CHECK (
    repository_id IN (
      SELECT id FROM public.repositories WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update queries from their repositories" 
  ON public.queries 
  FOR UPDATE 
  USING (
    repository_id IN (
      SELECT id FROM public.repositories WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete queries from their repositories" 
  ON public.queries 
  FOR DELETE 
  USING (
    repository_id IN (
      SELECT id FROM public.repositories WHERE user_id = auth.uid()
    )
  );

-- 2. Drop existing policies on repositories table and recreate them
DROP POLICY IF EXISTS "Users can view their own repositories" ON public.repositories;
DROP POLICY IF EXISTS "Users can insert their own repositories" ON public.repositories;
DROP POLICY IF EXISTS "Users can update their own repositories" ON public.repositories;
DROP POLICY IF EXISTS "Users can delete their own repositories" ON public.repositories;

-- Enable RLS on repositories table
ALTER TABLE public.repositories ENABLE ROW LEVEL SECURITY;

-- Create policies for repositories table
CREATE POLICY "Users can view their own repositories" 
  ON public.repositories 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own repositories" 
  ON public.repositories 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own repositories" 
  ON public.repositories 
  FOR UPDATE 
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own repositories" 
  ON public.repositories 
  FOR DELETE 
  USING (user_id = auth.uid());

-- 3. Fix rate_limit_tracking policies
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

-- 4. Fix audit log policies
DROP POLICY IF EXISTS "Users can view their own audit logs" ON public.security_audit_log;
DROP POLICY IF EXISTS "System can insert audit logs" ON public.security_audit_log;

-- Create policies for audit log access
CREATE POLICY "Users can view their own audit logs" 
  ON public.security_audit_log 
  FOR SELECT 
  USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "System can insert audit logs" 
  ON public.security_audit_log 
  FOR INSERT 
  WITH CHECK (true);
