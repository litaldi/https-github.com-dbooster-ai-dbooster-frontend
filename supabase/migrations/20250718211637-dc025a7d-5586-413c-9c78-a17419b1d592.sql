
-- Security Enhancement: Fix Role Assignment Policies and Add Admin Bootstrap

-- 1. Remove the overly permissive role viewing policy
DROP POLICY IF EXISTS "Users can view role assignments" ON public.user_roles;

-- 2. Create more restrictive policies for role viewing
CREATE POLICY "Users can view only their own roles" 
  ON public.user_roles 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all user roles" 
  ON public.user_roles 
  FOR SELECT 
  USING (has_role(auth.uid(), 'admin'));

-- 3. Add admin bootstrap tracking table
CREATE TABLE IF NOT EXISTS public.admin_bootstrap_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_admin_created BOOLEAN DEFAULT FALSE,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  bootstrap_method TEXT,
  ip_address INET,
  user_agent TEXT
);

-- Enable RLS on admin bootstrap log
ALTER TABLE public.admin_bootstrap_log ENABLE ROW LEVEL SECURITY;

-- Only system can manage bootstrap log
CREATE POLICY "System manages bootstrap log" 
  ON public.admin_bootstrap_log 
  FOR ALL 
  USING (true);

-- 4. Enhanced security monitoring for role changes
CREATE TABLE IF NOT EXISTS public.privilege_escalation_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  attempted_role app_role,
  method TEXT,
  blocked BOOLEAN DEFAULT TRUE,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on privilege escalation attempts
ALTER TABLE public.privilege_escalation_attempts ENABLE ROW LEVEL SECURITY;

-- Only admins can view escalation attempts
CREATE POLICY "Admins can view escalation attempts" 
  ON public.privilege_escalation_attempts 
  FOR SELECT 
  USING (has_role(auth.uid(), 'admin'));

-- System can insert escalation attempts
CREATE POLICY "System can log escalation attempts" 
  ON public.privilege_escalation_attempts 
  FOR INSERT 
  WITH CHECK (true);

-- 5. Function to check if admin bootstrap is needed
CREATE OR REPLACE FUNCTION public.is_admin_bootstrap_needed()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  admin_exists BOOLEAN;
  bootstrap_completed BOOLEAN;
BEGIN
  -- Check if any admin exists
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE role = 'admin'
  ) INTO admin_exists;
  
  -- Check if bootstrap was completed
  SELECT EXISTS (
    SELECT 1 FROM public.admin_bootstrap_log WHERE first_admin_created = true
  ) INTO bootstrap_completed;
  
  RETURN NOT admin_exists AND NOT bootstrap_completed;
END;
$$;

-- 6. Enhanced role assignment function with privilege escalation detection
CREATE OR REPLACE FUNCTION public.secure_role_assignment_with_monitoring(
  target_user_id UUID,
  new_role app_role,
  change_reason TEXT DEFAULT NULL,
  requester_ip INET DEFAULT NULL,
  user_agent_header TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  current_user_id UUID;
  is_admin BOOLEAN;
  is_bootstrap BOOLEAN;
  request_id UUID;
BEGIN
  current_user_id := auth.uid();
  
  -- Check if this is a bootstrap scenario
  is_bootstrap := public.is_admin_bootstrap_needed();
  
  -- If not bootstrap, require admin privileges
  IF NOT is_bootstrap THEN
    is_admin := has_role(current_user_id, 'admin');
    
    IF NOT is_admin THEN
      -- Log privilege escalation attempt
      INSERT INTO public.privilege_escalation_attempts (
        user_id, attempted_role, method, ip_address, user_agent
      ) VALUES (
        current_user_id, new_role, 'unauthorized_role_assignment', requester_ip, user_agent_header
      );
      
      RAISE EXCEPTION 'Access denied: Insufficient privileges for role assignment';
    END IF;
  END IF;
  
  -- For admin role assignments, always use the secure approval process
  IF new_role = 'admin' THEN
    RETURN public.secure_assign_user_role(
      target_user_id, new_role, change_reason, requester_ip
    );
  END IF;
  
  -- For non-admin roles, proceed with direct assignment if authorized
  INSERT INTO public.user_roles (user_id, role, assigned_by)
  VALUES (target_user_id, new_role, current_user_id)
  ON CONFLICT (user_id, role) 
  DO UPDATE SET 
    assigned_at = now(),
    assigned_by = current_user_id;
    
  -- Log successful assignment
  INSERT INTO public.role_change_audit (
    user_id, new_role, changed_by, reason, ip_address
  ) VALUES (
    target_user_id, new_role, current_user_id, 
    COALESCE(change_reason, 'Role assignment'), requester_ip
  );
  
  -- Mark bootstrap as completed if this was the first admin
  IF is_bootstrap AND new_role = 'admin' THEN
    INSERT INTO public.admin_bootstrap_log (
      first_admin_created, created_by, bootstrap_method, ip_address, user_agent
    ) VALUES (
      true, current_user_id, 'secure_assignment', requester_ip, user_agent_header
    );
  END IF;
  
  RETURN jsonb_build_object(
    'success', true,
    'message', 'Role assigned successfully'
  );
END;
$$;

-- 7. Add indexes for better security monitoring performance
CREATE INDEX IF NOT EXISTS idx_privilege_escalation_user_id ON public.privilege_escalation_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_privilege_escalation_created_at ON public.privilege_escalation_attempts(created_at);
CREATE INDEX IF NOT EXISTS idx_role_change_audit_user_id ON public.role_change_audit(user_id);
CREATE INDEX IF NOT EXISTS idx_role_change_audit_created_at ON public.role_change_audit(created_at);
