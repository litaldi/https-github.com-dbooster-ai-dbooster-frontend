import { supabase } from '@/integrations/supabase/client';
import { productionLogger } from '@/utils/productionLogger';

export interface SecurityMetrics {
  totalSecurityEvents: number;
  criticalAlerts: number;
  suspiciousActivities: number;
  activeSessions: number;
  mfaEnabledUsers: number;
  privilegeEscalationAttempts: number;
  lastSecurityScan: Date;
  overallSecurityScore: number;
}

export interface SecurityAlert {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  userId?: string;
  timestamp: Date;
  status: 'active' | 'resolved' | 'acknowledged';
  metadata?: Record<string, any>;
}

export interface SecurityThreat {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedUsers: number;
  detectedAt: Date;
  mitigated: boolean;
  recommendedActions: string[];
}

export class EnhancedSecurityDashboard {
  private static instance: EnhancedSecurityDashboard;

  static getInstance(): EnhancedSecurityDashboard {
    if (!EnhancedSecurityDashboard.instance) {
      EnhancedSecurityDashboard.instance = new EnhancedSecurityDashboard();
    }
    return EnhancedSecurityDashboard.instance;
  }

  async getSecurityMetrics(): Promise<SecurityMetrics> {
    try {
      const [
        securityEvents,
        criticalEvents,
        suspiciousEvents,
        activeSessions,
        mfaUsers,
        escalationAttempts
      ] = await Promise.all([
        this.getTotalSecurityEvents(),
        this.getCriticalAlerts(),
        this.getSuspiciousActivities(),
        this.getActiveSessions(),
        this.getMFAEnabledUsers(),
        this.getPrivilegeEscalationAttempts()
      ]);

      const securityScore = this.calculateSecurityScore({
        totalEvents: securityEvents,
        criticalAlerts: criticalEvents,
        suspiciousActivities: suspiciousEvents,
        mfaEnabledUsers: mfaUsers,
        escalationAttempts: escalationAttempts
      });

      return {
        totalSecurityEvents: securityEvents,
        criticalAlerts: criticalEvents,
        suspiciousActivities: suspiciousEvents,
        activeSessions: activeSessions,
        mfaEnabledUsers: mfaUsers,
        privilegeEscalationAttempts: escalationAttempts,
        lastSecurityScan: new Date(),
        overallSecurityScore: securityScore
      };
    } catch (error) {
      productionLogger.error('Failed to get security metrics', error, 'EnhancedSecurityDashboard.getSecurityMetrics');
      throw error;
    }
  }

  async getSecurityAlerts(limit: number = 50): Promise<SecurityAlert[]> {
    try {
      const { data, error } = await supabase
        .from('comprehensive_security_log')
        .select('*')
        .in('severity', ['high', 'critical'])
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data.map(event => ({
        id: event.id,
        type: event.event_type,
        severity: event.severity as 'low' | 'medium' | 'high' | 'critical',
        message: this.formatAlertMessage(event),
        userId: event.user_id,
        timestamp: new Date(event.created_at),
        status: 'active' as const,
        metadata: event.event_data as Record<string, any> || {}
      }));
    } catch (error) {
      productionLogger.error('Failed to get security alerts', error, 'EnhancedSecurityDashboard.getSecurityAlerts');
      return [];
    }
  }

  async getSecurityThreats(): Promise<SecurityThreat[]> {
    try {
      const { data, error } = await supabase
        .from('comprehensive_security_log')
        .select('*')
        .eq('auto_blocked', true)
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group similar threats
      const threatsMap = new Map<string, SecurityThreat>();
      
      data.forEach(event => {
        const key = `${event.event_type}_${event.severity}`;
        if (threatsMap.has(key)) {
          const threat = threatsMap.get(key)!;
          threat.affectedUsers++;
        } else {
          threatsMap.set(key, {
            id: event.id,
            type: event.event_type,
            severity: event.severity as 'low' | 'medium' | 'high' | 'critical',
            description: this.formatThreatDescription(event),
            affectedUsers: 1,
            detectedAt: new Date(event.created_at),
            mitigated: event.auto_blocked,
            recommendedActions: this.getRecommendedActions(event.event_type)
          });
        }
      });

      return Array.from(threatsMap.values());
    } catch (error) {
      productionLogger.error('Failed to get security threats', error, 'EnhancedSecurityDashboard.getSecurityThreats');
      return [];
    }
  }

