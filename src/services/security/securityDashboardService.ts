
import { enhancedThreatDetection } from './threatDetectionEnhanced';
import { rbac } from './roleBasedAccessControl';
import { supabase } from '@/integrations/supabase/client';
import { productionLogger } from '@/utils/productionLogger';

export interface SecurityMetrics {
  totalEvents: number;
  criticalThreats: number;
  blockedRequests: number;
  suspiciousUsers: number;
  systemHealth: 'healthy' | 'warning' | 'critical';
  lastUpdated: Date;
}

export interface SecuritySummary {
  metrics: SecurityMetrics;
  recentThreats: Array<{
    id: string;
    type: string;
    severity: string;
    timestamp: Date;
    userId?: string;
  }>;
  topRisks: Array<{
    risk: string;
    count: number;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }>;
}

export class SecurityDashboardService {
  private static instance: SecurityDashboardService;

  static getInstance(): SecurityDashboardService {
    if (!SecurityDashboardService.instance) {
      SecurityDashboardService.instance = new SecurityDashboardService();
    }
    return SecurityDashboardService.instance;
  }

  async getSecuritySummary(userId: string): Promise<SecuritySummary> {
    // Check if user has permission to view security metrics
    await rbac.requirePermission(userId, 'canViewSecurityMetrics');

    try {
      // Get security audit log data
      const { data: auditLogs, error: auditError } = await supabase
        .from('security_audit_log')
        .select('id, event_type, event_data, created_at, user_id')
        .order('created_at', { ascending: false })
        .limit(100);

      if (auditError) {
        productionLogger.error('Failed to fetch audit logs for security summary', auditError, 'SecurityDashboard');
        throw new Error('Failed to fetch security data');
      }

      // Get recent threat events
      const recentEvents = enhancedThreatDetection.getRecentEvents(20);

      // Calculate metrics
      const totalEvents = auditLogs?.length || 0;
      const criticalThreats = recentEvents.filter(e => e.severity === 'critical').length;
      const blockedRequests = auditLogs?.filter(log => 
        log.event_type.includes('blocked') || log.event_type.includes('denied')
      ).length || 0;

      // Count suspicious users (users with multiple threat detections)
      const userThreatCounts = new Map<string, number>();
      recentEvents.forEach(event => {
        if (event.userId) {
          userThreatCounts.set(event.userId, (userThreatCounts.get(event.userId) || 0) + 1);
        }
      });
      const suspiciousUsers = Array.from(userThreatCounts.values()).filter(count => count > 3).length;

      // Determine system health
      let systemHealth: 'healthy' | 'warning' | 'critical' = 'healthy';
      if (criticalThreats > 10 || suspiciousUsers > 5) {
        systemHealth = 'critical';
      } else if (criticalThreats > 3 || suspiciousUsers > 2) {
        systemHealth = 'warning';
      }

      // Prepare recent threats
      const recentThreats = recentEvents.slice(0, 10).map(event => ({
        id: `threat_${Date.now()}_${Math.random()}`,
        type: event.eventType,
        severity: event.severity,
        timestamp: event.timestamp,
        userId: event.userId
      }));

      // Calculate top risks
      const riskCounts = new Map<string, { count: number; severity: 'low' | 'medium' | 'high' | 'critical' }>();
      recentEvents.forEach(event => {
        const risk = event.details.pattern || event.eventType;
        if (riskCounts.has(risk)) {
          riskCounts.get(risk)!.count++;
        } else {
          riskCounts.set(risk, { count: 1, severity: event.severity });
        }
      });

      const topRisks = Array.from(riskCounts.entries())
        .map(([risk, data]) => ({ risk, ...data }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      return {
        metrics: {
          totalEvents,
          criticalThreats,
          blockedRequests,
          suspiciousUsers,
          systemHealth,
          lastUpdated: new Date()
        },
        recentThreats,
        topRisks
      };
    } catch (error) {
      productionLogger.error('Failed to generate security summary', error, 'SecurityDashboard');
      throw new Error('Failed to generate security summary');
    }
  }

  async getUserSecurityStatus(currentUserId: string, targetUserId: string): Promise<{
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    recentActivity: number;
    threats: number;
    recommendation: string;
  }> {
    // Check permissions
    const canViewUserData = await rbac.hasPermission(currentUserId, 'canViewSecurityMetrics');
    if (!canViewUserData && currentUserId !== targetUserId) {
      throw new Error('Insufficient permissions to view user security status');
    }

    const analysis = await enhancedThreatDetection.analyzeBehaviorPatterns(targetUserId);

    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (analysis.riskScore >= 80) {
      riskLevel = 'critical';
    } else if (analysis.riskScore >= 60) {
      riskLevel = 'high';
    } else if (analysis.riskScore >= 30) {
      riskLevel = 'medium';
    }

    const recentEvents = enhancedThreatDetection.getRecentEvents().filter(e => e.userId === targetUserId);
    const recentActivity = recentEvents.filter(e => 
      Date.now() - e.timestamp.getTime() < 24 * 60 * 60 * 1000
    ).length;
    
    const threats = recentEvents.filter(e => e.eventType === 'threat_detected').length;

    let recommendation = 'User activity appears normal';
    if (riskLevel === 'critical') {
      recommendation = 'Immediate action required - consider blocking user';
    } else if (riskLevel === 'high') {
      recommendation = 'Monitor closely - restrict sensitive operations';
    } else if (riskLevel === 'medium') {
      recommendation = 'Monitor user activity for suspicious patterns';
    }

    return {
      riskLevel,
      recentActivity,
      threats,
      recommendation
    };
  }
}

export const securityDashboard = SecurityDashboardService.getInstance();
