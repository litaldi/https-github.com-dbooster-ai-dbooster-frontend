
-- Fix database function security vulnerabilities
-- Add SECURITY DEFINER and proper search_path settings

-- Update handle_new_user function to be more secure
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name')
  );
  RETURN NEW;
END;
$function$;

-- Update validate_audit_log_entry function to be more secure
CREATE OR REPLACE FUNCTION public.validate_audit_log_entry()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- For authenticated events, user_id should not be null
  IF NEW.event_type LIKE '%login%' OR NEW.event_type LIKE '%signup%' OR NEW.event_type LIKE '%auth%' THEN
    IF NEW.user_id IS NULL THEN
      RAISE EXCEPTION 'user_id cannot be null for authenticated events';
    END IF;
  END IF;
  
  -- Validate event_type is not empty
  IF NEW.event_type IS NULL OR LENGTH(TRIM(NEW.event_type)) = 0 THEN
    RAISE EXCEPTION 'event_type cannot be empty';
  END IF;
  
  RETURN NEW;
END;
$function$;

-- Create a secure function to get user role (for future role-based access)
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $function$
  SELECT COALESCE(
    (SELECT 'admin' FROM profiles WHERE id = auth.uid() AND email LIKE '%admin%'),
    'user'
  );
$function$;

-- Add trigger to automatically update updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Apply the trigger to relevant tables
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_repositories_updated_at ON public.repositories;
CREATE TRIGGER update_repositories_updated_at
  BEFORE UPDATE ON public.repositories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_queries_updated_at ON public.queries;
CREATE TRIGGER update_queries_updated_at
  BEFORE UPDATE ON public.queries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
