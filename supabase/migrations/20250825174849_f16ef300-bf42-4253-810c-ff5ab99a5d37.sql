-- Comprehensive Security Fixes Migration
-- Addresses critical vulnerabilities identified in security review

-- 1. ADD MISSING TRIGGERS FOR AUDIT LOG INTEGRITY

-- Trigger for security_audit_log to enforce user_id ownership
CREATE TRIGGER enforce_audit_log_user_id_trigger
  BEFORE INSERT ON public.security_audit_log
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_audit_log_user_id();

-- Trigger for security_audit_log validation  
CREATE TRIGGER validate_audit_log_entry_trigger
  BEFORE INSERT ON public.security_audit_log
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_audit_log_entry();

-- 2. LOCK DOWN security_events_enhanced TABLE

-- Drop the overly permissive INSERT policy
DROP POLICY IF EXISTS "System can insert security events" ON public.security_events_enhanced;

-- Add secure INSERT policies for security_events_enhanced
CREATE POLICY "Authenticated users can insert their own events" 
ON public.security_events_enhanced 
FOR INSERT 
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Service role can insert all events" 
ON public.security_events_enhanced 
FOR INSERT 
TO service_role
WITH CHECK (true);

-- 3. ADD MISSING TRIGGERS FOR EXISTING SECURITY FUNCTIONS

-- Trigger for enhanced_session_tracking suspicious activity detection
CREATE TRIGGER detect_suspicious_session_activity_trigger
  AFTER INSERT OR UPDATE ON public.enhanced_session_tracking
  FOR EACH ROW
  EXECUTE FUNCTION public.detect_suspicious_session_activity();

-- Trigger for cms_media uploader validation
CREATE TRIGGER set_media_uploader_trigger
  BEFORE INSERT OR UPDATE ON public.cms_media
  FOR EACH ROW
  EXECUTE FUNCTION public.set_media_uploader();

-- Trigger for user_roles validation (defense in depth)
CREATE TRIGGER validate_role_assignment_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_role_assignment();

-- Trigger for privilege escalation detection on user_roles
CREATE TRIGGER detect_privilege_escalation_trigger
  BEFORE INSERT OR UPDATE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.detect_privilege_escalation();

-- 4. STRENGTHEN CSP VIOLATION REPORTING

-- Add rate limiting function for CSP violations
CREATE OR REPLACE FUNCTION public.check_csp_violation_rate_limit(p_ip_address inet)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  violation_count INTEGER;
BEGIN
  -- Count violations from this IP in the last hour
  SELECT COUNT(*) INTO violation_count
  FROM public.csp_violation_reports
  WHERE ip_address = p_ip_address
    AND created_at > now() - INTERVAL '1 hour';
  
  -- Allow max 10 violations per hour per IP
  RETURN violation_count < 10;
END;
$$;

-- Add validation trigger for CSP violations
CREATE OR REPLACE FUNCTION public.validate_csp_violation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Rate limit CSP violations per IP
  IF NEW.ip_address IS NOT NULL AND NOT public.check_csp_violation_rate_limit(NEW.ip_address) THEN
    RAISE EXCEPTION 'CSP violation rate limit exceeded for IP address';
  END IF;
  
  -- Validate report_data is not empty
  IF NEW.report_data IS NULL OR NEW.report_data = '{}'::jsonb THEN
    RAISE EXCEPTION 'CSP violation report data cannot be empty';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Add validation trigger to CSP violation reports
CREATE TRIGGER validate_csp_violation_trigger
  BEFORE INSERT ON public.csp_violation_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_csp_violation();

-- 5. STRENGTHEN comprehensive_security_log

-- Drop overly permissive INSERT policy
DROP POLICY IF EXISTS "Service role only can insert security logs" ON public.comprehensive_security_log;

-- Add more granular policies
CREATE POLICY "Service role can insert all security logs" 
ON public.comprehensive_security_log 
FOR INSERT 
TO service_role
WITH CHECK (true);

CREATE POLICY "Authenticated users can log their own events" 
ON public.comprehensive_security_log 
FOR INSERT 
TO authenticated
WITH CHECK (user_id = auth.uid() AND event_category IN ('user_action', 'session', 'validation'));

-- 6. ADD DEFENSE-IN-DEPTH TRIGGER FOR SECURITY EVENTS

-- Ensure user_id is properly set for security events
CREATE OR REPLACE FUNCTION public.enforce_security_event_user_id()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- For non-service_role inserts, force user_id to current user
  IF (auth.jwt() ->> 'role') <> 'service_role' THEN
    NEW.user_id := auth.uid();
  END IF;
  
  -- Require user_id for user-related events
  IF NEW.event_type IN ('login', 'logout', 'signup', 'session_validation', 'suspicious_activity') THEN
    IF NEW.user_id IS NULL THEN
      RAISE EXCEPTION 'user_id required for user-related security events';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Add trigger to security_events_enhanced
CREATE TRIGGER enforce_security_event_user_id_trigger
  BEFORE INSERT ON public.security_events_enhanced
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_security_event_user_id();

-- Add trigger to comprehensive_security_log  
CREATE TRIGGER enforce_comprehensive_log_user_id_trigger
  BEFORE INSERT ON public.comprehensive_security_log
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_security_event_user_id();

-- 7. CREATE INDEX FOR PERFORMANCE ON SECURITY TABLES

-- Index for security_audit_log performance
CREATE INDEX IF NOT EXISTS idx_security_audit_log_user_created 
ON public.security_audit_log (user_id, created_at DESC);

-- Index for security_events_enhanced performance  
CREATE INDEX IF NOT EXISTS idx_security_events_user_created
ON public.security_events_enhanced (user_id, created_at DESC);

-- Index for comprehensive_security_log performance
CREATE INDEX IF NOT EXISTS idx_comprehensive_security_log_user_created
ON public.comprehensive_security_log (user_id, created_at DESC);

-- Index for CSP violations by IP and time
CREATE INDEX IF NOT EXISTS idx_csp_violations_ip_created
ON public.csp_violation_reports (ip_address, created_at DESC);