
import { supabase } from '@/integrations/supabase/client';
import { productionLogger } from '@/utils/productionLogger';
import { enhancedThreatDetection } from '../threatDetectionEnhanced';

interface SecurityAuditReport {
  timestamp: Date;
  totalEvents: number;
  suspiciousPatterns: SuspiciousPattern[];
  threatTrends: ThreatTrend[];
  performanceMetrics: PerformanceMetrics;
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

interface SuspiciousPattern {
  pattern: string;
  occurrences: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  firstSeen: Date;
  lastSeen: Date;
  affectedUsers: string[];
  ipAddresses: string[];
}

interface ThreatTrend {
  threatType: string;
  count: number;
  trend: 'increasing' | 'decreasing' | 'stable';
  percentageChange: number;
}

interface PerformanceMetrics {
  averageResponseTime: number;
  validationErrors: number;
  blockedRequests: number;
  falsePositives: number;
}

export class SecurityAuditService {
  private static instance: SecurityAuditService;
  private auditInterval: NodeJS.Timeout | null = null;
  private readonly AUDIT_INTERVAL = 15 * 60 * 1000; // 15 minutes

  static getInstance(): SecurityAuditService {
    if (!SecurityAuditService.instance) {
      SecurityAuditService.instance = new SecurityAuditService();
    }
    return SecurityAuditService.instance;
  }

  async startContinuousMonitoring(): Promise<void> {
    if (this.auditInterval) {
      clearInterval(this.auditInterval);
    }

    productionLogger.secureInfo('Starting continuous security monitoring');

    // Immediate audit
    await this.performSecurityAudit();

    // Schedule periodic audits
    this.auditInterval = setInterval(async () => {
      try {
        await this.performSecurityAudit();
      } catch (error) {
        productionLogger.error('Periodic security audit failed', error, 'SecurityAuditService');
      }
    }, this.AUDIT_INTERVAL);
  }

  async performSecurityAudit(): Promise<SecurityAuditReport> {
    const startTime = Date.now();
    
    try {
      productionLogger.secureInfo('Starting security audit', { timestamp: new Date() });

      // Analyze recent security events
      const suspiciousPatterns = await this.detectSuspiciousPatterns();
      const threatTrends = await this.analyzeThreatTrends();
      const performanceMetrics = await this.gatherPerformanceMetrics();
      
      // Calculate total events
      const { data: recentEvents } = await supabase
        .from('security_audit_log')
        .select('id')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      const totalEvents = recentEvents?.length || 0;

      // Generate recommendations
      const recommendations = this.generateRecommendations(suspiciousPatterns, threatTrends, performanceMetrics);

      // Determine risk level
      const riskLevel = this.calculateRiskLevel(suspiciousPatterns, threatTrends);

      const report: SecurityAuditReport = {
        timestamp: new Date(),
        totalEvents,
        suspiciousPatterns,
        threatTrends,
        performanceMetrics,
        recommendations,
        riskLevel
      };

      // Log audit results
      await this.logAuditResults(report);

      // Alert on high-risk findings
      if (riskLevel === 'critical' || riskLevel === 'high') {
        await this.alertAdministrators(report);
      }

      const auditDuration = Date.now() - startTime;
      productionLogger.secureInfo('Security audit completed', {
        duration: auditDuration,
        riskLevel,
        patternsFound: suspiciousPatterns.length,
        recommendations: recommendations.length
      });

      return report;
    } catch (error) {
      productionLogger.error('Security audit failed', error, 'SecurityAuditService');
      throw error;
    }
  }

