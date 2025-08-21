-- Fix function search path security issue
-- Set explicit search_path for security functions

-- Fix the audit log enforcement function
CREATE OR REPLACE FUNCTION public.enforce_audit_log_user_id()
RETURNS trigger AS $$
BEGIN
  -- Force user_id to be the authenticated user for non-service_role inserts
  IF (auth.jwt() ->> 'role') <> 'service_role' THEN
    NEW.user_id := auth.uid();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;