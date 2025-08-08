-- Lock down CMS pages policies and bind session validation to authenticated user

-- 1) Restrict CMS pages visibility and management
DROP POLICY IF EXISTS "Anyone can view published pages" ON public.cms_pages;
DROP POLICY IF EXISTS "Authenticated users can manage pages" ON public.cms_pages;

-- Only published pages are public; creators and admins can view drafts
CREATE POLICY "Public can view published pages"
ON public.cms_pages
FOR SELECT
USING (
  published = true
  OR has_role(auth.uid(), 'admin')
  OR auth.uid() = created_by
);

-- Only admins can manage pages (create/update/delete)
CREATE POLICY "Admins can manage pages"
ON public.cms_pages
FOR ALL
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));


-- 2) Harden validate_session_security with ownership check and auth requirement
CREATE OR REPLACE FUNCTION public.validate_session_security(
  p_session_id text,
  p_device_fingerprint text,
  p_ip_address inet,
  p_user_agent text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  session_record RECORD;
  security_score INTEGER := 0;
  is_suspicious BOOLEAN := false;
  current_user_id uuid := auth.uid();
BEGIN
  -- Require authentication
  IF current_user_id IS NULL THEN
    RETURN jsonb_build_object('valid', false, 'reason', 'Authentication required');
  END IF;

  -- Get session record
  SELECT * INTO session_record
  FROM public.secure_session_validation
  WHERE session_id = p_session_id
    AND expires_at > now();

  IF NOT FOUND THEN
    RETURN jsonb_build_object('valid', false, 'reason', 'Session not found or expired');
  END IF;

  -- Ensure the session belongs to the current authenticated user
  IF session_record.user_id IS DISTINCT FROM current_user_id THEN
    RETURN jsonb_build_object('valid', false, 'reason', 'Session does not belong to current user');
  END IF;

  -- Calculate security score
  security_score := 50; -- Base score

  -- Device fingerprint match
  IF session_record.device_fingerprint = p_device_fingerprint THEN
    security_score := security_score + 20;
  ELSE
    is_suspicious := true;
  END IF;

  -- IP address consistency
  IF session_record.ip_address = p_ip_address THEN
    security_score := security_score + 15;
  ELSE
    is_suspicious := true;
  END IF;

  -- User agent consistency
  IF session_record.user_agent = p_user_agent THEN
    security_score := security_score + 10;
  END IF;

  -- Recent validation bonus
  IF session_record.last_validation > (now() - INTERVAL '5 minutes') THEN
    security_score := security_score + 5;
  END IF;

  -- Update session record
  UPDATE public.secure_session_validation
  SET 
    last_validation = now(),
    security_score = security_score,
    suspicious_activity_count = CASE 
      WHEN is_suspicious THEN suspicious_activity_count + 1 
      ELSE suspicious_activity_count 
    END
  WHERE id = session_record.id;

  -- Log suspicious activity
  IF is_suspicious OR security_score < 60 THEN
    INSERT INTO public.security_events_enhanced (
      event_type, severity, user_id, session_id, ip_address, user_agent,
      threat_score, event_data
    ) VALUES (
      'suspicious_session_validation', 
      CASE WHEN security_score < 40 THEN 'high' ELSE 'medium' END,
      session_record.user_id, p_session_id, p_ip_address, p_user_agent,
      100 - security_score,
      jsonb_build_object(
        'security_score', security_score,
        'fingerprint_match', session_record.device_fingerprint = p_device_fingerprint,
        'ip_match', session_record.ip_address = p_ip_address
      )
    );
  END IF;

  RETURN jsonb_build_object(
    'valid', security_score >= 60,
    'security_score', security_score,
    'suspicious', is_suspicious,
    'reason', CASE 
      WHEN security_score < 60 THEN 'Low security score'
      ELSE 'Session validated successfully'
    END
  );
END;
$function$;