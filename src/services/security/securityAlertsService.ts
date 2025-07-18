
import { supabase } from '@/integrations/supabase/client';
import { productionLogger } from '@/utils/productionLogger';

interface SecurityAlert {
  id: string;
  type: 'privilege_escalation' | 'suspicious_session' | 'unauthorized_access' | 'security_violation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  userId?: string;
  metadata?: Record<string, any>;
}

class SecurityAlertsService {
  private static instance: SecurityAlertsService;
  private alertListeners: ((alert: SecurityAlert) => void)[] = [];

  static getInstance(): SecurityAlertsService {
    if (!SecurityAlertsService.instance) {
      SecurityAlertsService.instance = new SecurityAlertsService();
    }
    return SecurityAlertsService.instance;
  }

  async getRecentAlerts(userId?: string): Promise<SecurityAlert[]> {
    try {
      let query = supabase
        .from('privilege_escalation_attempts')
        .select('*')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data: escalationAttempts, error: escalationError } = await query;

      if (escalationError) {
        productionLogger.error('Failed to fetch escalation attempts', escalationError, 'SecurityAlertsService');
        return [];
      }

      // Also get suspicious session events
      const { data: sessionEvents, error: sessionError } = await supabase
        .from('security_events_enhanced')
        .select('*')
        .eq('event_type', 'suspicious_session_validation')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false });

      if (sessionError) {
        productionLogger.error('Failed to fetch session events', sessionError, 'SecurityAlertsService');
      }

      const alerts: SecurityAlert[] = [];

      // Convert escalation attempts to alerts
      escalationAttempts?.forEach(attempt => {
        alerts.push({
          id: attempt.id,
          type: 'privilege_escalation',
          severity: attempt.attempted_role === 'admin' ? 'critical' : 'high',
          message: `Unauthorized ${attempt.attempted_role} role assignment attempt`,
          timestamp: attempt.created_at,
          userId: attempt.user_id,
          metadata: {
            method: attempt.method,
            blocked: attempt.blocked,
            ip_address: attempt.ip_address
          }
        });
      });

      // Convert session events to alerts
      sessionEvents?.forEach(event => {
        alerts.push({
          id: event.id,
          type: 'suspicious_session',
          severity: event.severity as SecurityAlert['severity'],
          message: 'Suspicious session activity detected',
          timestamp: event.created_at,
          userId: event.user_id,
          metadata: event.event_data
        });
      });

      return alerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (error) {
      productionLogger.error('Error fetching security alerts', error, 'SecurityAlertsService');
      return [];
    }
  }

  async createSecurityAlert(alert: Omit<SecurityAlert, 'id' | 'timestamp'>): Promise<void> {
    const fullAlert: SecurityAlert = {
      ...alert,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    };

    try {
      // Log the alert
      productionLogger.warn('Security alert created', {
        type: alert.type,
        severity: alert.severity,
        message: alert.message,
        user_id: alert.userId?.substring(0, 8)
      });

      // Notify listeners
      this.alertListeners.forEach(listener => {
        try {
          listener(fullAlert);
        } catch (error) {
          productionLogger.error('Error in alert listener', error, 'SecurityAlertsService');
        }
      });

      // For critical alerts, also log to security events
      if (alert.severity === 'critical') {
        await supabase.from('security_events_enhanced').insert({
          event_type: 'critical_security_alert',
          severity: 'high',
          user_id: alert.userId,
          event_data: {
            alert_type: alert.type,
            message: alert.message,
            metadata: alert.metadata
          }
        });
      }
    } catch (error) {
      productionLogger.error('Error creating security alert', error, 'SecurityAlertsService');
    }
  }

  onSecurityAlert(listener: (alert: SecurityAlert) => void): () => void {
    this.alertListeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.alertListeners.indexOf(listener);
      if (index > -1) {
        this.alertListeners.splice(index, 1);
      }
    };
  }

  async getSecuritySummary(): Promise<{
    totalAlerts: number;
    criticalAlerts: number;
    recentTrends: {
      privilegeEscalation: number;
      suspiciousSessions: number;
      securityViolations: number;
    };
  }> {
    try {
      const alerts = await this.getRecentAlerts();
      
      return {
        totalAlerts: alerts.length,
        criticalAlerts: alerts.filter(a => a.severity === 'critical').length,
        recentTrends: {
          privilegeEscalation: alerts.filter(a => a.type === 'privilege_escalation').length,
          suspiciousSessions: alerts.filter(a => a.type === 'suspicious_session').length,
          securityViolations: alerts.filter(a => a.type === 'security_violation').length
        }
      };
    } catch (error) {
      productionLogger.error('Error getting security summary', error, 'SecurityAlertsService');
      return {
        totalAlerts: 0,
        criticalAlerts: 0,
        recentTrends: {
          privilegeEscalation: 0,
          suspiciousSessions: 0,
          securityViolations: 0
        }
      };
    }
  }
}

export const securityAlertsService = SecurityAlertsService.getInstance();
