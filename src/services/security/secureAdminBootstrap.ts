
import { supabase } from '@/integrations/supabase/client';
import { productionLogger } from '@/utils/productionLogger';

interface AdminBootstrapResult {
  success: boolean;
  message?: string;
  error?: string;
  requiresBootstrap?: boolean;
}

class SecureAdminBootstrap {
  private static instance: SecureAdminBootstrap;

  static getInstance(): SecureAdminBootstrap {
    if (!SecureAdminBootstrap.instance) {
      SecureAdminBootstrap.instance = new SecureAdminBootstrap();
    }
    return SecureAdminBootstrap.instance;
  }

  async checkBootstrapRequired(): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('is_admin_bootstrap_needed');
      if (error) {
        productionLogger.error('Failed to check bootstrap requirement', error, 'SecureAdminBootstrap');
        return false;
      }
      return data || false;
    } catch (error) {
      productionLogger.error('Error checking bootstrap requirement', error, 'SecureAdminBootstrap');
      return false;
    }
  }

  async createBootstrapToken(): Promise<string | null> {
    try {
      // Generate secure bootstrap token
      const tokenArray = new Uint8Array(32);
      crypto.getRandomValues(tokenArray);
      const token = Array.from(tokenArray, byte => byte.toString(16).padStart(2, '0')).join('');

      // Get user's IP for security logging
      const ipAddress = await this.getUserIP();

      const { error } = await supabase
        .from('admin_bootstrap_validation')
        .insert({
          bootstrap_token: token,
          created_by_ip: ipAddress
        });

      if (error) {
        productionLogger.error('Failed to create bootstrap token', error, 'SecureAdminBootstrap');
        return null;
      }

      productionLogger.secureInfo('Bootstrap token created', {
        token_length: token.length,
        ip_address: ipAddress
      });

      return token;
    } catch (error) {
      productionLogger.error('Error creating bootstrap token', error, 'SecureAdminBootstrap');
      return null;
    }
  }

  async performSecureBootstrap(token: string, userId: string): Promise<AdminBootstrapResult> {
    try {
      const ipAddress = await this.getUserIP();

      const { data, error } = await supabase.rpc('secure_admin_bootstrap', {
        bootstrap_token: token,
        target_user_id: userId,
        requester_ip: ipAddress
      });

      if (error) {
        productionLogger.error('Bootstrap attempt failed', error, 'SecureAdminBootstrap');
        return {
          success: false,
          error: 'Bootstrap failed due to system error'
        };
      }

      const result = data as AdminBootstrapResult;
      
      if (result.success) {
        productionLogger.secureInfo('Admin bootstrap completed successfully', {
          user_id: userId.substring(0, 8),
          ip_address: ipAddress
        });
      } else {
        productionLogger.warn('Bootstrap attempt rejected', {
          user_id: userId.substring(0, 8),
          reason: result.error,
          ip_address: ipAddress
        });
      }

      return result;
    } catch (error) {
      productionLogger.error('Error during secure bootstrap', error, 'SecureAdminBootstrap');
      return {
        success: false,
        error: 'Unexpected error during bootstrap process'
      };
    }
  }

  private async getUserIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip || 'unknown';
    } catch {
      return 'unknown';
    }
  }
}

export const secureAdminBootstrap = SecureAdminBootstrap.getInstance();
