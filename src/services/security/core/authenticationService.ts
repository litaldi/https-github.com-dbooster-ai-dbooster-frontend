
import { consolidatedAuthenticationSecurity } from '../consolidatedAuthenticationSecurity';
import { enhancedRoleManager } from '../enhancedRoleManager';
import { ValidationService } from './validationService';

export class AuthenticationService {
  private static instance: AuthenticationService;
  private validationService: ValidationService;
  public consolidatedAuthenticationSecurity = consolidatedAuthenticationSecurity;

  private constructor() {
    this.validationService = ValidationService.getInstance();
  }

  static getInstance(): AuthenticationService {
    if (!AuthenticationService.instance) {
      AuthenticationService.instance = new AuthenticationService();
    }
    return AuthenticationService.instance;
  }

  async validateRepositoryAccess(
    repositoryId: string, 
    action: 'read' | 'write' | 'delete',
    userId?: string
  ): Promise<{ allowed: boolean; reason?: string }> {
    // Server-side validation for repository ID
    const repoValidation = await this.validationService.validateUserInput(repositoryId, 'repository_id');
    if (!repoValidation.valid) {
      return { allowed: false, reason: 'Invalid repository identifier' };
    }

    // Check if user has required permissions for the action using enhanced role manager
    if (userId && action === 'delete') {
      const canManage = await enhancedRoleManager.hasPermission(userId, 'canManageUsers');
      if (!canManage) {
        return { allowed: false, reason: 'Insufficient permissions for repository deletion' };
      }
    }
    
    return { allowed: true };
  }

  async checkPermission(userId: string, permission: string): Promise<boolean> {
    return enhancedRoleManager.hasPermission(userId, permission as keyof import('../enhancedRoleManager').RolePermissions);
  }

  async requirePermission(userId: string, permission: string): Promise<void> {
    return enhancedRoleManager.requirePermission(userId, permission as keyof import('../enhancedRoleManager').RolePermissions);
  }
}
