
import { unifiedSecurityService } from '@/services/security/unifiedSecurityService';
import { productionLogger } from './productionLogger';

export class SecurityUtils {
  static async validateUserInput(input: string, context: string = 'general') {
    return unifiedSecurityService.validateInput(input, context);
  }

  static async checkRateLimit(identifier: string, action: string = 'api') {
    return unifiedSecurityService.checkRateLimit(identifier, action);
  }

  static logSecurityEvent(event: string, success: boolean, metadata?: Record<string, any>) {
    return unifiedSecurityService.logSecurityEvent(event, success, metadata);
  }

  static sanitizeErrorMessage(message: string): string {
    // Remove potentially sensitive information from error messages
    return message
      .replace(/database|sql|postgres|supabase/gi, 'system')
      .replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, '[IP]')
      .replace(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/gi, '[UUID]');
  }

  static initializeSecurity(): void {
    try {
      unifiedSecurityService.initializeSecurityHeaders();
      productionLogger.info('Security system initialized', {}, 'SecurityUtils');
    } catch (error) {
      productionLogger.error('Failed to initialize security', error, 'SecurityUtils');
    }
  }
}

export const securityUtils = SecurityUtils;
