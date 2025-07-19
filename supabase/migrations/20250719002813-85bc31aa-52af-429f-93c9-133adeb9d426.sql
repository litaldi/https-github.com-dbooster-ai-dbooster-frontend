
-- Phase 1: Enhanced Role Assignment Security and Audit Logging

-- Create comprehensive security audit log table
CREATE TABLE IF NOT EXISTS public.comprehensive_security_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  event_type TEXT NOT NULL,
  event_category TEXT NOT NULL DEFAULT 'general',
  severity TEXT NOT NULL DEFAULT 'info' CHECK (severity IN ('info', 'warning', 'error', 'critical')),
  event_data JSONB,
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  affected_resource TEXT,
  risk_score INTEGER DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
  auto_blocked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on comprehensive security log
ALTER TABLE public.comprehensive_security_log ENABLE ROW LEVEL SECURITY;

-- Create policies for security log
CREATE POLICY "Admins can view all security logs" 
  ON public.comprehensive_security_log 
  FOR SELECT 
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert security logs" 
  ON public.comprehensive_security_log 
  FOR INSERT 
  WITH CHECK (true);

-- Create input validation log table
CREATE TABLE IF NOT EXISTS public.input_validation_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  input_context TEXT NOT NULL,
  validation_result JSONB NOT NULL,
  threat_detected BOOLEAN DEFAULT false,
  threat_types TEXT[],
  sanitized_input TEXT,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on input validation log
ALTER TABLE public.input_validation_log ENABLE ROW LEVEL SECURITY;

-- Create policies for input validation log
CREATE POLICY "Admins can view input validation logs" 
  ON public.input_validation_log 
  FOR SELECT 
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert validation logs" 
  ON public.input_validation_log 
  FOR INSERT 
  WITH CHECK (true);

