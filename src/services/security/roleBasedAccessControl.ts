
export interface RolePermissions {
  canViewReports: boolean;
  canEditReports: boolean;
  canDeleteReports: boolean;
  canManageUsers: boolean;
  canViewSecurityMetrics: boolean;
  canManageSecuritySettings: boolean;
  canViewAuditLogs: boolean;
  canExportData: boolean;
}

export interface UserRole {
  id: string;
  name: string;
  permissions: RolePermissions;
  description?: string;
}

export class RoleBasedAccessControl {
  private static instance: RoleBasedAccessControl;
  private roles: Map<string, UserRole> = new Map();
  private userRoles: Map<string, string[]> = new Map();

  static getInstance(): RoleBasedAccessControl {
    if (!RoleBasedAccessControl.instance) {
      RoleBasedAccessControl.instance = new RoleBasedAccessControl();
      this.initializeDefaultRoles();
    }
    return RoleBasedAccessControl.instance;
  }

  private static initializeDefaultRoles(): void {
    const instance = RoleBasedAccessControl.instance;
    
    // Admin role
    instance.roles.set('admin', {
      id: 'admin',
      name: 'Administrator',
      permissions: {
        canViewReports: true,
        canEditReports: true,
        canDeleteReports: true,
        canManageUsers: true,
        canViewSecurityMetrics: true,
        canManageSecuritySettings: true,
        canViewAuditLogs: true,
        canExportData: true
      },
      description: 'Full system access'
    });

    // User role
    instance.roles.set('user', {
      id: 'user',
      name: 'User',
      permissions: {
        canViewReports: true,
        canEditReports: false,
        canDeleteReports: false,
        canManageUsers: false,
        canViewSecurityMetrics: false,
        canManageSecuritySettings: false,
        canViewAuditLogs: false,
        canExportData: false
      },
      description: 'Basic user access'
    });

    // Moderator role
    instance.roles.set('moderator', {
      id: 'moderator',
      name: 'Moderator',
      permissions: {
        canViewReports: true,
        canEditReports: true,
        canDeleteReports: true,
        canManageUsers: false,
        canViewSecurityMetrics: true,
        canManageSecuritySettings: false,
        canViewAuditLogs: true,
        canExportData: true
      },
      description: 'Content moderation access'
    });
  }

  async hasPermission(userId: string, permission: keyof RolePermissions): Promise<boolean> {
    const userRoleIds = this.userRoles.get(userId) || ['user'];
    
    for (const roleId of userRoleIds) {
      const role = this.roles.get(roleId);
      if (role && role.permissions[permission]) {
        return true;
      }
    }
    
    return false;
  }

  async requirePermission(userId: string, permission: keyof RolePermissions): Promise<void> {
    const hasAccess = await this.hasPermission(userId, permission);
    if (!hasAccess) {
      throw new Error(`Access denied: Missing permission '${permission}'`);
    }
  }

  assignRole(userId: string, roleId: string): void {
    if (!this.roles.has(roleId)) {
      throw new Error(`Role '${roleId}' does not exist`);
    }
    
    const currentRoles = this.userRoles.get(userId) || [];
    if (!currentRoles.includes(roleId)) {
      currentRoles.push(roleId);
      this.userRoles.set(userId, currentRoles);
    }
  }

  removeRole(userId: string, roleId: string): void {
    const currentRoles = this.userRoles.get(userId) || [];
    const updatedRoles = currentRoles.filter(id => id !== roleId);
    
    if (updatedRoles.length === 0) {
      // Always ensure user has at least the 'user' role
      updatedRoles.push('user');
    }
    
    this.userRoles.set(userId, updatedRoles);
  }

  getUserRoles(userId: string): UserRole[] {
    const roleIds = this.userRoles.get(userId) || ['user'];
    return roleIds.map(id => this.roles.get(id)).filter(Boolean) as UserRole[];
  }

  getAllRoles(): UserRole[] {
    return Array.from(this.roles.values());
  }

  createRole(role: UserRole): void {
    this.roles.set(role.id, role);
  }

  updateRole(roleId: string, updates: Partial<UserRole>): void {
    const existingRole = this.roles.get(roleId);
    if (!existingRole) {
      throw new Error(`Role '${roleId}' does not exist`);
    }
    
    this.roles.set(roleId, { ...existingRole, ...updates });
  }

  deleteRole(roleId: string): void {
    if (roleId === 'user' || roleId === 'admin') {
      throw new Error('Cannot delete system roles');
    }
    
    this.roles.delete(roleId);
    
    // Remove this role from all users
    for (const [userId, roles] of this.userRoles.entries()) {
      const updatedRoles = roles.filter(id => id !== roleId);
      if (updatedRoles.length === 0) {
        updatedRoles.push('user');
      }
      this.userRoles.set(userId, updatedRoles);
    }
  }
}

export const rbac = RoleBasedAccessControl.getInstance();
