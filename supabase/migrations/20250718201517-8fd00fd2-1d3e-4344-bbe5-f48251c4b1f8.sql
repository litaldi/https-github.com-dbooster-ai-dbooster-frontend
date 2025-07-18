
-- Phase 1: Critical Database Security Fixes

-- Create IP whitelist table for admin operations
CREATE TABLE IF NOT EXISTS public.admin_ip_whitelist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address INET NOT NULL,
  description TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true
);

-- Enable RLS on IP whitelist
ALTER TABLE public.admin_ip_whitelist ENABLE ROW LEVEL SECURITY;

-- Create policy for IP whitelist - only admins can manage
CREATE POLICY "Only admins can manage IP whitelist" 
  ON public.admin_ip_whitelist 
  FOR ALL 
  USING (has_role(auth.uid(), 'admin'));

-- Create role assignment approval workflow table
CREATE TABLE IF NOT EXISTS public.role_assignment_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  target_user_id UUID NOT NULL,
  requested_role app_role NOT NULL,
  requested_by UUID REFERENCES auth.users(id) NOT NULL,
  approved_by UUID REFERENCES auth.users(id),
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

-- Enhanced role assignment function with approval workflow
CREATE OR REPLACE FUNCTION public.secure_assign_user_role(
  target_user_id UUID,
  new_role app_role,
  change_reason TEXT DEFAULT NULL,
  requester_ip INET DEFAULT NULL
)
RETURNS JSONB
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

-- Add time-based role restrictions
CREATE TABLE IF NOT EXISTS public.role_time_restrictions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  role app_role NOT NULL,
  start_time TIME,
  end_time TIME,
  timezone TEXT DEFAULT 'UTC',
  days_of_week INTEGER[] DEFAULT ARRAY[1,2,3,4,5,6,7], -- 1=Monday, 7=Sunday
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS on role time restrictions
ALTER TABLE public.role_time_restrictions ENABLE ROW LEVEL SECURITY;

-- Create policy for role time restrictions
CREATE POLICY "Admins can manage role time restrictions" 
  ON public.role_time_restrictions 
  FOR ALL 
  USING (has_role(auth.uid(), 'admin'));

-- Enhanced function to check if role is active considering time restrictions
CREATE OR REPLACE FUNCTION public.is_role_active_now(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  WITH role_check AS (
    SELECT EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = _user_id AND role = _role
    ) as has_role
  ),
  time_restriction AS (
    SELECT 
      start_time, 
      end_time, 
      timezone,
      days_of_week
    FROM public.role_time_restrictions 
    WHERE user_id = _user_id AND role = _role
  )
  SELECT 
    CASE 
      WHEN NOT rc.has_role THEN false
      WHEN tr.start_time IS NULL THEN true -- No time restrictions
      WHEN EXTRACT(DOW FROM (now() AT TIME ZONE COALESCE(tr.timezone, 'UTC'))) + 1 = ANY(tr.days_of_week)
        AND (now() AT TIME ZONE COALESCE(tr.timezone, 'UTC'))::TIME BETWEEN tr.start_time AND tr.end_time 
      THEN true
      ELSE false
    END
  FROM role_check rc
  LEFT JOIN time_restriction tr ON true;
$$;

-- Create enhanced security events table
CREATE TABLE IF NOT EXISTS public.security_events_enhanced (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  user_id UUID,
  session_id TEXT,
  ip_address INET,
  user_agent TEXT,
  event_data JSONB,
  threat_score INTEGER DEFAULT 0,
  auto_blocked BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on enhanced security events
ALTER TABLE public.security_events_enhanced ENABLE ROW LEVEL SECURITY;

-- Create policies for enhanced security events
CREATE POLICY "Admins can view all security events" 
  ON public.security_events_enhanced 
  FOR SELECT 
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert security events" 
  ON public.security_events_enhanced 
  FOR INSERT 
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_security_events_enhanced_severity ON public.security_events_enhanced(severity);
CREATE INDEX IF NOT EXISTS idx_security_events_enhanced_created_at ON public.security_events_enhanced(created_at);
CREATE INDEX IF NOT EXISTS idx_security_events_enhanced_threat_score ON public.security_events_enhanced(threat_score);
CREATE INDEX IF NOT EXISTS idx_role_assignment_requests_status ON public.role_assignment_requests(status);
CREATE INDEX IF NOT EXISTS idx_admin_ip_whitelist_active ON public.admin_ip_whitelist(is_active, expires_at);
