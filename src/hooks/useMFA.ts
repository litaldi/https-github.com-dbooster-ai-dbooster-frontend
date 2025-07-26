import { useState, useEffect } from 'react';
import { mfaService, MFAConfig } from '@/services/security/mfaService';
import { supabase } from '@/integrations/supabase/client';
import { productionLogger } from '@/utils/productionLogger';

export function useMFA() {
  const [mfaConfig, setMfaConfig] = useState<MFAConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnabling, setIsEnabling] = useState(false);

  const refreshMFAConfig = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        setMfaConfig(null);
        return;
      }

      const config = await mfaService.getMFAConfig(user.user.id);
      setMfaConfig(config);
    } catch (error) {
      productionLogger.error('Failed to refresh MFA config', error, 'useMFA.refreshMFAConfig');
      setMfaConfig(null);
    } finally {
      setIsLoading(false);
    }
  };

  const enableMFA = async (): Promise<{ success: boolean; secret?: string; backupCodes?: string[]; error?: string }> => {
    try {
      setIsEnabling(true);
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        return { success: false, error: 'User not authenticated' };
      }

      const secret = await mfaService.generateTOTPSecret();
      const backupCodes = await mfaService.generateBackupCodes();

      const success = await mfaService.enableMFA(user.user.id, secret, backupCodes);
      
      if (success) {
        await refreshMFAConfig();
        return { success: true, secret, backupCodes };
      } else {
        return { success: false, error: 'Failed to enable MFA' };
      }
    } catch (error) {
      productionLogger.error('Failed to enable MFA', error, 'useMFA.enableMFA');
      return { success: false, error: 'Failed to enable MFA' };
    } finally {
      setIsEnabling(false);
    }
  };

  const disableMFA = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) {
        return { success: false, error: 'User not authenticated' };
      }

      const success = await mfaService.disableMFA(user.user.id);
      
      if (success) {
        await refreshMFAConfig();
        return { success: true };
      } else {
        return { success: false, error: 'Failed to disable MFA' };
      }
    } catch (error) {
      productionLogger.error('Failed to disable MFA', error, 'useMFA.disableMFA');
      return { success: false, error: 'Failed to disable MFA' };
    }
  };

  const validateBackupCode = async (code: string): Promise<boolean> => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return false;

      return await mfaService.validateBackupCode(user.user.id, code);
    } catch (error) {
      productionLogger.error('Failed to validate backup code', error, 'useMFA.validateBackupCode');
      return false;
    }
  };

  useEffect(() => {
    refreshMFAConfig();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      refreshMFAConfig();
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    mfaConfig,
    isLoading,
    isEnabling,
    enableMFA,
    disableMFA,
    validateBackupCode,
    refreshMFAConfig
  };
}