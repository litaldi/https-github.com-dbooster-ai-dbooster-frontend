
import { supabase } from '@/integrations/supabase/client';
import { productionLogger } from '@/utils/productionLogger';
import { enhancedRoleManager, AppRole } from './enhancedRoleManager';

interface RoleAssignmentRequest {
  targetUserId: string;
  newRole: AppRole;
  reason?: string;
  requiresApproval?: boolean;
}

interface RoleAssignmentResult {
  success: boolean;
  message?: string;
  error?: string;
  requiresApproval?: boolean;
  requestId?: string;
}

class EnhancedPrivilegeControl {
  private static instance: EnhancedPrivilegeControl;

  static getInstance(): EnhancedPrivilegeControl {
    if (!EnhancedPrivilegeControl.instance) {
      EnhancedPrivilegeControl.instance = new EnhancedPrivilegeControl();
    }
    return EnhancedPrivilegeControl.instance;
  }

  async secureRoleAssignment(request: RoleAssignmentRequest): Promise<RoleAssignmentResult> {
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) {
        return {
          success: false,
          error: 'Authentication required for role assignment'
        };
      }

      // Get user's IP and user agent for security logging
      const ipAddress = await this.getUserIP();
      const userAgent = navigator.userAgent;

      const { data, error } = await supabase.rpc('secure_role_assignment_with_monitoring', {
        target_user_id: request.targetUserId,
        new_role: request.newRole,
        change_reason: request.reason,
        requester_ip: ipAddress,
        user_agent_header: userAgent
      });

      if (error) {
        productionLogger.error('Role assignment failed', error, 'EnhancedPrivilegeControl');
        return {
          success: false,
          error: 'Role assignment failed due to system error'
        };
      }

      // Type-safe handling of database response
      const result = data as unknown as RoleAssignmentResult;
      
      if (result && typeof result === 'object' && 'success' in result) {
        if (result.success) {
          productionLogger.secureInfo('Role assignment completed', {
            target_user: request.targetUserId.substring(0, 8),
            new_role: request.newRole,
            assigned_by: currentUser.user.id.substring(0, 8)
          });
        }
        return result;
      }

      return {
        success: false,
        error: 'Invalid response from role assignment function'
      };
    } catch (error) {
      productionLogger.error('Error during role assignment', error, 'EnhancedPrivilegeControl');
      return {
        success: false,
        error: 'Unexpected error during role assignment'
      };
    }
  }

  async detectUnauthorizedPrivilegeAttempts(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('privilege_escalation_attempts')
        .select('*')
        .eq('user_id', userId)
        .eq('blocked', true)
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (error) {
        productionLogger.error('Failed to check privilege attempts', error, 'EnhancedPrivilegeControl');
        return false;
      }

      const suspiciousAttempts = data.length;
      if (suspiciousAttempts > 0) {
        productionLogger.warn('Suspicious privilege escalation attempts detected', {
          user_id: userId.substring(0, 8),
          attempt_count: suspiciousAttempts
        });
        return true;
      }

      return false;
    } catch (error) {
      productionLogger.error('Error checking privilege attempts', error, 'EnhancedPrivilegeControl');
      return false;
    }
  }

  async getSecurityStatus(userId: string): Promise<{
    isSecure: boolean;
    issues: string[];
    recommendations: string[];
  }> {
    const issues: string[] = [];
    const recommendations: string[] = [];

    try {
      // Check for recent privilege escalation attempts
      const hasAttempts = await this.detectUnauthorizedPrivilegeAttempts(userId);
      if (hasAttempts) {
        issues.push('Recent unauthorized privilege escalation attempts detected');
        recommendations.push('Review account security and consider password change');
      }

      // Check user's current roles
      const userRoles = await enhancedRoleManager.getUserRoles(userId);
      if (userRoles.some(role => role.role === 'admin')) {
        recommendations.push('Admin account detected - ensure 2FA is enabled');
      }

      // Check session security
      const { data: sessions } = await supabase
        .from('enhanced_session_tracking')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'suspicious');

      if (sessions && sessions.length > 0) {
        issues.push('Suspicious session activity detected');
        recommendations.push('Review recent login activity and secure your account');
      }

      return {
        isSecure: issues.length === 0,
        issues,
        recommendations
      };
    } catch (error) {
      productionLogger.error('Error getting security status', error, 'EnhancedPrivilegeControl');
      return {
        isSecure: false,
        issues: ['Unable to verify security status'],
        recommendations: ['Contact system administrator']
      };
    }
  }

  private async getUserIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip || 'unknown';
    } catch {
      return 'unknown';
    }
  }
}

export const enhancedPrivilegeControl = EnhancedPrivilegeControl.getInstance();