-- Enhanced secure role assignment function with comprehensive validation
CREATE OR REPLACE FUNCTION public.enhanced_secure_role_assignment(
  target_user_id UUID,
  new_role app_role,
  change_reason TEXT DEFAULT NULL,
  requester_ip INET DEFAULT NULL,
  user_agent_header TEXT DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  current_user_id UUID;
  current_role app_role;
  is_admin BOOLEAN;
  is_bootstrap BOOLEAN;
  ip_whitelisted BOOLEAN := false;
  risk_score INTEGER := 0;
  request_id UUID;
BEGIN
  current_user_id := auth.uid();
  
  -- Enhanced security logging
  INSERT INTO public.comprehensive_security_log (
    user_id, event_type, event_category, severity, event_data, ip_address, user_agent
  ) VALUES (
    current_user_id, 'role_assignment_attempt', 'authentication', 'info',
    jsonb_build_object(
      'target_user', target_user_id,
      'requested_role', new_role,
      'reason', change_reason
    ),
    requester_ip, user_agent_header
  );
  
  -- Check if this is a bootstrap scenario
  is_bootstrap := public.is_admin_bootstrap_needed();
  
  -- Calculate risk score
  IF new_role = 'admin' THEN risk_score := risk_score + 50; END IF;
  IF requester_ip IS NULL THEN risk_score := risk_score + 20; END IF;
  IF current_user_id = target_user_id THEN risk_score := risk_score + 30; END IF;
  
  -- If not bootstrap, require admin privileges with enhanced validation
  IF NOT is_bootstrap THEN
    is_admin := has_role(current_user_id, 'admin');
    
    IF NOT is_admin THEN
      -- Log privilege escalation attempt with high risk score
      INSERT INTO public.comprehensive_security_log (
        user_id, event_type, event_category, severity, event_data, 
        ip_address, user_agent, risk_score, auto_blocked
      ) VALUES (
        current_user_id, 'unauthorized_role_assignment', 'security_violation', 'critical',
        jsonb_build_object(
          'target_user', target_user_id,
          'attempted_role', new_role,
          'current_user_role', (SELECT role FROM user_roles WHERE user_id = current_user_id LIMIT 1)
        ),
        requester_ip, user_agent_header, 90, true
      );
      
      RAISE EXCEPTION 'SECURITY VIOLATION: Unauthorized role assignment attempt detected';
    END IF;
    
    -- Check IP whitelist for admin operations
    IF requester_ip IS NOT NULL THEN
      SELECT EXISTS (
        SELECT 1 FROM public.admin_ip_whitelist 
        WHERE ip_address = requester_ip 
          AND is_active = true 
          AND (expires_at IS NULL OR expires_at > now())
      ) INTO ip_whitelisted;
    END IF;
    
    -- Reduce risk score for whitelisted IPs
    IF ip_whitelisted THEN risk_score := risk_score - 25; END IF;
  END IF;
  
  -- For admin role assignments, use approval workflow unless whitelisted
  IF new_role = 'admin' AND NOT is_bootstrap AND NOT ip_whitelisted THEN
    -- Create role assignment request
    INSERT INTO public.role_assignment_requests (
      target_user_id, requested_role, requested_by, reason, request_ip
    ) VALUES (
      target_user_id, new_role, current_user_id, 
      COALESCE(change_reason, 'Administrative role assignment request'), requester_ip
    ) RETURNING id INTO request_id;
    
    -- Log the approval request
    INSERT INTO public.comprehensive_security_log (
      user_id, event_type, event_category, severity, event_data, 
      ip_address, user_agent, risk_score
    ) VALUES (
      current_user_id, 'role_assignment_pending_approval', 'authentication', 'warning',
      jsonb_build_object(
        'request_id', request_id,
        'target_user', target_user_id,
        'requested_role', new_role
      ),
      requester_ip, user_agent_header, risk_score
    );
    
    RETURN jsonb_build_object(
      'success', false,
      'requires_approval', true,
      'request_id', request_id,
      'risk_score', risk_score,
      'message', 'Role assignment request created and pending approval due to security policies'
    );
  END IF;
  
  -- Direct assignment for approved cases
  INSERT INTO public.user_roles (user_id, role, assigned_by)
  VALUES (target_user_id, new_role, current_user_id)
  ON CONFLICT (user_id, role) 
  DO UPDATE SET 
    assigned_at = now(),
    assigned_by = current_user_id;
  
  -- Log successful assignment
  INSERT INTO public.comprehensive_security_log (
    user_id, event_type, event_category, severity, event_data, 
    ip_address, user_agent, risk_score
  ) VALUES (
    current_user_id, 'role_assignment_success', 'authentication', 'info',
    jsonb_build_object(
      'target_user', target_user_id,
      'assigned_role', new_role,
      'is_bootstrap', is_bootstrap,
      'ip_whitelisted', ip_whitelisted
    ),
    requester_ip, user_agent_header, risk_score
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'requires_approval', false,
    'risk_score', risk_score,
    'message', 'Role assigned successfully'
  );
END;
$$;

-- Create function for comprehensive input validation logging
CREATE OR REPLACE FUNCTION public.log_input_validation(
  p_user_id UUID,
  p_context TEXT,
  p_validation_result JSONB,
  p_ip_address INET DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.input_validation_log (
    user_id, input_context, validation_result, 
    threat_detected, threat_types, sanitized_input, ip_address
  ) VALUES (
    p_user_id, p_context, p_validation_result,
    COALESCE((p_validation_result->>'hasThreats')::boolean, false),
    CASE 
      WHEN p_validation_result->'threatTypes' IS NOT NULL 
      THEN ARRAY(SELECT jsonb_array_elements_text(p_validation_result->'threatTypes'))
      ELSE ARRAY[]::TEXT[]
    END,
    p_validation_result->>'sanitizedInput',
    p_ip_address
  );
END;
$$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_comprehensive_security_log_user_event 
  ON public.comprehensive_security_log(user_id, event_type, created_at);
CREATE INDEX IF NOT EXISTS idx_comprehensive_security_log_severity_risk 
  ON public.comprehensive_security_log(severity, risk_score, created_at);
CREATE INDEX IF NOT EXISTS idx_input_validation_log_context_threat 
  ON public.input_validation_log(input_context, threat_detected, created_at);
