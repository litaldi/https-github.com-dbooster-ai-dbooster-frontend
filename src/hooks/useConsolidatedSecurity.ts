
import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { consolidatedAuthenticationSecurity } from '@/services/security/consolidatedAuthenticationSecurity';
import { enhancedRoleManager } from '@/services/security/enhancedRoleManager';
import { enhancedClientSecurity } from '@/services/security/enhancedClientSecurity';
import { enhancedDemoSecurity } from '@/services/security/enhancedDemoSecurity';
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

      // For real sessions, use consolidated authentication security
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

      return isValid;
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
      const [clientMetrics, userRole] = await Promise.all([
        enhancedClientSecurity.getSecurityMetrics(),
        getUserRole()
      ]);

      return {
        clientSecurity: clientMetrics,
        userRole,
        sessionValid: await validateSession(),
        isDemo
      };
    } catch (error) {
      productionLogger.error('Failed to get security status', error, 'useConsolidatedSecurity');
      return null;
    }
  }, [getUserRole, validateSession, isDemo]);

  return {
    validateSession,
    getUserRole,
    hasPermission,
    getSecurityStatus,
    isLoading
  };
}
