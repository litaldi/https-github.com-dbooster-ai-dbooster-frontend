
import { supabase } from '@/integrations/supabase/client';
import { ApiSecurityService } from '@/services/security/core/apiSecurityService';

/**
 * Centralized API Directory
 * This file contains all API endpoints and functions used throughout the application
 * organized by service/feature for easy navigation and maintenance.
 */

// ===== SUPABASE CONFIGURATION =====
export const SUPABASE_CONFIG = {
  url: 'https://sxcbpmqsbcpsljwwwwyv.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4Y2JwbXFzYmNwc2xqd3d3d3l2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNjY5MDIsImV4cCI6MjA2Mzg0MjkwMn0.cbcKbYLZz8SGNO84yNy15AQCo1Ldhn1apoLtMDWqrxw'
} as const;

// ===== AUTHENTICATION ENDPOINTS =====
export const AUTH_ENDPOINTS = {
  // Supabase Auth
  signUp: () => supabase.auth.signUp,
  signIn: () => supabase.auth.signInWithPassword,
  signOut: () => supabase.auth.signOut,
  resetPassword: () => supabase.auth.resetPasswordForEmail,
  getSession: () => supabase.auth.getSession,
  getUser: () => supabase.auth.getUser,
  
  // API Paths
  paths: {
    login: '/auth/login',
    signup: '/auth/signup',
    logout: '/auth/logout',
    refresh: '/auth/refresh'
  }
} as const;

// ===== DATABASE ENDPOINTS =====
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

// ===== EDGE FUNCTIONS =====
export const EDGE_FUNCTIONS = {
  securityValidation: {
    invoke: (body: any) => supabase.functions.invoke('security-validation', { body }),
    url: `${SUPABASE_CONFIG.url}/functions/v1/security-validation`,
    path: '/functions/security-validation'
  }
} as const;

// ===== EXTERNAL API ENDPOINTS =====
export const EXTERNAL_APIS = {
  // GitHub API
  github: {
    baseUrl: 'https://api.github.com',
    endpoints: {
      userRepos: '/user/repos',
      repo: (owner: string, repo: string) => `/repos/${owner}/${repo}`,
      user: '/user'
    },
    // Secure GitHub API calls
    getUserRepositories: async (token: string) => {
      const apiSecurity = ApiSecurityService.getInstance();
      return apiSecurity.makeSecureGitHubRequest('/user/repos', {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
  },
  
  // OpenAI API (if used in edge functions)
  openai: {
    baseUrl: 'https://api.openai.com/v1',
    endpoints: {
      chatCompletions: '/chat/completions',
      embeddings: '/embeddings'
    }
  }
} as const;

// ===== SERVICE-SPECIFIC API FUNCTIONS =====
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

// ===== API UTILITY FUNCTIONS =====
export const API_UTILS = {
  // Build full URLs for external APIs
  buildGitHubUrl: (endpoint: string) => `${EXTERNAL_APIS.github.baseUrl}${endpoint}`,
  buildSupabaseUrl: (path: string) => `${SUPABASE_CONFIG.url}${path}`,
  buildEdgeFunctionUrl: (functionName: string) => `${SUPABASE_CONFIG.url}/functions/v1/${functionName}`,
  
  // Common headers
  headers: {
    json: { 'Content-Type': 'application/json' },
    github: (token: string) => ({ Authorization: `Bearer ${token}` }),
    supabase: { 
      apikey: SUPABASE_CONFIG.anonKey,
      'Content-Type': 'application/json'
    }
  }
} as const;

// ===== API CONSTANTS =====
export const API_CONSTANTS = {
  // Rate limiting
  rateLimits: {
    login: { maxAttempts: 5, windowMs: 15 * 60 * 1000 },
    signup: { maxAttempts: 3, windowMs: 60 * 60 * 1000 },
    api: { maxAttempts: 100, windowMs: 60 * 1000 },
    formSubmission: { maxAttempts: 10, windowMs: 5 * 60 * 1000 }
  },
  
  // HTTP Status Codes
  statusCodes: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500
  },
  
  // API Endpoints from constants
  endpoints: {
    auth: {
      login: '/auth/login',
      signup: '/auth/signup',
      logout: '/auth/logout',
      refresh: '/auth/refresh'
    },
    users: {
      profile: '/users/profile',
      preferences: '/users/preferences'
    },
    security: {
      auditLogs: '/security/audit-logs',
      threatDetection: '/security/threats',
      rateLimits: '/security/rate-limits'
    }
  }
} as const;

// ===== EXPORT ALL API FUNCTIONS =====
export const API_DIRECTORY = {
  auth: AUTH_ENDPOINTS,
  database: DATABASE_ENDPOINTS,
  edgeFunctions: EDGE_FUNCTIONS,
  external: EXTERNAL_APIS,
  services: SERVICE_APIS,
  utils: API_UTILS,
  constants: API_CONSTANTS,
  supabase: supabase
} as const;

// Default export for easy importing
export default API_DIRECTORY;

/**
 * Usage Examples:
 * 
 * // Import specific service
 * import { SERVICE_APIS } from '@/services/api/apiDirectory';
 * const repos = await SERVICE_APIS.repositoryService.getRepositories();
 * 
 * // Import full directory
 * import API_DIRECTORY from '@/services/api/apiDirectory';
 * const user = await API_DIRECTORY.auth.getUser();
 * 
 * // Import utilities
 * import { API_UTILS } from '@/services/api/apiDirectory';
 * const githubUrl = API_UTILS.buildGitHubUrl('/user/repos');
 */
