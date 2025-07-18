
import { supabase } from '@/integrations/supabase/client';
import { productionLogger } from '@/utils/productionLogger';

export interface PrivilegeEscalationAttempt {
  id: string;
  user_id: string;
  attempted_role: 'admin' | 'moderator' | 'user';
  method: string;
  blocked: boolean;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

export interface SecurityAlert {
  id: string;
  type: 'privilege_escalation' | 'suspicious_activity' | 'security_violation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  user_id?: string;
  metadata: Record<string, any>;
  created_at: string;
}

class SecurityMonitoringService {
  private static instance: SecurityMonitoringService;

  static getInstance(): SecurityMonitoringService {
    if (!SecurityMonitoringService.instance) {
      SecurityMonitoringService.instance = new SecurityMonitoringService();
    }
    return SecurityMonitoringService.instance;
  }

  async logPrivilegeEscalationAttempt(
    userId: string,
    attemptedRole: 'admin' | 'moderator' | 'user',
    method: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('privilege_escalation_attempts')
        .insert({
          user_id: userId,
          attempted_role: attemptedRole,
          method,
          blocked: true,
          ip_address: ipAddress,
          user_agent: userAgent
        });

      if (error) {
        throw error;
      }

      productionLogger.secureWarn('Privilege escalation attempt blocked', {
        userId,
        attemptedRole,
        method,
        ipAddress
      });
    } catch (error) {
      productionLogger.error('Failed to log privilege escalation attempt', error, 'SecurityMonitoringService');
    }
  }

  async getPrivilegeEscalationAttempts(limit: number = 50): Promise<PrivilegeEscalationAttempt[]> {
    try {
      const { data, error } = await supabase
        .from('privilege_escalation_attempts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      // Transform the data to match our interface
      return (data || []).map(item => ({
        id: item.id,
        user_id: item.user_id,
        attempted_role: item.attempted_role as 'admin' | 'moderator' | 'user',
        method: item.method || '',
        blocked: item.blocked || true,
        ip_address: item.ip_address ? String(item.ip_address) : undefined,
        user_agent: item.user_agent || undefined,
        created_at: item.created_at
      }));
    } catch (error) {
      productionLogger.error('Failed to fetch privilege escalation attempts', error, 'SecurityMonitoringService');
      return [];
    }
  }

  async checkAdminBootstrapNeeded(): Promise<boolean> {
    try {
      const { data, error } = await supabase.rpc('is_admin_bootstrap_needed');
      
      if (error) {
        throw error;
      }

      return data || false;
    } catch (error) {
      productionLogger.error('Failed to check admin bootstrap status', error, 'SecurityMonitoringService');
      return false;
    }
  }

  async secureRoleAssignment(
    targetUserId: string,
    newRole: 'admin' | 'moderator' | 'user',
    reason?: string
  ): Promise<{ success: boolean; message: string; requiresApproval?: boolean }> {
    try {
      const ipAddress = await this.getUserIP();
      const userAgent = navigator.userAgent;

      const { data, error } = await supabase.rpc('secure_role_assignment_with_monitoring', {
        target_user_id: targetUserId,
        new_role: newRole,
        change_reason: reason,
        requester_ip: ipAddress,
        user_agent_header: userAgent
      });

      if (error) {
        throw error;
      }

      // Handle the JSON response from the database function
      if (typeof data === 'object' && data !== null) {
        return data as { success: boolean; message: string; requiresApproval?: boolean };
      }

      // Fallback for unexpected response format
      return {
        success: false,
        message: 'Unexpected response format from role assignment function'
      };
    } catch (error) {
      productionLogger.error('Secure role assignment failed', error, 'SecurityMonitoringService');
      
      // If it's an access denied error, it might be a privilege escalation attempt
      if (error.message?.includes('Access denied')) {
        const { data: user } = await supabase.auth.getUser();
        if (user.user) {
          await this.logPrivilegeEscalationAttempt(
            user.user.id,
            newRole,
            'unauthorized_role_assignment',
            await this.getUserIP(),
            navigator.userAgent
          );
        }
      }

      throw error;
    }
  }

  async getSecurityAlerts(limit: number = 20): Promise<SecurityAlert[]> {
    try {
      // Combine privilege escalation attempts and security events
      const [escalationAttempts, securityEvents] = await Promise.all([
        this.getPrivilegeEscalationAttempts(limit / 2),
        this.getSecurityEvents(limit / 2)
      ]);

      const alerts: SecurityAlert[] = [
        ...escalationAttempts.map(attempt => ({
          id: attempt.id,
          type: 'privilege_escalation' as const,
          severity: 'high' as const,
          message: `Privilege escalation attempt: User tried to gain ${attempt.attempted_role} role`,
          user_id: attempt.user_id,
          metadata: {
            attempted_role: attempt.attempted_role,
            method: attempt.method,
            ip_address: attempt.ip_address
          },
          created_at: attempt.created_at
        })),
        ...securityEvents.map(event => ({
          id: event.id,
          type: 'security_violation' as const,
          severity: this.calculateEventSeverity(event.event_type),
          message: `Security event: ${event.event_type}`,
          user_id: event.user_id,
          metadata: event.event_data || {},
          created_at: event.created_at
        }))
      ];

      return alerts.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ).slice(0, limit);
    } catch (error) {
      productionLogger.error('Failed to fetch security alerts', error, 'SecurityMonitoringService');
      return [];
    }
  }

  private async getSecurityEvents(limit: number): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('security_events_enhanced')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      productionLogger.error('Failed to fetch security events', error, 'SecurityMonitoringService');
      return [];
    }
  }

  private calculateEventSeverity(eventType: string): 'low' | 'medium' | 'high' | 'critical' {
    if (eventType.includes('critical') || eventType.includes('attack')) {
      return 'critical';
    }
    if (eventType.includes('suspicious') || eventType.includes('blocked')) {
      return 'high';
    }
    if (eventType.includes('warning') || eventType.includes('failed')) {
      return 'medium';
    }
    return 'low';
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

  async getSecurityMetrics(): Promise<{
    totalEscalationAttempts: number;
    recentEscalationAttempts: number;
    securityScore: number;
    criticalAlerts: number;
  }> {
    try {
      const [escalationAttempts, securityEvents] = await Promise.all([
        this.getPrivilegeEscalationAttempts(100),
        this.getSecurityEvents(100)
      ]);

      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const recentEscalationAttempts = escalationAttempts.filter(
        attempt => new Date(attempt.created_at) > oneDayAgo
      ).length;

      const criticalEvents = securityEvents.filter(
        event => this.calculateEventSeverity(event.event_type) === 'critical'
      ).length;

      // Calculate security score (0-100, higher is better)
      let securityScore = 100;
      securityScore -= Math.min(recentEscalationAttempts * 10, 50); // -10 per recent attempt, max -50
      securityScore -= Math.min(criticalEvents * 20, 40); // -20 per critical event, max -40
      securityScore = Math.max(securityScore, 0);

      return {
        totalEscalationAttempts: escalationAttempts.length,
        recentEscalationAttempts,
        securityScore,
        criticalAlerts: criticalEvents
      };
    } catch (error) {
      productionLogger.error('Failed to calculate security metrics', error, 'SecurityMonitoringService');
      return {
        totalEscalationAttempts: 0,
        recentEscalationAttempts: 0,
        securityScore: 100,
        criticalAlerts: 0
      };
    }
  }
}

export const securityMonitoringService = SecurityMonitoringService.getInstance();
