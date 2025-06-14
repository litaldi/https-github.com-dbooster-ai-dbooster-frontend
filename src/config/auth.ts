
export const AUTH_CONFIG = {
  STORAGE_KEYS: {
    REMEMBER_ME: 'dbooster_remember_me',
    EMAIL: 'dbooster_email',
  },
  RATE_LIMIT: {
    MAX_ATTEMPTS: 5,
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  },
  OAUTH_PROVIDERS: ['github', 'google'] as const,
  REDIRECT_PATHS: {
    SUCCESS: '/',
    ERROR: '/login?error=auth_failed',
  },
} as const;

export type OAuthProvider = typeof AUTH_CONFIG.OAUTH_PROVIDERS[number];
