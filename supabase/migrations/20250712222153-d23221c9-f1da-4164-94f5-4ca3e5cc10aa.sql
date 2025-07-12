
-- Step 1: Tighten Rate Limiting Controls
-- Remove the policy that allows users to update their own rate limits
DROP POLICY IF EXISTS "Users can update their own rate limits" ON public.rate_limit_tracking;

-- Create a more restrictive policy - users can only view, not modify
CREATE POLICY "Users can view own rate limits only" 
  ON public.rate_limit_tracking 
  FOR SELECT 
  USING (identifier = CONCAT('login:', auth.email()) OR identifier = auth.uid()::text);

-- Service role maintains full control for system operations
-- (The existing "Service role can manage all rate limits" policy remains)

-- Step 2: Improve Audit Log Integrity
-- Add a constraint to ensure user_id is provided for authenticated events
-- First, let's add a function to validate audit log entries
CREATE OR REPLACE FUNCTION public.validate_audit_log_entry()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
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
$$;

-- Create trigger for audit log validation
CREATE TRIGGER validate_audit_log_trigger
  BEFORE INSERT ON public.security_audit_log
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_audit_log_entry();

-- Step 3: Add database constraints for additional security
-- Add check constraint for valid event types
ALTER TABLE public.security_audit_log 
ADD CONSTRAINT valid_event_type 
CHECK (LENGTH(TRIM(event_type)) > 0);

-- Add index for better performance on security queries
CREATE INDEX IF NOT EXISTS idx_security_audit_log_user_event 
ON public.security_audit_log(user_id, event_type, created_at);

CREATE INDEX IF NOT EXISTS idx_security_audit_log_created_at 
ON public.security_audit_log(created_at DESC);
