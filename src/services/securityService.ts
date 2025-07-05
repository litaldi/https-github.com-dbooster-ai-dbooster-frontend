
import { consolidatedAuthenticationSecurity } from './security/consolidatedAuthenticationSecurity';
import { rateLimitService } from './security/rateLimitService';
import { enhancedSecurityHeaders } from './security/enhancedSecurityHeaders';

export class SecurityService {
  consolidatedAuthenticationSecurity = consolidatedAuthenticationSecurity;
  rateLimitService = rateLimitService;
  enhancedSecurityHeaders = enhancedSecurityHeaders;

  async logAuthEvent(event: string, success: boolean, context: any) {
    // Mock implementation for now
    console.log(`Auth event: ${event}`, { success, context });
  }
}

export const securityService = new SecurityService();
