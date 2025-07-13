
export interface RolePermissions {
  canRead: boolean;
  canWrite: boolean;
  canDelete: boolean;
  canManageUsers: boolean;
  canAccessAdmin: boolean;
  canViewReports: boolean;
  canExportData: boolean;
}

export interface UserRole {
  id: string;
  name: string;
  permissions: RolePermissions;
  level: number;
}

export class RoleBasedAccessControl {
  private static instance: RoleBasedAccessControl;
  private userRoles: Map<string, UserRole> = new Map();

  // Default roles
  private defaultRoles: Record<string, UserRole> = {
    admin: {
      id: 'admin',
      name: 'Administrator',
      level: 100,
      permissions: {
        canRead: true,
        canWrite: true,
        canDelete: true,
        canManageUsers: true,
        canAccessAdmin: true,
        canViewReports: true,
        canExportData: true
      }
    },
    user: {
      id: 'user',
      name: 'User',
      level: 10,
      permissions: {
        canRead: true,
        canWrite: true,
        canDelete: false,
        canManageUsers: false,
        canAccessAdmin: false,
        canViewReports: false,
        canExportData: false
      }
    },
    viewer: {
      id: 'viewer',
      name: 'Viewer',
      level: 1,
      permissions: {
        canRead: true,
        canWrite: false,
        canDelete: false,
        canManageUsers: false,
        canAccessAdmin: false,
        canViewReports: false,
        canExportData: false
      }
    }
  };

  static getInstance(): RoleBasedAccessControl {
    if (!RoleBasedAccessControl.instance) {
      RoleBasedAccessControl.instance = new RoleBasedAccessControl();
    }
    return RoleBasedAccessControl.instance;
  }

  async hasPermission(userId: string, permission: keyof RolePermissions): Promise<boolean> {
    const userRole = this.getUserRole(userId);
    return userRole?.permissions[permission] || false;
  }

  async requirePermission(userId: string, permission: keyof RolePermissions): Promise<void> {
    const hasPermission = await this.hasPermission(userId, permission);
    if (!hasPermission) {
      throw new Error(`Access denied: Missing permission '${permission}'`);
    }
  }

  getUserRole(userId: string): UserRole | null {
    return this.userRoles.get(userId) || this.defaultRoles.user;
  }

  assignRole(userId: string, roleId: string): void {
    const role = this.defaultRoles[roleId];
    if (role) {
      this.userRoles.set(userId, role);
    }
  }

  getRolePermissions(roleId: string): RolePermissions | null {
    return this.defaultRoles[roleId]?.permissions || null;
  }

  canAccess(userId: string, requiredLevel: number): boolean {
    const userRole = this.getUserRole(userId);
    return (userRole?.level || 0) >= requiredLevel;
  }
}

export const rbac = RoleBasedAccessControl.getInstance();
