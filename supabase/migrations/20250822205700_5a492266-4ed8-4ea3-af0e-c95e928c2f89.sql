-- COMPREHENSIVE SECURITY FIXES
-- Addresses critical findings from security review

-- 1. CRITICAL: Fix security_audit_log - prevent user_id spoofing and restrict access
DROP POLICY IF EXISTS "Service role can insert audit logs" ON public.security_audit_log;
DROP POLICY IF EXISTS "Users can view their own audit logs" ON public.security_audit_log;

-- Only service role can insert audit logs (prevents spoofing)
CREATE POLICY "Service role only can insert audit logs"
ON public.security_audit_log
FOR INSERT
USING ((auth.jwt() ->> 'role') = 'service_role')
WITH CHECK ((auth.jwt() ->> 'role') = 'service_role');

-- Users can view their own logs, admins can view all
CREATE POLICY "Users view own logs, admins view all"
ON public.security_audit_log
FOR SELECT
USING (
  user_id = auth.uid() OR 
  has_role(auth.uid(), 'admin') OR 
  (auth.jwt() ->> 'role') = 'service_role'
);

-- 2. CRITICAL: Fix comprehensive_security_log - restrict to service role only
DROP POLICY IF EXISTS "Service role only can insert security logs" ON public.comprehensive_security_log;
DROP POLICY IF EXISTS "Admins can view all security logs" ON public.comprehensive_security_log;
DROP POLICY IF EXISTS "Users can view their own security logs" ON public.comprehensive_security_log;

-- Only service role can insert (prevents unauthorized writes)
CREATE POLICY "Service role manages security logs"
ON public.comprehensive_security_log
FOR INSERT
USING ((auth.jwt() ->> 'role') = 'service_role')
WITH CHECK ((auth.jwt() ->> 'role') = 'service_role');

-- Admins can view all, users can view their own
CREATE POLICY "Admins view all, users view own security logs"
ON public.comprehensive_security_log
FOR SELECT
USING (
  has_role(auth.uid(), 'admin') OR 
  (user_id = auth.uid()) OR
  (auth.jwt() ->> 'role') = 'service_role'
);

-- 3. CRITICAL: Fix security_events_enhanced - allow users to view their own events
DROP POLICY IF EXISTS "Admins can view all security events" ON public.security_events_enhanced;
DROP POLICY IF EXISTS "System can insert security events" ON public.security_events_enhanced;

-- Service role can insert security events
CREATE POLICY "Service role inserts security events"
ON public.security_events_enhanced
FOR INSERT
USING ((auth.jwt() ->> 'role') = 'service_role')
WITH CHECK ((auth.jwt() ->> 'role') = 'service_role');

-- Users can view their own events, admins can view all
CREATE POLICY "Users view own events, admins view all"
ON public.security_events_enhanced
FOR SELECT
USING (
  user_id = auth.uid() OR 
  has_role(auth.uid(), 'admin') OR
  (auth.jwt() ->> 'role') = 'service_role'
);

-- 4. HIGH PRIORITY: Strengthen CSP violation reports with better validation
DROP POLICY IF EXISTS "Anyone can report CSP violations" ON public.csp_violation_reports;

-- Add validation trigger for CSP reports
CREATE OR REPLACE FUNCTION public.validate_csp_report()
RETURNS TRIGGER AS $$
BEGIN
  -- Basic validation of report structure
  IF NEW.report_data IS NULL OR 
     NOT (NEW.report_data ? 'violated-directive') OR
     NOT (NEW.report_data ? 'blocked-uri') THEN
    RAISE EXCEPTION 'Invalid CSP violation report structure';
  END IF;
  
  -- Rate limit by IP (max 10 reports per minute)
  IF (
    SELECT COUNT(*) FROM public.csp_violation_reports 
    WHERE ip_address = NEW.ip_address 
    AND created_at > (now() - INTERVAL '1 minute')
  ) >= 10 THEN
    RAISE EXCEPTION 'CSP violation report rate limit exceeded';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS validate_csp_report_trigger ON public.csp_violation_reports;
CREATE TRIGGER validate_csp_report_trigger
  BEFORE INSERT ON public.csp_violation_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_csp_report();

-- Recreate policy with rate limiting protection
CREATE POLICY "Validated CSP violation reports only"
ON public.csp_violation_reports
FOR INSERT
WITH CHECK (true); -- Validation is handled by trigger

-- 5. Add security audit trigger to enforce user_id for authenticated events
CREATE OR REPLACE FUNCTION public.enforce_audit_log_user_id()
RETURNS TRIGGER AS $$
BEGIN
  -- Force user_id to be the authenticated user for non-service_role inserts
  IF (auth.jwt() ->> 'role') <> 'service_role' THEN
    NEW.user_id := auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS enforce_audit_user_id ON public.security_audit_log;
CREATE TRIGGER enforce_audit_user_id
  BEFORE INSERT ON public.security_audit_log
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_audit_log_user_id();

-- 6. Add validation trigger for audit log entries
CREATE OR REPLACE FUNCTION public.validate_audit_log_entry()
RETURNS TRIGGER AS $$
BEGIN
  -- For authenticated events, user_id should not be null
  IF NEW.event_type LIKE '%login%' OR NEW.event_type LIKE '%signup%' OR NEW.event_type LIKE '%auth%' THEN
    IF NEW.user_id IS NULL THEN
      RAISE EXCEPTION 'user_id cannot be null for authenticated events';
    END IF;
  END IF;
  
  -- Validate event_type is not empty
  IF NEW.event_type IS NULL OR LENGTH(TRIM(NEW.event_type)) = 0 THEN
    RAISE EXCEPTION 'event_type cannot be empty';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS validate_audit_entry ON public.security_audit_log;
CREATE TRIGGER validate_audit_entry
  BEFORE INSERT ON public.security_audit_log
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_audit_log_entry();

-- Log the security fixes
INSERT INTO public.comprehensive_security_log (
  event_type, event_category, severity, event_data
) VALUES (
  'comprehensive_security_fixes_applied', 'security', 'info',
  jsonb_build_object(
    'fixes_applied', array[
      'security_audit_log_user_spoofing_prevention',
      'comprehensive_security_log_access_restriction', 
      'security_events_enhanced_user_access_restoration',
      'csp_violation_reports_validation_and_rate_limiting',
      'audit_log_validation_triggers'
    ],
    'timestamp', now()::text,
    'security_review_date', '2025-01-22',
    'critical_issues_resolved', 3,
    'high_priority_issues_resolved', 1
  )
);