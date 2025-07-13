interface ThreatDetectionResult {
  shouldBlock: boolean;
  threatTypes: string[];
  riskScore: number;
  details?: Record<string, any>;
}

interface ThreatDetectionContext {
  inputType?: string;
  userAgent?: string;
  ip?: string;
  timestamp?: number;
}

interface ThreatEvent {
  id: string;
  eventType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  userId?: string;
  details: Record<string, any>;
}

interface BehaviorAnalysis {
  riskScore: number;
  recommendation: string;
  patterns: string[];
}

export class EnhancedThreatDetection {
  private static instance: EnhancedThreatDetection;
  private events: ThreatEvent[] = [];

  static getInstance(): EnhancedThreatDetection {
    if (!EnhancedThreatDetection.instance) {
      EnhancedThreatDetection.instance = new EnhancedThreatDetection();
    }
    return EnhancedThreatDetection.instance;
  }

  async detectThreats(
    input: string,
    context: ThreatDetectionContext = {}
  ): Promise<ThreatDetectionResult> {
    const threatTypes: string[] = [];
    let riskScore = 0;
    const details: Record<string, any> = {};

    // XSS Detection
    if (this.detectXSS(input)) {
      threatTypes.push('XSS');
      riskScore += 8;
      details.xssPatterns = this.getXSSPatterns(input);
    }

    // SQL Injection Detection
    if (this.detectSQLInjection(input)) {
      threatTypes.push('SQL_INJECTION');
      riskScore += 9;
      details.sqlPatterns = this.getSQLPatterns(input);
    }

    // Command Injection Detection
    if (this.detectCommandInjection(input)) {
      threatTypes.push('COMMAND_INJECTION');
      riskScore += 7;
    }

    // Malicious Email Patterns
    if (context.inputType === 'email' && this.detectMaliciousEmail(input)) {
      threatTypes.push('MALICIOUS_EMAIL');
      riskScore += 5;
    }

    // Path Traversal
    if (this.detectPathTraversal(input)) {
      threatTypes.push('PATH_TRAVERSAL');
      riskScore += 6;
    }

    // Log the threat if detected
    if (threatTypes.length > 0) {
      this.logThreatEvent({
        eventType: 'threat_detected',
        severity: riskScore >= 8 ? 'critical' : riskScore >= 6 ? 'high' : riskScore >= 4 ? 'medium' : 'low',
        userId: context.ip,
        details: { input: input.substring(0, 100), threatTypes, riskScore }
      });
    }

    return {
      shouldBlock: riskScore >= 7,
      threatTypes,
      riskScore,
      details: Object.keys(details).length > 0 ? details : undefined
    };
  }

  getRecentEvents(limit: number = 50): ThreatEvent[] {
    return this.events
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async analyzeBehaviorPatterns(userId: string): Promise<BehaviorAnalysis> {
    const userEvents = this.events.filter(event => event.userId === userId);
    const recentEvents = userEvents.filter(event => 
      Date.now() - event.timestamp.getTime() < 24 * 60 * 60 * 1000
    );

    let riskScore = 0;
    const patterns: string[] = [];

    // Analyze frequency of threats
    if (recentEvents.length > 10) {
      riskScore += 30;
      patterns.push('high_frequency_threats');
    }

    // Analyze severity of threats
    const criticalThreats = recentEvents.filter(e => e.severity === 'critical');
    if (criticalThreats.length > 3) {
      riskScore += 40;
      patterns.push('multiple_critical_threats');
    }

    // Analyze threat types diversity
    const threatTypes = new Set(recentEvents.map(e => e.eventType));
    if (threatTypes.size > 5) {
      riskScore += 20;
      patterns.push('diverse_attack_vectors');
    }

    let recommendation = 'User activity appears normal';
    if (riskScore >= 70) {
      recommendation = 'Immediate action required - consider blocking user';
    } else if (riskScore >= 40) {
      recommendation = 'Monitor closely - restrict sensitive operations';
    } else if (riskScore >= 20) {
      recommendation = 'Monitor user activity for suspicious patterns';
    }

    return {
      riskScore,
      recommendation,
      patterns
    };
  }

  cleanupOldEvents(hoursToKeep: number = 168): void {
    const cutoffTime = Date.now() - (hoursToKeep * 60 * 60 * 1000);
    this.events = this.events.filter(event => event.timestamp.getTime() > cutoffTime);
  }

  private logThreatEvent(eventData: Omit<ThreatEvent, 'id' | 'timestamp'>): void {
    const event: ThreatEvent = {
      id: `threat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      ...eventData
    };
    
    this.events.push(event);
    
    // Keep only last 1000 events to prevent memory issues
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000);
    }
  }

  private detectXSS(input: string): boolean {
    const xssPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe[^>]*>/gi,
      /<object[^>]*>/gi,
      /<embed[^>]*>/gi,
      /<svg[^>]*onload/gi
    ];

    return xssPatterns.some(pattern => pattern.test(input));
  }

  private detectSQLInjection(input: string): boolean {
    const sqlPatterns = [
      /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b)/gi,
      /(\b(or|and)\s+\d+\s*=\s*\d+)/gi,
      /(';\s*(drop|delete|insert|update))/gi,
      /(\/\*|\*\/|--)/g,
      /(\bxp_|\bsp_)/gi
    ];

    return sqlPatterns.some(pattern => pattern.test(input));
  }

  private detectCommandInjection(input: string): boolean {
    const commandPatterns = [
      /(\||;|&|`|\$\(|\${)/g,
      /\b(cat|ls|pwd|whoami|id|uname|ps|netstat|ifconfig)\b/gi,
      /(\.\.\/|\.\.\\)/g
    ];

    return commandPatterns.some(pattern => pattern.test(input));
  }

  private detectMaliciousEmail(email: string): boolean {
    const maliciousPatterns = [
      /\+script/gi,
      /javascript:/gi,
      /<[^>]*>/g,
      /\.(exe|bat|cmd|scr|pif|com)$/gi
    ];

    return maliciousPatterns.some(pattern => pattern.test(email));
  }

  private detectPathTraversal(input: string): boolean {
    const traversalPatterns = [
      /(\.\.\/|\.\.\\)/g,
      /(%2e%2e%2f|%2e%2e%5c)/gi,
      /(\.\.\%2f|\.\.\%5c)/gi
    ];

    return traversalPatterns.some(pattern => pattern.test(input));
  }

  private getXSSPatterns(input: string): string[] {
    const patterns: string[] = [];
    if (/<script/gi.test(input)) patterns.push('script_tag');
    if (/javascript:/gi.test(input)) patterns.push('javascript_protocol');
    if (/on\w+\s*=/gi.test(input)) patterns.push('event_handler');
    return patterns;
  }

  private getSQLPatterns(input: string): string[] {
    const patterns: string[] = [];
    if (/union/gi.test(input)) patterns.push('union_select');
    if (/(or|and)\s+\d+\s*=\s*\d+/gi.test(input)) patterns.push('boolean_injection');
    if (/(--|\*\/)/g.test(input)) patterns.push('comment_injection');
    return patterns;
  }
}

export const enhancedThreatDetection = EnhancedThreatDetection.getInstance();
