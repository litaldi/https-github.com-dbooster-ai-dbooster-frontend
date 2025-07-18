
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { consolidatedAuthenticationSecurity } from '@/services/security/consolidatedAuthenticationSecurity';
import { enhancedRoleManager } from '@/services/security/enhancedRoleManager';
import { enhancedClientSecurity } from '@/services/security/enhancedClientSecurity';
import { enhancedDemoSecurity } from '@/services/security/enhancedDemoSecurity';
import { enhancedSessionSecurity } from '@/services/security/enhancedSessionSecurity';
import { productionLogger } from '@/utils/productionLogger';

export function useConsolidatedSecurity() {
  const { user, session, isDemo } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const validateSession = useCallback(async (): Promise<boolean> => {
    if (!user || !session) {
      return false;
    }

    try {
      setIsLoading(true);

      // For demo sessions, use enhanced demo security validation
      if (isDemo) {
        const demoValidation = await enhancedDemoSecurity.validateDemoSession(user.id);
        
        if (!demoValidation.isValid) {
          productionLogger.warn('Demo session validation failed', {
            reason: demoValidation.reason,
            userId: user.id.substring(0, 8)
          }, 'useConsolidatedSecurity');
          return false;
        }

        // If demo session requires revalidation, handle it
        if (demoValidation.requiresRevalidation) {
          productionLogger.info('Demo session requires revalidation', {
            securityLevel: demoValidation.securityLevel
          }, 'useConsolidatedSecurity');
        }

        return true;
      }

      // Enhanced session security validation
      const sessionValidation = await enhancedSessionSecurity.validateSession(
        session.access_token,
        user.id
      );

      if (!sessionValidation.isValid) {
        productionLogger.warn('Session validation failed', {
          reason: sessionValidation.reason,
          shouldReauthenticate: sessionValidation.shouldReauthenticate,
          securityScore: sessionValidation.securityScore
        }, 'useConsolidatedSecurity');

        if (sessionValidation.shouldReauthenticate) {
          // Session needs reauthentication - this could trigger logout
          return false;
        }
      }

      // Legacy consolidated authentication security check
      const isValid = await consolidatedAuthenticationSecurity.validateSessionSecurity(session.access_token);
      
      if (isValid) {
        // Additional client-side security validation
        const securityMetrics = await enhancedClientSecurity.getSecurityMetrics();
        
        if (securityMetrics.vulnerabilities.length > 0) {
          productionLogger.warn('Client security vulnerabilities detected', {
            vulnerabilities: securityMetrics.vulnerabilities,
            securityLevel: securityMetrics.securityLevel
          }, 'useConsolidatedSecurity');
        }
      }

      return isValid && sessionValidation.isValid;
    } catch (error) {
      productionLogger.error('Session validation failed', error, 'useConsolidatedSecurity');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user, session, isDemo]);

  const getUserRole = useCallback(async () => {
    if (!user) return 'user';
    
    try {
      return await enhancedRoleManager.getCurrentUserRole();
    } catch (error) {
      productionLogger.error('Failed to get user role', error, 'useConsolidatedSecurity');
      return 'user';
    }
  }, [user]);

  const hasPermission = useCallback(async (permission: string): Promise<boolean> => {
    if (!user) return false;
    
    try {
      return await enhancedRoleManager.hasPermission(user.id, permission as any);
    } catch (error) {
      productionLogger.error('Permission check failed', error, 'useConsolidatedSecurity');
      return false;
    }
  }, [user]);

  const getSecurityStatus = useCallback(async () => {
    try {
      const [clientMetrics, userRole, sessionValid] = await Promise.all([
        enhancedClientSecurity.getSecurityMetrics(),
        getUserRole(),
        validateSession()
      ]);

      // Get session security metrics if available
      let sessionMetrics = null;
      if (session) {
        sessionMetrics = enhancedSessionSecurity.getSessionMetrics(session.access_token);
      }

      return {
        clientSecurity: clientMetrics,
        userRole,
        sessionValid,
        sessionMetrics,
        isDemo
      };
    } catch (error) {
      productionLogger.error('Failed to get security status', error, 'useConsolidatedSecurity');
      return null;
    }
  }, [getUserRole, validateSession, isDemo, session]);

  const invalidateSession = useCallback(async () => {
    if (session) {
      try {
        await enhancedSessionSecurity.invalidateSession(session.access_token);
      } catch (error) {
        productionLogger.error('Failed to invalidate session', error, 'useConsolidatedSecurity');
      }
    }
  }, [session]);

  return {
    validateSession,
    getUserRole,
    hasPermission,
    getSecurityStatus,
    invalidateSession,
    isLoading
  };
}
