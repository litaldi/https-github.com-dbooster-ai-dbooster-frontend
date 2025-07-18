
import { useState, useEffect, useCallback } from 'react';
import { enhancedRateLimiting } from '@/services/security/enhancedRateLimiting';
import { enhancedDemoSecurity } from '@/services/security/enhancedDemoSecurity';
import { csrfProtection } from '@/services/security/csrfProtection';
import { secureStorageService } from '@/services/security/secureStorageService';

interface SecurityEnhancementsStatus {
  rateLimiting: {
    enabled: boolean;
    stats: any;
  };
  demoSecurity: {
    enabled: boolean;
    activeSessions: number;
  };
  csrfProtection: {
    enabled: boolean;
    currentToken: string;
  };
  secureStorage: {
    enabled: boolean;
    encrypted: boolean;
  };
}

export function useSecurityEnhancements() {
  const [status, setStatus] = useState<SecurityEnhancementsStatus>({
    rateLimiting: { enabled: false, stats: {} },
    demoSecurity: { enabled: false, activeSessions: 0 },
    csrfProtection: { enabled: false, currentToken: '' },
    secureStorage: { enabled: false, encrypted: false }
  });

  const refreshStatus = useCallback(() => {
    try {
      // Rate limiting status
      const rateLimitStats = enhancedRateLimiting.getStats();
      
      // Demo security status
      const demoStats = enhancedDemoSecurity.getDemoSessionStats();
      
      // CSRF protection status
      const csrfToken = csrfProtection.getCSRFToken();
      
      setStatus({
        rateLimiting: {
          enabled: true,
          stats: rateLimitStats
        },
        demoSecurity: {
          enabled: true,
          activeSessions: demoStats.activeSessions
        },
        csrfProtection: {
          enabled: true,
          currentToken: csrfToken
        },
        secureStorage: {
          enabled: true,
          encrypted: true // Our secure storage uses AES-GCM encryption
        }
      });
    } catch (error) {
      console.error('Failed to refresh security status:', error);
    }
  }, []);

  useEffect(() => {
    refreshStatus();
    
    // Refresh status every 30 seconds
    const interval = setInterval(refreshStatus, 30000);
    
    return () => clearInterval(interval);
  }, [refreshStatus]);

  const checkRateLimit = useCallback((action: string, identifier?: string) => {
    return enhancedRateLimiting.checkRateLimit(action, identifier);
  }, []);

  const getCSRFToken = useCallback(() => {
    return csrfProtection.getCSRFToken();
  }, []);

  const validateCSRFToken = useCallback((token: string) => {
    return csrfProtection.validateCSRFToken(token);
  }, []);

  const storeSecureData = useCallback(async (key: string, data: any, ttl?: number) => {
    return secureStorageService.setSecureItem(key, data, ttl);
  }, []);

  const getSecureData = useCallback(async (key: string) => {
    return secureStorageService.getSecureItem(key);
  }, []);

  const clearSecureData = useCallback((key: string) => {
    secureStorageService.removeSecureItem(key);
  }, []);

  return {
    status,
    refreshStatus,
    checkRateLimit,
    getCSRFToken,
    validateCSRFToken,
    storeSecureData,
    getSecureData,
    clearSecureData
  };
}
