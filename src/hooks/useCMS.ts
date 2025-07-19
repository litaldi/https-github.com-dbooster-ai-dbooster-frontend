
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface CMSPage {
  id: string;
  slug: string;
  title: string;
  content: any;
  meta_title?: string;
  meta_description?: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

interface CMSSetting {
  id: string;
  key: string;
  value: any;
  category: string;
}

interface CMSNavigation {
  id: string;
  label: string;
  url: string;
  parent_id?: string;
  sort_order: number;
  is_active: boolean;
}

export function useCMS() {
  const [pages, setPages] = useState<CMSPage[]>([]);
  const [settings, setSettings] = useState<CMSSetting[]>([]);
  const [navigation, setNavigation] = useState<CMSNavigation[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch CMS data
  const fetchCMSData = async () => {
    try {
      setLoading(true);
      
      const [pagesRes, settingsRes, navRes] = await Promise.all([
        supabase.from('cms_pages').select('*').order('created_at', { ascending: false }),
        supabase.from('cms_settings').select('*').order('category', { ascending: true }),
        supabase.from('cms_navigation').select('*').order('sort_order', { ascending: true })
      ]);

      if (pagesRes.data) setPages(pagesRes.data);
      if (settingsRes.data) setSettings(settingsRes.data);
      if (navRes.data) setNavigation(navRes.data);
    } catch (error) {
      console.error('Failed to fetch CMS data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get setting by key
  const getSetting = (key: string, defaultValue: any = null) => {
    const setting = settings.find(s => s.key === key);
    return setting ? setting.value : defaultValue;
  };

  // Get page by slug
  const getPage = (slug: string) => {
    return pages.find(p => p.slug === slug);
  };

  // Update page
  const updatePage = async (id: string, data: Partial<CMSPage>) => {
    try {
      const { error } = await supabase
        .from('cms_pages')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      await fetchCMSData();
      return { success: true };
    } catch (error) {
      console.error('Failed to update page:', error);
      return { success: false, error };
    }
  };

  // Create page
  const createPage = async (data: Omit<CMSPage, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { error } = await supabase
        .from('cms_pages')
        .insert([data]);

      if (error) throw error;
      await fetchCMSData();
      return { success: true };
    } catch (error) {
      console.error('Failed to create page:', error);
      return { success: false, error };
    }
  };

  // Update setting
  const updateSetting = async (key: string, value: any, category: string = 'general') => {
    try {
      const { error } = await supabase
        .from('cms_settings')
        .upsert({ key, value, category });

      if (error) throw error;
      await fetchCMSData();
      return { success: true };
    } catch (error) {
      console.error('Failed to update setting:', error);
      return { success: false, error };
    }
  };

  useEffect(() => {
    fetchCMSData();
  }, []);

  return {
    pages,
    settings,
    navigation,
    loading,
    getSetting,
    getPage,
    updatePage,
    createPage,
    updateSetting,
    refetch: fetchCMSData
  };
}
