
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { productionLogger } from '@/utils/productionLogger';

export function useConsolidatedSecurity() {
  const [isLoading, setIsLoading] = useState(false);

  const validateSession = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        productionLogger.error('Session validation error', error, 'useConsolidatedSecurity');
        return false;
      }

      return !!session;
    } catch (error) {
      productionLogger.error('Session validation failed', error, 'useConsolidatedSecurity');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkSecurityCompliance = useCallback(async () => {
    try {
      // Basic security compliance checks
      const session = await validateSession();
      return {
        isCompliant: session,
        score: session ? 85 : 0,
        issues: session ? [] : ['No active session']
      };
    } catch (error) {
      productionLogger.error('Security compliance check failed', error, 'useConsolidatedSecurity');
      return {
        isCompliant: false,
        score: 0,
        issues: ['Compliance check failed']
      };
    }
  }, [validateSession]);

  return {
    validateSession,
    checkSecurityCompliance,
    isLoading
  };
}
