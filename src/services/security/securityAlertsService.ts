
import { productionLogger } from '@/utils/productionLogger';
import { realTimeSecurityMonitor } from './realTimeSecurityMonitor';

interface SecurityAlert {
  id: string;
  type: 'critical' | 'high' | 'medium' | 'low';
  category: 'authentication' | 'authorization' | 'data_breach' | 'suspicious_activity' | 'system_security';
  message: string;
  details: Record<string, any>;
  timestamp: number;
  acknowledged: boolean;
  adminNotified: boolean;
}

interface AlertConfig {
  enableRealTimeAlerts: boolean;
  criticalAlertThreshold: number;
  adminNotificationDelay: number;
  maxAlertsPerHour: number;
}

class SecurityAlertsService {
  private static instance: SecurityAlertsService;
  private alerts: Map<string, SecurityAlert> = new Map();
  private config: AlertConfig = {
    enableRealTimeAlerts: true,
    criticalAlertThreshold: 3, // Escalate after 3 critical alerts
    adminNotificationDelay: 5 * 60 * 1000, // 5 minutes
    maxAlertsPerHour: 100
  };
  private alertCounts: Map<string, number> = new Map(); // hourly alert counts

  static getInstance(): SecurityAlertsService {
    if (!SecurityAlertsService.instance) {
      SecurityAlertsService.instance = new SecurityAlertsService();
    }
    return SecurityAlertsService.instance;
  }

  async createAlert(
    type: SecurityAlert['type'],
    category: SecurityAlert['category'],
    message: string,
    details: Record<string, any> = {}
  ): Promise<string> {
    const alertId = this.generateAlertId();
    const timestamp = Date.now();
    
    // Check rate limiting
    const hourKey = Math.floor(timestamp / (60 * 60 * 1000)).toString();
    const currentHourCount = this.alertCounts.get(hourKey) || 0;
    
    if (currentHourCount >= this.config.maxAlertsPerHour) {
      productionLogger.warn('Alert rate limit exceeded', {
        hourKey,
        count: currentHourCount,
        limit: this.config.maxAlertsPerHour
      }, 'SecurityAlertsService');
      return alertId;
    }

    const alert: SecurityAlert = {
      id: alertId,
      type,
      category,
      message,
      details,
      timestamp,
      acknowledged: false,
      adminNotified: false
    };

    this.alerts.set(alertId, alert);
    this.alertCounts.set(hourKey, currentHourCount + 1);

    // Log the security event
    realTimeSecurityMonitor.logSecurityEvent({
      type: 'security_alert',
      severity: this.mapTypeToSeverity(type),
      message: `Security alert created: ${message}`,
      metadata: {
        alertId,
        category,
        ...details
      }
    });

    // Handle critical alerts immediately
    if (type === 'critical') {
      await this.handleCriticalAlert(alert);
    }

    // Schedule admin notification if enabled
    if (this.config.enableRealTimeAlerts && !alert.adminNotified) {
      setTimeout(() => {
        this.notifyAdmins(alert);
      }, this.config.adminNotificationDelay);
    }

    productionLogger.warn(`Security alert created: ${type}`, {
      alertId,
      category,
      message,
      details
    }, 'SecurityAlertsService');

    return alertId;
  }

  private async handleCriticalAlert(alert: SecurityAlert): Promise<void> {
    try {
      // Immediate admin notification for critical alerts
      await this.notifyAdmins(alert, true);

      // Check if we need to escalate (multiple critical alerts)
      const recentCriticalAlerts = this.getRecentAlerts('critical', 60 * 60 * 1000); // Last hour
      
      if (recentCriticalAlerts.length >= this.config.criticalAlertThreshold) {
        await this.escalateSecurityIncident(recentCriticalAlerts);
      }

      // Auto-response for certain critical alert types
      switch (alert.category) {
        case 'authentication':
          await this.handleAuthenticationIncident(alert);
          break;
        case 'data_breach':
          await this.handleDataBreachIncident(alert);
          break;
        case 'suspicious_activity':
          await this.handleSuspiciousActivityIncident(alert);
          break;
      }
    } catch (error) {
      productionLogger.error('Failed to handle critical alert', error, 'SecurityAlertsService');
    }
  }

  private async notifyAdmins(alert: SecurityAlert, immediate: boolean = false): Promise<void> {
    try {
      // In a real implementation, this would send notifications via:
      // - Email
      // - SMS
      // - Slack/Teams
      // - Push notifications
      
      productionLogger.info('Admin notification sent', {
        alertId: alert.id,
        type: alert.type,
        immediate,
        message: alert.message
      }, 'SecurityAlertsService');

      // Mark as notified
      alert.adminNotified = true;
      this.alerts.set(alert.id, alert);
    } catch (error) {
      productionLogger.error('Failed to notify admins', error, 'SecurityAlertsService');
    }
  }

  private async escalateSecurityIncident(alerts: SecurityAlert[]): Promise<void> {
    const incidentId = this.generateAlertId();
    
    productionLogger.error('Security incident escalated', {
      incidentId,
      alertCount: alerts.length,
      alerts: alerts.map(a => ({
        id: a.id,
        type: a.type,
        category: a.category,
        message: a.message
      }))
    }, 'SecurityAlertsService');

    // Create high-priority incident alert
    await this.createAlert(
      'critical',
      'system_security',
      `Security incident escalated: ${alerts.length} critical alerts in the last hour`,
      {
        incidentId,
        triggeringAlerts: alerts.map(a => a.id),
        escalationReason: 'critical_alert_threshold_exceeded'
      }
    );
  }

