
import { supabase } from '@/integrations/supabase/client';

export interface Repository {
  id: string;
  user_id: string;
  github_id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  clone_url: string;
  language: string | null;
  default_branch: string;
  scan_status: 'pending' | 'scanning' | 'completed' | 'error';
  last_scan: string | null;
  queries_count: number;
  optimizations_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreateRepositoryData {
  user_id: string;
  github_id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  clone_url: string;
  language: string | null;
  default_branch: string;
}

class RepositoryService {
  async getRepositories(): Promise<Repository[]> {
    const { data, error } = await supabase
      .from('repositories')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch repositories: ${error.message}`);
    }

    return data || [];
  }

  async createRepository(repositoryData: CreateRepositoryData): Promise<Repository> {
    const { data, error } = await supabase
      .from('repositories')
      .insert([repositoryData])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create repository: ${error.message}`);
    }

    return data;
  }

  async scanRepository(repositoryId: string): Promise<void> {
    const { error } = await supabase
      .from('repositories')
      .update({ 
        scan_status: 'scanning',
        updated_at: new Date().toISOString()
      })
      .eq('id', repositoryId);

    if (error) {
      throw new Error(`Failed to start repository scan: ${error.message}`);
    }

    // TODO: Trigger actual scanning process
    // This would typically call an edge function or background job
  }

  async deleteRepository(repositoryId: string): Promise<void> {
    const { error } = await supabase
      .from('repositories')
      .delete()
      .eq('id', repositoryId);

    if (error) {
      throw new Error(`Failed to delete repository: ${error.message}`);
    }
  }

  async updateRepositoryStatus(repositoryId: string, status: Repository['scan_status']): Promise<void> {
    const { error } = await supabase
      .from('repositories')
      .update({ 
        scan_status: status,
        last_scan: status === 'completed' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      })
      .eq('id', repositoryId);

    if (error) {
      throw new Error(`Failed to update repository status: ${error.message}`);
    }
  }
}

export const repositoryService = new RepositoryService();
