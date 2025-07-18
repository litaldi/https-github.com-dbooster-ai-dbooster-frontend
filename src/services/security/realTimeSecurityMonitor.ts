import { productionLogger } from '@/utils/productionLogger';
import { supabase } from '@/integrations/supabase/client';
import type { SecurityEvent, SecurityMetrics, SecurityHealthCheck } from './types/securityTypes';

class RealTimeSecurityMonitor {
  private static instance: RealTimeSecurityMonitor;
  private metrics: SecurityMetrics = {
    failedLogins: 0,
    suspiciousActivities: 0,
    blockedRequests: 0,
    activeThreats: 0
  };
  private recentEvents: SecurityEvent[] = [];
  private readonly MAX_EVENTS = 100;
  private readonly METRICS_RESET_INTERVAL = 60 * 60 * 1000; // 1 hour

  static getInstance(): RealTimeSecurityMonitor {
    if (!RealTimeSecurityMonitor.instance) {
      RealTimeSecurityMonitor.instance = new RealTimeSecurityMonitor();
    }
    return RealTimeSecurityMonitor.instance;
  }

  constructor() {
    // Reset metrics hourly
    setInterval(() => {
      this.resetMetrics();
    }, this.METRICS_RESET_INTERVAL);
  }

  logSecurityEvent(event: Omit<SecurityEvent, 'timestamp'>): void {
    const fullEvent: SecurityEvent = {
      ...event,
      timestamp: Date.now()
    };

    this.recentEvents.unshift(fullEvent);
    
    // Keep only recent events
    if (this.recentEvents.length > this.MAX_EVENTS) {
      this.recentEvents = this.recentEvents.slice(0, this.MAX_EVENTS);
    }

    // Update metrics
    this.updateMetrics(fullEvent);

    // Log to production logger
    productionLogger.secureInfo('Security event detected', {
      type: event.type,
      severity: event.severity,
      message: event.message
    });

    // Store in audit log
    this.storeSecurityEvent(fullEvent);

    // Check for threat escalation
    this.checkThreatEscalation(fullEvent);
  }

  getSecurityMetrics(): SecurityMetrics {
    return { ...this.metrics };
  }

  getRecentEvents(limit: number = 20): SecurityEvent[] {
    return this.recentEvents.slice(0, limit);
  }

  getSecurityHealth(): SecurityHealthCheck {
    const issues: string[] = [];
    let score = 100;

    // Check failed login rate
    if (this.metrics.failedLogins > 10) {
      issues.push('High number of failed login attempts');
      score -= 20;
    }

    // Check suspicious activities
    if (this.metrics.suspiciousActivities > 5) {
      issues.push('Multiple suspicious activities detected');
      score -= 25;
    }

    // Check blocked requests
    if (this.metrics.blockedRequests > 20) {
      issues.push('High number of blocked requests');
      score -= 15;
    }

    // Check active threats
    if (this.metrics.activeThreats > 0) {
      issues.push('Active security threats detected');
      score -= 30;
    }

    let status: 'healthy' | 'warning' | 'critical' = 'healthy';
    if (score < 70) status = 'warning';
    if (score < 50) status = 'critical';

    return { score: Math.max(score, 0), status, issues };
  }

  private updateMetrics(event: SecurityEvent): void {
    switch (event.type) {
      case 'login_failure':
        this.metrics.failedLogins++;
        break;
      case 'suspicious_activity':
        this.metrics.suspiciousActivities++;
        break;
      case 'rate_limit_hit':
        this.metrics.blockedRequests++;
        break;
      case 'security_violation':
        this.metrics.activeThreats++;
        break;
    }
  }

  private async storeSecurityEvent(event: SecurityEvent): Promise<void> {
    try {
      await supabase
        .from('security_audit_log')
        .insert({
          event_type: event.type,
          event_data: {
            severity: event.severity,
            message: event.message,
            metadata: event.metadata,
            timestamp: event.timestamp
          },
          user_id: event.metadata.userId || null,
          ip_address: event.metadata.ipAddress || null,
          user_agent: event.metadata.userAgent || null
        });
    } catch (error) {
      productionLogger.error('Failed to store security event', error, 'RealTimeSecurityMonitor');
    }
  }

  private checkThreatEscalation(event: SecurityEvent): void {
    if (event.severity === 'critical') {
      // Trigger immediate alert
      this.triggerSecurityAlert(event);
    }

    // Check for patterns indicating coordinated attack
    const recentSimilarEvents = this.recentEvents
      .filter(e => e.type === event.type && Date.now() - e.timestamp < 5 * 60 * 1000)
      .length;

    if (recentSimilarEvents >= 5) {
      this.triggerSecurityAlert({
        ...event,
        severity: 'critical',
        message: `Potential coordinated attack detected: ${recentSimilarEvents} ${event.type} events in 5 minutes`
      });
    }
  }

  private triggerSecurityAlert(event: SecurityEvent): void {
    productionLogger.error('SECURITY ALERT', {
      type: event.type,
      severity: event.severity,
      message: event.message,
      metadata: event.metadata
    }, 'RealTimeSecurityMonitor');

    // In production, this would trigger actual alerting systems
    console.error('🚨 SECURITY ALERT:', event.message);
  }

  private resetMetrics(): void {
    this.metrics = {
      failedLogins: 0,
      suspiciousActivities: 0,
      blockedRequests: 0,
      activeThreats: 0
    };

    productionLogger.info('Security metrics reset');
  }
}

export const realTimeSecurityMonitor = RealTimeSecurityMonitor.getInstance();