  private async handleAuthenticationIncident(alert: SecurityAlert): Promise<void> {
    // Auto-response for authentication incidents
    productionLogger.info('Authentication incident auto-response triggered', {
      alertId: alert.id,
      details: alert.details
    }, 'SecurityAlertsService');

    // Could implement:
    // - Temporary account lockouts
    // - IP blocking
    // - Enhanced monitoring
  }

  private async handleDataBreachIncident(alert: SecurityAlert): Promise<void> {
    // Auto-response for data breach incidents
    productionLogger.error('Data breach incident detected', {
      alertId: alert.id,
      details: alert.details
    }, 'SecurityAlertsService');

    // Could implement:
    // - Data access logging
    // - User notifications
    // - Compliance reporting
  }

  private async handleSuspiciousActivityIncident(alert: SecurityAlert): Promise<void> {
    // Auto-response for suspicious activity
    productionLogger.warn('Suspicious activity auto-response triggered', {
      alertId: alert.id,
      details: alert.details
    }, 'SecurityAlertsService');

    // Could implement:
    // - Enhanced user verification
    // - Activity restrictions
    // - Fraud detection
  }

  acknowledgeAlert(alertId: string, acknowledgedBy?: string): boolean {
    const alert = this.alerts.get(alertId);
    if (!alert) {
      return false;
    }

    alert.acknowledged = true;
    this.alerts.set(alertId, alert);

    productionLogger.info('Security alert acknowledged', {
      alertId,
      acknowledgedBy,
      type: alert.type,
      category: alert.category
    }, 'SecurityAlertsService');

    return true;
  }

  getAlerts(filters?: {
    type?: SecurityAlert['type'];
    category?: SecurityAlert['category'];
    acknowledged?: boolean;
    timeRange?: { start: number; end: number };
  }): SecurityAlert[] {
    let alerts = Array.from(this.alerts.values());

    if (filters) {
      if (filters.type) {
        alerts = alerts.filter(a => a.type === filters.type);
      }
      if (filters.category) {
        alerts = alerts.filter(a => a.category === filters.category);
      }
      if (filters.acknowledged !== undefined) {
        alerts = alerts.filter(a => a.acknowledged === filters.acknowledged);
      }
      if (filters.timeRange) {
        alerts = alerts.filter(a => 
          a.timestamp >= filters.timeRange!.start && 
          a.timestamp <= filters.timeRange!.end
        );
      }
    }

    return alerts.sort((a, b) => b.timestamp - a.timestamp);
  }

  private getRecentAlerts(type?: SecurityAlert['type'], timeWindow: number = 60 * 60 * 1000): SecurityAlert[] {
    const cutoff = Date.now() - timeWindow;
    let alerts = Array.from(this.alerts.values()).filter(a => a.timestamp >= cutoff);
    
    if (type) {
      alerts = alerts.filter(a => a.type === type);
    }
    
    return alerts;
  }

  getAlertStats(): {
    total: number;
    byType: Record<SecurityAlert['type'], number>;
    byCategory: Record<SecurityAlert['category'], number>;
    acknowledged: number;
    unacknowledged: number;
  } {
    const alerts = Array.from(this.alerts.values());
    
    const stats = {
      total: alerts.length,
      byType: { critical: 0, high: 0, medium: 0, low: 0 } as Record<SecurityAlert['type'], number>,
      byCategory: { 
        authentication: 0, 
        authorization: 0, 
        data_breach: 0, 
        suspicious_activity: 0, 
        system_security: 0 
      } as Record<SecurityAlert['category'], number>,
      acknowledged: 0,
      unacknowledged: 0
    };

    alerts.forEach(alert => {
      stats.byType[alert.type]++;
      stats.byCategory[alert.category]++;
      if (alert.acknowledged) {
        stats.acknowledged++;
      } else {
        stats.unacknowledged++;
      }
    });

    return stats;
  }

  private generateAlertId(): string {
    return `alert_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  }

  private mapTypeToSeverity(type: SecurityAlert['type']): 'low' | 'medium' | 'high' | 'critical' {
    switch (type) {
      case 'critical': return 'critical';
      case 'high': return 'high';
      case 'medium': return 'medium';
      case 'low': return 'low';
      default: return 'medium';
    }
  }

  // Cleanup old alerts (call periodically)
  cleanupOldAlerts(maxAge: number = 30 * 24 * 60 * 60 * 1000): void { // 30 days
    const cutoff = Date.now() - maxAge;
    let removedCount = 0;

    for (const [alertId, alert] of this.alerts.entries()) {
      if (alert.timestamp < cutoff && alert.acknowledged) {
        this.alerts.delete(alertId);
        removedCount++;
      }
    }

    if (removedCount > 0) {
      productionLogger.info('Old security alerts cleaned up', {
        removedCount,
        remainingCount: this.alerts.size
      }, 'SecurityAlertsService');
    }
  }
}

export const securityAlertsService = SecurityAlertsService.getInstance();