  private async detectSuspiciousPatterns(): Promise<SuspiciousPattern[]> {
    const patterns: SuspiciousPattern[] = [];
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    try {
      // Get recent security events
      const { data: events } = await supabase
        .from('security_audit_log')
        .select('*')
        .gte('created_at', twentyFourHoursAgo.toISOString())
        .order('created_at', { ascending: false });

      if (!events) return patterns;

      // Group events by type and analyze patterns
      const eventGroups = this.groupEventsByType(events);

      for (const [eventType, eventList] of Object.entries(eventGroups)) {
        // Check for high frequency patterns
        if (eventList.length > 10) {
          const ipAddresses = [...new Set(eventList.map(e => e.ip_address).filter(Boolean))];
          const affectedUsers = [...new Set(eventList.map(e => e.user_id).filter(Boolean))];

          patterns.push({
            pattern: `High frequency ${eventType}`,
            occurrences: eventList.length,
            severity: eventList.length > 50 ? 'critical' : eventList.length > 25 ? 'high' : 'medium',
            firstSeen: new Date(eventList[eventList.length - 1].created_at),
            lastSeen: new Date(eventList[0].created_at),
            affectedUsers,
            ipAddresses
          });
        }

        // Check for coordinated attacks (same IP, multiple event types)
        const ipGroups = this.groupEventsByIP(eventList);
        for (const [ip, ipEvents] of Object.entries(ipGroups)) {
          if (ipEvents.length > 5) {
            const uniqueEventTypes = [...new Set(ipEvents.map(e => e.event_type))];
            if (uniqueEventTypes.length > 2) {
              patterns.push({
                pattern: `Coordinated attack from IP ${ip}`,
                occurrences: ipEvents.length,
                severity: 'high',
                firstSeen: new Date(ipEvents[ipEvents.length - 1].created_at),
                lastSeen: new Date(ipEvents[0].created_at),
                affectedUsers: [...new Set(ipEvents.map(e => e.user_id).filter(Boolean))],
                ipAddresses: [ip]
              });
            }
          }
        }
      }

      return patterns;
    } catch (error) {
      productionLogger.error('Failed to detect suspicious patterns', error, 'SecurityAuditService');
      return patterns;
    }
  }

  private async analyzeThreatTrends(): Promise<ThreatTrend[]> {
    const trends: ThreatTrend[] = [];
    
    try {
      const now = new Date();
      const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const previous24Hours = new Date(now.getTime() - 48 * 60 * 60 * 1000);

      // Get current period events
      const { data: currentEvents } = await supabase
        .from('security_audit_log')
        .select('event_type')
        .gte('created_at', last24Hours.toISOString());

      // Get previous period events
      const { data: previousEvents } = await supabase
        .from('security_audit_log')
        .select('event_type')
        .gte('created_at', previous24Hours.toISOString())
        .lt('created_at', last24Hours.toISOString());

      if (!currentEvents || !previousEvents) return trends;

      // Count events by type for both periods
      const currentCounts = this.countEventsByType(currentEvents);
      const previousCounts = this.countEventsByType(previousEvents);

      // Calculate trends
      for (const [threatType, currentCount] of Object.entries(currentCounts)) {
        const previousCount = previousCounts[threatType] || 0;
        let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
        let percentageChange = 0;

        if (previousCount > 0) {
          percentageChange = ((currentCount - previousCount) / previousCount) * 100;
          if (percentageChange > 10) trend = 'increasing';
          else if (percentageChange < -10) trend = 'decreasing';
        } else if (currentCount > 0) {
          trend = 'increasing';
          percentageChange = 100;
        }

        trends.push({
          threatType,
          count: currentCount,
          trend,
          percentageChange: Math.round(percentageChange)
        });
      }

      return trends.sort((a, b) => b.count - a.count);
    } catch (error) {
      productionLogger.error('Failed to analyze threat trends', error, 'SecurityAuditService');
      return trends;
    }
  }

  private async gatherPerformanceMetrics(): Promise<PerformanceMetrics> {
    try {
      // Get threat detection statistics
      const stats = enhancedThreatDetection.getThreatStatistics();
      
      // Mock performance data (in real implementation, you'd track actual metrics)
      return {
        averageResponseTime: 150, // ms
        validationErrors: 5,
        blockedRequests: stats.blockedIPs,
        falsePositives: 2
      };
    } catch (error) {
      productionLogger.error('Failed to gather performance metrics', error, 'SecurityAuditService');
      return {
        averageResponseTime: 0,
        validationErrors: 0,
        blockedRequests: 0,
        falsePositives: 0
      };
    }
  }

