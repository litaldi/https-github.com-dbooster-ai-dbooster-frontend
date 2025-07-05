
import { auditLogger } from './auditLogger';
import { rateLimitService } from './security/rateLimitService';
import { threatDetectionService } from './threatDetectionService';
import { consolidatedAuthenticationSecurity } from './security/consolidatedAuthenticationSecurity';
import { consolidatedInputValidation } from './security/consolidatedInputValidation';

// Re-export essential security services
export { auditLogger } from './auditLogger';
export { rateLimitService } from './security/rateLimitService';
export { threatDetectionService } from './threatDetectionService';
export { consolidatedAuthenticationSecurity } from './security/consolidatedAuthenticationSecurity';
export { consolidatedInputValidation } from './security/consolidatedInputValidation';

// Consolidated SecurityService
export class SecurityService {
  private static instance: SecurityService;

  static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService();
    }
    return SecurityService.instance;
  }

  // Input validation using consolidated service
  async validateUserInput(input: any, context: string): Promise<{ valid: boolean; errors?: string[]; riskLevel?: string }> {
    const result = consolidatedInputValidation.validateAndSanitize(input, context);
    return {
      valid: result.isValid,
      errors: result.errors,
      riskLevel: result.riskLevel
    };
  }

  // Authentication security using consolidated service
  async validateAuthenticationSecurity(email: string): Promise<{ allowed: boolean; reason?: string }> {
    const rateLimitResult = await rateLimitService.checkRateLimit(`auth:${email}`, 'login');
    return {
      allowed: rateLimitResult.allowed,
      reason: rateLimitResult.allowed ? undefined : 'Rate limit exceeded'
    };
  }

  // Session security validation using consolidated service
  async validateSessionSecurity(): Promise<boolean> {
    return consolidatedAuthenticationSecurity.validateSessionSecurity();
  }

  // Repository access validation (simplified)
  async validateRepositoryAccess(repositoryId: string, action: 'read' | 'write' | 'delete'): Promise<boolean> {
    // Basic validation - can be enhanced based on specific requirements
    return true;
  }

  // Legacy compatibility methods
  async logSecurityEvent(event: any): Promise<void> {
    return auditLogger.logSecurityEvent(event);
  }

  async checkRateLimit(identifier: string, actionType: string): Promise<{ allowed: boolean; retryAfter?: number }> {
    return rateLimitService.checkRateLimit(identifier, actionType);
  }

  sanitizeInput(input: string): string {
    const result = consolidatedInputValidation.validateAndSanitize(input, 'general');
    return result.sanitizedValue || input;
  }

  async logAuthEvent(eventType: string, success: boolean, details?: Record<string, any>): Promise<void> {
    return auditLogger.logAuthEvent(eventType, success, details);
  }

  async detectSuspiciousActivity(userId: string): Promise<boolean> {
    return threatDetectionService.detectSuspiciousActivity(userId);
  }
}

export const securityService = SecurityService.getInstance();
