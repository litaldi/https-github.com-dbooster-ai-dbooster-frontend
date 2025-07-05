
// Production configuration and constants
export const PRODUCTION_CONFIG = {
  // App metadata
  APP_NAME: 'DBooster',
  APP_VERSION: '1.0.0',
  APP_DESCRIPTION: 'AI-Powered Database Query Optimization Platform',
  
  // Performance settings
  MAX_CHUNK_SIZE: 1000000, // 1MB
  CACHE_TTL: 300000, // 5 minutes
  
  // Security settings
  ENABLE_CSP: true,
  ENABLE_HTTPS_REDIRECT: true,
  
  // Feature flags for production
  FEATURES: {
    ANALYTICS: false, // Set to true when analytics are configured
    ERROR_REPORTING: true,
    PERFORMANCE_MONITORING: true,
    SECURITY_MONITORING: true,
  },
  
  // API endpoints
  API_TIMEOUT: 30000, // 30 seconds
  
  // UI settings
  THEME: {
    DEFAULT: 'system',
    ENABLE_DARK_MODE: true,
  },
  
  // Content settings
  COMPANY: {
    NAME: 'DBooster',
    TAGLINE: 'Optimize. Analyze. Accelerate.',
    SUPPORT_EMAIL: 'support@dbooster.dev',
  }
} as const;

// Production environment checks
export const isProduction = () => import.meta.env.PROD;
export const isDevelopment = () => import.meta.env.DEV;

// Safe production utilities
export const safeParseJSON = (str: string, fallback: any = null) => {
  try {
    return JSON.parse(str);
  } catch {
    return fallback;
  }
};

export const safeStringify = (obj: any, fallback: string = '{}') => {
  try {
    return JSON.stringify(obj);
  } catch {
    return fallback;
  }
};
