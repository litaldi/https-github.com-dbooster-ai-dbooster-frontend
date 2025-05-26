
import { supabase } from '@/integrations/supabase/client';

// Temporary type definitions until Supabase types refresh
type Query = {
  id: string;
  repository_id: string;
  file_path: string;
  line_number: number;
  query_content: string;
  status: string;
  optimization_suggestion: string | null;
  performance_impact: string | null;
  created_at: string;
  updated_at: string;
};

type QueryInsert = {
  repository_id: string;
  file_path: string;
  line_number: number;
  query_content: string;
  status?: string;
  optimization_suggestion?: string | null;
  performance_impact?: string | null;
};

export type { Query, QueryInsert };

export const queryService = {
  async getQueries(repositoryId?: string): Promise<Query[]> {
    let query = supabase
      .from('queries')
      .select('*')
      .order('created_at', { ascending: false });

    if (repositoryId) {
      query = query.eq('repository_id', repositoryId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching queries:', error);
      throw error;
    }

    return (data as Query[]) || [];
  },

  async getQuery(id: string): Promise<Query | null> {
    const { data, error } = await supabase
      .from('queries')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching query:', error);
      throw error;
    }

    return data as Query | null;
  },

  async updateQueryStatus(id: string, status: string, optimization?: string): Promise<Query> {
    const updates: Partial<Query> = { 
      status,
      updated_at: new Date().toISOString()
    };

    if (optimization) {
      updates.optimization_suggestion = optimization;
    }

    const { data, error } = await supabase
      .from('queries')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating query:', error);
      throw error;
    }

    return data as Query;
  },

  async searchQueries(searchTerm: string, repositoryId?: string): Promise<Query[]> {
    let query = supabase
      .from('queries')
      .select('*')
      .or(`query_content.ilike.%${searchTerm}%,file_path.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false });

    if (repositoryId) {
      query = query.eq('repository_id', repositoryId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error searching queries:', error);
      throw error;
    }

    return (data as Query[]) || [];
  }
};
