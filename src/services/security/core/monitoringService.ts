
import { auditLogger } from '../../auditLogger';
import { rateLimitService } from '../rateLimitService';
import { enhancedThreatDetection } from '../threatDetectionEnhanced';
import { securityDashboard } from '../securityDashboardService';

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  retryAfter?: number;
  remainingAttempts: number;
}

interface AuditSecurityEvent {
  event_type: string;
  event_data?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}

export class MonitoringService {
  private static instance: MonitoringService;

  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  async getEnhancedSecuritySummary(): Promise<any> {
    try {
      const { enhancedSecurityMonitor } = await import('../enhancedSecurityMonitor');
      return await enhancedSecurityMonitor.getSecuritySummary();
    } catch (error) {
      console.error('Failed to get enhanced security summary:', error);
      return {
        totalEvents: 0,
        threatsDetected: 0,
        blockedIPs: 0,
        recentHighRiskEvents: []
      };
    }
  }

  async getSecurityDashboard(userId: string): Promise<any> {
    return securityDashboard.getSecuritySummary(userId);
  }

  async getUserSecurityStatus(currentUserId: string, targetUserId: string): Promise<any> {
    return securityDashboard.getUserSecurityStatus(currentUserId, targetUserId);
  }

  async logSecurityEvent(event: AuditSecurityEvent): Promise<void> {
    return auditLogger.logSecurityEvent(event);
  }

  async checkRateLimit(identifier: string, actionType: string): Promise<RateLimitResult> {
    const result = await rateLimitService.checkRateLimit(identifier, actionType);
    return {
      allowed: result.allowed,
      remaining: result.remaining,
      resetTime: result.resetTime,
      retryAfter: result.retryAfter,
      remainingAttempts: result.remaining // Map remaining to remainingAttempts
    };
  }

  async logAuthEvent(eventType: string, success: boolean, details?: Record<string, any>): Promise<void> {
    return auditLogger.logAuthEvent(eventType, success, details);
  }

  async detectSuspiciousActivity(userId: string): Promise<{
    suspicious: boolean;
    riskScore: number;
    recommendation: string;
  }> {
    const analysis = await enhancedThreatDetection.analyzeBehaviorPatterns(userId);
    return {
      suspicious: analysis.riskScore > 50,
      riskScore: analysis.riskScore,
      recommendation: analysis.recommendation
    };
  }
}
