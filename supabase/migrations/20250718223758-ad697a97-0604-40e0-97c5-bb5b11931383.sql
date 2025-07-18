
-- Phase 1: Critical Security Fixes - Database Level

-- Create admin bootstrap validation table
CREATE TABLE IF NOT EXISTS public.admin_bootstrap_validation (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bootstrap_token TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '24 hours'),
  used_at TIMESTAMP WITH TIME ZONE NULL,
  created_by_ip INET,
  is_active BOOLEAN DEFAULT true
);

-- Enable RLS on admin bootstrap validation
ALTER TABLE public.admin_bootstrap_validation ENABLE ROW LEVEL SECURITY;

-- Only allow system to manage bootstrap tokens
CREATE POLICY "System manages bootstrap tokens" 
  ON public.admin_bootstrap_validation 
  FOR ALL 
  USING (true);

-- Create secure admin creation function with proper validation
CREATE OR REPLACE FUNCTION public.secure_admin_bootstrap(
  bootstrap_token TEXT,
  target_user_id UUID,
  requester_ip INET DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  token_record RECORD;
  existing_admin_count INTEGER;
BEGIN
  -- Check if any admin already exists
  SELECT COUNT(*) INTO existing_admin_count
  FROM public.user_roles
  WHERE role = 'admin';
  
  -- If admins exist, reject bootstrap attempt
  IF existing_admin_count > 0 THEN
    -- Log potential security violation
    INSERT INTO public.privilege_escalation_attempts (
      user_id, attempted_role, method, ip_address, blocked
    ) VALUES (
      target_user_id, 'admin', 'bootstrap_after_admin_exists', requester_ip, true
    );
    
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Bootstrap not allowed: Admin users already exist'
    );
  END IF;
  
  -- Validate bootstrap token
  SELECT * INTO token_record
  FROM public.admin_bootstrap_validation
  WHERE bootstrap_token = secure_admin_bootstrap.bootstrap_token
    AND is_active = true
    AND expires_at > now()
    AND used_at IS NULL;
    
  IF NOT FOUND THEN
    INSERT INTO public.privilege_escalation_attempts (
      user_id, attempted_role, method, ip_address, blocked
    ) VALUES (
      target_user_id, 'admin', 'invalid_bootstrap_token', requester_ip, true
    );
    
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Invalid or expired bootstrap token'
    );
  END IF;
  
  -- Mark token as used
  UPDATE public.admin_bootstrap_validation
  SET used_at = now(), is_active = false
  WHERE id = token_record.id;
  
  -- Create first admin
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'admin');
  
  -- Log successful bootstrap
  INSERT INTO public.admin_bootstrap_log (
    first_admin_created, created_by, bootstrap_method, ip_address
  ) VALUES (
    true, target_user_id, 'secure_bootstrap', requester_ip
  );
  
  -- Log audit trail
  INSERT INTO public.role_change_audit (
    user_id, new_role, changed_by, reason, ip_address
  ) VALUES (
    target_user_id, 'admin', target_user_id, 'SECURE BOOTSTRAP - First admin created', requester_ip
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'message', 'Admin bootstrap completed successfully'
  );
END;
$$;

-- Enhanced privilege escalation detection function
CREATE OR REPLACE FUNCTION public.detect_privilege_escalation()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  current_user_role app_role;
  is_bootstrap BOOLEAN;
BEGIN
  -- Check if this is a bootstrap scenario
  is_bootstrap := public.is_admin_bootstrap_needed();
  
  -- If not bootstrap and trying to assign admin role, validate carefully
  IF NOT is_bootstrap AND NEW.role = 'admin' THEN
    -- Get current user's highest role
    SELECT role INTO current_user_role
    FROM public.user_roles
    WHERE user_id = auth.uid()
    ORDER BY 
      CASE role
        WHEN 'admin' THEN 3
        WHEN 'moderator' THEN 2
        WHEN 'user' THEN 1
      END DESC
    LIMIT 1;
    
    -- Only existing admins can create new admins
    IF current_user_role != 'admin' THEN
      INSERT INTO public.privilege_escalation_attempts (
        user_id, attempted_role, method, blocked
      ) VALUES (
        auth.uid(), 'admin', 'unauthorized_admin_assignment', true
      );
      
      RAISE EXCEPTION 'SECURITY VIOLATION: Unauthorized attempt to assign admin role';
    END IF;
  END IF;
  
  -- Additional validation for self-role modification
  IF NEW.user_id = auth.uid() AND OLD.role IS DISTINCT FROM NEW.role THEN
    INSERT INTO public.privilege_escalation_attempts (
      user_id, attempted_role, method, blocked
    ) VALUES (
      auth.uid(), NEW.role, 'self_role_modification', true
    );
    
    RAISE EXCEPTION 'SECURITY VIOLATION: Users cannot modify their own roles';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for privilege escalation detection
DROP TRIGGER IF EXISTS detect_privilege_escalation_trigger ON public.user_roles;
CREATE TRIGGER detect_privilege_escalation_trigger
  BEFORE INSERT OR UPDATE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.detect_privilege_escalation();

-- Enhanced session security table
CREATE TABLE IF NOT EXISTS public.secure_session_validation (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL,
  device_fingerprint TEXT,
  ip_address INET,
  user_agent TEXT,
  security_score INTEGER DEFAULT 0,
  is_validated BOOLEAN DEFAULT false,
  last_validation TIMESTAMP WITH TIME ZONE DEFAULT now(),
  suspicious_activity_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '24 hours')
);

-- Enable RLS on secure session validation
ALTER TABLE public.secure_session_validation ENABLE ROW LEVEL SECURITY;

-- Users can only see their own sessions
CREATE POLICY "Users can view their own secure sessions" 
  ON public.secure_session_validation 
  FOR SELECT 
  USING (user_id = auth.uid());

-- System can manage secure sessions
CREATE POLICY "System can manage secure sessions" 
  ON public.secure_session_validation 
  FOR ALL 
  USING (true);

-- Function to validate session security
CREATE OR REPLACE FUNCTION public.validate_session_security(
  p_session_id TEXT,
  p_device_fingerprint TEXT,
  p_ip_address INET,
  p_user_agent TEXT
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  session_record RECORD;
  security_score INTEGER := 0;
  is_suspicious BOOLEAN := false;
BEGIN
  -- Get session record
  SELECT * INTO session_record
  FROM public.secure_session_validation
  WHERE session_id = p_session_id
    AND expires_at > now();
    
  IF NOT FOUND THEN
    RETURN jsonb_build_object(
      'valid', false,
      'reason', 'Session not found or expired'
    );
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
$$;
