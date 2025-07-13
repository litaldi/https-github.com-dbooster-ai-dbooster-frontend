
/**
 * API Directory - Main Entry Point
 * Centralized access to all API endpoints and functions
 */

import { supabase } from '@/integrations/supabase/client';
import { AUTH_ENDPOINTS } from './auth';
import { DATABASE_ENDPOINTS } from './database';
import { EDGE_FUNCTIONS } from './edgeFunctions';
import { EXTERNAL_APIS } from './external';
import { SERVICE_APIS } from './services';
import { API_UTILS, API_CONSTANTS, SUPABASE_CONFIG } from './config';

// Main API Directory Export
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

// Re-export individual modules for granular imports
export { AUTH_ENDPOINTS } from './auth';
export { DATABASE_ENDPOINTS } from './database';
export { EDGE_FUNCTIONS } from './edgeFunctions';
export { EXTERNAL_APIS } from './external';
export { SERVICE_APIS } from './services';
export { API_UTILS, API_CONSTANTS, SUPABASE_CONFIG } from './config';

// Default export for easy importing
export default API_DIRECTORY;

/**
 * Usage Examples:
 * 
 * // Import specific service
 * import { SERVICE_APIS } from '@/services/api';
 * const repos = await SERVICE_APIS.repositoryService.getRepositories();
 * 
 * // Import full directory
 * import API_DIRECTORY from '@/services/api';
 * const user = await API_DIRECTORY.auth.getUser();
 * 
 * // Import utilities
 * import { API_UTILS } from '@/services/api';
 * const githubUrl = API_UTILS.buildGitHubUrl('/user/repos');
 * 
 * // Import specific endpoints
 * import { DATABASE_ENDPOINTS } from '@/services/api';
 * const profiles = await DATABASE_ENDPOINTS.profiles.select();
 */
