
import { supabase } from '@/integrations/supabase/client';
import { productionLogger } from '@/utils/productionLogger';
import { auditLogger } from '@/services/auditLogger';
import { rateLimitService } from './rateLimitService';

interface SecurityMetrics {
  totalEvents: number;
  criticalEvents: number;
  rateLimitViolations: number;
  authenticationFailures: number;
  suspiciousActivity: number;
  lastUpdated: Date;
}

interface ThreatDetectionResult {
  threat: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  reasons: string[];
  recommendations: string[];
}

interface SecurityAlert {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  resolved: boolean;
}

export class EnhancedSecurityMonitoring {
  private static instance: EnhancedSecurityMonitoring;
  private metrics: SecurityMetrics = {
    totalEvents: 0,
    criticalEvents: 0,
    rateLimitViolations: 0,
    authenticationFailures: 0,
    suspiciousActivity: 0,
    lastUpdated: new Date()
  };

  private suspiciousPatterns = [
    { pattern: /admin|root|administrator/i, severity: 'medium' as const, reason: 'Admin credential attempt' },
    { pattern: /\b(SELECT|INSERT|UPDATE|DELETE)\b.*\b(OR|AND)\b.*['"=]/i, severity: 'high' as const, reason: 'SQL injection attempt' },
    { pattern: /<script|javascript:|on\w+=/i, severity: 'high' as const, reason: 'XSS attempt' },
    { pattern: /\.\.\//g, severity: 'medium' as const, reason: 'Path traversal attempt' },
    { pattern: /\b(eval|exec|system|shell_exec)\b/i, severity: 'critical' as const, reason: 'Code execution attempt' }
  ];

  static getInstance(): EnhancedSecurityMonitoring {
    if (!EnhancedSecurityMonitoring.instance) {
      EnhancedSecurityMonitoring.instance = new EnhancedSecurityMonitoring();
    }
    return EnhancedSecurityMonitoring.instance;
  }

  async analyzeSecurityEvent(eventData: {
    type: string;
    data: any;
    userAgent?: string;
    ipAddress?: string;
    userId?: string;
  }): Promise<ThreatDetectionResult> {
    const threats: { severity: 'low' | 'medium' | 'high' | 'critical'; reason: string }[] = [];
    const recommendations: string[] = [];

    // Analyze event data for suspicious patterns
    const dataString = JSON.stringify(eventData.data);
    
    for (const { pattern, severity, reason } of this.suspiciousPatterns) {
      if (pattern.test(dataString)) {
        threats.push({ severity, reason });
      }
    }

    // Check for rapid requests from same IP using consolidated rate limiting
    if (eventData.ipAddress) {
      const rateLimitResult = await rateLimitService.checkRateLimit(eventData.ipAddress, 'api');
      if (!rateLimitResult.allowed) {
        threats.push({ 
          severity: 'high', 
          reason: 'Excessive requests from single IP address' 
        });
        recommendations.push('Consider IP-based rate limiting');
      }
    }

    // Determine overall threat level
    const maxSeverity = threats.reduce((max, threat) => {
      const severityLevels = { low: 1, medium: 2, high: 3, critical: 4 };
      return severityLevels[threat.severity] > severityLevels[max] ? threat.severity : max;
    }, 'low' as const);

    const result: ThreatDetectionResult = {
      threat: threats.length > 0,
      severity: maxSeverity,
      reasons: threats.map(t => t.reason),
      recommendations
    };

    // Log high-severity threats
    if (maxSeverity === 'high' || maxSeverity === 'critical') {
      await auditLogger.logSecurityEvent({
        event_type: 'security_threat_detected',
        event_data: {
          originalEvent: eventData,
          threatAnalysis: result
        }
      });

      productionLogger.error('Security threat detected', {
        eventType: eventData.type,
        severity: maxSeverity,
        reasons: result.reasons
      }, 'EnhancedSecurityMonitoring');
    }

    return result;
  }

  async getSecurityMetrics(): Promise<SecurityMetrics> {
    try {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

      const { data: events, error } = await supabase
        .from('security_audit_log')
        .select('event_type, event_data, created_at')
        .gte('created_at', oneHourAgo.toISOString());

      if (error) {
        productionLogger.error('Failed to fetch security metrics', error, 'EnhancedSecurityMonitoring');
        return this.metrics;
      }

      const metrics: SecurityMetrics = {
        totalEvents: events?.length || 0,
        criticalEvents: events?.filter(e => 
          e.event_type.includes('threat') || 
          e.event_type.includes('violation') ||
          e.event_type.includes('breach')
        ).length || 0,
        rateLimitViolations: events?.filter(e => 
          e.event_type.includes('rate_limit')
        ).length || 0,
        authenticationFailures: events?.filter(e => {
          if (!e.event_type.includes('auth')) return false;
          // Safely check event_data
          if (typeof e.event_data === 'object' && e.event_data !== null) {
            const eventData = e.event_data as Record<string, any>;
            return eventData.success === false;
          }
          return false;
        }).length || 0,
        suspiciousActivity: events?.filter(e => 
          e.event_type.includes('suspicious') ||
          e.event_type.includes('anomaly')
        ).length || 0,
        lastUpdated: new Date()
      };

      this.metrics = metrics;
      return metrics;
    } catch (error) {
      productionLogger.error('Error calculating security metrics', error, 'EnhancedSecurityMonitoring');
      return this.metrics;
    }
  }

  // Generate security alerts for dashboard
  async generateSecurityAlerts(): Promise<SecurityAlert[]> {
    const metrics = await this.getSecurityMetrics();
    const alerts: SecurityAlert[] = [];

    if (metrics.criticalEvents > 0) {
      alerts.push({
        id: `critical-${Date.now()}`,
        severity: 'critical',
        message: `${metrics.criticalEvents} critical security events detected in the last hour`,
        timestamp: new Date(),
        resolved: false
      });
    }

    if (metrics.rateLimitViolations > 10) {
      alerts.push({
        id: `rate-limit-${Date.now()}`,
        severity: 'medium',
        message: `High number of rate limit violations: ${metrics.rateLimitViolations}`,
        timestamp: new Date(),
        resolved: false
      });
    }

    if (metrics.authenticationFailures > 20) {
      alerts.push({
        id: `auth-failures-${Date.now()}`,
        severity: 'high',
        message: `Unusual number of authentication failures: ${metrics.authenticationFailures}`,
        timestamp: new Date(),
        resolved: false
      });
    }

    return alerts;
  }
}

export const enhancedSecurityMonitoring = EnhancedSecurityMonitoring.getInstance();
