
import { auditLogger } from '../auditLogger';
import { secureRateLimitService } from '../secureRateLimitService';
import { productionLogger } from '@/utils/productionLogger';

export class AuthSecurityService {
  private static instance: AuthSecurityService;

  static getInstance(): AuthSecurityService {
    if (!AuthSecurityService.instance) {
      AuthSecurityService.instance = new AuthSecurityService();
    }
    return AuthSecurityService.instance;
  }

  async validateAuthenticationSecurity(email: string): Promise<{ allowed: boolean; reason?: string }> {
    try {
      // Check for suspicious authentication patterns
      const suspiciousPatterns = [
        /admin|root|superuser|sa|operator/i,
        /test|demo|example|null|undefined/i
      ];

      if (suspiciousPatterns.some(pattern => pattern.test(email))) {
        await auditLogger.logSecurityEvent({
          event_type: 'suspicious_auth_attempt',
          event_data: {
            email: email.replace(/(.{2}).*(@.*)/, "$1***$2"),
            reason: 'suspicious_email_pattern'
          }
        });
        
        return {
          allowed: false,
          reason: 'Suspicious authentication pattern detected'
        };
      }

      // Rate limit authentication attempts
      const rateLimitResult = await secureRateLimitService.checkRateLimit(`auth:${email}`, 'login');
      if (!rateLimitResult.allowed) {
        return {
          allowed: false,
          reason: `Too many attempts. Try again in ${rateLimitResult.retryAfter} seconds.`
        };
      }

      return { allowed: true };
    } catch (error) {
      productionLogger.error('Authentication security check failed', error, 'AuthSecurityService');
      return { allowed: true }; // Allow on error to avoid blocking legitimate users
    }
  }
}

export const authSecurityService = AuthSecurityService.getInstance();
