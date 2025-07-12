
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

// Main SecurityService class - now uses composition instead of inheritance
export class SecurityService {
  private static instance: SecurityService;
  private core: SecurityServiceCore;

  private constructor() {
    this.core = SecurityServiceCore.getInstance();
  }

  static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService();
    }
    return SecurityService.instance;
  }

  // Delegate all methods to the core service
  async validateUserInput(input: string, context: string = 'general') {
    return this.core.validateUserInput(input, context);
  }

  async validateFormData(formData: Record<string, any>, context: string) {
    return this.core.validateFormData(formData, context);
  }

  async validateRepositoryAccess(repositoryId: string, action: 'read' | 'write' | 'delete', userId?: string) {
    return this.core.validateRepositoryAccess(repositoryId, action, userId);
  }

  async makeSecureApiRequest<T>(url: string, options?: RequestInit): Promise<T> {
    return this.core.makeSecureApiRequest<T>(url, options);
  }

  async makeSecureGitHubRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.core.makeSecureGitHubRequest<T>(endpoint, options);
  }

  async getSecurityDashboard(userId: string) {
    return this.core.getSecurityDashboard(userId);
  }

  async getUserSecurityStatus(currentUserId: string, targetUserId: string) {
    return this.core.getUserSecurityStatus(currentUserId, targetUserId);
  }

  async getEnhancedSecuritySummary() {
    return this.core.getEnhancedSecuritySummary();
  }

  async logSecurityEvent(event: any) {
    return this.core.logSecurityEvent(event);
  }

  async checkRateLimit(identifier: string, actionType: string) {
    return this.core.checkRateLimit(identifier, actionType);
  }

  sanitizeInput(input: string, context: string = 'general'): string {
    return this.core.sanitizeInput(input, context);
  }

  async logAuthEvent(eventType: string, success: boolean, details?: Record<string, any>) {
    return this.core.logAuthEvent(eventType, success, details);
  }

  async detectSuspiciousActivity(userId: string) {
    return this.core.detectSuspiciousActivity(userId);
  }

  async checkPermission(userId: string, permission: string): Promise<boolean> {
    return this.core.checkPermission(userId, permission);
  }

  async requirePermission(userId: string, permission: string): Promise<void> {
    return this.core.requirePermission(userId, permission);
  }

  // Public property for backward compatibility
  get consolidatedAuthenticationSecurity() {
    return this.core.consolidatedAuthenticationSecurity;
  }
}

export const securityService = SecurityService.getInstance();
