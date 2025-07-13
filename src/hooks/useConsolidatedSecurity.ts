
import { useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { consolidatedAuthenticationSecurity } from '@/services/security/consolidatedAuthenticationSecurity';
import { productionLogger } from '@/utils/productionLogger';

export function useConsolidatedSecurity() {
  const { user, session } = useAuth();

  const validateSession = useCallback(async (): Promise<boolean> => {
    try {
      if (!user || !session) {
        return false;
      }

      // Basic session validation - check if session is still valid
      const now = new Date();
      const sessionExpiry = new Date(session.expires_at || 0);
      
      if (sessionExpiry < now) {
        productionLogger.warn('Session expired', { userId: user.id }, 'useConsolidatedSecurity');
        return false;
      }

      return true;
    } catch (error) {
      productionLogger.error('Session validation failed', error, 'useConsolidatedSecurity');
      return false;
    }
  }, [user, session]);

  const checkPasswordStrength = useCallback(async (password: string) => {
    return await consolidatedAuthenticationSecurity.validateStrongPassword(password);
  }, []);

  return {
    validateSession,
    checkPasswordStrength,
    isLoading: false
  };
}
