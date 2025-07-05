
import { productionLogger } from '@/utils/productionLogger';

interface ThreatEvent {
  id: string;
  timestamp: Date;
  eventType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  input: string;
  context: Record<string, any>;
  blocked: boolean;
  userId?: string;
  details: Record<string, any>;
}

export class EnhancedThreatDetection {
  private static instance: EnhancedThreatDetection;
  private threatEvents: ThreatEvent[] = [];
  private suspiciousPatterns: RegExp[] = [];

  constructor() {
    this.initializeThreatPatterns();
  }

  static getInstance(): EnhancedThreatDetection {
    if (!EnhancedThreatDetection.instance) {
      EnhancedThreatDetection.instance = new EnhancedThreatDetection();
    }
    return EnhancedThreatDetection.instance;
  }

  private initializeThreatPatterns(): void {
    this.suspiciousPatterns = [
      // XSS patterns
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe\b[^>]*>/gi,
      
      // SQL Injection patterns
      /(union|select|insert|update|delete|drop|create|alter)\s+/gi,
      /(\bor\b|\band\b)\s+\d+\s*=\s*\d+/gi,
      /'\s*(or|and)\s*'.*?'/gi,
      
      // Command injection
      /[;&|`$(){}[\]]/g,
      /(wget|curl|nc|netcat|bash|sh|cmd|powershell)/gi,
      
      // Path traversal
      /\.\.[\/\\]/g,
      /(\/etc\/passwd|\/proc\/self\/environ)/gi,
      
      // Template injection
      /\$\{.*\}/g,
      /\{\{.*\}\}/g,
      
      // LDAP injection
      /[()=*!&|]/g
    ];
  }

  async detectThreats(input: string, context: Record<string, any> = {}): Promise<{
    threatDetected: boolean;
    severity: 'low' | 'medium' | 'high' | 'critical';
    threatTypes: string[];
    shouldBlock: boolean;
  }> {
    const threatTypes: string[] = [];
    let maxSeverity: 'low' | 'medium' | 'high' | 'critical' = 'low';

    // Check against known threat patterns
    for (const pattern of this.suspiciousPatterns) {
      if (pattern.test(input)) {
        const threatType = this.identifyThreatType(pattern);
        threatTypes.push(threatType);
        
        const severity = this.getSeverityForThreat(threatType);
        if (this.compareSeverity(severity, maxSeverity) > 0) {
          maxSeverity = severity;
        }
      }
    }

    // Additional context-based analysis
    const contextThreats = this.analyzeContext(input, context);
    threatTypes.push(...contextThreats.types);
    if (this.compareSeverity(contextThreats.severity, maxSeverity) > 0) {
      maxSeverity = contextThreats.severity;
    }

    const threatDetected = threatTypes.length > 0;
    const shouldBlock = maxSeverity === 'critical' || maxSeverity === 'high';

    if (threatDetected) {
      this.logThreatEvent({
        id: this.generateThreatId(),
        timestamp: new Date(),
        eventType: 'threat_detected',
        severity: maxSeverity,
        input: input.substring(0, 200), // Limit logged input length
        context,
        blocked: shouldBlock,
        userId: context.userId,
        details: { pattern: threatTypes.join(', ') }
      });
    }

    return {
      threatDetected,
      severity: maxSeverity,
      threatTypes,
      shouldBlock
    };
  }

  getRecentEvents(limit: number = 100): ThreatEvent[] {
    return this.threatEvents
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async analyzeBehaviorPatterns(userId: string): Promise<{
    riskScore: number;
    recommendation: string;
    patterns: string[];
  }> {
    const userEvents = this.threatEvents.filter(event => event.userId === userId);
    const recentEvents = userEvents.filter(event => 
      Date.now() - event.timestamp.getTime() < 24 * 60 * 60 * 1000 // Last 24 hours
    );

    let riskScore = 0;
    const patterns: string[] = [];

    // Calculate risk based on recent threat events
    const criticalThreats = recentEvents.filter(e => e.severity === 'critical').length;
    const highThreats = recentEvents.filter(e => e.severity === 'high').length;
    const totalThreats = recentEvents.length;

    riskScore += criticalThreats * 40;
    riskScore += highThreats * 20;
    riskScore += totalThreats * 5;

    // Pattern analysis
    if (criticalThreats > 0) {
      patterns.push('Critical security threats detected');
    }
    if (totalThreats > 10) {
      patterns.push('High frequency of security events');
    }
    if (recentEvents.some(e => e.eventType === 'suspicious_activity')) {
      patterns.push('Suspicious activity patterns');
    }

    // Cap risk score at 100
    riskScore = Math.min(100, riskScore);

    let recommendation = 'Normal user activity';
    if (riskScore >= 80) {
      recommendation = 'Immediate attention required - consider blocking user';
    } else if (riskScore >= 60) {
      recommendation = 'High risk - implement additional monitoring';
    } else if (riskScore >= 30) {
      recommendation = 'Moderate risk - monitor user activity';
    }

    return {
      riskScore,
      recommendation,
      patterns
    };
  }

  private identifyThreatType(pattern: RegExp): string {
    const patternString = pattern.toString();
    if (patternString.includes('script') || patternString.includes('javascript')) return 'XSS';
    if (patternString.includes('union') || patternString.includes('select')) return 'SQL_INJECTION';
    if (patternString.includes('bash') || patternString.includes('cmd')) return 'COMMAND_INJECTION';
    if (patternString.includes('..')) return 'PATH_TRAVERSAL';
    if (patternString.includes('${') || patternString.includes('{{')) return 'TEMPLATE_INJECTION';
    return 'SUSPICIOUS_PATTERN';
  }

  private getSeverityForThreat(threatType: string): 'low' | 'medium' | 'high' | 'critical' {
    switch (threatType) {
      case 'XSS':
      case 'SQL_INJECTION':
      case 'COMMAND_INJECTION':
        return 'critical';
      case 'PATH_TRAVERSAL':
      case 'TEMPLATE_INJECTION':
        return 'high';
      default:
        return 'medium';
    }
  }

  private compareSeverity(a: string, b: string): number {
    const levels = { low: 1, medium: 2, high: 3, critical: 4 };
    return (levels[a as keyof typeof levels] || 0) - (levels[b as keyof typeof levels] || 0);
  }

  private analyzeContext(input: string, context: Record<string, any>): {
    types: string[];
    severity: 'low' | 'medium' | 'high' | 'critical';
  } {
    const types: string[] = [];
    let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';

    // Check for suspicious user agents
    if (context.userAgent && /bot|crawler|spider/i.test(context.userAgent)) {
      types.push('SUSPICIOUS_BOT');
      severity = 'medium';
    }

    // Check for rapid successive requests (potential automation)
    if (context.requestCount && context.requestCount > 10) {
      types.push('RATE_LIMIT_VIOLATION');
      severity = 'high';
    }

    // Check for unusual input length
    if (input.length > 10000) {
      types.push('OVERSIZED_INPUT');
      severity = 'medium';
    }

    return { types, severity };
  }

  private logThreatEvent(event: ThreatEvent): void {
    this.threatEvents.push(event);
    
    // Keep only last 1000 events to prevent memory issues
    if (this.threatEvents.length > 1000) {
      this.threatEvents = this.threatEvents.slice(-1000);
    }

    productionLogger.warn('Threat detected', {
      threatId: event.id,
      threatType: event.eventType,
      severity: event.severity,
      blocked: event.blocked
    }, 'ThreatDetection');
  }

  private generateThreatId(): string {
    return 'threat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  cleanupOldEvents(maxAgeHours: number = 24): void {
    const cutoff = Date.now() - (maxAgeHours * 60 * 60 * 1000);
    this.threatEvents = this.threatEvents.filter(event => event.timestamp.getTime() > cutoff);
  }

  getThreatStatistics(): {
    totalThreats: number;
    threatsBlocked: number;
    severityBreakdown: Record<string, number>;
    topThreatTypes: Array<{ type: string; count: number }>;
  } {
    const severityBreakdown: Record<string, number> = {};
    const threatTypeCounts: Record<string, number> = {};

    this.threatEvents.forEach(event => {
      severityBreakdown[event.severity] = (severityBreakdown[event.severity] || 0) + 1;
      threatTypeCounts[event.eventType] = (threatTypeCounts[event.eventType] || 0) + 1;
    });

    const topThreatTypes = Object.entries(threatTypeCounts)
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalThreats: this.threatEvents.length,
      threatsBlocked: this.threatEvents.filter(e => e.blocked).length,
      severityBreakdown,
      topThreatTypes
    };
  }
}

export const enhancedThreatDetection = EnhancedThreatDetection.getInstance();
