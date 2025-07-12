import { auditLogger } from './auditLogger';
import { rateLimitService } from './security/rateLimitService';
import { threatDetectionService } from './threatDetectionService';
import { consolidatedAuthenticationSecurity } from './security/consolidatedAuthenticationSecurity';
import { consolidatedInputValidation } from './security/consolidatedInputValidation';
import { enhancedThreatDetection } from './security/threatDetectionEnhanced';
import { rbac } from './security/roleBasedAccessControl';
import { apiSecurity } from './security/apiSecurityEnhancement';
import { securityDashboard } from './security/securityDashboardService';
import { logger } from '@/utils/logger';
import type { ValidationResult } from '@/types';

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

// Define RateLimitResult interface
interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
  remainingAttempts: number;
}

// Define SecurityEvent interface that matches auditLogger expectations
interface AuditSecurityEvent {
  event_type: string;
  event_data?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}

export class SecurityService {
  private static instance: SecurityService;

  // Add the missing property
  public consolidatedAuthenticationSecurity = consolidatedAuthenticationSecurity;

  static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService();
      // Initialize enhanced security monitoring
      this.initializeEnhancedSecurity();
    }
    return SecurityService.instance;
  }

  private static async initializeEnhancedSecurity(): Promise<void> {
    try {
      const { enhancedSecurityMonitor } = await import('./security/enhancedSecurityMonitor');
      const { serverSideValidationService } = await import('./security/serverSideValidationService');
      
      // Start enhanced monitoring
      await enhancedSecurityMonitor.startMonitoring();
      
      productionLogger.info('Enhanced security services initialized');
    } catch (error) {
      productionLogger.error('Failed to initialize enhanced security', error, 'SecurityService');
    }
  }

  // Enhanced input validation with server-side validation
  async validateUserInput(input: string, context: string = 'general'): Promise<{ 
    valid: boolean; 
    errors?: string[]; 
    riskLevel?: string;
    threatTypes?: string[];
    sanitizedInput?: string;
  }> {
    // Client-side validation first
    const clientValidation = consolidatedInputValidation.validateAndSanitize(input, context);
    
    // Enhanced threat detection for string inputs
    const threatResult = await enhancedThreatDetection.detectThreats(input, {
      inputType: context,
      userAgent: navigator.userAgent
    });
    
    // Server-side validation for critical inputs
    let serverValidation = null;
    if (context.includes('database') || context.includes('auth') || threatResult.shouldBlock) {
      try {
        const { serverSideValidationService } = await import('./security/serverSideValidationService');
        serverValidation = await serverSideValidationService.validateInput(input, 'general', context);
      } catch (error) {
        productionLogger.error('Server-side validation failed', error, 'SecurityService');
      }
    }
    
    const isValid = clientValidation.isValid && 
                   !threatResult.shouldBlock && 
                   (serverValidation?.isValid !== false);

    return {
      valid: isValid,
      errors: clientValidation.errors,
      riskLevel: serverValidation?.riskLevel || clientValidation.riskLevel,
      threatTypes: [
        ...(threatResult.threatTypes || []),
        ...(serverValidation?.threatTypes || [])
      ],
      sanitizedInput: serverValidation?.sanitizedInput || clientValidation.sanitizedValue
    };
  }

  // Enhanced form validation with server-side support
  async validateFormData(formData: Record<string, any>, context: string): Promise<{
    isValid: boolean;
    errors: Record<string, string[]>;
    sanitizedData: Record<string, any>;
  }> {
    try {
      const { serverSideValidationService } = await import('./security/serverSideValidationService');
      return await serverSideValidationService.validateFormData(formData, context);
    } catch (error) {
      productionLogger.error('Form validation failed', error, 'SecurityService');
      
      // Fallback to client-side validation
      const errors: Record<string, string[]> = {};
      const sanitizedData: Record<string, any> = {};
      let isValid = true;

      for (const [key, value] of Object.entries(formData)) {
        if (typeof value === 'string') {
          const validation = consolidatedInputValidation.validateAndSanitize(value, context);
          if (!validation.isValid) {
            errors[key] = validation.errors || ['Invalid input'];
            isValid = false;
          }
          sanitizedData[key] = validation.sanitizedValue || value;
        } else {
          sanitizedData[key] = value;
        }
      }

      return { isValid, errors, sanitizedData };
    }
  }

  // Get enhanced security summary
  async getEnhancedSecuritySummary(): Promise<any> {
    try {
      const { enhancedSecurityMonitor } = await import('./security/enhancedSecurityMonitor');
      return await enhancedSecurityMonitor.getSecuritySummary();
    } catch (error) {
      productionLogger.error('Failed to get enhanced security summary', error, 'SecurityService');
      return {
        totalEvents: 0,
        threatsDetected: 0,
        blockedIPs: 0,
        recentHighRiskEvents: []
      };
    }
  }

  // Enhanced repository access validation with server-side checks
  async validateRepositoryAccess(
    repositoryId: string, 
    action: 'read' | 'write' | 'delete',
    userId?: string
  ): Promise<{ allowed: boolean; reason?: string }> {
    // Server-side validation for repository ID
    const repoValidation = await this.validateUserInput(repositoryId, 'repository_id');
    if (!repoValidation.valid) {
      return { allowed: false, reason: 'Invalid repository identifier' };
    }

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
  async getSecurityDashboard(userId: string): Promise<any> {
    return securityDashboard.getSecuritySummary(userId);
  }

  // Get user security status
  async getUserSecurityStatus(currentUserId: string, targetUserId: string): Promise<any> {
    return securityDashboard.getUserSecurityStatus(currentUserId, targetUserId);
  }

  // Legacy compatibility methods - enhanced versions
  async logSecurityEvent(event: AuditSecurityEvent): Promise<void> {
    return auditLogger.logSecurityEvent(event);
  }

  async checkRateLimit(identifier: string, actionType: string): Promise<RateLimitResult> {
    const result = await rateLimitService.checkRateLimit(identifier, actionType);
    return {
      allowed: result.allowed,
      remaining: result.remaining,
      resetTime: result.resetTime,
      retryAfter: result.retryAfter,
      remainingAttempts: result.remaining // Map remaining to remainingAttempts
    };
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
    return rbac.hasPermission(userId, permission as keyof import('./security/roleBasedAccessControl').RolePermissions);
  }

  // Require specific permission (throws if not allowed)
  async requirePermission(userId: string, permission: string): Promise<void> {
    return rbac.requirePermission(userId, permission as keyof import('./security/roleBasedAccessControl').RolePermissions);
  }
}

export const securityService = SecurityService.getInstance();
