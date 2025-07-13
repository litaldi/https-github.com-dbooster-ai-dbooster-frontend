
/**
 * Service-Specific API Functions
 */

import { supabase } from '@/integrations/supabase/client';
import { DATABASE_ENDPOINTS } from './database';
import { EDGE_FUNCTIONS } from './edgeFunctions';

export const SERVICE_APIS = {
  // Repository Service
  repositoryService: {
    getRepositories: () => DATABASE_ENDPOINTS.repositories.select(),
    createRepository: (repo: any) => DATABASE_ENDPOINTS.repositories.insert(repo).select().single(),
    deleteRepository: (repoId: string) => DATABASE_ENDPOINTS.repositories.delete(repoId),
    scanRepository: async (repoId: string) => {
      console.log('Scanning repository:', repoId);
      return { success: true };
    }
  },
  
  // Query Service
  queryService: {
    getQueries: (repositoryId?: string) => {
      if (repositoryId) {
        return DATABASE_ENDPOINTS.queries.selectByRepo(repositoryId);
      }
      return DATABASE_ENDPOINTS.queries.select().order('created_at', { ascending: false });
    },
    getQuery: (id: string) => supabase.from('queries').select('*').eq('id', id).maybeSingle(),
    updateQueryStatus: (id: string, status: string, optimization?: string) => {
      const updates: any = { status, updated_at: new Date().toISOString() };
      if (optimization) updates.optimization_suggestion = optimization;
      return DATABASE_ENDPOINTS.queries.update(id, updates).select().single();
    },
    searchQueries: (searchTerm: string, repositoryId?: string) => {
      let query = DATABASE_ENDPOINTS.queries.search(searchTerm);
      if (repositoryId) {
        query = query.eq('repository_id', repositoryId);
      }
      return query.order('created_at', { ascending: false });
    }
  },
  
  // Security Service
  securityService: {
    validateInput: (input: string, validationType: string, context?: string) => 
      EDGE_FUNCTIONS.securityValidation.invoke({ input, validationType, context }),
    logSecurityEvent: (eventData: any) => DATABASE_ENDPOINTS.securityAuditLog.insert(eventData),
    getRateLimitStatus: (identifier: string, actionType: string) => 
      supabase.from('rate_limit_tracking').select('*').eq('identifier', identifier).eq('action_type', actionType)
  }
} as const;
