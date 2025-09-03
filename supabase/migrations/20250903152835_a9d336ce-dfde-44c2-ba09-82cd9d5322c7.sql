-- ============================================================================
-- CRITICAL SECURITY FIXES - Phase 1
-- ============================================================================

-- 1. Fix SECURITY DEFINER functions with mutable search_path
-- ============================================================================

-- Fix check_csp_violation_rate_limit function
CREATE OR REPLACE FUNCTION public.check_csp_violation_rate_limit(p_ip_address inet)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
$function$;

-- Fix validate_csp_violation function
CREATE OR REPLACE FUNCTION public.validate_csp_violation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
$function$;

-- Fix enforce_security_event_user_id function
CREATE OR REPLACE FUNCTION public.enforce_security_event_user_id()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
$function$;

-- 2. Attach missing security enforcement triggers
-- ============================================================================

-- Attach trigger to security_audit_log
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'enforce_audit_log_user_id_trigger' 
    AND tgrelid = 'public.security_audit_log'::regclass
  ) THEN
    CREATE TRIGGER enforce_audit_log_user_id_trigger
      BEFORE INSERT ON public.security_audit_log
      FOR EACH ROW
      EXECUTE FUNCTION public.enforce_audit_log_user_id();
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'validate_audit_log_entry_trigger' 
    AND tgrelid = 'public.security_audit_log'::regclass
  ) THEN
    CREATE TRIGGER validate_audit_log_entry_trigger
      BEFORE INSERT ON public.security_audit_log
      FOR EACH ROW
      EXECUTE FUNCTION public.validate_audit_log_entry();
  END IF;
END $$;

-- Attach trigger to security_events_enhanced
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'enforce_security_event_user_id_trigger' 
    AND tgrelid = 'public.security_events_enhanced'::regclass
  ) THEN
    CREATE TRIGGER enforce_security_event_user_id_trigger
      BEFORE INSERT ON public.security_events_enhanced
      FOR EACH ROW
      EXECUTE FUNCTION public.enforce_security_event_user_id();
  END IF;
END $$;

-- Attach trigger to csp_violation_reports
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'validate_csp_violation_trigger' 
    AND tgrelid = 'public.csp_violation_reports'::regclass
  ) THEN
    CREATE TRIGGER validate_csp_violation_trigger
      BEFORE INSERT ON public.csp_violation_reports
      FOR EACH ROW
      EXECUTE FUNCTION public.validate_csp_violation();
  END IF;
END $$;

-- Attach trigger to enhanced_session_tracking
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'detect_suspicious_session_activity_trigger' 
    AND tgrelid = 'public.enhanced_session_tracking'::regclass
  ) THEN
    CREATE TRIGGER detect_suspicious_session_activity_trigger
      AFTER INSERT ON public.enhanced_session_tracking
      FOR EACH ROW
      EXECUTE FUNCTION public.detect_suspicious_session_activity();
  END IF;
END $$;

-- Attach trigger to cms_media
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'set_media_uploader_trigger' 
    AND tgrelid = 'public.cms_media'::regclass
  ) THEN
    CREATE TRIGGER set_media_uploader_trigger
      BEFORE INSERT ON public.cms_media
      FOR EACH ROW
      EXECUTE FUNCTION public.set_media_uploader();
  END IF;
END $$;

