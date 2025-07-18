
import { useState, useEffect, useCallback } from 'react';
import { enhancedAuthenticationService } from '@/services/security/core/enhancedAuthenticationService';
import { securityDashboardEnhanced } from '@/services/security/securityDashboardEnhanced';
import { productionLogger } from '@/utils/productionLogger';

export function useEnhancedSecurity() {
  const [securityMetrics, setSecurityMetrics] = useState(null);
  const [securityAlerts, setSecurityAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const refreshSecurityData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [metrics, alerts] = await Promise.all([
        securityDashboardEnhanced.getSecurityMetrics(),
        securityDashboardEnhanced.getSecurityAlerts()
      ]);
      setSecurityMetrics(metrics);
      setSecurityAlerts(alerts);
    } catch (error) {
      productionLogger.error('Failed to refresh security data', error, 'useEnhancedSecurity');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createSecureSession = useCallback(async (userId: string, isDemo: boolean = false) => {
    try {
      const sessionId = await enhancedAuthenticationService.createSecureSession(userId, isDemo);
      setCurrentSessionId(sessionId);
      return sessionId;
    } catch (error) {
      productionLogger.error('Failed to create secure session', error, 'useEnhancedSecurity');
      throw error;
    }
  }, []);

  const validateCurrentSession = useCallback(async () => {
    if (!currentSessionId) return false;
    
    try {
      return await enhancedAuthenticationService.validateSession(currentSessionId);
    } catch (error) {
      productionLogger.error('Session validation failed', error, 'useEnhancedSecurity');
      return false;
    }
  }, [currentSessionId]);

  const assignRole = useCallback(async (targetUserId: string, newRole: string, reason?: string) => {
    try {
      await enhancedAuthenticationService.assignUserRole(targetUserId, newRole, reason);
      await refreshSecurityData(); // Refresh to show updated metrics
    } catch (error) {
      productionLogger.error('Role assignment failed', error, 'useEnhancedSecurity');
      throw error;
    }
  }, [refreshSecurityData]);

  const invalidateAllSessions = useCallback(async (userId: string) => {
    try {
      await securityDashboardEnhanced.invalidateAllSessions(userId);
      await refreshSecurityData();
    } catch (error) {
      productionLogger.error('Failed to invalidate sessions', error, 'useEnhancedSecurity');
      throw error;
    }
  }, [refreshSecurityData]);

  useEffect(() => {
    refreshSecurityData();
    
    // Set up periodic refresh
    const interval = setInterval(refreshSecurityData, 60000); // Every minute
    
    return () => clearInterval(interval);
  }, [refreshSecurityData]);

  return {
    securityMetrics,
    securityAlerts,
    isLoading,
    currentSessionId,
    createSecureSession,
    validateCurrentSession,
    assignRole,
    invalidateAllSessions,
    refreshSecurityData
  };
}
