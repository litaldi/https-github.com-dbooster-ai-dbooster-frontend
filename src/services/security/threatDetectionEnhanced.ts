import { productionLogger } from '@/utils/productionLogger';

interface ThreatEvent {
  id: string;
  timestamp: number;
  threatType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  input: string;
  context: Record<string, any>;
  blocked: boolean;
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
        timestamp: Date.now(),
        threatType: threatTypes.join(', '),
        severity: maxSeverity,
        input: input.substring(0, 200), // Limit logged input length
        context,
        blocked: shouldBlock
      });
    }

    return {
      threatDetected,
      severity: maxSeverity,
      threatTypes,
      shouldBlock
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
      threatType: event.threatType,
      severity: event.severity,
      blocked: event.blocked
    }, 'ThreatDetection');
  }

  private generateThreatId(): string {
    return 'threat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  cleanupOldEvents(maxAgeHours: number = 24): void {
    const cutoff = Date.now() - (maxAgeHours * 60 * 60 * 1000);
    this.threatEvents = this.threatEvents.filter(event => event.timestamp > cutoff);
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
      threatTypeCounts[event.threatType] = (threatTypeCounts[event.threatType] || 0) + 1;
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
