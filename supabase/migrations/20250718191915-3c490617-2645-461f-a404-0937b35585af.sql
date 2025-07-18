
-- Phase 1: Database Security Reinforcement

-- Create audit table for role changes
CREATE TABLE IF NOT EXISTS public.role_change_audit (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  old_role app_role,
  new_role app_role NOT NULL,
  changed_by UUID,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address INET,
  user_agent TEXT
);

-- Enable RLS on role change audit
ALTER TABLE public.role_change_audit ENABLE ROW LEVEL SECURITY;

-- Create restrictive policy for role change audit - only admins can view
CREATE POLICY "Admins can view role changes" 
  ON public.role_change_audit 
  FOR SELECT 
  USING (has_role(auth.uid(), 'admin'));

-- Create policy for inserting role change audits
CREATE POLICY "System can insert role change audits" 
  ON public.role_change_audit 
  FOR INSERT 
  WITH CHECK (true);

-- Strengthen user_roles policies by preventing self-role modifications
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

-- Recreate more restrictive policies
CREATE POLICY "Users can view their own roles only" 
  ON public.user_roles 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Only admins can view all roles" 
  ON public.user_roles 
  FOR SELECT 
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can insert roles" 
  ON public.user_roles 
  FOR INSERT 
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update roles" 
  ON public.user_roles 
  FOR UPDATE 
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete roles" 
  ON public.user_roles 
  FOR DELETE 
  USING (has_role(auth.uid(), 'admin'));

-- Create function to validate role changes
CREATE OR REPLACE FUNCTION public.validate_role_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Prevent users from modifying their own roles (except during initial setup)
  IF OLD.user_id = auth.uid() AND NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Users cannot modify their own roles';
  END IF;

  -- Log role changes
  INSERT INTO public.role_change_audit (
    user_id, 
    old_role, 
    new_role, 
    changed_by,
    reason
  ) VALUES (
    COALESCE(NEW.user_id, OLD.user_id),
    OLD.role,
    NEW.role,
    auth.uid(),
    'Role change via database'
  );

  RETURN NEW;
END;
$$;

-- Create trigger for role change validation
DROP TRIGGER IF EXISTS validate_role_change_trigger ON public.user_roles;
CREATE TRIGGER validate_role_change_trigger
  BEFORE UPDATE ON public.user_roles
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_role_change();

-- Create function for secure role assignment
CREATE OR REPLACE FUNCTION public.assign_user_role(
  target_user_id UUID,
  new_role app_role,
  change_reason TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  current_role app_role;
BEGIN
  -- Only admins can assign roles
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only administrators can assign roles';
  END IF;

  -- Get current role
  SELECT role INTO current_role 
  FROM public.user_roles 
  WHERE user_id = target_user_id;

  -- Insert audit record
  INSERT INTO public.role_change_audit (
    user_id, 
    old_role, 
    new_role, 
    changed_by,
    reason
  ) VALUES (
    target_user_id,
    current_role,
    new_role,
    auth.uid(),
    COALESCE(change_reason, 'Administrative role change')
  );

  -- Update or insert role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, new_role)
  ON CONFLICT (user_id, role) 
  DO UPDATE SET role = EXCLUDED.role;

  RETURN TRUE;
END;
$$;

-- Create enhanced session tracking table
CREATE TABLE IF NOT EXISTS public.enhanced_session_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_id TEXT NOT NULL,
  device_fingerprint TEXT,
  ip_address INET,
  user_agent TEXT,
  is_demo BOOLEAN DEFAULT FALSE,
  security_score INTEGER DEFAULT 0,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'revoked', 'suspicious'))
);

-- Enable RLS on enhanced session tracking
ALTER TABLE public.enhanced_session_tracking ENABLE ROW LEVEL SECURITY;

-- Create policies for session tracking
CREATE POLICY "Users can view their own sessions" 
  ON public.enhanced_session_tracking 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "System can insert session tracking" 
  ON public.enhanced_session_tracking 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own sessions" 
  ON public.enhanced_session_tracking 
  FOR UPDATE 
  USING (user_id = auth.uid());

-- Create function to detect suspicious sessions
CREATE OR REPLACE FUNCTION public.detect_suspicious_session_activity()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  session_count INTEGER;
  different_ips INTEGER;
BEGIN
  -- Count active sessions for user
  SELECT COUNT(*) INTO session_count
  FROM public.enhanced_session_tracking
  WHERE user_id = NEW.user_id 
    AND status = 'active'
    AND expires_at > now();

  -- Count different IP addresses in last hour
  SELECT COUNT(DISTINCT ip_address) INTO different_ips
  FROM public.enhanced_session_tracking
  WHERE user_id = NEW.user_id 
    AND created_at > now() - INTERVAL '1 hour';

  -- Mark as suspicious if too many sessions or IPs
  IF session_count > 5 OR different_ips > 3 THEN
    NEW.status = 'suspicious';
    
    -- Log security event
    INSERT INTO public.security_audit_log (
      user_id,
      event_type,
      event_data,
      ip_address
    ) VALUES (
      NEW.user_id,
      'suspicious_session_detected',
      jsonb_build_object(
        'session_count', session_count,
        'different_ips', different_ips,
        'session_id', NEW.session_id
      ),
      NEW.ip_address
    );
  END IF;

  RETURN NEW;
END;
$$;

-- Create trigger for suspicious session detection
DROP TRIGGER IF EXISTS detect_suspicious_session_trigger ON public.enhanced_session_tracking;
CREATE TRIGGER detect_suspicious_session_trigger
  BEFORE INSERT ON public.enhanced_session_tracking
  FOR EACH ROW
  EXECUTE FUNCTION public.detect_suspicious_session_activity();
