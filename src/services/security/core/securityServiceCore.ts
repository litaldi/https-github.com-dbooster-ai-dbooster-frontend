import { productionLogger } from '@/utils/productionLogger';
import { ValidationService } from './validationService';
import { AuthenticationService } from './authenticationService';
import { MonitoringService } from './monitoringService';
import { ApiSecurityService } from './apiSecurityService';
import { enhancedAuthenticationService } from './enhancedAuthenticationService';

export class SecurityServiceCore {
  private static instance: SecurityServiceCore;
  private validationService: ValidationService;
  private authenticationService: AuthenticationService;
  private monitoringService: MonitoringService;
  private apiSecurityService: ApiSecurityService;

  private constructor() {
    this.validationService = ValidationService.getInstance();
    this.authenticationService = AuthenticationService.getInstance();
    this.monitoringService = MonitoringService.getInstance();
    this.apiSecurityService = ApiSecurityService.getInstance();
  }

  static getInstance(): SecurityServiceCore {
    if (!SecurityServiceCore.instance) {
      SecurityServiceCore.instance = new SecurityServiceCore();
      this.initializeEnhancedSecurity();
    }
    return SecurityServiceCore.instance;
  }

  private static async initializeEnhancedSecurity(): Promise<void> {
    try {
      const { enhancedSecurityMonitor } = await import('../enhancedSecurityMonitor');
      await enhancedSecurityMonitor.startMonitoring();
      productionLogger.info('Enhanced security services initialized');
    } catch (error) {
      productionLogger.error('Failed to initialize enhanced security', error, 'SecurityService');
    }
  }

  // Enhanced session management
  async createSecureSession(userId: string, isDemo: boolean = false): Promise<string> {
    return enhancedAuthenticationService.createSecureSession(userId, isDemo);
  }

  async validateSession(sessionId: string): Promise<boolean> {
    return enhancedAuthenticationService.validateSession(sessionId);
  }

  async detectSuspiciousActivity(userId: string): Promise<boolean> {
    return enhancedAuthenticationService.detectSuspiciousActivity(userId);
  }

  async assignUserRole(targetUserId: string, newRole: string, reason?: string): Promise<boolean> {
    return enhancedAuthenticationService.assignUserRole(targetUserId, newRole, reason);
  }

  // Delegation methods
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
}