-- Attach updated_at triggers to tables that have updated_at columns
DO $$
BEGIN
  -- rate_limit_tracking
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_rate_limit_tracking_updated_at' 
    AND tgrelid = 'public.rate_limit_tracking'::regclass
  ) THEN
    CREATE TRIGGER update_rate_limit_tracking_updated_at
      BEFORE UPDATE ON public.rate_limit_tracking
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
  
  -- repositories
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_repositories_updated_at' 
    AND tgrelid = 'public.repositories'::regclass
  ) THEN
    CREATE TRIGGER update_repositories_updated_at
      BEFORE UPDATE ON public.repositories
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
  
  -- cms_pages
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_cms_pages_updated_at' 
    AND tgrelid = 'public.cms_pages'::regclass
  ) THEN
    CREATE TRIGGER update_cms_pages_updated_at
      BEFORE UPDATE ON public.cms_pages
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
  
  -- cms_navigation
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_cms_navigation_updated_at' 
    AND tgrelid = 'public.cms_navigation'::regclass
  ) THEN
    CREATE TRIGGER update_cms_navigation_updated_at
      BEFORE UPDATE ON public.cms_navigation
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
  
  -- cms_settings
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_cms_settings_updated_at' 
    AND tgrelid = 'public.cms_settings'::regclass
  ) THEN
    CREATE TRIGGER update_cms_settings_updated_at
      BEFORE UPDATE ON public.cms_settings
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
  
  -- queries
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_queries_updated_at' 
    AND tgrelid = 'public.queries'::regclass
  ) THEN
    CREATE TRIGGER update_queries_updated_at
      BEFORE UPDATE ON public.queries
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
  
  -- user_mfa_config
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_user_mfa_config_updated_at' 
    AND tgrelid = 'public.user_mfa_config'::regclass
  ) THEN
    CREATE TRIGGER update_user_mfa_config_updated_at
      BEFORE UPDATE ON public.user_mfa_config
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
  
  -- persistent_rate_limits
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_persistent_rate_limits_updated_at' 
    AND tgrelid = 'public.persistent_rate_limits'::regclass
  ) THEN
    CREATE TRIGGER update_persistent_rate_limits_updated_at
      BEFORE UPDATE ON public.persistent_rate_limits
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
  
  -- profiles
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_profiles_updated_at' 
    AND tgrelid = 'public.profiles'::regclass
  ) THEN
    CREATE TRIGGER update_profiles_updated_at
      BEFORE UPDATE ON public.profiles
      FOR EACH ROW
      EXECUTE FUNCTION public.update_updated_at_column();
  END IF;
END $$;

-- 3. Secure MFA data storage
-- ============================================================================

-- Add encrypted storage columns for MFA secrets
ALTER TABLE public.user_mfa_config 
ADD COLUMN IF NOT EXISTS totp_secret_encrypted bytea,
ADD COLUMN IF NOT EXISTS backup_codes_hashed text[];

-- Create secure MFA functions
CREATE OR REPLACE FUNCTION public.enable_mfa_secure(user_totp_secret text, user_backup_codes text[])
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  current_user_id uuid := auth.uid();
  hashed_codes text[];
  code text;
BEGIN
  -- Require authentication
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Hash backup codes
  FOREACH code IN ARRAY user_backup_codes LOOP
    hashed_codes := array_append(hashed_codes, crypt(code, gen_salt('bf')));
  END LOOP;
  
  -- Update MFA config with encrypted data
  INSERT INTO public.user_mfa_config (
    user_id, 
    is_mfa_enabled, 
    totp_secret_encrypted, 
    backup_codes_hashed
  ) VALUES (
    current_user_id,
    true,
    pgp_sym_encrypt(user_totp_secret, current_user_id::text),
    hashed_codes
  )
  ON CONFLICT (user_id) 
  DO UPDATE SET
    is_mfa_enabled = true,
    totp_secret_encrypted = pgp_sym_encrypt(user_totp_secret, current_user_id::text),
    backup_codes_hashed = hashed_codes,
    recovery_codes_used = 0,
    updated_at = now();
    
  RETURN jsonb_build_object(
    'success', true,
    'message', 'MFA enabled successfully'
  );
END;
$function$;

