import { productionLogger } from '@/utils/productionLogger';
import { realTimeSecurityMonitor } from './realTimeSecurityMonitor';

interface ThreatPattern {
  name: string;
  pattern: RegExp;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

interface IPThreatInfo {
  ip: string;
  threatScore: number;
  isBlocked: boolean;
  blockedUntil?: number;
  failureCount: number;
  lastFailure?: number;
}

interface ThreatDetectionResult {
  threatDetected: boolean;
  threatTypes: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  blocked: boolean;
  reason?: string;
}

interface SecurityEvent {
  id: string;
  eventType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  userId?: string;
  details: Record<string, any>;
}

interface BehaviorAnalysis {
  riskScore: number;
  patterns: string[];
  anomalies: string[];
  recommendation: string;
}

class EnhancedThreatDetection {
  private static instance: EnhancedThreatDetection;
  private threatPatterns: ThreatPattern[] = [];
  private ipThreatMap = new Map<string, IPThreatInfo>();
  private securityEvents: SecurityEvent[] = [];
  private readonly BLOCK_DURATION = 60 * 60 * 1000; // 1 hour
  private readonly MAX_FAILURES = 5;
  private readonly FAILURE_WINDOW = 15 * 60 * 1000; // 15 minutes

  static getInstance(): EnhancedThreatDetection {
    if (!EnhancedThreatDetection.instance) {
      EnhancedThreatDetection.instance = new EnhancedThreatDetection();
    }
    return EnhancedThreatDetection.instance;
  }

  constructor() {
    this.initializeThreatPatterns();
  }

