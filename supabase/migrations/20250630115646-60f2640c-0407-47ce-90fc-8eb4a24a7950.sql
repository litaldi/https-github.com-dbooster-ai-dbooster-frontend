
-- Create user profiles table with proper RLS policies
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update existing rate_limit_tracking policies to be more restrictive
DROP POLICY IF EXISTS "System can insert rate limit records" ON public.rate_limit_tracking;
DROP POLICY IF EXISTS "System can update rate limit records" ON public.rate_limit_tracking;
DROP POLICY IF EXISTS "System can select rate limit records" ON public.rate_limit_tracking;

-- Create more specific rate limiting policies
CREATE POLICY "Service role can manage rate limits" 
  ON public.rate_limit_tracking 
  FOR ALL 
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Update security_audit_log policies for better access control
DROP POLICY IF EXISTS "System can insert audit logs" ON public.security_audit_log;
DROP POLICY IF EXISTS "Users can view their own audit logs" ON public.security_audit_log;

CREATE POLICY "Service role can insert audit logs" 
  ON public.security_audit_log 
  FOR INSERT 
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role' OR auth.uid() IS NOT NULL);

CREATE POLICY "Users can view their own audit logs" 
  ON public.security_audit_log 
  FOR SELECT 
  USING (user_id = auth.uid() OR auth.jwt() ->> 'role' = 'service_role');
