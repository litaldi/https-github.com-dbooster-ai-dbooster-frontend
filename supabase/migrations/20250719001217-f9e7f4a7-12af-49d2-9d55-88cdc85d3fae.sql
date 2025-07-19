
-- Create CMS tables for managing content
CREATE TABLE public.cms_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content JSONB,
  meta_title TEXT,
  meta_description TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users,
  updated_by UUID REFERENCES auth.users
);

-- Create CMS settings table
CREATE TABLE public.cms_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB,
  category TEXT DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create CMS media table for file management
CREATE TABLE public.cms_media (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes INTEGER,
  url TEXT NOT NULL,
  alt_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  uploaded_by UUID REFERENCES auth.users
);

-- Create CMS navigation table
CREATE TABLE public.cms_navigation (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  parent_id UUID REFERENCES public.cms_navigation,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for CMS tables
ALTER TABLE public.cms_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cms_navigation ENABLE ROW LEVEL SECURITY;

-- CMS Pages policies
CREATE POLICY "Anyone can view published pages" 
  ON public.cms_pages 
  FOR SELECT 
  USING (published = true OR auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can manage pages" 
  ON public.cms_pages 
  FOR ALL 
  USING (auth.uid() IS NOT NULL);

-- CMS Settings policies
CREATE POLICY "Anyone can view settings" 
  ON public.cms_settings 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can manage settings" 
  ON public.cms_settings 
  FOR ALL 
  USING (auth.uid() IS NOT NULL);

-- CMS Media policies
CREATE POLICY "Anyone can view media" 
  ON public.cms_media 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can manage media" 
  ON public.cms_media 
  FOR ALL 
  USING (auth.uid() IS NOT NULL);

-- CMS Navigation policies
CREATE POLICY "Anyone can view navigation" 
  ON public.cms_navigation 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Authenticated users can manage navigation" 
  ON public.cms_navigation 
  FOR ALL 
  USING (auth.uid() IS NOT NULL);

-- Create updated_at trigger for CMS tables
CREATE TRIGGER update_cms_pages_updated_at 
  BEFORE UPDATE ON public.cms_pages 
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_cms_settings_updated_at 
  BEFORE UPDATE ON public.cms_settings 
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER update_cms_navigation_updated_at 
  BEFORE UPDATE ON public.cms_navigation 
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- Insert default CMS settings
INSERT INTO public.cms_settings (key, value, category) VALUES 
  ('site_title', '"DBooster"', 'general'),
  ('site_description', '"AI-Powered Database Optimization Platform"', 'general'),
  ('contact_email', '"support@dbooster.com"', 'contact'),
  ('social_github', '"https://github.com/dbooster"', 'social'),
  ('social_twitter', '"https://twitter.com/dbooster"', 'social');

-- Insert default navigation items
INSERT INTO public.cms_navigation (label, url, sort_order, is_active) VALUES 
  ('Home', '/', 1, true),
  ('Features', '/features', 2, true),
  ('Pricing', '/pricing', 3, true),
  ('Documentation', '/documentation', 4, true),
  ('Blog', '/blog', 5, true),
  ('Contact', '/contact', 6, true);