CREATE OR REPLACE FUNCTION public.validate_backup_code_secure(backup_code text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  current_user_id uuid := auth.uid();
  mfa_config RECORD;
  hashed_code text;
  is_valid boolean := false;
BEGIN
  -- Require authentication
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Get MFA config
  SELECT * INTO mfa_config
  FROM public.user_mfa_config
  WHERE user_id = current_user_id AND is_mfa_enabled = true;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('valid', false, 'reason', 'MFA not enabled');
  END IF;
  
  -- Check each hashed backup code
  FOREACH hashed_code IN ARRAY mfa_config.backup_codes_hashed LOOP
    IF hashed_code = crypt(backup_code, hashed_code) THEN
      is_valid := true;
      EXIT;
    END IF;
  END LOOP;
  
  IF is_valid THEN
    -- Remove used backup code and increment counter
    UPDATE public.user_mfa_config
    SET 
      backup_codes_hashed = array_remove(backup_codes_hashed, hashed_code),
      recovery_codes_used = recovery_codes_used + 1,
      updated_at = now()
    WHERE user_id = current_user_id;
  END IF;
  
  RETURN jsonb_build_object('valid', is_valid);
END;
$function$;

-- Create safe view for MFA status (no secrets exposed)
CREATE OR REPLACE VIEW public.user_mfa_status AS
SELECT 
  user_id,
  is_mfa_enabled,
  recovery_codes_used,
  CASE 
    WHEN backup_codes_hashed IS NOT NULL 
    THEN array_length(backup_codes_hashed, 1)
    ELSE 0
  END as backup_codes_remaining,
  created_at,
  updated_at
FROM public.user_mfa_config;

-- Update RLS policies for MFA config to prevent secret exposure
DROP POLICY IF EXISTS "Users can manage their own MFA config" ON public.user_mfa_config;

CREATE POLICY "Users can insert their own MFA config"
ON public.user_mfa_config
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own MFA config"
ON public.user_mfa_config
FOR UPDATE
USING (auth.uid() = user_id);

-- No SELECT policy - users must use secure functions or the safe view
-- This prevents exposure of encrypted secrets

-- RLS for the safe view
ALTER VIEW public.user_mfa_status SET (security_invoker = true);

-- 4. Add session token hashing
-- ============================================================================

-- Add hashed session token column
ALTER TABLE public.secure_user_sessions 
ADD COLUMN IF NOT EXISTS session_token_hash text;

-- Create index on hash for performance
CREATE INDEX IF NOT EXISTS idx_secure_user_sessions_token_hash 
ON public.secure_user_sessions(session_token_hash);

-- Function to validate session by hash
CREATE OR REPLACE FUNCTION public.validate_secure_session_by_hash(
  p_session_token text, 
  p_device_fingerprint text DEFAULT NULL,
  p_ip_address inet DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  session_record RECORD;
  token_hash text;
  security_score INTEGER := 50;
BEGIN
  -- Hash the provided token
  token_hash := encode(digest(p_session_token, 'sha256'), 'hex');
  
  -- Get session record by hash
  SELECT * INTO session_record
  FROM public.secure_user_sessions
  WHERE session_token_hash = token_hash
    AND is_active = true
    AND expires_at > now();
    
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'valid', false,
      'reason', 'Session not found or expired'
    );
  END IF;
  
  -- Calculate security score based on various factors
  IF session_record.device_fingerprint = p_device_fingerprint THEN
    security_score := security_score + 20;
  END IF;
  
  IF session_record.ip_address = p_ip_address THEN
    security_score := security_score + 15;
  END IF;
  
  -- Update session activity
  UPDATE public.secure_user_sessions
  SET 
    last_activity = now(),
    security_score = security_score
  WHERE id = session_record.id;
  
  RETURN jsonb_build_object(
    'valid', true,
    'user_id', session_record.user_id,
    'security_score', security_score,
    'expires_at', session_record.expires_at
  );
END;
$function$;

-- Function to create session with hashed token
CREATE OR REPLACE FUNCTION public.create_secure_session_with_hash(
  p_user_id uuid,
  p_session_token text,
  p_device_fingerprint text DEFAULT NULL,
  p_ip_address inet DEFAULT NULL,
  p_user_agent text DEFAULT NULL,
  p_is_demo boolean DEFAULT false
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  token_hash text;
  session_id uuid;
BEGIN
  -- Hash the session token
  token_hash := encode(digest(p_session_token, 'sha256'), 'hex');
  
  -- Insert session with hash only
  INSERT INTO public.secure_user_sessions (
    user_id,
    session_token_hash,
    device_fingerprint,
    ip_address,
    user_agent,
    metadata
  ) VALUES (
    p_user_id,
    token_hash,
    p_device_fingerprint,
    p_ip_address,
    p_user_agent,
    jsonb_build_object('is_demo', p_is_demo)
  ) RETURNING id INTO session_id;
  
  RETURN jsonb_build_object(
    'success', true,
    'session_id', session_id
  );
END;
$function$;

-- 5. Create CSP violation reporting function (public endpoint)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.report_csp_violation(violation_data jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  client_ip inet;
BEGIN
  -- Extract IP from headers (set by proxy/edge function)
  client_ip := (violation_data->>'client_ip')::inet;
  
  -- Rate limit check
  IF client_ip IS NOT NULL AND NOT public.check_csp_violation_rate_limit(client_ip) THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Rate limit exceeded'
    );
  END IF;
  
  -- Insert violation report
  INSERT INTO public.csp_violation_reports (
    report_data,
    ip_address,
    user_agent
  ) VALUES (
    violation_data,
    client_ip,
    violation_data->>'user_agent'
  );
  
  RETURN jsonb_build_object('success', true);
END;
$function$;