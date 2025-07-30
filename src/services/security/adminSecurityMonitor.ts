import { supabase } from '@/integrations/supabase/client';
import { productionLogger } from '@/utils/productionLogger';

interface AdminActivityAlert {
  id: string;
  type: 'bootstrap_token_generated' | 'admin_role_assigned' | 'privilege_escalation' | 'suspicious_admin_activity';
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  userId: string;
  metadata: Record<string, any>;
  timestamp: Date;
  acknowledged: boolean;
}

export class AdminSecurityMonitor {
  private static instance: AdminSecurityMonitor;
  private alertListeners: ((alert: AdminActivityAlert) => void)[] = [];

  static getInstance(): AdminSecurityMonitor {
    if (!AdminSecurityMonitor.instance) {
      AdminSecurityMonitor.instance = new AdminSecurityMonitor();
    }
    return AdminSecurityMonitor.instance;
  }

  async initializeMonitoring(): Promise<void> {
    try {
      // Set up real-time listeners for admin activities
      this.setupAdminRoleChangeMonitoring();
      this.setupBootstrapTokenMonitoring();
      this.setupPrivilegeEscalationMonitoring();
      
      productionLogger.info('Admin security monitoring initialized', {}, 'AdminSecurityMonitor');
    } catch (error) {
      productionLogger.error('Failed to initialize admin monitoring', error, 'AdminSecurityMonitor');
    }
  }

  private setupAdminRoleChangeMonitoring(): void {
    // Listen for admin role assignments
    const roleChangeSubscription = supabase
      .channel('admin_role_changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'role_change_audit',
        filter: 'new_role=eq.admin'
      }, (payload) => {
        this.handleAdminRoleAssignment(payload.new);
      })
      .subscribe();

