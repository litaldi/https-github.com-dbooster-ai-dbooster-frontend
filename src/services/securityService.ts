
import { auditLogger } from './auditLogger';
import { rateLimitService } from './rateLimitService';
import { inputValidationService } from './inputValidationService';
import { threatDetectionService } from './threatDetectionService';
import { securityEnhancementService } from './securityEnhancementService';

// Re-export all security services from a single entry point
export { auditLogger } from './auditLogger';
export { rateLimitService } from './rateLimitService';
export { inputValidationService } from './inputValidationService';
export { threatDetectionService } from './threatDetectionService';
export { securityEnhancementService } from './securityEnhancementService';

// Enhanced SecurityService with new security features
export class SecurityService {
  private static instance: SecurityService;

  static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService();
    }
    return SecurityService.instance;
  }

  // Enhanced validation with security checks
  async validateUserInput(input: any, context: string): Promise<{ valid: boolean; errors?: string[]; riskLevel?: string }> {
    const result = await securityEnhancementService.validateUserInput(input, context);
    return {
      valid: result.isValid,
      errors: result.errors,
      riskLevel: result.riskLevel
    };
  }

  // Enhanced authentication security
  async validateAuthenticationSecurity(email: string): Promise<{ allowed: boolean; reason?: string }> {
    return securityEnhancementService.validateAuthenticationSecurity(email);
  }

  // Repository access validation
  async validateRepositoryAccess(repositoryId: string, action: 'read' | 'write' | 'delete'): Promise<boolean> {
    return securityEnhancementService.validateRepositoryAccess(repositoryId, action);
  }

  // Session security validation
  async validateSessionSecurity(): Promise<boolean> {
    return securityEnhancementService.validateSessionSecurity();
  }

  // Legacy compatibility methods
  async logSecurityEvent(event: any): Promise<void> {
    return auditLogger.logSecurityEvent(event);
  }

  async checkRateLimit(identifier: string, actionType: string): Promise<{ allowed: boolean; retryAfter?: number }> {
    return rateLimitService.checkRateLimit(identifier, actionType);
  }

  sanitizeInput(input: string): string {
    return inputValidationService.sanitizeInput(input);
  }

  async logAuthEvent(eventType: string, success: boolean, details?: Record<string, any>): Promise<void> {
    return auditLogger.logAuthEvent(eventType, success, details);
  }

  async detectSuspiciousActivity(userId: string): Promise<boolean> {
    return threatDetectionService.detectSuspiciousActivity(userId);
  }
}

export const securityService = SecurityService.getInstance();
