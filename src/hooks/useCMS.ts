
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { enhancedSecurityValidation } from '@/services/security/enhancedSecurityValidation';
import { productionLogger } from '@/utils/productionLogger';
import { toast } from 'sonner';

interface CMSPage {
  id: string;
  title: string;
  slug: string;
  content: any;
  published: boolean;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
}

interface CMSNavigation {
  id: string;
  label: string;
  url: string;
  parent_id?: string;
  sort_order: number;
  is_active: boolean;
}

interface CMSSettings {
  id: string;
  key: string;
  value: any;
  category: string;
}

export function useCMS() {
  const [pages, setPages] = useState<CMSPage[]>([]);
  const [navigation, setNavigation] = useState<CMSNavigation[]>([]);
  const [settings, setSettings] = useState<CMSSettings[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all CMS data
  const fetchCMSData = async () => {
    try {
      setLoading(true);
      
      const [pagesResponse, navResponse, settingsResponse] = await Promise.all([
        supabase.from('cms_pages').select('*').order('created_at', { ascending: false }),
        supabase.from('cms_navigation').select('*').order('sort_order'),
        supabase.from('cms_settings').select('*').order('category', { ascending: true })
      ]);

      if (pagesResponse.error) throw pagesResponse.error;
      if (navResponse.error) throw navResponse.error;
      if (settingsResponse.error) throw settingsResponse.error;

      setPages(pagesResponse.data || []);
      setNavigation(navResponse.data || []);
      setSettings(settingsResponse.data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch CMS data';
      setError(errorMessage);
      productionLogger.error('Failed to fetch CMS data', err, 'useCMS');
    } finally {
      setLoading(false);
    }
  };

  // Secure page creation with validation
  const createPage = async (pageData: Partial<CMSPage>) => {
    try {
      // Validate all text inputs
      const titleValidation = await enhancedSecurityValidation.validateAndSanitizeInput(
        pageData.title || '', 
        { context: 'cms_title', maxLength: 200, allowHtml: false }
      );

      const slugValidation = await enhancedSecurityValidation.validateAndSanitizeInput(
        pageData.slug || '', 
        { context: 'cms_slug', maxLength: 100, allowHtml: false }
      );

      const contentValidation = await enhancedSecurityValidation.validateCMSContent(
        pageData.content, 
        'content'
      );

      // Check for security threats
      if (titleValidation.blocked || slugValidation.blocked || contentValidation.blocked) {
        toast.error('Content blocked due to security policy violations');
        return { success: false, error: 'Security validation failed' };
      }

      // Sanitize meta fields if present
      let sanitizedMetaTitle = pageData.meta_title;
      let sanitizedMetaDescription = pageData.meta_description;

      if (pageData.meta_title) {
        const metaTitleValidation = await enhancedSecurityValidation.validateAndSanitizeInput(
          pageData.meta_title, 
          { context: 'cms_meta_title', maxLength: 200, allowHtml: false }
        );
        sanitizedMetaTitle = metaTitleValidation.sanitizedInput;
      }

      if (pageData.meta_description) {
        const metaDescValidation = await enhancedSecurityValidation.validateAndSanitizeInput(
          pageData.meta_description, 
          { context: 'cms_meta_description', maxLength: 500, allowHtml: false }
        );
        sanitizedMetaDescription = metaDescValidation.sanitizedInput;
      }

      const { data, error } = await supabase
        .from('cms_pages')
        .insert({
          title: titleValidation.sanitizedInput,
          slug: slugValidation.sanitizedInput,
          content: pageData.content, // Content validation is more complex, handled separately
          published: pageData.published || false,
          meta_title: sanitizedMetaTitle,
          meta_description: sanitizedMetaDescription,
          created_by: (await supabase.auth.getUser()).data.user?.id,
          updated_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;

      setPages(prev => [data, ...prev]);
      toast.success('Page created successfully');
      return { success: true, data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create page';
      toast.error('Failed to create page');
      productionLogger.error('Failed to create CMS page', err, 'useCMS');
      return { success: false, error: errorMessage };
    }
  };

  // Secure page update with validation
  const updatePage = async (id: string, pageData: Partial<CMSPage>) => {
    try {
      // Validate all text inputs if they're being updated
      const validations: any = {};

      if (pageData.title !== undefined) {
        validations.title = await enhancedSecurityValidation.validateAndSanitizeInput(
          pageData.title, 
          { context: 'cms_title', maxLength: 200, allowHtml: false }
        );
      }

      if (pageData.slug !== undefined) {
        validations.slug = await enhancedSecurityValidation.validateAndSanitizeInput(
          pageData.slug, 
          { context: 'cms_slug', maxLength: 100, allowHtml: false }
        );
      }

      if (pageData.content !== undefined) {
        validations.content = await enhancedSecurityValidation.validateCMSContent(
          pageData.content, 
          'content'
        );
      }

      // Check for blocked content
      const hasBlockedContent = Object.values(validations).some((v: any) => v.blocked);
      if (hasBlockedContent) {
        toast.error('Content blocked due to security policy violations');
        return { success: false, error: 'Security validation failed' };
      }

      // Prepare sanitized update data
      const updateData: any = {};
      
      if (validations.title) updateData.title = validations.title.sanitizedInput;
      if (validations.slug) updateData.slug = validations.slug.sanitizedInput;
      if (pageData.content !== undefined) updateData.content = pageData.content;
      if (pageData.published !== undefined) updateData.published = pageData.published;
      
      if (pageData.meta_title !== undefined) {
        const metaTitleValidation = await enhancedSecurityValidation.validateAndSanitizeInput(
          pageData.meta_title, 
          { context: 'cms_meta_title', maxLength: 200, allowHtml: false }
        );
        updateData.meta_title = metaTitleValidation.sanitizedInput;
      }

      if (pageData.meta_description !== undefined) {
        const metaDescValidation = await enhancedSecurityValidation.validateAndSanitizeInput(
          pageData.meta_description, 
          { context: 'cms_meta_description', maxLength: 500, allowHtml: false }
        );
        updateData.meta_description = metaDescValidation.sanitizedInput;
      }

      updateData.updated_by = (await supabase.auth.getUser()).data.user?.id;

      const { data, error } = await supabase
        .from('cms_pages')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setPages(prev => prev.map(page => page.id === id ? data : page));
      toast.success('Page updated successfully');
      return { success: true, data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update page';
      toast.error('Failed to update page');
      productionLogger.error('Failed to update CMS page', err, 'useCMS');
      return { success: false, error: errorMessage };
    }
  };

  // Secure navigation creation
  const createNavigation = async (navData: Partial<CMSNavigation>) => {
    try {
      const labelValidation = await enhancedSecurityValidation.validateAndSanitizeInput(
        navData.label || '', 
        { context: 'cms_nav_label', maxLength: 100, allowHtml: false }
      );

      const urlValidation = await enhancedSecurityValidation.validateAndSanitizeInput(
        navData.url || '', 
        { context: 'cms_nav_url', maxLength: 500, allowHtml: false }
      );

      if (labelValidation.blocked || urlValidation.blocked) {
        toast.error('Navigation data blocked due to security policy violations');
        return { success: false, error: 'Security validation failed' };
      }

      const { data, error } = await supabase
        .from('cms_navigation')
        .insert({
          label: labelValidation.sanitizedInput,
          url: urlValidation.sanitizedInput,
          parent_id: navData.parent_id,
          sort_order: navData.sort_order || 0,
          is_active: navData.is_active !== false
        })
        .select()
        .single();

      if (error) throw error;

      setNavigation(prev => [...prev, data].sort((a, b) => a.sort_order - b.sort_order));
      toast.success('Navigation item created successfully');
      return { success: true, data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create navigation item';
      toast.error('Failed to create navigation item');
      productionLogger.error('Failed to create CMS navigation', err, 'useCMS');
      return { success: false, error: errorMessage };
    }
  };

  // Delete functions with security logging
  const deletePage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('cms_pages')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setPages(prev => prev.filter(page => page.id !== id));
      toast.success('Page deleted successfully');
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete page';
      toast.error('Failed to delete page');
      productionLogger.error('Failed to delete CMS page', err, 'useCMS');
      return { success: false, error: errorMessage };
    }
  };

  const deleteNavigation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('cms_navigation')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setNavigation(prev => prev.filter(nav => nav.id !== id));
      toast.success('Navigation item deleted successfully');
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete navigation item';
      toast.error('Failed to delete navigation item');
      productionLogger.error('Failed to delete CMS navigation', err, 'useCMS');
      return { success: false, error: errorMessage };
    }
  };

  useEffect(() => {
    fetchCMSData();
  }, []);

  return {
    pages,
    navigation,
    settings,
    loading,
    error,
    createPage,
    updatePage,
    deletePage,
    createNavigation,
    deleteNavigation,
    refetch: fetchCMSData
  };
}
