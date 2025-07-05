
import { productionLogger } from '@/utils/productionLogger';
import { auditLogger } from '@/services/auditLogger';

export interface ThreatPattern {
  pattern: RegExp;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  action: 'log' | 'block' | 'alert';
}

export interface SecurityEvent {
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  eventType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: Record<string, any>;
  timestamp: Date;
}

export class EnhancedThreatDetection {
  private static instance: EnhancedThreatDetection;

  static getInstance(): EnhancedThreatDetection {
    if (!EnhancedThreatDetection.instance) {
      EnhancedThreatDetection.instance = new EnhancedThreatDetection();
    }
    return EnhancedThreatDetection.instance;
  }

  private readonly threatPatterns: ThreatPattern[] = [
    // SQL Injection patterns
    {
      pattern: /(\bUNION\b|\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b).*(\bFROM\b|\bWHERE\b|\bINTO\b)/i,
      severity: 'critical',
      description: 'SQL injection attempt detected',
      action: 'block'
    },
    
    // XSS patterns
    {
      pattern: /<script[^>]*>.*?<\/script>/i,
      severity: 'high',
      description: 'XSS script injection attempt',
      action: 'block'
    },
    
    // Command injection
    {
      pattern: /(\b(rm|cat|ls|pwd|whoami|nc|netcat|curl|wget|python|perl|php|sh|bash)\b)|(\||;|`|\$\()/i,
      severity: 'high',
      description: 'Command injection attempt detected',
      action: 'block'
    },
    
    // Path traversal
    {
      pattern: /\.\.\/|\.\.\\|%2e%2e%2f|%2e%2e\\|\.\.%2f|\.\.%5c/i,
      severity: 'medium',
      description: 'Path traversal attempt detected',
      action: 'block'
    },
    
    // Suspicious user agents
    {
      pattern: /(sqlmap|nmap|nikto|burp|w3af|owasp|zap)/i,
      severity: 'medium',
      description: 'Suspicious security scanner detected',
      action: 'alert'
    }
  ];

  private securityEvents: SecurityEvent[] = [];
  private readonly maxEvents = 1000;

  async detectThreats(input: string, context: {
    userId?: string;
    ipAddress?: string;
    userAgent?: string;
    inputType: string;
  }): Promise<{ threats: ThreatPattern[]; shouldBlock: boolean }> {
    const detectedThreats: ThreatPattern[] = [];

    for (const threat of this.threatPatterns) {
      if (threat.pattern.test(input)) {
        detectedThreats.push(threat);
        
        // Log security event
        await this.logSecurityEvent({
          userId: context.userId,
          ipAddress: context.ipAddress,
          userAgent: context.userAgent,
          eventType: 'threat_detected',
          severity: threat.severity,
          details: {
            pattern: threat.description,
            input: input.substring(0, 200), // Limit input logging
            inputType: context.inputType,
            threatLevel: threat.severity
          },
          timestamp: new Date()
        });
      }
    }

    const shouldBlock = detectedThreats.some(threat => 
      threat.action === 'block' && (threat.severity === 'high' || threat.severity === 'critical')
    );

    return { threats: detectedThreats, shouldBlock };
  }

  async analyzeBehaviorPatterns(userId: string): Promise<{
    riskScore: number;
    anomalies: string[];
    recommendation: 'allow' | 'monitor' | 'restrict' | 'block';
  }> {
    const userEvents = this.securityEvents.filter(event => event.userId === userId);
    const recentEvents = userEvents.filter(event => 
      Date.now() - event.timestamp.getTime() < 24 * 60 * 60 * 1000 // Last 24 hours
    );

    let riskScore = 0;
    const anomalies: string[] = [];

    // Check for rapid-fire requests
    const requestsLastHour = recentEvents.filter(event => 
      Date.now() - event.timestamp.getTime() < 60 * 60 * 1000
    ).length;

    if (requestsLastHour > 100) {
      riskScore += 30;
      anomalies.push('Unusually high request frequency');
    }

    // Check for multiple threat detections
    const threatEvents = recentEvents.filter(event => event.eventType === 'threat_detected');
    if (threatEvents.length > 5) {
      riskScore += 50;
      anomalies.push('Multiple security threats detected');
    }

    // Check for login failures
    const loginFailures = recentEvents.filter(event => 
      event.eventType === 'auth_login' && event.details.success === false
    ).length;

    if (loginFailures > 10) {
      riskScore += 40;
      anomalies.push('Multiple failed login attempts');
    }

    // Determine recommendation based on risk score
    let recommendation: 'allow' | 'monitor' | 'restrict' | 'block';
    if (riskScore >= 80) {
      recommendation = 'block';
    } else if (riskScore >= 60) {
      recommendation = 'restrict';
    } else if (riskScore >= 30) {
      recommendation = 'monitor';
    } else {
      recommendation = 'allow';
    }

    return { riskScore, anomalies, recommendation };
  }

  private async logSecurityEvent(event: SecurityEvent): Promise<void> {
    // Add to in-memory store
    this.securityEvents.push(event);
    
    // Maintain size limit
    if (this.securityEvents.length > this.maxEvents) {
      this.securityEvents.shift();
    }

    // Log to audit system
    await auditLogger.logSecurityEvent({
      event_type: event.eventType,
      event_data: {
        severity: event.severity,
        ...event.details
      }
    });

    // Log critical events immediately
    if (event.severity === 'critical' || event.severity === 'high') {
      productionLogger.error('Critical security threat detected', {
        eventType: event.eventType,
        severity: event.severity,
        userId: event.userId,
        timestamp: event.timestamp.toISOString()
      }, 'ThreatDetection');
    }
  }

  // Get recent security events for monitoring
  getRecentEvents(limit: number = 50): SecurityEvent[] {
    return this.securityEvents
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  // Clear old events (cleanup function)
  cleanupOldEvents(maxAgeHours: number = 168): void { // Default 7 days
    const cutoffTime = Date.now() - (maxAgeHours * 60 * 60 * 1000);
    this.securityEvents = this.securityEvents.filter(
      event => event.timestamp.getTime() > cutoffTime
    );
  }
}

export const enhancedThreatDetection = EnhancedThreatDetection.getInstance();
