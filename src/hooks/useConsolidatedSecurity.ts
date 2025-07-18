
import { useState, useCallback } from 'react';
import { enhancedDemoSessionSecurity } from '@/services/security/enhancedDemoSessionSecurity';
import { productionLogger } from '@/utils/productionLogger';

export function useConsolidatedSecurity() {
  const [isLoading, setIsLoading] = useState(false);

  const validateSession = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simple session validation for demo purposes
      const sessionData = localStorage.getItem('demo_validation');
      if (!sessionData) {
        return false;
      }

      const parsed = JSON.parse(sessionData);
      return parsed.sessionId && parsed.timestamp > Date.now() - (2 * 60 * 60 * 1000);
    } catch (error) {
      productionLogger.error('Session validation failed', error, 'useConsolidatedSecurity');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const invalidateSession = useCallback(async (): Promise<void> => {
    try {
      // Clear demo session validation data
      localStorage.removeItem('demo_validation');
      localStorage.removeItem('demo_session_validation');
      
      // If there's an active demo session, revoke it
      const sessionData = localStorage.getItem('demo_session_validation');
      if (sessionData) {
        try {
          const parsed = JSON.parse(sessionData);
          if (parsed.sessionId) {
            await enhancedDemoSessionSecurity.revokeDemoSession(parsed.sessionId);
          }
        } catch (error) {
          // Ignore parsing errors during cleanup
        }
      }
      
      productionLogger.info('Session invalidated', {}, 'useConsolidatedSecurity');
    } catch (error) {
      productionLogger.error('Session invalidation failed', error, 'useConsolidatedSecurity');
    }
  }, []);

  return {
    validateSession,
    invalidateSession,
    isLoading
  };
}
