
export const AUTH_CONFIG = {
  STORAGE_KEYS: {
    REMEMBER_ME: 'dbooster_remember_me',
    EMAIL: 'dbooster_email',
  },
  REDIRECT_PATHS: {
    SUCCESS: '/app',
    LOGIN: '/login',
  },
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours
};
