
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

  return {
    validateSession,
    isLoading
  };
}
