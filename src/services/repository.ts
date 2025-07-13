
import { supabase } from '@/integrations/supabase/client';

export const repositoryService = {
  getRepositories: async () => {
    const { data, error } = await supabase
      .from('repositories')
      .select('*');
    
    if (error) throw error;
    return data || [];
  },

  createRepository: async (repo: any) => {
    const { data, error } = await supabase
      .from('repositories')
      .insert(repo)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  scanRepository: async (repoId: string) => {
    // Mock implementation for scanning
    console.log('Scanning repository:', repoId);
    return { success: true };
  },

  deleteRepository: async (repoId: string) => {
    const { error } = await supabase
      .from('repositories')
      .delete()
      .eq('id', repoId);
    
    if (error) throw error;
  }
};
