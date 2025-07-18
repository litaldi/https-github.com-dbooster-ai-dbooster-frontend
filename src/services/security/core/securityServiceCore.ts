
import { productionLogger } from '@/utils/productionLogger';
import { ValidationService } from './validationService';
import { AuthenticationService } from './authenticationService';
import { MonitoringService } from './monitoringService';
import { ApiSecurityService } from './apiSecurityService';

// Import the AppRole type
type AppRole = 'admin' | 'moderator' | 'user';

/**
 * Core security service that orchestrates all security operations
 * Uses singleton pattern for consistent state management
 */
export class SecurityServiceCore {
  private static instance: SecurityServiceCore;
  private readonly validationService: ValidationService;
  private readonly authenticationService: AuthenticationService;
  private readonly monitoringService: MonitoringService;
  private readonly apiSecurityService: ApiSecurityService;
  private isInitialized = false;

  private constructor() {
    this.validationService = ValidationService.getInstance();
    this.authenticationService = AuthenticationService.getInstance();
    this.monitoringService = MonitoringService.getInstance();
    this.apiSecurityService = ApiSecurityService.getInstance();
  }

  static getInstance(): SecurityServiceCore {
    if (!SecurityServiceCore.instance) {
      SecurityServiceCore.instance = new SecurityServiceCore();
    }
    return SecurityServiceCore.instance;
  }

  /**
   * Initialize enhanced security features with proper error handling
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      return;
    }

    try {
      // Lazy load enhanced security monitor to avoid circular dependencies
      const { enhancedSecurityMonitor } = await import('../enhancedSecurityMonitor');
      await enhancedSecurityMonitor.startMonitoring();
      
      this.isInitialized = true;
      productionLogger.info('Enhanced security services initialized');
    } catch (error) {
      productionLogger.error('Failed to initialize enhanced security', error, 'SecurityServiceCore');
      // Don't throw - allow basic security to continue working
    }
  }

  // Enhanced session management with better error handling
  async createSecureSession(userId: string, isDemo: boolean = false): Promise<string> {
    try {
      const { enhancedAuthenticationService } = await import('./enhancedAuthenticationService');
      return enhancedAuthenticationService.createSecureSession(userId, isDemo);
    } catch (error) {
      productionLogger.error('Failed to create secure session', error, 'SecurityServiceCore');
      throw new Error('Session creation failed');
    }
  }

  async validateSession(sessionId: string): Promise<boolean> {
    try {
      const { enhancedAuthenticationService } = await import('./enhancedAuthenticationService');
      return enhancedAuthenticationService.validateSession(sessionId);
    } catch (error) {
      productionLogger.error('Session validation failed', error, 'SecurityServiceCore');
      return false;
    }
  }

  async detectSuspiciousActivity(userId: string): Promise<boolean> {
    try {
      const { enhancedAuthenticationService } = await import('./enhancedAuthenticationService');
      return enhancedAuthenticationService.detectSuspiciousActivity(userId);
    } catch (error) {
      productionLogger.error('Suspicious activity detection failed', error, 'SecurityServiceCore');
      return false;
    }
  }

  async assignUserRole(targetUserId: string, newRole: AppRole, reason?: string): Promise<boolean> {
    try {
      const { enhancedAuthenticationService } = await import('./enhancedAuthenticationService');
      return enhancedAuthenticationService.assignUserRole(targetUserId, newRole, reason);
    } catch (error) {
      productionLogger.error('Role assignment failed', error, 'SecurityServiceCore');
      return false;
    }
  }

  // Optimized delegation methods with better error boundaries
  async validateUserInput(input: string, context: string = 'general') {
    return this.validationService.validateUserInput(input, context);
  }

  async validateFormData(formData: Record<string, any>, context: string) {
    return this.validationService.validateFormData(formData, context);
  }

  async validateRepositoryAccess(repositoryId: string, action: 'read' | 'write' | 'delete', userId?: string) {
    return this.authenticationService.validateRepositoryAccess(repositoryId, action, userId);
  }

  async makeSecureApiRequest<T>(url: string, options?: RequestInit): Promise<T> {
    return this.apiSecurityService.makeSecureApiRequest<T>(url, options);
  }

  async makeSecureGitHubRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.apiSecurityService.makeSecureGitHubRequest<T>(endpoint, options);
  }

  async getSecurityDashboard(userId: string) {
    return this.monitoringService.getSecurityDashboard(userId);
  }

  async getUserSecurityStatus(currentUserId: string, targetUserId: string) {
    return this.monitoringService.getUserSecurityStatus(currentUserId, targetUserId);
  }

  async getEnhancedSecuritySummary() {
    return this.monitoringService.getEnhancedSecuritySummary();
  }

  async logSecurityEvent(event: any) {
    return this.monitoringService.logSecurityEvent(event);
  }

  async checkRateLimit(identifier: string, actionType: string) {
    return this.monitoringService.checkRateLimit(identifier, actionType);
  }

  sanitizeInput(input: string, context: string = 'general'): string {
    return this.validationService.sanitizeInput(input, context);
  }

  async logAuthEvent(eventType: string, success: boolean, details?: Record<string, any>) {
    return this.monitoringService.logAuthEvent(eventType, success, details);
  }

  async checkPermission(userId: string, permission: string): Promise<boolean> {
    return this.authenticationService.checkPermission(userId, permission);
  }

  async requirePermission(userId: string, permission: string): Promise<void> {
    return this.authenticationService.requirePermission(userId, permission);
  }

  // Public property for backward compatibility
  get consolidatedAuthenticationSecurity() {
    return this.authenticationService.consolidatedAuthenticationSecurity;
  }

  // Health check method
  getHealthStatus() {
    return {
      initialized: this.isInitialized,
      services: {
        validation: !!this.validationService,
        authentication: !!this.authenticationService,
        monitoring: !!this.monitoringService,
        apiSecurity: !!this.apiSecurityService
      }
    };
  }
}