    // Monitor role assignment requests
    const roleRequestSubscription = supabase
      .channel('admin_role_requests')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'role_assignment_requests',
        filter: 'requested_role=eq.admin'
      }, (payload) => {
        this.handleAdminRoleRequest(payload.new);
      })
      .subscribe();
  }

  private setupBootstrapTokenMonitoring(): void {
    const bootstrapSubscription = supabase
      .channel('bootstrap_monitoring')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'admin_bootstrap_validation'
      }, (payload) => {
        this.handleBootstrapTokenGeneration(payload.new);
      })
      .subscribe();
  }

  private setupPrivilegeEscalationMonitoring(): void {
    const escalationSubscription = supabase
      .channel('privilege_escalation')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'privilege_escalation_attempts'
      }, (payload) => {
        this.handlePrivilegeEscalationAttempt(payload.new);
      })
      .subscribe();
  }

  private async handleAdminRoleAssignment(roleChange: any): Promise<void> {
    const alert: AdminActivityAlert = {
      id: crypto.randomUUID(),
      type: 'admin_role_assigned',
      severity: 'high',
      message: `Admin role assigned to user ${roleChange.user_id} by ${roleChange.changed_by}`,
      userId: roleChange.changed_by || 'system',
      metadata: {
        targetUserId: roleChange.user_id,
        reason: roleChange.reason,
        ipAddress: roleChange.ip_address,
        timestamp: roleChange.created_at
      },
      timestamp: new Date(),
      acknowledged: false
    };

    await this.processAlert(alert);
  }

  private async handleAdminRoleRequest(request: any): Promise<void> {
    const alert: AdminActivityAlert = {
      id: crypto.randomUUID(),
      type: 'admin_role_assigned',
      severity: 'medium',
      message: `Admin role requested for user ${request.target_user_id} by ${request.requested_by}`,
      userId: request.requested_by,
      metadata: {
        requestId: request.id,
        targetUserId: request.target_user_id,
        reason: request.reason,
        requestIp: request.request_ip
      },
      timestamp: new Date(),
      acknowledged: false
    };

    await this.processAlert(alert);
  }

  private async handleBootstrapTokenGeneration(bootstrap: any): Promise<void> {
    const alert: AdminActivityAlert = {
      id: crypto.randomUUID(),
      type: 'bootstrap_token_generated',
      severity: 'critical',
      message: 'Admin bootstrap token generated - System initialization detected',
      userId: 'system',
      metadata: {
        bootstrapId: bootstrap.id,
        createdByIp: bootstrap.created_by_ip,
        expiresAt: bootstrap.expires_at,
        isActive: bootstrap.is_active
      },
      timestamp: new Date(),
      acknowledged: false
    };

    await this.processAlert(alert);
  }

  private async handlePrivilegeEscalationAttempt(attempt: any): Promise<void> {
    const severity = attempt.attempted_role === 'admin' ? 'critical' : 'high';
    
    const alert: AdminActivityAlert = {
      id: crypto.randomUUID(),
      type: 'privilege_escalation',
      severity,
      message: `Privilege escalation attempt: ${attempt.method} to ${attempt.attempted_role}`,
      userId: attempt.user_id || 'unknown',
      metadata: {
        attemptedRole: attempt.attempted_role,
        method: attempt.method,
        blocked: attempt.blocked,
        ipAddress: attempt.ip_address,
        userAgent: attempt.user_agent
      },
      timestamp: new Date(),
      acknowledged: false
    };

    await this.processAlert(alert);
  }

  private async processAlert(alert: AdminActivityAlert): Promise<void> {
    try {
      // Log to database
      await supabase.from('security_events_enhanced').insert({
        event_type: alert.type,
        severity: alert.severity,
        user_id: alert.userId,
        event_data: {
          message: alert.message,
          metadata: alert.metadata
        },
        threat_score: this.calculateThreatScore(alert),
        auto_blocked: alert.severity === 'critical'
      });

      // Notify listeners
      this.alertListeners.forEach(listener => {
        try {
          listener(alert);
        } catch (error) {
          productionLogger.error('Alert listener failed', error, 'AdminSecurityMonitor');
        }
      });

      // Auto-escalate critical alerts
      if (alert.severity === 'critical') {
        await this.escalateCriticalAlert(alert);
      }

      productionLogger.warn('Admin security alert generated', alert, 'AdminSecurityMonitor');
    } catch (error) {
      productionLogger.error('Failed to process admin security alert', error, 'AdminSecurityMonitor');
    }
  }

  private calculateThreatScore(alert: AdminActivityAlert): number {
    const baseSeverityScores = {
      critical: 90,
      high: 70,
      medium: 40,
      low: 20
    };

    let score = baseSeverityScores[alert.severity];

    // Increase score for specific alert types
    if (alert.type === 'bootstrap_token_generated') score += 10;
    if (alert.type === 'privilege_escalation') score += 15;
    if (alert.metadata.blocked === false) score += 20; // Unblocked escalation is worse

    return Math.min(score, 100);
  }

  private async escalateCriticalAlert(alert: AdminActivityAlert): Promise<void> {
    try {
      // Create high-priority security event
      await supabase.from('comprehensive_security_log').insert({
        user_id: alert.userId,
        event_type: 'critical_admin_alert',
        event_category: 'security_violation',
        severity: 'critical',
        event_data: {
          alertId: alert.id,
          alertType: alert.type,
          alertMessage: alert.message,
          escalatedAt: new Date().toISOString(),
          requiresImmedateAction: true
        },
        risk_score: 95,
        auto_blocked: true
      });

      // If it's a privilege escalation, trigger emergency protocols
      if (alert.type === 'privilege_escalation' && !alert.metadata.blocked) {
        const { unifiedSecurityService } = await import('./unified/UnifiedSecurityService');
        await unifiedSecurityService.emergencyLockdown(
          `Critical admin security alert: ${alert.message}`
        );
      }
    } catch (error) {
      productionLogger.error('Failed to escalate critical alert', error, 'AdminSecurityMonitor');
    }
  }

  // Public methods for integration
  public onAlert(listener: (alert: AdminActivityAlert) => void): () => void {
    this.alertListeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.alertListeners.indexOf(listener);
      if (index > -1) {
        this.alertListeners.splice(index, 1);
      }
    };
  }

  public async getRecentAlerts(limit: number = 50): Promise<AdminActivityAlert[]> {
    try {
      const { data, error } = await supabase
        .from('security_events_enhanced')
        .select('*')
        .in('event_type', [
          'bootstrap_token_generated',
          'admin_role_assigned', 
          'privilege_escalation',
          'suspicious_admin_activity'
        ])
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []).map(event => ({
        id: event.id,
        type: event.event_type as AdminActivityAlert['type'],
        severity: event.severity as AdminActivityAlert['severity'],
        message: (event.event_data as any)?.message || 'No message',
        userId: event.user_id || 'unknown',
        metadata: (event.event_data as any)?.metadata || {},
        timestamp: new Date(event.created_at),
        acknowledged: false // Would need additional field to track this
      }));
    } catch (error) {
      productionLogger.error('Failed to fetch recent alerts', error, 'AdminSecurityMonitor');
      return [];
    }
  }

  public async acknowledgeAlert(alertId: string, userId: string): Promise<boolean> {
    try {
      // In a real implementation, you'd update an acknowledgment table
      // For now, we'll log the acknowledgment
      await supabase.from('comprehensive_security_log').insert({
        user_id: userId,
        event_type: 'alert_acknowledged',
        event_category: 'admin_action',
        severity: 'info',
        event_data: {
          acknowledgedAlertId: alertId,
          acknowledgedAt: new Date().toISOString()
        }
      });

      return true;
    } catch (error) {
      productionLogger.error('Failed to acknowledge alert', error, 'AdminSecurityMonitor');
      return false;
    }
  }
}

export const adminSecurityMonitor = AdminSecurityMonitor.getInstance();