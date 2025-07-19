
import { useState, useEffect, useCallback } from 'react';
import { securityAlertsService } from '@/services/security/securityAlertsService';
import { enhancedPrivilegeControl } from '@/services/security/enhancedPrivilegeControl';
import { secureSessionManager } from '@/services/security/secureSessionManager';
import { supabase } from '@/integrations/supabase/client';
import { productionLogger } from '@/utils/productionLogger';

interface SecurityStatus {
  isSecure: boolean;
  alerts: any[];
  sessionValid: boolean;
  securityScore: number;
  issues: string[];
  recommendations: string[];
}

export function useSecurityMonitoring() {
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus>({
    isSecure: true,
    alerts: [],
    sessionValid: true,
    securityScore: 100,
    issues: [],
    recommendations: []
  });
  const [isLoading, setIsLoading] = useState(true);

  const refreshSecurityStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        setSecurityStatus({
          isSecure: false,
          alerts: [],
          sessionValid: false,
          securityScore: 0,
          issues: ['User not authenticated'],
          recommendations: ['Please log in to access security features']
        });
        return;
      }

      // Get recent alerts
      const alerts = await securityAlertsService.getRecentAlerts(user.user.id);
      
      // Get user security status
      const userSecurityStatus = await enhancedPrivilegeControl.getSecurityStatus(user.user.id);
      
      // Create a temporary session for validation
      const tempSessionId = await secureSessionManager.createSecureSession(user.user.id, true);
      const sessionValidation = await secureSessionManager.validateSession(tempSessionId);
      
      // Calculate overall security score
      const baseScore = sessionValidation ? 80 : 40;
      const alertPenalty = Math.min(alerts.length * 10, 50);
      const issuePenalty = userSecurityStatus.issues.length * 15;
      const overallScore = Math.max(baseScore - alertPenalty - issuePenalty, 0);

      setSecurityStatus({
        isSecure: userSecurityStatus.isSecure && sessionValidation && alerts.length < 3,
        alerts,
        sessionValid: sessionValidation,
        securityScore: overallScore,
        issues: [
          ...userSecurityStatus.issues,
          ...(sessionValidation ? [] : ['Session validation failed'])
        ],
        recommendations: userSecurityStatus.recommendations
      });

    } catch (error) {
      productionLogger.error('Failed to refresh security status', error, 'useSecurityMonitoring');
      setSecurityStatus({
        isSecure: false,
        alerts: [],
        sessionValid: false,
        securityScore: 0,
        issues: ['Unable to verify security status'],
        recommendations: ['Contact system administrator']
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createSecurityAlert = useCallback(async (type: string, severity: string, message: string) => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return;

    await securityAlertsService.createSecurityAlert({
      type: type as any,
      severity: severity as any,
      message,
      userId: user.user.id
    });

    // Refresh status after creating alert
    await refreshSecurityStatus();
  }, [refreshSecurityStatus]);

  const createSecureSession = useCallback(async () => {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) return null;

    const sessionId = await secureSessionManager.createSecureSession(user.user.id);
    if (sessionId) {
      await refreshSecurityStatus();
    }
    return sessionId;
  }, [refreshSecurityStatus]);

  useEffect(() => {
    refreshSecurityStatus();

    // Set up security alert listener
    const unsubscribe = securityAlertsService.onSecurityAlert(() => {
      refreshSecurityStatus();
    });

    // Periodic security checks
    const interval = setInterval(refreshSecurityStatus, 5 * 60 * 1000); // Every 5 minutes

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [refreshSecurityStatus]);

  return {
    securityStatus,
    isLoading,
    refreshSecurityStatus,
    createSecurityAlert,
    createSecureSession
  };
}
