
-- Create a comprehensive audit log table for security monitoring
CREATE TABLE public.security_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on audit log
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Create policy for audit log (only admins can read, system can write)
CREATE POLICY "System can insert audit logs" 
  ON public.security_audit_log 
  FOR INSERT 
  WITH CHECK (true);

-- Create rate limiting tracking table
CREATE TABLE public.rate_limit_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL, -- IP address or user ID
  action_type TEXT NOT NULL,
  attempt_count INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  blocked_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(identifier, action_type)
);

-- Enable RLS on rate limiting table
ALTER TABLE public.rate_limit_tracking ENABLE ROW LEVEL SECURITY;

-- Create policy for rate limiting (system access only)
CREATE POLICY "System can manage rate limits" 
  ON public.rate_limit_tracking 
  FOR ALL 
  USING (true);

-- Create indexes for performance
CREATE INDEX idx_rate_limit_identifier_action ON public.rate_limit_tracking(identifier, action_type);
CREATE INDEX idx_rate_limit_window_start ON public.rate_limit_tracking(window_start);
CREATE INDEX idx_security_audit_user_id ON public.security_audit_log(user_id);
CREATE INDEX idx_security_audit_event_type ON public.security_audit_log(event_type);
CREATE INDEX idx_security_audit_created_at ON public.security_audit_log(created_at);