  private initializeThreatPatterns(): void {
    this.threatPatterns = [
      // SQL Injection patterns
      {
        name: 'SQL_INJECTION',
        pattern: /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b)|('(''|[^'])*')|(--)|(\b(or|and)\b\s*\d+\s*=\s*\d+)/i,
        severity: 'critical',
        description: 'SQL injection attempt detected'
      },
      // XSS patterns
      {
        name: 'XSS_SCRIPT',
        pattern: /<script[^>]*>.*?<\/script>/i,
        severity: 'high',
        description: 'Cross-site scripting attempt detected'
      },
      {
        name: 'XSS_EVENT_HANDLER',
        pattern: /on\w+\s*=\s*['"]/i,
        severity: 'high',
        description: 'Malicious event handler detected'
      },
      // Command injection
      {
        name: 'COMMAND_INJECTION',
        pattern: /[;&|`$(){}[\]\\]/,
        severity: 'critical',
        description: 'Command injection attempt detected'
      },
      // Path traversal
      {
        name: 'PATH_TRAVERSAL',
        pattern: /(\.\.[\/\\])+/,
        severity: 'high',
        description: 'Path traversal attempt detected'
      },
      // LDAP injection
      {
        name: 'LDAP_INJECTION',
        pattern: /[()=*&|!]/,
        severity: 'medium',
        description: 'LDAP injection attempt detected'
      },
      // NoSQL injection
      {
        name: 'NOSQL_INJECTION',
        pattern: /\$where|\$ne|\$gt|\$lt|\$regex/i,
        severity: 'high',
        description: 'NoSQL injection attempt detected'
      }
    ];
  }

  async detectThreats(
    input: string, 
    context: { 
      inputType?: string; 
      userAgent?: string; 
      ipAddress?: string; 
    } = {}
  ): Promise<ThreatDetectionResult> {
    const threatTypes: string[] = [];
    let maxSeverity: 'low' | 'medium' | 'high' | 'critical' = 'low';
    let blocked = false;

    // Check IP-based threats first
    if (context.ipAddress) {
      const ipThreat = this.checkIPThreat(context.ipAddress);
      if (ipThreat.isBlocked) {
        return {
          threatDetected: true,
          threatTypes: ['IP_BLOCKED'],
          severity: 'critical',
          blocked: true,
          reason: 'IP address is currently blocked due to suspicious activity'
        };
      }
    }

    // Pattern-based threat detection
    for (const pattern of this.threatPatterns) {
      if (pattern.pattern.test(input)) {
        threatTypes.push(pattern.name);
        if (this.getSeverityLevel(pattern.severity) > this.getSeverityLevel(maxSeverity)) {
          maxSeverity = pattern.severity;
        }

        productionLogger.warn(`Threat detected: ${pattern.name}`, {
          inputType: context.inputType,
          threatDescription: pattern.description,
          userAgent: context.userAgent,
          ipAddress: context.ipAddress
        });
      }
    }

    // Behavioral analysis
    const behavioralThreats = this.analyzeBehavioralPatterns(input, context);
    threatTypes.push(...behavioralThreats);

    const threatDetected = threatTypes.length > 0;

    // Auto-block for critical threats
    if (maxSeverity === 'critical' && context.ipAddress) {
      this.blockIP(context.ipAddress, 'Critical threat detected');
      blocked = true;
    }

    // Log threat event
    if (threatDetected) {
      realTimeSecurityMonitor.logSecurityEvent({
        type: 'security_violation',
        severity: maxSeverity,
        message: `Security threat detected: ${threatTypes.join(', ')}`,
        metadata: {
          threatTypes,
          inputType: context.inputType,
          userAgent: context.userAgent,
          ipAddress: context.ipAddress,
          blocked
        }
      });
    }

    return {
      threatDetected,
      threatTypes,
      severity: maxSeverity,
      blocked
    };
  }

  private checkIPThreat(ipAddress: string): IPThreatInfo {
    const existing = this.ipThreatMap.get(ipAddress);
    if (!existing) {
      const newInfo: IPThreatInfo = {
        ip: ipAddress,
        threatScore: 0,
        isBlocked: false,
        failureCount: 0
      };
      this.ipThreatMap.set(ipAddress, newInfo);
      return newInfo;
    }

    // Check if block has expired
    if (existing.isBlocked && existing.blockedUntil && Date.now() > existing.blockedUntil) {
      existing.isBlocked = false;
      existing.blockedUntil = undefined;
      existing.failureCount = 0;
    }

    return existing;
  }

  recordFailedAttempt(ipAddress: string, reason: string): void {
    const threatInfo = this.checkIPThreat(ipAddress);
    threatInfo.failureCount++;
    threatInfo.lastFailure = Date.now();
    threatInfo.threatScore += 10;

    // Auto-block after max failures
    if (threatInfo.failureCount >= this.MAX_FAILURES) {
      this.blockIP(ipAddress, `Too many failed attempts: ${reason}`);
    }

    realTimeSecurityMonitor.logSecurityEvent({
      type: 'suspicious_activity',
      severity: 'medium',
      message: `Failed attempt recorded for IP: ${ipAddress}`,
      metadata: {
        ipAddress,
        reason,
        failureCount: threatInfo.failureCount,
        threatScore: threatInfo.threatScore
      }
    });
  }

  private blockIP(ipAddress: string, reason: string): void {
    const threatInfo = this.checkIPThreat(ipAddress);
    threatInfo.isBlocked = true;
    threatInfo.blockedUntil = Date.now() + this.BLOCK_DURATION;
    threatInfo.threatScore += 50;

    productionLogger.error(`IP blocked: ${ipAddress}`, {
      reason,
      blockedUntil: new Date(threatInfo.blockedUntil).toISOString(),
      threatScore: threatInfo.threatScore
    });

    realTimeSecurityMonitor.logSecurityEvent({
      type: 'security_violation',
      severity: 'critical',
      message: `IP address blocked: ${ipAddress}`,
      metadata: {
        ipAddress,
        reason,
        blockedUntil: threatInfo.blockedUntil,
        threatScore: threatInfo.threatScore
      }
    });
  }

  private analyzeBehavioralPatterns(input: string, context: any): string[] {
    const threats: string[] = [];

    // Check for unusual input length
    if (input.length > 10000) {
      threats.push('OVERSIZED_INPUT');
    }

    // Check for excessive special characters
    const specialCharCount = (input.match(/[^a-zA-Z0-9\s]/g) || []).length;
    if (specialCharCount > input.length * 0.3) {
      threats.push('EXCESSIVE_SPECIAL_CHARS');
    }

    // Check for base64 encoding (potential payload)
    if (/^[A-Za-z0-9+\/]+=*$/.test(input) && input.length > 20) {
      threats.push('POTENTIAL_ENCODED_PAYLOAD');
    }

    // Check user agent patterns
    if (context.userAgent) {
      if (/bot|crawler|spider|scan/i.test(context.userAgent)) {
        threats.push('AUTOMATED_TOOL');
      }
      if (context.userAgent.length > 500) {
        threats.push('SUSPICIOUS_USER_AGENT');
      }
    }

    return threats;
  }

  private getSeverityLevel(severity: string): number {
    const levels = { low: 1, medium: 2, high: 3, critical: 4 };
    return levels[severity as keyof typeof levels] || 1;
  }

  getThreatStatistics(): {
    totalThreats: number;
    blockedIPs: number;
    threatsByType: Record<string, number>;
    averageThreatScore: number;
  } {
    const threatsByType: Record<string, number> = {};
    let totalThreats = 0;
    let totalScore = 0;
    let blockedIPs = 0;

    for (const [ip, info] of this.ipThreatMap.entries()) {
      if (info.isBlocked) blockedIPs++;
      totalScore += info.threatScore;
      totalThreats++;
    }

    return {
      totalThreats,
      blockedIPs,
      threatsByType,
      averageThreatScore: totalThreats > 0 ? totalScore / totalThreats : 0
    };
  }

  unblockIP(ipAddress: string): boolean {
    const threatInfo = this.ipThreatMap.get(ipAddress);
    if (threatInfo && threatInfo.isBlocked) {
      threatInfo.isBlocked = false;
      threatInfo.blockedUntil = undefined;
      threatInfo.failureCount = 0;
      threatInfo.threatScore = Math.max(0, threatInfo.threatScore - 25);
      
      productionLogger.info(`IP unblocked: ${ipAddress}`);
      return true;
    }
    return false;
  }

  getBlockedIPs(): string[] {
    return Array.from(this.ipThreatMap.entries())
      .filter(([_, info]) => info.isBlocked)
      .map(([ip]) => ip);
  }

  analyzeBehaviorPatterns(userId: string): Promise<BehaviorAnalysis> {
    return new Promise((resolve) => {
      // Get user's recent security events
      const userEvents = this.securityEvents.filter(event => 
        event.userId === userId && 
        Date.now() - event.timestamp.getTime() < 24 * 60 * 60 * 1000 // Last 24 hours
      );

      let riskScore = 0;
      const patterns: string[] = [];
      const anomalies: string[] = [];

      // Analyze patterns
      if (userEvents.length > 10) {
        patterns.push('high_activity');
        riskScore += 20;
      }

      const criticalEvents = userEvents.filter(e => e.severity === 'critical');
      if (criticalEvents.length > 0) {
        patterns.push('critical_security_events');
        riskScore += 50;
      }

      const suspiciousEvents = userEvents.filter(e => e.eventType === 'suspicious_activity');
      if (suspiciousEvents.length > 3) {
        anomalies.push('repeated_suspicious_activity');
        riskScore += 30;
      }

      let recommendation = 'User behavior appears normal';
      if (riskScore > 70) {
        recommendation = 'High risk user - consider additional verification';
      } else if (riskScore > 30) {
        recommendation = 'Monitor user activity closely';
      }

      resolve({
        riskScore: Math.min(riskScore, 100),
        patterns,
        anomalies,
        recommendation
      });
    });
  }

  getRecentEvents(limit: number = 50): SecurityEvent[] {
    return this.securityEvents
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  cleanupOldEvents(maxAgeHours: number = 168): void {
    const cutoffTime = Date.now() - (maxAgeHours * 60 * 60 * 1000);
    const initialCount = this.securityEvents.length;
    
    this.securityEvents = this.securityEvents.filter(event => 
      event.timestamp.getTime() > cutoffTime
    );

    const removedCount = initialCount - this.securityEvents.length;
    if (removedCount > 0) {
      productionLogger.info(`Cleaned up ${removedCount} old security events`, {
        maxAgeHours,
        remainingEvents: this.securityEvents.length
      });
    }
  }

  private addSecurityEvent(event: Omit<SecurityEvent, 'id' | 'timestamp'>): void {
    const securityEvent: SecurityEvent = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      ...event
    };
    
    this.securityEvents.push(securityEvent);
    
    // Keep only recent events to prevent memory bloat
    if (this.securityEvents.length > 1000) {
      this.securityEvents = this.securityEvents.slice(-500);
    }
  }
}

export const enhancedThreatDetection = EnhancedThreatDetection.getInstance();
