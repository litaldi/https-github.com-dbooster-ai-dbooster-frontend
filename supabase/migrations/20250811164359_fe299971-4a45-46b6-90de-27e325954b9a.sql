-- SECURITY FIX MIGRATION (idempotent-safe)
-- 1) Tighten CMS and admin bootstrap tables

-- cms_navigation: ensure admin-only management
DROP POLICY IF EXISTS "Authenticated users can manage navigation" ON public.cms_navigation;
DROP POLICY IF EXISTS "Admins can manage navigation" ON public.cms_navigation;
CREATE POLICY "Admins can manage navigation"
ON public.cms_navigation
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- cms_settings: ensure admin-only management
DROP POLICY IF EXISTS "Authenticated users can manage settings" ON public.cms_settings;
DROP POLICY IF EXISTS "Admins can manage settings" ON public.cms_settings;
CREATE POLICY "Admins can manage settings"
ON public.cms_settings
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- admin_bootstrap_validation: restrict ALL to service_role only (system only)
DROP POLICY IF EXISTS "System manages bootstrap tokens" ON public.admin_bootstrap_validation;
DROP POLICY IF EXISTS "Service role manages bootstrap tokens" ON public.admin_bootstrap_validation;
CREATE POLICY "Service role manages bootstrap tokens"
ON public.admin_bootstrap_validation
FOR ALL
TO authenticated
USING ((auth.jwt() ->> 'role') = 'service_role')
WITH CHECK ((auth.jwt() ->> 'role') = 'service_role');

-- admin_bootstrap_log: restrict ALL to service_role only (system only)
DROP POLICY IF EXISTS "System manages bootstrap log" ON public.admin_bootstrap_log;
DROP POLICY IF EXISTS "Service role manages bootstrap log" ON public.admin_bootstrap_log;
CREATE POLICY "Service role manages bootstrap log"
ON public.admin_bootstrap_log
FOR ALL
TO authenticated
USING ((auth.jwt() ->> 'role') = 'service_role')
WITH CHECK ((auth.jwt() ->> 'role') = 'service_role');

-- 2) Critical: Fix over-permissive RLS on secure_user_sessions
DROP POLICY IF EXISTS "System can manage sessions" ON public.secure_user_sessions;
DROP POLICY IF EXISTS "Service role can manage sessions" ON public.secure_user_sessions;
CREATE POLICY "Service role can manage sessions"
ON public.secure_user_sessions
FOR ALL
TO authenticated
USING ((auth.jwt() ->> 'role') = 'service_role')
WITH CHECK ((auth.jwt() ->> 'role') = 'service_role');

-- Keep existing per-user SELECT/UPDATE policies intact

-- 3) Policy hygiene: remove duplicates
-- rate_limit_tracking had duplicate SELECT policies; keep the more specific one
DROP POLICY IF EXISTS "Users can view their own rate limits" ON public.rate_limit_tracking;

-- user_roles had duplicate SELECT policies; keep a single admin view policy
DROP POLICY IF EXISTS "Only admins can view all roles" ON public.user_roles;
