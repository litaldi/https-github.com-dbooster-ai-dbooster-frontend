
import { supabase } from '@/integrations/supabase/client';
import { productionLogger } from '@/utils/productionLogger';

export type AppRole = 'admin' | 'moderator' | 'user';

export interface UserRole {
  id: string;
  user_id: string;
  role: AppRole;
  assigned_at: string;
  assigned_by?: string;
}

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

class EnhancedRoleManager {
  private static instance: EnhancedRoleManager;
  private rolePermissions: Record<AppRole, RolePermissions> = {
    admin: {
      canViewReports: true,
      canEditReports: true,
      canDeleteReports: true,
      canManageUsers: true,
      canViewSecurityMetrics: true,
      canManageSecuritySettings: true,
      canViewAuditLogs: true,
      canExportData: true
    },
    moderator: {
      canViewReports: true,
      canEditReports: true,
      canDeleteReports: true,
      canManageUsers: false,
      canViewSecurityMetrics: true,
      canManageSecuritySettings: false,
      canViewAuditLogs: true,
      canExportData: true
    },
    user: {
      canViewReports: true,
      canEditReports: false,
      canDeleteReports: false,
      canManageUsers: false,
      canViewSecurityMetrics: false,
      canManageSecuritySettings: false,
      canViewAuditLogs: false,
      canExportData: false
    }
  };

  static getInstance(): EnhancedRoleManager {
    if (!EnhancedRoleManager.instance) {
      EnhancedRoleManager.instance = new EnhancedRoleManager();
    }
    return EnhancedRoleManager.instance;
  }

  async getCurrentUserRole(): Promise<AppRole> {
    try {
      const { data, error } = await supabase.rpc('get_current_user_role');
      if (error) {
        productionLogger.error('Failed to get current user role', error, 'EnhancedRoleManager');
        return 'user';
      }
      return (data as AppRole) || 'user';
    } catch (error) {
      productionLogger.error('Error getting current user role', error, 'EnhancedRoleManager');
      return 'user';
    }
  }

  async hasRole(userId: string, role: AppRole): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('has_role', {
        _user_id: userId,
        _role: role
      });
      if (error) {
        productionLogger.error('Failed to check role', error, 'EnhancedRoleManager');
        return false;
      }
      return data || false;
    } catch (error) {
      productionLogger.error('Error checking role', error, 'EnhancedRoleManager');
      return false;
    }
  }

  async hasPermission(userId: string, permission: keyof RolePermissions): Promise<boolean> {
    try {
      const userRoles = await this.getUserRoles(userId);
      
      for (const userRole of userRoles) {
        const rolePerms = this.rolePermissions[userRole.role];
        if (rolePerms && rolePerms[permission]) {
          return true;
        }
      }
      
      return false;
    } catch (error) {
      productionLogger.error('Error checking permission', error, 'EnhancedRoleManager');
      return false;
    }
  }

  async requirePermission(userId: string, permission: keyof RolePermissions): Promise<void> {
    const hasAccess = await this.hasPermission(userId, permission);
    if (!hasAccess) {
      throw new Error(`Access denied: Missing permission '${permission}'`);
    }
  }

  async getUserRoles(userId: string): Promise<UserRole[]> {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        productionLogger.error('Failed to get user roles', error, 'EnhancedRoleManager');
        return [];
      }

      return data || [];
    } catch (error) {
      productionLogger.error('Error getting user roles', error, 'EnhancedRoleManager');
      return [];
    }
  }

  async assignRole(userId: string, role: AppRole, assignedBy?: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role,
          assigned_by: assignedBy
        });

      if (error) {
        productionLogger.error('Failed to assign role', error, 'EnhancedRoleManager');
        return false;
      }

      productionLogger.info('Role assigned successfully', {
        userId,
        role,
        assignedBy
      }, 'EnhancedRoleManager');

      return true;
    } catch (error) {
      productionLogger.error('Error assigning role', error, 'EnhancedRoleManager');
      return false;
    }
  }

  async removeRole(userId: string, role: AppRole): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);

      if (error) {
        productionLogger.error('Failed to remove role', error, 'EnhancedRoleManager');
        return false;
      }

      productionLogger.info('Role removed successfully', {
        userId,
        role
      }, 'EnhancedRoleManager');

      return true;
    } catch (error) {
      productionLogger.error('Error removing role', error, 'EnhancedRoleManager');
      return false;
    }
  }

  getRolePermissions(role: AppRole): RolePermissions {
    return this.rolePermissions[role];
  }

  getAllRoles(): AppRole[] {
    return ['admin', 'moderator', 'user'];
  }
}

export const enhancedRoleManager = EnhancedRoleManager.getInstance();
