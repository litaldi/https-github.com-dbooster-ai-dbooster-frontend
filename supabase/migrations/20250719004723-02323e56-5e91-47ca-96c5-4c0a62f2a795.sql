
-- Fix Role Assignment RLS Policy and Add Security Validations

-- Create a more secure role assignment function with proper validation
CREATE OR REPLACE FUNCTION public.secure_role_assignment_enhanced(
  target_user_id uuid, 
  new_role app_role, 
  change_reason text DEFAULT NULL,
  requester_ip inet DEFAULT NULL,
  user_agent_header text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id UUID;
  current_user_role app_role;
  is_admin BOOLEAN;
  is_bootstrap BOOLEAN;
  requires_approval BOOLEAN := false;
  request_id UUID;
BEGIN
  current_user_id := auth.uid();
  
  -- Enhanced logging for all role assignment attempts
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
  
  -- If not bootstrap, require admin privileges
  IF NOT is_bootstrap THEN
    is_admin := has_role(current_user_id, 'admin');
    
    IF NOT is_admin THEN
      -- Log privilege escalation attempt
      INSERT INTO public.privilege_escalation_attempts (
        user_id, attempted_role, method, ip_address, user_agent, blocked
      ) VALUES (
        current_user_id, new_role, 'unauthorized_role_assignment', requester_ip, user_agent_header, true
      );
      
      RAISE EXCEPTION 'SECURITY VIOLATION: Unauthorized role assignment attempt detected';
    END IF;
    
    -- For admin role assignments, require approval workflow
    IF new_role = 'admin' THEN
      requires_approval := true;
    END IF;
  END IF;
  
  -- If approval is required, create request instead of direct assignment
  IF requires_approval THEN
    INSERT INTO public.role_assignment_requests (
      target_user_id, requested_role, requested_by, reason, request_ip
    ) VALUES (
      target_user_id, new_role, current_user_id, 
      COALESCE(change_reason, 'Administrative role assignment request'), requester_ip
    ) RETURNING id INTO request_id;
    
    RETURN jsonb_build_object(
      'success', false,
      'requires_approval', true,
      'request_id', request_id,
      'message', 'Admin role assignment requires approval'
    );
  END IF;
  
  -- Direct assignment for non-admin roles or bootstrap
  INSERT INTO public.user_roles (user_id, role, assigned_by)
  VALUES (target_user_id, new_role, current_user_id)
  ON CONFLICT (user_id, role) 
  DO UPDATE SET 
    assigned_at = now(),
    assigned_by = current_user_id;
  
  -- Log successful assignment
  INSERT INTO public.comprehensive_security_log (
    user_id, event_type, event_category, severity, event_data, 
    ip_address, user_agent
  ) VALUES (
    current_user_id, 'role_assignment_success', 'authentication', 'info',
    jsonb_build_object(
      'target_user', target_user_id,
      'assigned_role', new_role,
      'is_bootstrap', is_bootstrap
    ),
    requester_ip, user_agent_header
  );
  
  RETURN jsonb_build_object(
    'success', true,
    'requires_approval', false,
    'message', 'Role assigned successfully'
  );
END;
$$;

-- Update user_roles RLS policies to be more secure
DROP POLICY IF EXISTS "Only admins can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can update roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can delete roles" ON public.user_roles;

-- Create more restrictive policies
CREATE POLICY "Secure role insertion"
  ON public.user_roles
  FOR INSERT
  WITH CHECK (
    -- Only allow through secure functions or bootstrap
    (has_role(auth.uid(), 'admin') AND auth.uid() != user_id) OR
    public.is_admin_bootstrap_needed()
  );

CREATE POLICY "Secure role updates"
  ON public.user_roles
  FOR UPDATE
  USING (has_role(auth.uid(), 'admin') AND auth.uid() != user_id);

CREATE POLICY "Secure role deletion"
  ON public.user_roles
  FOR DELETE
  USING (has_role(auth.uid(), 'admin') AND auth.uid() != user_id);

-- Add trigger to prevent direct role table manipulation
CREATE OR REPLACE FUNCTION public.validate_role_assignment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log all role assignment attempts
  INSERT INTO public.comprehensive_security_log (
    user_id, event_type, event_category, severity, event_data
  ) VALUES (
    auth.uid(), 'direct_role_table_access', 'security_violation', 'warning',
    jsonb_build_object(
      'operation', TG_OP,
      'target_user', COALESCE(NEW.user_id, OLD.user_id),
      'role', COALESCE(NEW.role, OLD.role)
    )
  );
  
  -- Prevent users from modifying their own roles
  IF (TG_OP = 'UPDATE' OR TG_OP = 'DELETE') AND OLD.user_id = auth.uid() THEN
    RAISE EXCEPTION 'SECURITY VIOLATION: Users cannot modify their own roles';
  END IF;
  
  IF TG_OP = 'INSERT' AND NEW.user_id = auth.uid() THEN
    -- Allow only during bootstrap or through secure functions
    IF NOT public.is_admin_bootstrap_needed() AND NOT has_role(auth.uid(), 'admin') THEN
      RAISE EXCEPTION 'SECURITY VIOLATION: Users cannot assign roles to themselves';
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS validate_role_assignment_trigger ON public.user_roles;
CREATE TRIGGER validate_role_assignment_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_role_assignment();

-- Create session security validation table for enhanced session management
CREATE TABLE IF NOT EXISTS public.session_security_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'info',
  device_fingerprint TEXT,
  ip_address INET,
  user_agent TEXT,
  security_score INTEGER DEFAULT 0,
  blocked BOOLEAN DEFAULT false,
  event_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on session security events
ALTER TABLE public.session_security_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own session events"
  ON public.session_security_events
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "System can insert session events"
  ON public.session_security_events
  FOR INSERT
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_session_security_events_user_id ON public.session_security_events(user_id);
CREATE INDEX IF NOT EXISTS idx_session_security_events_session_id ON public.session_security_events(session_id);
CREATE INDEX IF NOT EXISTS idx_session_security_events_created_at ON public.session_security_events(created_at);
