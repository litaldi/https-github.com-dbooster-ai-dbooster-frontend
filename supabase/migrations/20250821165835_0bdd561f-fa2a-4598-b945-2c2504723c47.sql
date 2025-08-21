-- SECURITY FIX: Restrict cms_media access to prevent unauthorized file deletion (FIXED)
-- Issue: Any authenticated user could delete/modify all media files
-- Fix: Users can only manage their own uploads, admins can manage all

-- Drop all existing policies first
DROP POLICY IF EXISTS "Authenticated users can manage media" ON public.cms_media;
DROP POLICY IF EXISTS "Anyone can view media" ON public.cms_media;
DROP POLICY IF EXISTS "Users can upload their own media" ON public.cms_media;
DROP POLICY IF EXISTS "Users can update own media, admins all" ON public.cms_media;
DROP POLICY IF EXISTS "Users can delete own media, admins all" ON public.cms_media;

-- Create granular policies for proper access control

-- 1) Anyone can VIEW media (public read access for displaying images/files)
CREATE POLICY "Public can view media"
ON public.cms_media
FOR SELECT
USING (true);

-- 2) Authenticated users can INSERT their own media
CREATE POLICY "Users upload own media"
ON public.cms_media
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = uploaded_by);

-- 3) Users can UPDATE only their own media, admins can update any
CREATE POLICY "Users update own media or admins all"
ON public.cms_media
FOR UPDATE
TO authenticated
USING (
  auth.uid() = uploaded_by OR 
  has_role(auth.uid(), 'admin')
)
WITH CHECK (
  auth.uid() = uploaded_by OR 
  has_role(auth.uid(), 'admin')
);

-- 4) Users can DELETE only their own media, admins can delete any
CREATE POLICY "Users delete own media or admins all"
ON public.cms_media
FOR DELETE
TO authenticated
USING (
  auth.uid() = uploaded_by OR 
  has_role(auth.uid(), 'admin')
);

-- 5) Add trigger to automatically set uploaded_by on INSERT
CREATE OR REPLACE FUNCTION public.set_media_uploader()
RETURNS TRIGGER AS $$
BEGIN
  -- Automatically set uploaded_by to current user if not specified
  IF NEW.uploaded_by IS NULL THEN
    NEW.uploaded_by := auth.uid();
  END IF;
  
  -- Prevent users from spoofing the uploaded_by field (except admins)
  IF TG_OP = 'UPDATE' AND OLD.uploaded_by IS NOT NULL AND NEW.uploaded_by != OLD.uploaded_by THEN
    IF NOT has_role(auth.uid(), 'admin') THEN
      RAISE EXCEPTION 'Only admins can change file ownership';
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for media uploads
DROP TRIGGER IF EXISTS set_media_uploader_trigger ON public.cms_media;
CREATE TRIGGER set_media_uploader_trigger
  BEFORE INSERT OR UPDATE ON public.cms_media
  FOR EACH ROW
  EXECUTE FUNCTION public.set_media_uploader();

-- Log this security fix
INSERT INTO public.comprehensive_security_log (
  event_type, event_category, severity, event_data
) VALUES (
  'cms_media_security_fix_applied', 'security', 'info',
  jsonb_build_object(
    'issue', 'overly_permissive_media_access',
    'fix', 'granular_rls_policies_implemented',
    'timestamp', now()::text,
    'policies_created', array[
      'public_can_view_media',
      'users_upload_own_media',
      'users_update_own_or_admins_all',
      'users_delete_own_or_admins_all'
    ],
    'trigger_added', 'set_media_uploader_trigger'
  )
);