import { useState, useEffect, useCallback } from 'react';
import { enhancedRateLimiting } from '@/services/security/enhancedRateLimiting';
import { enhancedDemoSecurity } from '@/services/security/enhancedDemoSecurity';
import { csrfProtection } from '@/services/security/csrfProtection';
import { secureStorageService } from '@/services/security/secureStorageService';
import { enhancedCSPViolationHandler } from '@/services/security/enhancedCSPViolationHandler';
import { adminSecurityMonitor } from '@/services/security/adminSecurityMonitor';

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
  cspViolationMonitoring: {
    enabled: boolean;
    violationStats: any;
  };
  adminSecurityMonitoring: {
    enabled: boolean;
    recentAlerts: number;
  };
}

export function useSecurityEnhancements() {
  const [status, setStatus] = useState<SecurityEnhancementsStatus>({
    rateLimiting: { enabled: false, stats: {} },
    demoSecurity: { enabled: false, activeSessions: 0 },
    csrfProtection: { enabled: false, currentToken: '' },
    secureStorage: { enabled: false, encrypted: false },
    cspViolationMonitoring: { enabled: false, violationStats: {} },
    adminSecurityMonitoring: { enabled: false, recentAlerts: 0 }
  });

  const refreshStatus = useCallback(async () => {
    try {
      // Rate limiting status
      const rateLimitStats = enhancedRateLimiting.getStats();
      
      // Demo security status
      const demoStats = enhancedDemoSecurity.getDemoSessionStats();
      
      // CSRF protection status
      const csrfToken = csrfProtection.getCSRFToken();
      
      // CSP violation monitoring stats
      const cspStats = enhancedCSPViolationHandler.getViolationStats();
      
      // Admin security monitoring stats
      const adminAlerts = await adminSecurityMonitor.getRecentAlerts(10);
      
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
        },
        cspViolationMonitoring: {
          enabled: true,
          violationStats: cspStats
        },
        adminSecurityMonitoring: {
          enabled: true,
          recentAlerts: adminAlerts.length
        }
      });
    } catch (error) {
      console.error('Failed to refresh security status:', error);
    }
  }, []);

  useEffect(() => {
    // Initialize security monitoring
    adminSecurityMonitor.initializeMonitoring();
    
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

  const storeSecureData = useCallback(async (key: string, data: any) => {
    return secureStorageService.setSecureItem(key, data);
  }, []);

  const getSecureData = useCallback(async (key: string) => {
    return secureStorageService.getSecureItem(key);
  }, []);

  const clearSecureData = useCallback((key: string) => {
    secureStorageService.removeSecureItem(key);
  }, []);

  const getCSPViolationStats = useCallback(() => {
    return enhancedCSPViolationHandler.getViolationStats();
  }, []);

  const acknowledgeAdminAlert = useCallback(async (alertId: string, userId: string) => {
    return adminSecurityMonitor.acknowledgeAlert(alertId, userId);
  }, []);

  return {
    status,
    refreshStatus,
    checkRateLimit,
    getCSRFToken,
    validateCSRFToken,
    storeSecureData,
    getSecureData,
    clearSecureData,
    getCSPViolationStats,
    acknowledgeAdminAlert
  };
}