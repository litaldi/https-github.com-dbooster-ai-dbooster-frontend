
import { auditLogger } from './auditLogger';
import { rateLimitService } from './security/rateLimitService';
import { threatDetectionService } from './threatDetectionService';
import { consolidatedAuthenticationSecurity } from './security/consolidatedAuthenticationSecurity';
import { consolidatedInputValidation } from './security/consolidatedInputValidation';
import { enhancedThreatDetection } from './security/threatDetectionEnhanced';
import { rbac } from './security/roleBasedAccessControl';
import { apiSecurity } from './security/apiSecurityEnhancement';
import { securityDashboard } from './security/securityDashboardService';

// Re-export essential security services
export { auditLogger } from './auditLogger';
export { rateLimitService } from './security/rateLimitService';
export { threatDetectionService } from './threatDetectionService';
export { consolidatedAuthenticationSecurity } from './security/consolidatedAuthenticationSecurity';
export { consolidatedInputValidation } from './security/consolidatedInputValidation';
export { enhancedThreatDetection } from './security/threatDetectionEnhanced';
export { rbac } from './security/roleBasedAccessControl';
export { apiSecurity } from './security/apiSecurityEnhancement';
export { securityDashboard } from './security/securityDashboardService';

// Enhanced SecurityService with all new features
export class SecurityService {
  private static instance: SecurityService;

  static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService();
    }
    return SecurityService.instance;
  }

  // Enhanced input validation with threat detection
  async validateUserInput(input: any, context: string): Promise<{ 
    valid: boolean; 
    errors?: string[]; 
    riskLevel?: string;
    threats?: any[];
  }> {
    const validationResult = consolidatedInputValidation.validateAndSanitize(input, context);
    
    // Enhanced threat detection for string inputs
    if (typeof input === 'string') {
      const threatResult = await enhancedThreatDetection.detectThreats(input, {
        inputType: context,
        userAgent: navigator.userAgent
      });
      
      return {
        valid: validationResult.isValid && !threatResult.shouldBlock,
        errors: validationResult.errors,
        riskLevel: validationResult.riskLevel,
        threats: threatResult.threats
      };
    }

    return {
      valid: validationResult.isValid,
      errors: validationResult.errors,
      riskLevel: validationResult.riskLevel
    };
  }

  // Enhanced authentication security with role-based access
  async validateAuthenticationSecurity(email: string, userId?: string): Promise<{ 
    allowed: boolean; 
    reason?: string;
    userRole?: string;
  }> {
    const rateLimitResult = await rateLimitService.checkRateLimit(`auth:${email}`, 'login');
    
    let userRole = 'user';
    if (userId) {
      userRole = await rbac.getUserRole(userId);
    }
    
    return {
      allowed: rateLimitResult.allowed,
      reason: rateLimitResult.allowed ? undefined : 'Rate limit exceeded',
      userRole
    };
  }

  // Enhanced session security validation
  async validateSessionSecurity(userId?: string): Promise<{
    valid: boolean;
    riskAssessment?: any;
  }> {
    const sessionValid = consolidatedAuthenticationSecurity.validateSessionSecurity();
    
    let riskAssessment;
    if (userId) {
      riskAssessment = await enhancedThreatDetection.analyzeBehaviorPatterns(userId);
    }
    
    return {
      valid: sessionValid,
      riskAssessment
    };
  }

  // Enhanced repository access validation with RBAC
  async validateRepositoryAccess(
    repositoryId: string, 
    action: 'read' | 'write' | 'delete',
    userId?: string
  ): Promise<{ allowed: boolean; reason?: string }> {
    // Check if user has required permissions for the action
    if (userId && action === 'delete') {
      const canManage = await rbac.hasPermission(userId, 'canManageUsers');
      if (!canManage) {
        return { allowed: false, reason: 'Insufficient permissions for repository deletion' };
      }
    }
    
    return { allowed: true };
  }

  // Enhanced API request with security
  async makeSecureApiRequest<T>(url: string, options?: RequestInit): Promise<T> {
    return apiSecurity.secureApiRequest<T>(url, options);
  }

  // GitHub-specific secure API requests
  async makeSecureGitHubRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return apiSecurity.secureGitHubApiRequest<T>(endpoint, options);
  }

  // Get security dashboard data
  async getSecurityDashboard(userId: string) {
    return securityDashboard.getSecuritySummary(userId);
  }

  // Get user security status
  async getUserSecurityStatus(currentUserId: string, targetUserId: string) {
    return securityDashboard.getUserSecurityStatus(currentUserId, targetUserId);
  }

  // Legacy compatibility methods - enhanced versions
  async logSecurityEvent(event: any): Promise<void> {
    return auditLogger.logSecurityEvent(event);
  }

  async checkRateLimit(identifier: string, actionType: string): Promise<{ allowed: boolean; retryAfter?: number }> {
    return rateLimitService.checkRateLimit(identifier, actionType);
  }

  sanitizeInput(input: string, context: string = 'general'): string {
    const result = consolidatedInputValidation.validateAndSanitize(input, context);
    return result.sanitizedValue || input;
  }

  async logAuthEvent(eventType: string, success: boolean, details?: Record<string, any>): Promise<void> {
    return auditLogger.logAuthEvent(eventType, success, details);
  }

  async detectSuspiciousActivity(userId: string): Promise<{
    suspicious: boolean;
    riskScore: number;
    recommendation: string;
  }> {
    const analysis = await enhancedThreatDetection.analyzeBehaviorPatterns(userId);
    return {
      suspicious: analysis.riskScore > 50,
      riskScore: analysis.riskScore,
      recommendation: analysis.recommendation
    };
  }

  // Check user permissions
  async checkPermission(userId: string, permission: string): Promise<boolean> {
    return rbac.hasPermission(userId, permission as any);
  }

  // Require specific permission (throws if not allowed)
  async requirePermission(userId: string, permission: string): Promise<void> {
    return rbac.requirePermission(userId, permission as any);
  }
}

export const securityService = SecurityService.getInstance();
