-- Create secure session management tables for server-side session handling
CREATE TABLE IF NOT EXISTS public.secure_user_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_token TEXT NOT NULL UNIQUE,
  device_fingerprint TEXT,
  ip_address INET,
  user_agent TEXT,
  security_score INTEGER DEFAULT 50,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '24 hours'),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create password history table for enhanced password security
CREATE TABLE IF NOT EXISTS public.user_password_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_compromised BOOLEAN DEFAULT false,
  breach_source TEXT
);

-- Create persistent rate limiting table
CREATE TABLE IF NOT EXISTS public.persistent_rate_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier TEXT NOT NULL,
  action_type TEXT NOT NULL,
  attempt_count INTEGER DEFAULT 0,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT now(),
  blocked_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb,
  UNIQUE(identifier, action_type)
);

-- Enable RLS on all new tables
ALTER TABLE public.secure_user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_password_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.persistent_rate_limits ENABLE ROW LEVEL SECURITY;

-- RLS policies for secure_user_sessions
CREATE POLICY "Users can view their own sessions" 
ON public.secure_user_sessions 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can update their own sessions" 
ON public.secure_user_sessions 
FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "System can manage sessions" 
ON public.secure_user_sessions 
FOR ALL 
USING (true);

-- RLS policies for user_password_history
CREATE POLICY "Users can view their own password history" 
ON public.user_password_history 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "System can manage password history" 
ON public.user_password_history 
FOR ALL 
USING (true);

-- RLS policies for persistent_rate_limits
CREATE POLICY "System can manage rate limits" 
ON public.persistent_rate_limits 
FOR ALL 
USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_secure_sessions_user_id ON public.secure_user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_secure_sessions_token ON public.secure_user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_secure_sessions_expires ON public.secure_user_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_password_history_user_id ON public.user_password_history(user_id);
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier ON public.persistent_rate_limits(identifier, action_type);

-- Create function to clean up expired sessions
CREATE OR REPLACE FUNCTION public.cleanup_expired_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.secure_user_sessions 
  WHERE expires_at < now() OR (last_activity < now() - INTERVAL '7 days');
END;
$$;

-- Create function for secure session validation
CREATE OR REPLACE FUNCTION public.validate_secure_session(
  p_session_token TEXT,
  p_device_fingerprint TEXT DEFAULT NULL,
  p_ip_address INET DEFAULT NULL
) 
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  session_record RECORD;
  security_score INTEGER := 50;
BEGIN
  -- Get session record
  SELECT * INTO session_record
  FROM public.secure_user_sessions
  WHERE session_token = p_session_token
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
$$;