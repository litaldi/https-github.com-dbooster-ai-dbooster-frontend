-- Security Fix: Add missing SELECT policy for user_mfa_config table
-- The user_mfa_status view depends on this table but users can't select from it

-- Add SELECT policy for users to view their own MFA config (needed for the view)
CREATE POLICY "Users can view their own MFA config" 
ON public.user_mfa_config 
FOR SELECT 
USING (auth.uid() = user_id);

-- Add admin policy for viewing all MFA configs (for support)
CREATE POLICY "Admins can view all MFA configs" 
ON public.user_mfa_config 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'));

-- Add DELETE policy for users to remove their own MFA config
CREATE POLICY "Users can delete their own MFA config" 
ON public.user_mfa_config 
FOR DELETE 
USING (auth.uid() = user_id);