
/**
 * Database API Endpoints
 */

import { supabase } from '@/integrations/supabase/client';

export const DATABASE_ENDPOINTS = {
  // Profiles
  profiles: {
    select: () => supabase.from('profiles').select('*'),
    insert: (data: any) => supabase.from('profiles').insert(data),
    update: (id: string, data: any) => supabase.from('profiles').update(data).eq('id', id),
    path: '/profiles'
  },
  
  // Repositories
  repositories: {
    select: () => supabase.from('repositories').select('*'),
    insert: (data: any) => supabase.from('repositories').insert(data),
    update: (id: string, data: any) => supabase.from('repositories').update(data).eq('id', id),
    delete: (id: string) => supabase.from('repositories').delete().eq('id', id),
    path: '/repositories'
  },
  
  // Queries
  queries: {
    select: () => supabase.from('queries').select('*'),
    selectByRepo: (repoId: string) => supabase.from('queries').select('*').eq('repository_id', repoId),
    insert: (data: any) => supabase.from('queries').insert(data),
    update: (id: string, data: any) => supabase.from('queries').update(data).eq('id', id),
    delete: (id: string) => supabase.from('queries').delete().eq('id', id),
    search: (term: string) => supabase.from('queries').select('*').or(`query_content.ilike.%${term}%,file_path.ilike.%${term}%`),
    path: '/queries'
  },
  
  // Security Audit Log
  securityAuditLog: {
    select: () => supabase.from('security_audit_log').select('*'),
    insert: (data: any) => supabase.from('security_audit_log').insert(data),
    path: '/security_audit_log'
  },
  
  // Rate Limiting
  rateLimitTracking: {
    select: () => supabase.from('rate_limit_tracking').select('*'),
    insert: (data: any) => supabase.from('rate_limit_tracking').insert(data),
    update: (id: string, data: any) => supabase.from('rate_limit_tracking').update(data).eq('id', id),
    path: '/rate_limit_tracking'
  }
} as const;
