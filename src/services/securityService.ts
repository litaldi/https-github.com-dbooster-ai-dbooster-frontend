
import { SecurityServiceCore } from './security/core/securityServiceCore';

// Re-export essential security services for backward compatibility
export { auditLogger } from './auditLogger';
export { rateLimitService } from './security/rateLimitService';
export { threatDetectionService } from './threatDetectionService';
export { consolidatedAuthenticationSecurity } from './security/consolidatedAuthenticationSecurity';
export { consolidatedInputValidation } from './security/consolidatedInputValidation';
export { enhancedThreatDetection } from './security/threatDetectionEnhanced';
export { rbac } from './security/roleBasedAccessControl';
export { apiSecurity } from './security/apiSecurityEnhancement';
export { securityDashboard } from './security/securityDashboardService';

// Main SecurityService class - now a wrapper around SecurityServiceCore
export class SecurityService extends SecurityServiceCore {
  private static instance: SecurityService;

  static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService();
    }
    return SecurityService.instance;
  }
}

export const securityService = SecurityService.getInstance();
