
import { useState, useEffect, useCallback } from 'react';
import { unifiedSecurityService } from '@/services/security/unified/UnifiedSecurityService';

interface SecurityStatus {
  isSecure: boolean;
  sessionValid: boolean;
  securityScore: number;
  threats: string[];
  lastCheck: Date;
}

export function useConsolidatedSecurity() {
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus>({
    isSecure: true,
    sessionValid: true,
    securityScore: 100,
    threats: [],
    lastCheck: new Date()
  });
  const [isLoading, setIsLoading] = useState(false);

  const validateSession = useCallback(async (sessionId?: string) => {
    if (!sessionId) {
      // Get current session ID from localStorage or context
      const currentSession = Object.keys(localStorage).find(key => key.startsWith('secure_session_'));
      if (!currentSession) return false;
      sessionId = currentSession.replace('secure_session_', '');
    }

    return await unifiedSecurityService.validateSession(sessionId);
  }, []);

  const validateInput = useCallback(async (input: string, context?: string) => {
    return await unifiedSecurityService.validateUserInput(input, context);
  }, []);

  const checkRateLimit = useCallback((action: string, identifier: string) => {
    return unifiedSecurityService.checkRateLimit(action, identifier);
  }, []);

  const logSecurityEvent = useCallback(async (event: any) => {
    await unifiedSecurityService.logSecurityEvent(event);
  }, []);

  const refreshSecurityStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      // Check current session validity
      const sessionValid = await validateSession();
      
      // Calculate security score based on various factors
      let securityScore = 100;
      const threats: string[] = [];
      
      if (!sessionValid) {
        securityScore -= 50;
        threats.push('Invalid session');
      }

      setSecurityStatus({
        isSecure: threats.length === 0,
        sessionValid,
        securityScore,
        threats,
        lastCheck: new Date()
      });
    } catch (error) {
      console.error('Failed to refresh security status:', error);
      setSecurityStatus(prev => ({
        ...prev,
        isSecure: false,
        threats: ['Security check failed'],
        lastCheck: new Date()
      }));
    } finally {
      setIsLoading(false);
    }
  }, [validateSession]);

  useEffect(() => {
    refreshSecurityStatus();
    
    // Refresh security status every 5 minutes
    const interval = setInterval(refreshSecurityStatus, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [refreshSecurityStatus]);

  return {
    securityStatus,
    isLoading,
    validateSession,
    validateInput,
    checkRateLimit,
    logSecurityEvent,
    refreshSecurityStatus
  };
}
