
import { useState, useCallback } from 'react';
import { secureSessionManager } from '@/services/security/secureSessionManager';
import { securityAlertsService } from '@/services/security/securityAlertsService';
import { enhancedPrivilegeControl } from '@/services/security/enhancedPrivilegeControl';
import { supabase } from '@/integrations/supabase/client';
import { cleanupAuthState } from '@/utils/authUtils';
import { productionLogger } from '@/utils/productionLogger';

interface SecurityValidationResult {
  valid: boolean;
  securityScore: number;
  issues: string[];
  recommendations: string[];
}

export function useConsolidatedSecurity() {
  const [isLoading, setIsLoading] = useState(false);

  const validateSession = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const result = await secureSessionManager.validateCurrentSession();
      
      if (!result.valid) {
        await securityAlertsService.createSecurityAlert({
          type: 'session_anomaly',
          severity: 'medium',
          message: `Session validation failed: ${result.reason}`,
          metadata: { securityScore: result.securityScore }
        });
      }

      return result.valid;
    } catch (error) {
      productionLogger.error('Session validation error', error, 'useConsolidatedSecurity');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const invalidateSession = useCallback(async (): Promise<void> => {
    try {
      // Clear secure session
      secureSessionManager.clearSession();
      
      // Clean up auth state
      cleanupAuthState();
      
      // Sign out from Supabase
      await supabase.auth.signOut({ scope: 'global' });
      
      productionLogger.info('Session invalidated successfully');
    } catch (error) {
      productionLogger.error('Error invalidating session', error, 'useConsolidatedSecurity');
    }
  }, []);

  const initializeSecureSession = useCallback(async (userId: string): Promise<string | null> => {
    try {
      const sessionId = await secureSessionManager.initializeSecureSession(userId);
      
      if (sessionId) {
        await securityAlertsService.createSecurityAlert({
          type: 'unusual_activity',
          severity: 'low',
          message: 'New secure session initialized',
          userId,
          metadata: { sessionType: 'secure' }
        });
      }

      return sessionId;
    } catch (error) {
      productionLogger.error('Error initializing secure session', error, 'useConsolidatedSecurity');
      return null;
    }
  }, []);

  const performSecurityAssessment = useCallback(async (userId: string): Promise<SecurityValidationResult> => {
    try {
      // Get session validation
      const sessionResult = await secureSessionManager.validateCurrentSession();
      
      // Get security status from privilege control
      const privilegeStatus = await enhancedPrivilegeControl.getSecurityStatus(userId);
      
      // Check for recent alerts
      const recentAlerts = await securityAlertsService.getRecentAlerts(userId, 10);
      const criticalAlerts = recentAlerts.filter(alert => alert.severity === 'critical').length;
      
      // Calculate overall security score
      let overallScore = sessionResult.securityScore;
      if (criticalAlerts > 0) overallScore -= 30;
      if (!privilegeStatus.isSecure) overallScore -= 20;
      
      const allIssues = [
        ...privilegeStatus.issues,
        ...(sessionResult.valid ? [] : [`Session issue: ${sessionResult.reason}`]),
        ...(criticalAlerts > 0 ? [`${criticalAlerts} critical security alerts`] : [])
      ];

      return {
        valid: privilegeStatus.isSecure && sessionResult.valid && criticalAlerts === 0,
        securityScore: Math.max(overallScore, 0),
        issues: allIssues,
        recommendations: privilegeStatus.recommendations
      };
    } catch (error) {
      productionLogger.error('Security assessment error', error, 'useConsolidatedSecurity');
      return {
        valid: false,
        securityScore: 0,
        issues: ['Unable to perform security assessment'],
        recommendations: ['Contact system administrator']
      };
    }
  }, []);

  const reportSecurityIncident = useCallback(async (
    type: Parameters<typeof securityAlertsService.createSecurityAlert>[0]['type'],
    message: string,
    severity: Parameters<typeof securityAlertsService.createSecurityAlert>[0]['severity'] = 'medium',
    metadata?: Record<string, any>
  ): Promise<boolean> => {
    const { data: user } = await supabase.auth.getUser();
    
    return securityAlertsService.createSecurityAlert({
      type,
      severity,
      message,
      userId: user.user?.id,
      metadata
    });
  }, []);

  return {
    validateSession,
    invalidateSession,
    initializeSecureSession,
    performSecurityAssessment,
    reportSecurityIncident,
    isLoading
  };
}
