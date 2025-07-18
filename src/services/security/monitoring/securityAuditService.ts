import { supabase } from '@/integrations/supabase/client';
import { productionLogger } from '@/utils/productionLogger';
import type { AuditReport } from '../types/securityEvent';

export class SecurityAuditService {
  private static instance: SecurityAuditService;
  private isMonitoring = false;
  private monitoringInterval: NodeJS.Timeout | null = null;

  static getInstance(): SecurityAuditService {
    if (!SecurityAuditService.instance) {
      SecurityAuditService.instance = new SecurityAuditService();
    }
    return SecurityAuditService.instance;
  }

  async startContinuousMonitoring(): Promise<void> {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    productionLogger.secureInfo('Starting continuous security audit monitoring');
    
    // Run audit every 15 minutes
    this.monitoringInterval = setInterval(async () => {
      await this.performSecurityAudit();
    }, 15 * 60 * 1000);
  }

  stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    this.isMonitoring = false;
    productionLogger.secureInfo('Stopped continuous security audit monitoring');
  }

  async getLatestAuditReport(): Promise<AuditReport | null> {
    try {
      const { data: auditLogs } = await supabase
        .from('security_audit_log')
        .select('*')
        .eq('event_type', 'security_audit_completed')
        .order('created_at', { ascending: false })
        .limit(1);

      if (!auditLogs || auditLogs.length === 0) return null;

      const latestLog = auditLogs[0];
      const eventData = latestLog.event_data as any;

      return {
        id: latestLog.id,
        timestamp: new Date(latestLog.created_at),
        riskLevel: eventData?.riskLevel || 'low',
        totalEvents: eventData?.totalEvents || 0,
        suspiciousPatterns: eventData?.suspiciousPatterns || [],
        recommendations: eventData?.recommendations || [],
        summary: eventData?.summary || 'No audit summary available'
      };
    } catch (error) {
      productionLogger.error('Failed to get latest audit report', error, 'SecurityAuditService');
      return null;
    }
  }

  async performSecurityAudit(): Promise<AuditReport> {
    try {
      productionLogger.secureInfo('Starting security audit');
      
      const [eventStats, suspiciousPatterns] = await Promise.all([
        this.analyzeSecurityEvents(),
        this.detectSuspiciousPatterns()
      ]);

      const riskLevel = this.calculateOverallRisk(eventStats, suspiciousPatterns);
      const recommendations = this.generateRecommendations(eventStats, suspiciousPatterns, riskLevel);

      const report: AuditReport = {
        id: crypto.randomUUID(),
        timestamp: new Date(),
        riskLevel,
        totalEvents: eventStats.totalEvents,
        suspiciousPatterns,
        recommendations,
        summary: this.generateAuditSummary(eventStats, suspiciousPatterns, riskLevel)
      };

      await this.storeAuditReport(report);
      return report;
    } catch (error) {
      productionLogger.error('Security audit failed', error, 'SecurityAuditService');
      throw error;
    }
  }

  private async analyzeSecurityEvents(): Promise<{
    totalEvents: number;
    threatEvents: number;
    blockedEvents: number;
    recentActivity: number;
  }> {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [totalResult, threatResult, blockedResult] = await Promise.all([
      supabase
        .from('security_audit_log')
        .select('id', { count: 'exact' })
        .gte('created_at', twentyFourHoursAgo.toISOString()),
      
      supabase
        .from('security_audit_log')
        .select('id', { count: 'exact' })
        .in('event_type', ['security_validation_threat_detected', 'suspicious_activity_detected'])
        .gte('created_at', twentyFourHoursAgo.toISOString()),
      
      supabase
        .from('rate_limit_tracking')
        .select('id', { count: 'exact' })
        .eq('action_type', 'security_block')
        .gte('created_at', twentyFourHoursAgo.toISOString())
    ]);

    return {
      totalEvents: totalResult.count || 0,
      threatEvents: threatResult.count || 0,
      blockedEvents: blockedResult.count || 0,
      recentActivity: totalResult.count || 0
    };
  }

  private async detectSuspiciousPatterns(): Promise<Array<{
    pattern: string;
    occurrences: number;
    riskLevel: string;
  }>> {
    try {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      
      const { data: events } = await supabase
        .from('security_audit_log')
        .select('*')
        .gte('created_at', oneHourAgo.toISOString());

      if (!events) return [];

      const patterns = [];
      
      // Analyze IP patterns
      const ipCounts = this.countEventsByField(events, 'ip_address');
      for (const [ip, count] of Object.entries(ipCounts)) {
        if (count > 20) { // More than 20 events per hour from one IP
          patterns.push({
            pattern: `High frequency activity from IP: ${ip}`,
            occurrences: count,
            riskLevel: count > 50 ? 'high' : 'medium'
          });
        }
      }

      // Analyze user patterns
      const userCounts = this.countEventsByField(events, 'user_id');
      for (const [userId, count] of Object.entries(userCounts)) {
        if (count > 30) { // More than 30 events per hour from one user
          patterns.push({
            pattern: `High frequency activity from user: ${userId}`,
            occurrences: count,
            riskLevel: count > 60 ? 'high' : 'medium'
          });
        }
      }

      return patterns;
    } catch (error) {
      productionLogger.error('Pattern detection failed', error, 'SecurityAuditService');
      return [];
    }
  }

  private countEventsByField(events: any[], field: string): Record<string, number> {
    const counts: Record<string, number> = {};
    events.forEach(event => {
      const value = event[field];
      if (value) {
        counts[value] = (counts[value] || 0) + 1;
      }
    });
    return counts;
  }

  private calculateOverallRisk(
    eventStats: any,
    patterns: any[]
  ): 'low' | 'medium' | 'high' | 'critical' {
    const highRiskPatterns = patterns.filter(p => p.riskLevel === 'high').length;
    const threatRatio = eventStats.totalEvents > 0 ? eventStats.threatEvents / eventStats.totalEvents : 0;

    if (highRiskPatterns > 3 || threatRatio > 0.3) return 'critical';
    if (highRiskPatterns > 1 || threatRatio > 0.1) return 'high';
    if (patterns.length > 0 || threatRatio > 0.05) return 'medium';
    return 'low';
  }

  private generateRecommendations(
    eventStats: any,
    patterns: any[],
    riskLevel: string
  ): string[] {
    const recommendations = [];

    if (riskLevel === 'critical' || riskLevel === 'high') {
      recommendations.push('Immediate security review required');
      recommendations.push('Consider temporarily restricting access from suspicious IPs');
    }

    if (patterns.length > 0) {
      recommendations.push('Monitor identified patterns closely');
      recommendations.push('Consider implementing additional rate limiting');
    }

    if (eventStats.threatEvents > 10) {
      recommendations.push('Review and strengthen input validation');
      recommendations.push('Update threat detection patterns');
    }

    if (recommendations.length === 0) {
      recommendations.push('Security posture is acceptable');
      recommendations.push('Continue regular monitoring');
    }

    return recommendations;
  }

  private generateAuditSummary(
    eventStats: any,
    patterns: any[],
    riskLevel: string
  ): string {
    return `Security audit completed. Risk level: ${riskLevel}. ` +
           `Total events: ${eventStats.totalEvents}, ` +
           `Threat events: ${eventStats.threatEvents}, ` +
           `Suspicious patterns: ${patterns.length}`;
  }

  private async storeAuditReport(report: AuditReport): Promise<void> {
    try {
      await supabase.from('security_audit_log').insert({
        event_type: 'security_audit_completed',
        event_data: {
          riskLevel: report.riskLevel,
          totalEvents: report.totalEvents,
          patternsFound: report.suspiciousPatterns.length,
          recommendations: report.recommendations.length,
          auditTimestamp: report.timestamp.toISOString()
        }
      });
    } catch (error) {
      productionLogger.error('Failed to store audit report', error, 'SecurityAuditService');
    }
  }
}

export const securityAuditService = SecurityAuditService.getInstance();
