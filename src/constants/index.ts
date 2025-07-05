
// Application constants and configuration

export const APP_CONFIG = {
  NAME: 'DBooster',
  VERSION: '1.0.0',
  DESCRIPTION: 'Database Query Optimization Platform',
  COMPANY: 'DBooster Inc.',
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  USERS: {
    PROFILE: '/users/profile',
    PREFERENCES: '/users/preferences',
  },
  SECURITY: {
    AUDIT_LOGS: '/security/audit-logs',
    THREAT_DETECTION: '/security/threats',
    RATE_LIMITS: '/security/rate-limits',
  },
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/app',
  QUERIES: '/queries',
  REPOSITORIES: '/repositories',
  REPORTS: '/reports',
  SECURITY: '/security',
  SETTINGS: '/settings',
} as const;

export const STORAGE_KEYS = {
  AUTH: {
    REMEMBER_ME: 'dbooster_remember_me',
    EMAIL: 'dbooster_email',
    THEME: 'dbooster_theme',
  },
  PREFERENCES: {
    SIDEBAR_COLLAPSED: 'dbooster_sidebar_collapsed',
    DASHBOARD_LAYOUT: 'dbooster_dashboard_layout',
  },
} as const;

export const VALIDATION_RULES = {
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SYMBOLS: true,
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
  },
} as const;

export const RATE_LIMITS = {
  LOGIN: { maxAttempts: 5, windowMs: 15 * 60 * 1000 },
  SIGNUP: { maxAttempts: 3, windowMs: 60 * 60 * 1000 },
  API: { maxAttempts: 100, windowMs: 60 * 1000 },
  FORM_SUBMISSION: { maxAttempts: 10, windowMs: 5 * 60 * 1000 },
} as const;

export const THEME_CONFIG = {
  COLORS: {
    PRIMARY: 'hsl(var(--primary))',
    SECONDARY: 'hsl(var(--secondary))',
    BACKGROUND: 'hsl(var(--background))',
    FOREGROUND: 'hsl(var(--foreground))',
  },
  BREAKPOINTS: {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
  },
} as const;
