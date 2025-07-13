
/**
 * API Configuration
 * Centralized configuration for all API services
 */

export const SUPABASE_CONFIG = {
  url: 'https://sxcbpmqsbcpsljwwwwyv.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4Y2JwbXFzYmNwc2xqd3d3d3l2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNjY5MDIsImV4cCI6MjA2Mzg0MjkwMn0.cbcKbYLZz8SGNO84yNy15AQCo1Ldhn1apoLtMDWqrxw'
} as const;

export const API_CONSTANTS = {
  rateLimits: {
    login: { maxAttempts: 5, windowMs: 15 * 60 * 1000 },
    signup: { maxAttempts: 3, windowMs: 60 * 60 * 1000 },
    api: { maxAttempts: 100, windowMs: 60 * 1000 },
    formSubmission: { maxAttempts: 10, windowMs: 5 * 60 * 1000 }
  },
  
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

export const API_UTILS = {
  buildGitHubUrl: (endpoint: string) => `https://api.github.com${endpoint}`,
  buildSupabaseUrl: (path: string) => `${SUPABASE_CONFIG.url}${path}`,
  buildEdgeFunctionUrl: (functionName: string) => `${SUPABASE_CONFIG.url}/functions/v1/${functionName}`,
  
  headers: {
    json: { 'Content-Type': 'application/json' },
    github: (token: string) => ({ Authorization: `Bearer ${token}` }),
    supabase: { 
      apikey: SUPABASE_CONFIG.anonKey,
      'Content-Type': 'application/json'
    }
  }
} as const;
