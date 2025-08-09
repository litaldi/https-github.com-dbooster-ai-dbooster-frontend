-- Tighten RLS policies for CMS and admin bootstrap tables

-- cms_navigation: restrict management to admins only
DROP POLICY IF EXISTS "Authenticated users can manage navigation" ON public.cms_navigation;
CREATE POLICY "Admins can manage navigation"
ON public.cms_navigation
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- cms_settings: restrict management to admins only
DROP POLICY IF EXISTS "Authenticated users can manage settings" ON public.cms_settings;
CREATE POLICY "Admins can manage settings"
ON public.cms_settings
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

-- admin_bootstrap_validation: restrict ALL to service_role only (system only)
DROP POLICY IF EXISTS "System manages bootstrap tokens" ON public.admin_bootstrap_validation;
CREATE POLICY "Service role manages bootstrap tokens"
ON public.admin_bootstrap_validation
FOR ALL
TO authenticated
USING ((auth.jwt() ->> 'role') = 'service_role')
WITH CHECK ((auth.jwt() ->> 'role') = 'service_role');

-- admin_bootstrap_log: restrict ALL to service_role only (system only)
DROP POLICY IF EXISTS "System manages bootstrap log" ON public.admin_bootstrap_log;
CREATE POLICY "Service role manages bootstrap log"
ON public.admin_bootstrap_log
FOR ALL
TO authenticated
USING ((auth.jwt() ->> 'role') = 'service_role')
WITH CHECK ((auth.jwt() ->> 'role') = 'service_role');