  async invalidateAllSessions(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('secure_session_validation')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;

      productionLogger.info('All sessions invalidated for user', { userId }, 'EnhancedSecurityDashboard.invalidateAllSessions');
    } catch (error) {
      productionLogger.error('Failed to invalidate sessions', error, 'EnhancedSecurityDashboard.invalidateAllSessions');
      throw error;
    }
  }

  private async getTotalSecurityEvents(): Promise<number> {
    const { count, error } = await supabase
      .from('comprehensive_security_log')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (error) throw error;
    return count || 0;
  }

  private async getCriticalAlerts(): Promise<number> {
    const { count, error } = await supabase
      .from('comprehensive_security_log')
      .select('*', { count: 'exact', head: true })
      .eq('severity', 'critical')
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (error) throw error;
    return count || 0;
  }

  private async getSuspiciousActivities(): Promise<number> {
    const { count, error } = await supabase
      .from('comprehensive_security_log')
      .select('*', { count: 'exact', head: true })
      .gte('risk_score', 50)
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (error) throw error;
    return count || 0;
  }

  private async getActiveSessions(): Promise<number> {
    const { count, error } = await supabase
      .from('secure_session_validation')
      .select('*', { count: 'exact', head: true })
      .gt('expires_at', new Date().toISOString());

    if (error) throw error;
    return count || 0;
  }

  private async getMFAEnabledUsers(): Promise<number> {
    const { count, error } = await supabase
      .from('user_mfa_config')
      .select('*', { count: 'exact', head: true })
      .eq('is_mfa_enabled', true);

    if (error) throw error;
    return count || 0;
  }

  private async getPrivilegeEscalationAttempts(): Promise<number> {
    const { count, error } = await supabase
      .from('privilege_escalation_attempts')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (error) throw error;
    return count || 0;
  }

  private calculateSecurityScore(metrics: {
    totalEvents: number;
    criticalAlerts: number;
    suspiciousActivities: number;
    mfaEnabledUsers: number;
    escalationAttempts: number;
  }): number {
    let score = 100;

    // Deduct points for security events
    score -= Math.min(metrics.criticalAlerts * 10, 50);
    score -= Math.min(metrics.suspiciousActivities * 2, 30);
    score -= Math.min(metrics.escalationAttempts * 5, 20);

    // Add points for security measures
    if (metrics.mfaEnabledUsers > 0) score += 10;

    return Math.max(score, 0);
  }

  private formatAlertMessage(event: any): string {
    switch (event.event_type) {
      case 'unauthorized_role_assignment':
        return 'Unauthorized attempt to assign elevated privileges detected';
      case 'suspicious_session_validation':
        return 'Suspicious session activity detected from unknown device/location';
      case 'privilege_escalation_attempt':
        return 'Privilege escalation attempt blocked';
      default:
        return `Security event: ${event.event_type}`;
    }
  }

  private formatThreatDescription(event: any): string {
    switch (event.event_type) {
      case 'unauthorized_role_assignment':
        return 'Multiple unauthorized attempts to assign administrative roles';
      case 'suspicious_session_validation':
        return 'Sessions accessed from unusual locations or devices';
      case 'privilege_escalation_attempt':
        return 'Coordinated attempts to gain unauthorized system access';
      default:
        return `Security threat involving ${event.event_type}`;
    }
  }

  private getRecommendedActions(eventType: string): string[] {
    switch (eventType) {
      case 'unauthorized_role_assignment':
        return [
          'Review user permissions and access controls',
          'Implement additional authentication for role changes',
          'Monitor admin account activities closely'
        ];
      case 'suspicious_session_validation':
        return [
          'Force password reset for affected accounts',
          'Enable multi-factor authentication',
          'Review session management policies'
        ];
      case 'privilege_escalation_attempt':
        return [
          'Immediately review all administrative accounts',
          'Implement IP whitelisting for admin operations',
          'Enable real-time security monitoring'
        ];
      default:
        return ['Review security logs and take appropriate action'];
    }
  }
}

export const enhancedSecurityDashboard = EnhancedSecurityDashboard.getInstance();