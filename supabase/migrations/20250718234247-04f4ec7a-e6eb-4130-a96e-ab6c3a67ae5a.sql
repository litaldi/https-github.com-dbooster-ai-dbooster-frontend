
-- Phase 1: Critical Security Fixes - Enhanced Role Security and Session Management

-- Create table for tracking privilege escalation attempts
CREATE TABLE IF NOT EXISTS public.privilege_escalation_attempts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  attempted_role app_role,
  method TEXT,
  ip_address INET,
  user_agent TEXT,
  blocked BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on privilege escalation attempts
ALTER TABLE public.privilege_escalation_attempts ENABLE ROW LEVEL SECURITY;

-- Create policies for privilege escalation attempts
CREATE POLICY "Admins can view escalation attempts" 
  ON public.privilege_escalation_attempts 
  FOR SELECT 
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "System can log escalation attempts" 
  ON public.privilege_escalation_attempts 
  FOR INSERT 
  WITH CHECK (true);

-- Create role assignment requests table for approval workflow
CREATE TABLE IF NOT EXISTS public.role_assignment_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  target_user_id UUID NOT NULL,
  requested_role app_role NOT NULL,
  requested_by UUID NOT NULL,
  approved_by UUID,
  reason TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  request_ip INET,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  approved_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on role assignment requests
ALTER TABLE public.role_assignment_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for role assignment requests
CREATE POLICY "Admins can view all role requests" 
  ON public.role_assignment_requests 
  FOR SELECT 
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create role requests" 
  ON public.role_assignment_requests 
  FOR INSERT 
  WITH CHECK (requested_by = auth.uid());

CREATE POLICY "Admins can update role requests" 
  ON public.role_assignment_requests 
  FOR UPDATE 
  USING (has_role(auth.uid(), 'admin'));

-- Create admin IP whitelist table
CREATE TABLE IF NOT EXISTS public.admin_ip_whitelist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address INET NOT NULL UNIQUE,
  description TEXT,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true
);

-- Enable RLS on admin IP whitelist
ALTER TABLE public.admin_ip_whitelist ENABLE ROW LEVEL SECURITY;

-- Create policy for admin IP whitelist
CREATE POLICY "Only admins can manage IP whitelist" 
  ON public.admin_ip_whitelist 
  FOR ALL 
  USING (has_role(auth.uid(), 'admin'));

-- Enhanced secure role assignment function with approval workflow
CREATE OR REPLACE FUNCTION public.secure_assign_user_role(
  target_user_id UUID,
  new_role app_role,
  change_reason TEXT DEFAULT NULL,
  requester_ip INET DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  current_role app_role;
  request_id UUID;
  requires_approval BOOLEAN := false;
  ip_whitelisted BOOLEAN := false;
BEGIN
  -- Only admins can assign roles
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only administrators can assign roles';
  END IF;

  -- Check if IP is whitelisted for admin operations
  IF requester_ip IS NOT NULL THEN
    SELECT EXISTS (
      SELECT 1 FROM public.admin_ip_whitelist 
      WHERE ip_address = requester_ip 
        AND is_active = true 
        AND (expires_at IS NULL OR expires_at > now())
    ) INTO ip_whitelisted;
  END IF;

  -- Get current role
  SELECT role INTO current_role 
  FROM public.user_roles 
  WHERE user_id = target_user_id 
  ORDER BY assigned_at DESC 
  LIMIT 1;

  -- Determine if approval workflow is needed
  -- Admin role assignments always require approval unless IP is whitelisted
  IF new_role = 'admin' AND NOT ip_whitelisted THEN
    requires_approval := true;
  END IF;

  -- If approval is required, create a request instead of direct assignment
  IF requires_approval THEN
    INSERT INTO public.role_assignment_requests (
      target_user_id, 
      requested_role, 
      requested_by, 
      reason,
      request_ip
    ) VALUES (
      target_user_id,
      new_role,
      auth.uid(),
      COALESCE(change_reason, 'Administrative role change request'),
      requester_ip
    ) RETURNING id INTO request_id;

    -- Log the request
    INSERT INTO public.role_change_audit (
      user_id, 
      old_role, 
      new_role, 
      changed_by,
      reason,
      ip_address
    ) VALUES (
      target_user_id,
      current_role,
      new_role,
      auth.uid(),
      CONCAT('PENDING APPROVAL - Request ID: ', request_id),
      requester_ip
    );

    RETURN jsonb_build_object(
      'success', false,
      'requires_approval', true,
      'request_id', request_id,
      'message', 'Role change request created and pending approval'
    );
  END IF;

  -- Direct assignment for non-critical roles or whitelisted IPs
  INSERT INTO public.role_change_audit (
    user_id, 
    old_role, 
    new_role, 
    changed_by,
    reason,
    ip_address
  ) VALUES (
    target_user_id,
    current_role,
    new_role,
    auth.uid(),
    COALESCE(change_reason, 'Administrative role change'),
    requester_ip
  );

  -- Update or insert role
  INSERT INTO public.user_roles (user_id, role, assigned_by)
  VALUES (target_user_id, new_role, auth.uid())
  ON CONFLICT (user_id, role) 
  DO UPDATE SET 
    assigned_at = now(),
    assigned_by = auth.uid();

  RETURN jsonb_build_object(
    'success', true,
    'requires_approval', false,
    'message', 'Role assigned successfully'
  );
END;
$$;

-- Function to approve role assignment requests
CREATE OR REPLACE FUNCTION public.approve_role_assignment_request(
  request_id UUID,
  approve BOOLEAN DEFAULT true
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  req_record RECORD;
BEGIN
  -- Only admins can approve requests
  IF NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only administrators can approve role requests';
  END IF;

  -- Get the request
  SELECT * INTO req_record 
  FROM public.role_assignment_requests 
  WHERE id = request_id AND status = 'pending';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Request not found or already processed';
  END IF;

  -- Update request status
  UPDATE public.role_assignment_requests 
  SET 
    status = CASE WHEN approve THEN 'approved' ELSE 'rejected' END,
    approved_by = auth.uid(),
    approved_at = now()
  WHERE id = request_id;

  -- If approved, actually assign the role
  IF approve THEN
    INSERT INTO public.user_roles (user_id, role, assigned_by)
    VALUES (req_record.target_user_id, req_record.requested_role, auth.uid())
    ON CONFLICT (user_id, role) 
    DO UPDATE SET 
      assigned_at = now(),
      assigned_by = auth.uid();

    -- Log the approval
    INSERT INTO public.role_change_audit (
      user_id, 
      new_role, 
      changed_by,
      reason,
      ip_address
    ) VALUES (
      req_record.target_user_id,
      req_record.requested_role,
      auth.uid(),
      CONCAT('APPROVED - Request ID: ', request_id, ' - ', req_record.reason),
      req_record.request_ip
    );
  END IF;

  RETURN approve;
END;
$$;

-- Enhanced function for checking if bootstrap is needed
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
