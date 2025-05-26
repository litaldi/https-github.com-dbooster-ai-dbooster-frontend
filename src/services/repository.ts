
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

export type Repository = Tables<'repositories'>;
export type RepositoryInsert = TablesInsert<'repositories'>;

export const repositoryService = {
  async getRepositories(): Promise<Repository[]> {
    const { data, error } = await supabase
      .from('repositories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching repositories:', error);
      throw error;
    }

    return data || [];
  },

  async getRepository(id: string): Promise<Repository | null> {
    const { data, error } = await supabase
      .from('repositories')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching repository:', error);
      throw error;
    }

    return data;
  },

  async createRepository(repository: RepositoryInsert): Promise<Repository> {
    const { data, error } = await supabase
      .from('repositories')
      .insert(repository)
      .select()
      .single();

    if (error) {
      console.error('Error creating repository:', error);
      throw error;
    }

    return data;
  },

  async updateRepository(id: string, updates: Partial<Repository>): Promise<Repository> {
    const { data, error } = await supabase
      .from('repositories')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating repository:', error);
      throw error;
    }

    return data;
  },

  async deleteRepository(id: string): Promise<void> {
    const { error } = await supabase
      .from('repositories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting repository:', error);
      throw error;
    }
  },

  async scanRepository(repositoryId: string): Promise<void> {
    // Update repository status to scanning
    await this.updateRepository(repositoryId, { 
      scan_status: 'scanning',
      last_scan_at: new Date().toISOString()
    });

    try {
      // Call the scanning edge function
      const { data, error } = await supabase.functions.invoke('scan-repository', {
        body: { repositoryId }
      });

      if (error) {
        throw error;
      }

      console.log('Repository scan initiated:', data);
    } catch (error) {
      console.error('Error initiating repository scan:', error);
      
      // Update repository with error status
      await this.updateRepository(repositoryId, { 
        scan_status: 'error',
        scan_error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
      
      throw error;
    }
  }
};
