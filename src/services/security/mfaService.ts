import { supabase } from '@/integrations/supabase/client';
import { productionLogger } from '@/utils/productionLogger';

export interface MFAConfig {
  totpSecret?: string;
  backupCodes?: string[];
  isMfaEnabled: boolean;
  recoveryCodesUsed: number;
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
      const { data, error } = await supabase
        .from('user_mfa_config')
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
        totpSecret: data.totp_secret,
        backupCodes: data.backup_codes,
        isMfaEnabled: data.is_mfa_enabled,
        recoveryCodesUsed: data.recovery_codes_used
      };
    } catch (error) {
      productionLogger.error('Failed to get MFA config', error, 'MFAService.getMFAConfig');
      return null;
    }
  }

  async enableMFA(userId: string, totpSecret: string, backupCodes: string[]): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_mfa_config')
        .upsert({
          user_id: userId,
          totp_secret: totpSecret,
          backup_codes: backupCodes,
          is_mfa_enabled: true,
          recovery_codes_used: 0
        });

      if (error) throw error;

      productionLogger.info('MFA enabled for user', { userId }, 'MFAService.enableMFA');
      return true;
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
          totp_secret: null,
          backup_codes: null
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
      const config = await this.getMFAConfig(userId);
      if (!config || !config.backupCodes) return false;

      const codeIndex = config.backupCodes.indexOf(code);
      if (codeIndex === -1) return false;

      // Remove used backup code
      const updatedCodes = config.backupCodes.filter(c => c !== code);
      
      const { error } = await supabase
        .from('user_mfa_config')
        .update({
          backup_codes: updatedCodes,
          recovery_codes_used: config.recoveryCodesUsed + 1
        })
        .eq('user_id', userId);

      if (error) throw error;

      productionLogger.info('Backup code used', { userId }, 'MFAService.validateBackupCode');
      return true;
    } catch (error) {
      productionLogger.error('Failed to validate backup code', error, 'MFAService.validateBackupCode');
      return false;
    }
  }
}

export const mfaService = MFAService.getInstance();