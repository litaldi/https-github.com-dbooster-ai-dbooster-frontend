
import { consolidatedAuthenticationSecurity } from './consolidatedAuthenticationSecurity';
import { consolidatedInputValidation } from './consolidatedInputValidation';
import { rateLimitService } from './rateLimitService';
import { enhancedSecurityHeaders } from './enhancedSecurityHeaders';
import { productionLogger } from '@/utils/productionLogger';

export class UnifiedSecurityService {
  private static instance: UnifiedSecurityService;

  static getInstance(): UnifiedSecurityService {
    if (!UnifiedSecurityService.instance) {
      UnifiedSecurityService.instance = new UnifiedSecurityService();
    }
    return UnifiedSecurityService.instance;
  }

  async validateInput(input: string, context: string = 'general') {
    return consolidatedInputValidation.validateAndSanitize(input, context);
  }

  async checkRateLimit(key: string, limit: number = 10, windowMs: number = 60000) {
    return rateLimitService.checkRateLimit(key, limit, windowMs);
  }

  async secureLogin(email: string, password: string, options?: { rememberMe?: boolean }) {
    return consolidatedAuthenticationSecurity.secureLogin(email, password, options);
  }

  async secureSignup(email: string, password: string, userData: { fullName: string; acceptedTerms: boolean }) {
    return consolidatedAuthenticationSecurity.secureSignup(email, password, userData);
  }

  initializeSecurityHeaders() {
    enhancedSecurityHeaders.applyStrictSecurityHeaders();
  }

  logSecurityEvent(event: string, success: boolean, metadata?: Record<string, any>) {
    if (success) {
      productionLogger.secureInfo(`Security event: ${event}`, metadata, 'UnifiedSecurity');
    } else {
      productionLogger.warn(`Security event failed: ${event}`, metadata, 'UnifiedSecurity');
    }
  }
}

export const unifiedSecurityService = UnifiedSecurityService.getInstance();
