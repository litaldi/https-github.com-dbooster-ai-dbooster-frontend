
import { auditLogger } from './auditLogger';
import { rateLimitService } from './rateLimitService';
import { inputValidationService } from './inputValidationService';
import { threatDetectionService } from './threatDetectionService';

// Re-export all security services from a single entry point
export { auditLogger } from './auditLogger';
export { rateLimitService } from './rateLimitService';
export { inputValidationService } from './inputValidationService';
export { threatDetectionService } from './threatDetectionService';

// Legacy compatibility - maintain the original SecurityService interface
export class SecurityService {
  private static instance: SecurityService;

  static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService();
    }
    return SecurityService.instance;
  }

  // Delegate to specialized services
  async logSecurityEvent(event: any): Promise<void> {
    return auditLogger.logSecurityEvent(event);
  }

  async checkRateLimit(identifier: string, actionType: string): Promise<{ allowed: boolean; retryAfter?: number }> {
    return rateLimitService.checkRateLimit(identifier, actionType);
  }

  async validateInput(input: any, schema: any): Promise<{ valid: boolean; errors?: string[] }> {
    return inputValidationService.validateInput(input, schema);
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
