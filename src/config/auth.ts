
export const AUTH_CONFIG = {
  STORAGE_KEYS: {
    REMEMBER_ME: 'dbooster_remember_me',
    EMAIL: 'dbooster_email',
  },
  REDIRECT_PATHS: {
    SUCCESS: '/app',
    LOGIN: '/login',
  },
  PASSWORD_REQUIREMENTS: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL: false,
  },
} as const;
