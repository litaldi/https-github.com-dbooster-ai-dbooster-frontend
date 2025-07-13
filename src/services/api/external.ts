
/**
 * External API Endpoints
 */

import { ApiSecurityService } from '@/services/security/core/apiSecurityService';

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
