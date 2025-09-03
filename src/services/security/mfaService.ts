import { supabase } from '@/integrations/supabase/client';
import { productionLogger } from '@/utils/productionLogger';

export interface MFAConfig {
  totpSecret?: string;
  backupCodes?: string[];
  isMfaEnabled: boolean;
  recoveryCodesUsed: number;
  backupCodesRemaining?: number;
}

export class MFAService {
  private static instance: MFAService;

  static getInstance(): MFAService {
    if (!MFAService.instance) {
      MFAService.instance = new MFAService();
    }
    return MFAService.instance;
  }

  async getMFAConfig(userId: string): Promise<MFAConfig | null> {
    try {
      // Use safe view that doesn't expose secrets
      const { data, error } = await supabase
        .from('user_mfa_status')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        return {
          isMfaEnabled: false,
          recoveryCodesUsed: 0
        };
      }

      return {
        isMfaEnabled: data.is_mfa_enabled,
        recoveryCodesUsed: data.recovery_codes_used,
        backupCodesRemaining: data.backup_codes_remaining || 0
      };
    } catch (error) {
      productionLogger.error('Failed to get MFA config', error, 'MFAService.getMFAConfig');
      return null;
    }
  }

  async enableMFA(userId: string, totpSecret: string, backupCodes: string[]): Promise<boolean> {
    try {
      // Use secure function to enable MFA
      const { data, error } = await supabase.rpc('enable_mfa_secure', {
        user_totp_secret: totpSecret,
        user_backup_codes: backupCodes
      });

      if (error) throw error;

      productionLogger.info('MFA enabled for user', { userId }, 'MFAService.enableMFA');
      return (data as { success: boolean })?.success || false;
    } catch (error) {
      productionLogger.error('Failed to enable MFA', error, 'MFAService.enableMFA');
      return false;
    }
  }

  async disableMFA(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_mfa_config')
        .update({
          is_mfa_enabled: false,
          totp_secret_encrypted: null,
          backup_codes_hashed: null
        })
        .eq('user_id', userId);

      if (error) throw error;

      productionLogger.info('MFA disabled for user', { userId }, 'MFAService.disableMFA');
      return true;
    } catch (error) {
      productionLogger.error('Failed to disable MFA', error, 'MFAService.disableMFA');
      return false;
    }
  }

  async generateTOTPSecret(): Promise<string> {
    // Generate a cryptographically secure random secret for TOTP
    const array = new Uint8Array(20);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  async generateBackupCodes(): Promise<string[]> {
    const codes: string[] = [];
    for (let i = 0; i < 10; i++) {
      const array = new Uint8Array(4);
      crypto.getRandomValues(array);
      const code = Array.from(array, byte => 
        byte.toString(16).padStart(2, '0')
      ).join('').substring(0, 8);
      codes.push(code);
    }
    return codes;
  }

  async validateBackupCode(userId: string, code: string): Promise<boolean> {
    try {
      // Use secure function to validate backup code
      const { data, error } = await supabase.rpc('validate_backup_code_secure', {
        backup_code: code
      });

      if (error) throw error;

      productionLogger.info('Backup code validation attempt', { userId, valid: (data as { valid: boolean })?.valid }, 'MFAService.validateBackupCode');
      return (data as { valid: boolean })?.valid || false;
    } catch (error) {
      productionLogger.error('Failed to validate backup code', error, 'MFAService.validateBackupCode');
      return false;
    }
  }
}

export const mfaService = MFAService.getInstance();