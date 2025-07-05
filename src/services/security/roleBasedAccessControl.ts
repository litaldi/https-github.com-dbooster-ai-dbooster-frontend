
export type UserRole = 'admin' | 'moderator' | 'user';

export interface RolePermissions {
  canViewAuditLogs: boolean;
  canManageUsers: boolean;
  canAccessAdminDashboard: boolean;
  canModifySystemSettings: boolean;
  canViewSecurityMetrics: boolean;
}

export class RoleBasedAccessControl {
  private static instance: RoleBasedAccessControl;

  static getInstance(): RoleBasedAccessControl {
    if (!RoleBasedAccessControl.instance) {
      RoleBasedAccessControl.instance = new RoleBasedAccessControl();
    }
    return RoleBasedAccessControl.instance;
  }

  private readonly rolePermissions: Record<UserRole, RolePermissions> = {
    admin: {
      canViewAuditLogs: true,
      canManageUsers: true,
      canAccessAdminDashboard: true,
      canModifySystemSettings: true,
      canViewSecurityMetrics: true
    },
    moderator: {
      canViewAuditLogs: true,
      canManageUsers: false,
      canAccessAdminDashboard: true,
      canModifySystemSettings: false,
      canViewSecurityMetrics: true
    },
    user: {
      canViewAuditLogs: false,
      canManageUsers: false,
      canAccessAdminDashboard: false,
      canModifySystemSettings: false,
      canViewSecurityMetrics: false
    }
  };

  // Get user role - in a real implementation, this would come from the database
  async getUserRole(userId: string): Promise<UserRole> {
    // For now, return 'user' by default
    // In production, this should query the user_roles table
    return 'user';
  }

  async hasPermission(userId: string, permission: keyof RolePermissions): Promise<boolean> {
    try {
      const userRole = await this.getUserRole(userId);
      const permissions = this.rolePermissions[userRole];
      return permissions[permission] || false;
    } catch (error) {
      // Fail securely - deny access on error
      console.error('Error checking permissions:', error);
      return false;
    }
  }

  async canAccessResource(userId: string, resource: string): Promise<boolean> {
    const resourcePermissionMap: Record<string, keyof RolePermissions> = {
      'security-audit-logs': 'canViewAuditLogs',
      'admin-dashboard': 'canAccessAdminDashboard',
      'user-management': 'canManageUsers',
      'system-settings': 'canModifySystemSettings',
      'security-metrics': 'canViewSecurityMetrics'
    };

    const permission = resourcePermissionMap[resource];
    if (!permission) {
      return false;
    }

    return this.hasPermission(userId, permission);
  }

  async requirePermission(userId: string, permission: keyof RolePermissions): Promise<void> {
    const hasAccess = await this.hasPermission(userId, permission);
    if (!hasAccess) {
      throw new Error(`Access denied: Insufficient permissions for ${permission}`);
    }
  }

  async requireResourceAccess(userId: string, resource: string): Promise<void> {
    const hasAccess = await this.canAccessResource(userId, resource);
    if (!hasAccess) {
      throw new Error(`Access denied: Insufficient permissions for resource ${resource}`);
    }
  }
}

export const rbac = RoleBasedAccessControl.getInstance();
