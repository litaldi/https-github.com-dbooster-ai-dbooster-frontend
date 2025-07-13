
import { useCallback } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { cleanLogger } from '@/utils/cleanLogger';

export function useConsolidatedSecurity() {
  const { user } = useAuth();

  const validateSession = useCallback(async () => {
    try {
      if (!user) {
        cleanLogger.warn('Session validation failed - no user', {}, 'ConsolidatedSecurity');
        return false;
      }

      // For demo users, always validate as expired to show the warning
      if (user.id === 'demo-user-id') {
        cleanLogger.warn('Session expired', { userId: user.id }, 'ConsolidatedSecurity');
        return false;
      }

      cleanLogger.info('Session validated successfully', { userId: user.id }, 'ConsolidatedSecurity');
      return true;
    } catch (error) {
      cleanLogger.error('Session validation error', error, 'ConsolidatedSecurity');
      return false;
    }
  }, [user]);

  return {
    validateSession
  };
}