  private generateRecommendations(
    patterns: SuspiciousPattern[],
    trends: ThreatTrend[],
    metrics: PerformanceMetrics
  ): string[] {
    const recommendations: string[] = [];

    // Pattern-based recommendations
    patterns.forEach(pattern => {
      if (pattern.severity === 'critical' || pattern.severity === 'high') {
        recommendations.push(`Investigate ${pattern.pattern} - ${pattern.occurrences} occurrences detected`);
      }
      
      if (pattern.ipAddresses.length > 0) {
        recommendations.push(`Consider blocking IP addresses: ${pattern.ipAddresses.slice(0, 3).join(', ')}`);
      }
    });

    // Trend-based recommendations
    trends.forEach(trend => {
      if (trend.trend === 'increasing' && trend.percentageChange > 50) {
        recommendations.push(`Alert: ${trend.threatType} incidents increased by ${trend.percentageChange}%`);
      }
    });

    // Performance-based recommendations
    if (metrics.averageResponseTime > 500) {
      recommendations.push('Security validation response time is high - consider optimization');
    }

    if (metrics.falsePositives > 10) {
      recommendations.push('High false positive rate detected - review threat detection rules');
    }

    // General recommendations
    if (recommendations.length === 0) {
      recommendations.push('Security posture is stable - continue monitoring');
    }

    return recommendations;
  }

  private calculateRiskLevel(patterns: SuspiciousPattern[], trends: ThreatTrend[]): 'low' | 'medium' | 'high' | 'critical' {
    let riskScore = 0;

    // Score based on patterns
    patterns.forEach(pattern => {
      switch (pattern.severity) {
        case 'critical': riskScore += 40; break;
        case 'high': riskScore += 20; break;
        case 'medium': riskScore += 10; break;
        case 'low': riskScore += 5; break;
      }
    });

    // Score based on trends
    trends.forEach(trend => {
      if (trend.trend === 'increasing' && trend.percentageChange > 25) {
        riskScore += 15;
      }
    });

    if (riskScore >= 80) return 'critical';
    if (riskScore >= 50) return 'high';
    if (riskScore >= 20) return 'medium';
    return 'low';
  }

  private async logAuditResults(report: SecurityAuditReport): Promise<void> {
    try {
      await supabase.from('security_audit_log').insert({
        event_type: 'security_audit_completed',
        event_data: {
          riskLevel: report.riskLevel,
          totalEvents: report.totalEvents,
          patternsFound: report.suspiciousPatterns.length,
          recommendations: report.recommendations.length,
          auditTimestamp: report.timestamp
        }
      });
    } catch (error) {
      productionLogger.error('Failed to log audit results', error, 'SecurityAuditService');
    }
  }

  private async alertAdministrators(report: SecurityAuditReport): Promise<void> {
    productionLogger.secureWarn('HIGH RISK SECURITY AUDIT FINDINGS', {
      riskLevel: report.riskLevel,
      criticalPatterns: report.suspiciousPatterns.filter(p => p.severity === 'critical').length,
      recommendations: report.recommendations
    });

    // Here you would implement actual alerting (email, Slack, etc.)
    console.warn('🚨 SECURITY ALERT: High-risk findings detected in security audit');
  }

  private groupEventsByType(events: any[]): Record<string, any[]> {
    return events.reduce((groups, event) => {
      const type = event.event_type;
      groups[type] = groups[type] || [];
      groups[type].push(event);
      return groups;
    }, {});
  }

  private groupEventsByIP(events: any[]): Record<string, any[]> {
    return events.reduce((groups, event) => {
      const ip = event.ip_address || 'unknown';
      groups[ip] = groups[ip] || [];
      groups[ip].push(event);
      return groups;
    }, {});
  }

  private countEventsByType(events: any[]): Record<string, number> {
    return events.reduce((counts, event) => {
      const type = event.event_type;
      counts[type] = (counts[type] || 0) + 1;
      return counts;
    }, {});
  }

  stopMonitoring(): void {
    if (this.auditInterval) {
      clearInterval(this.auditInterval);
      this.auditInterval = null;
      productionLogger.secureInfo('Continuous security monitoring stopped');
    }
  }

  async getLatestAuditReport(): Promise<SecurityAuditReport | null> {
    try {
      return await this.performSecurityAudit();
    } catch (error) {
      productionLogger.error('Failed to get latest audit report', error, 'SecurityAuditService');
      return null;
    }
  }
}

export const securityAuditService = SecurityAuditService.getInstance();
