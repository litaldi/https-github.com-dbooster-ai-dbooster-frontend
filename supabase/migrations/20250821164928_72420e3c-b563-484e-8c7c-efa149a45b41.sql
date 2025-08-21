-- Execute the security migration to fix RLS policies
-- This migration implements the security fixes identified in the security review

-- 1) Fix comprehensive_security_log RLS - CRITICAL
DROP POLICY IF EXISTS "System can insert security logs" ON public.comprehensive_security_log;
CREATE POLICY "Service role only can insert security logs"
ON public.comprehensive_security_log
FOR INSERT
TO authenticated
WITH CHECK ((auth.jwt() ->> 'role') = 'service_role');

-- 2) Add trigger to enforce user_id on security_audit_log
CREATE OR REPLACE FUNCTION public.enforce_audit_log_user_id()
RETURNS trigger AS $$
BEGIN
  -- Force user_id to be the authenticated user for non-service_role inserts
  IF (auth.jwt() ->> 'role') <> 'service_role' THEN
    NEW.user_id := auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS enforce_audit_user_id ON public.security_audit_log;
CREATE TRIGGER enforce_audit_user_id
  BEFORE INSERT ON public.security_audit_log
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_audit_log_user_id();

-- 3) Add is_public flag to cms_settings for proper access control
ALTER TABLE public.cms_settings ADD COLUMN IF NOT EXISTS is_public boolean DEFAULT false;

-- Update RLS for cms_settings to respect is_public flag
DROP POLICY IF EXISTS "Anyone can view settings" ON public.cms_settings;
CREATE POLICY "Public can view public settings"
ON public.cms_settings
FOR SELECT
TO authenticated
USING (is_public = true OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Anonymous can view public settings"
ON public.cms_settings
FOR SELECT
TO anon
USING (is_public = true);

-- 4) Policy hygiene - remove duplicates and fix overlaps
-- Remove duplicate SELECT policies on user_roles
DROP POLICY IF EXISTS "Users can view their own roles only" ON public.user_roles;
-- Keep "Users can view only their own roles" and "Admins can view all user roles"

-- 5) Tighten session security policies
DROP POLICY IF EXISTS "System can insert session events" ON public.session_security_events;
CREATE POLICY "Authenticated users can log their session events"
ON public.session_security_events
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- 6) Create CSP violation reporting table (no JWT required)
CREATE TABLE IF NOT EXISTS public.csp_violation_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_data jsonb NOT NULL,
  user_agent text,
  ip_address inet,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS but allow anonymous inserts for CSP reporting
ALTER TABLE public.csp_violation_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can report CSP violations"
ON public.csp_violation_reports
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view CSP reports"
ON public.csp_violation_reports
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- 7) Log this security migration
INSERT INTO public.comprehensive_security_log (
  event_type, event_category, severity, event_data
) VALUES (
  'security_migration_applied', 'security', 'info',
  '{"migration": "comprehensive_security_fixes", "timestamp": "' || now() || '"}'
);