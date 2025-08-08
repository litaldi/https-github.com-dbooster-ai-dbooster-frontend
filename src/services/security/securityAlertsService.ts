
import { supabase } from '@/integrations/supabase/client';
import { productionLogger } from '@/utils/productionLogger';

export type SecurityAlertType = 
  | 'suspicious_login'
  | 'privilege_escalation'
  | 'unusual_activity'
  | 'security_policy_violation'
  | 'rate_limit_exceeded'
  | 'session_anomaly';

export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';

interface SecurityAlert {
  id?: string;
  type: SecurityAlertType;
  severity: AlertSeverity;
  message: string;
  userId?: string;
  metadata?: Record<string, any>;
  createdAt?: string;
}

class SecurityAlertsService {
  private static instance: SecurityAlertsService;
  private alertListeners: Array<(alert: SecurityAlert) => void> = [];

  static getInstance(): SecurityAlertsService {
    if (!SecurityAlertsService.instance) {
      SecurityAlertsService.instance = new SecurityAlertsService();
    }
    return SecurityAlertsService.instance;
  }

  async createSecurityAlert(alert: SecurityAlert): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('security_events_enhanced')
        .insert({
          event_type: alert.type,
          severity: alert.severity,
          user_id: alert.userId,
          event_data: {
            message: alert.message,
            ...alert.metadata
          },
          threat_score: this.calculateThreatScore(alert.severity),
          ip_address: await this.getUserIP(),
          user_agent: navigator.userAgent
        });

      if (error) {
        productionLogger.error('Failed to create security alert', error, 'SecurityAlertsService');
        return false;
      }

      // Notify listeners
      this.notifyListeners(alert);

      productionLogger.warn('Security alert created', {
        type: alert.type,
        severity: alert.severity,
        message: alert.message
      });

      return true;
    } catch (error) {
      productionLogger.error('Error creating security alert', error, 'SecurityAlertsService');
      return false;
    }
  }

  async getRecentAlerts(userId?: string, limit: number = 50): Promise<SecurityAlert[]> {
    try {
      let query = supabase
        .from('security_events_enhanced')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) {
        productionLogger.error('Failed to fetch security alerts', error, 'SecurityAlertsService');
        return [];
      }

      return data.map(row => {
        // Safely handle the event_data JSON field
        const eventData = row.event_data;
        let message = 'Security event detected';
        let metadata: Record<string, any> = {};

        if (eventData && typeof eventData === 'object') {
          if ('message' in eventData && typeof eventData.message === 'string') {
            message = eventData.message;
          }
          metadata = eventData as Record<string, any>;
        }

        return {
          id: row.id,
          type: row.event_type as SecurityAlertType,
          severity: row.severity as AlertSeverity,
          message,
          userId: row.user_id,
          metadata,
          createdAt: row.created_at
        };
      });
    } catch (error) {
      productionLogger.error('Error fetching security alerts', error, 'SecurityAlertsService');
      return [];
    }
  }

  async getAlertStats(userId?: string): Promise<{
    total: number;
    byType: Record<string, number>;
    bySeverity: Record<string, number>;
  }> {
    try {
      let query = supabase
        .from('security_events_enhanced')
        .select('event_type, severity');

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      const stats = {
        total: data.length,
        byType: {} as Record<string, number>,
        bySeverity: {} as Record<string, number>
      };

      data.forEach(row => {
        stats.byType[row.event_type] = (stats.byType[row.event_type] || 0) + 1;
        stats.bySeverity[row.severity] = (stats.bySeverity[row.severity] || 0) + 1;
      });

      return stats;
    } catch (error) {
      productionLogger.error('Error fetching alert stats', error, 'SecurityAlertsService');
      return { total: 0, byType: {}, bySeverity: {} };
    }
  }

  onSecurityAlert(callback: (alert: SecurityAlert) => void): () => void {
    this.alertListeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.alertListeners.indexOf(callback);
      if (index > -1) {
        this.alertListeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(alert: SecurityAlert): void {
    this.alertListeners.forEach(listener => {
      try {
        listener(alert);
      } catch (error) {
        productionLogger.error('Error in security alert listener', error, 'SecurityAlertsService');
      }
    });
  }

  private calculateThreatScore(severity: AlertSeverity): number {
    switch (severity) {
      case 'low': return 25;
      case 'medium': return 50;
      case 'high': return 75;
      case 'critical': return 100;
      default: return 0;
    }
  }

  private async getUserIP(): Promise<string> {
    // Avoid client-side IP collection; rely on server-side logs
    return 'unknown';
  }
}

export const securityAlertsService = SecurityAlertsService.getInstance();
