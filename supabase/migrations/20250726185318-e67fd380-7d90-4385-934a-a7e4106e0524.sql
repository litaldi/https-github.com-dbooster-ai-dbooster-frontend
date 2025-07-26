-- Create table for secure session validation
CREATE TABLE IF NOT EXISTS public.secure_session_validation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL UNIQUE,
    user_id UUID NOT NULL,
    device_fingerprint TEXT NOT NULL,
    ip_address INET,
    user_agent TEXT,
    security_score INTEGER DEFAULT 100,
    is_valid BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.secure_session_validation ENABLE ROW LEVEL SECURITY;

-- Create policies for secure session validation
CREATE POLICY "Users can view their own sessions" 
ON public.secure_session_validation 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sessions" 
ON public.secure_session_validation 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions" 
ON public.secure_session_validation 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions" 
ON public.secure_session_validation 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create table for MFA configuration
CREATE TABLE IF NOT EXISTS public.user_mfa_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE,
    totp_secret TEXT,
    backup_codes TEXT[], 
    is_mfa_enabled BOOLEAN DEFAULT false,
    recovery_codes_used INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for MFA config
ALTER TABLE public.user_mfa_config ENABLE ROW LEVEL SECURITY;

-- Create policies for MFA config
CREATE POLICY "Users can manage their own MFA config" 
ON public.user_mfa_config 
FOR ALL 
USING (auth.uid() = user_id);

-- Create table for comprehensive security log
CREATE TABLE IF NOT EXISTS public.comprehensive_security_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    event_type TEXT NOT NULL,
    event_data JSONB,
    ip_address INET,
    user_agent TEXT,
    risk_score INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for security log
ALTER TABLE public.comprehensive_security_log ENABLE ROW LEVEL SECURITY;

-- Create policies for security log (admin access only for viewing others' logs)
CREATE POLICY "Users can view their own security logs" 
ON public.comprehensive_security_log 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create trigger for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for timestamp updates
CREATE TRIGGER update_secure_session_validation_updated_at
    BEFORE UPDATE ON public.secure_session_validation
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_mfa_config_updated_at
    BEFORE UPDATE ON public.user_mfa_config
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_secure_session_validation_user_id ON public.secure_session_validation(user_id);
CREATE INDEX IF NOT EXISTS idx_secure_session_validation_session_id ON public.secure_session_validation(session_id);
CREATE INDEX IF NOT EXISTS idx_comprehensive_security_log_user_id ON public.comprehensive_security_log(user_id);
CREATE INDEX IF NOT EXISTS idx_comprehensive_security_log_event_type ON public.comprehensive_security_log(event_type);