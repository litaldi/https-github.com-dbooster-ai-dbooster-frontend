import { productionLogger } from '@/utils/productionLogger';

interface ThreatDetectionResult {
  shouldBlock: boolean;
  threatTypes: string[];
  confidence: number;
}

interface ThreatEvent {
  id: string;
  eventType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  userId?: string;
  details: {
    pattern?: string;
    input?: string;
    userAgent?: string;
    ip?: string;
  };
}

export class EnhancedThreatDetection {
  private recentEvents: ThreatEvent[] = [];

  async detectThreats(input: string, context: { inputType: string; userAgent?: string; ip?: string }): Promise<ThreatDetectionResult> {
    const threatTypes: string[] = [];
    let shouldBlock = false;

    // Basic SQL injection detection
    if (/(\bunion\b|\bselect\b|\binsert\b|\bupdate\b|\bdelete\b|\bdrop\b)/i.test(input)) {
      threatTypes.push('sql_injection');
      shouldBlock = true;
    }

    // XSS detection
    if (/<script|javascript:|on\w+=/i.test(input)) {
      threatTypes.push('xss');
      shouldBlock = true;
    }

    // Email format validation for email inputs
    if (context.inputType === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)) {
      threatTypes.push('invalid_email');
    }

    // Log threat event if detected
    if (threatTypes.length > 0) {
      this.logThreatEvent({
        eventType: 'threat_detected',
        severity: shouldBlock ? 'high' : 'medium',
        details: {
          pattern: threatTypes.join(', '),
          input: input.substring(0, 100),
          userAgent: context.userAgent,
          ip: context.ip
        }
      });
    }

    return {
      shouldBlock,
      threatTypes,
      confidence: threatTypes.length > 0 ? 0.8 : 0.1
    };
  }

  getRecentEvents(limit: number = 50): ThreatEvent[] {
    return this.recentEvents.slice(0, limit);
  }

  cleanupOldEvents(hoursToKeep: number = 168): void {
    const cutoffTime = new Date(Date.now() - hoursToKeep * 60 * 60 * 1000);
    this.recentEvents = this.recentEvents.filter(event => event.timestamp > cutoffTime);
  }

  async analyzeBehaviorPatterns(userId: string): Promise<{ riskScore: number; patterns: string[] }> {
    const userEvents = this.recentEvents.filter(event => event.userId === userId);
    const patterns: string[] = [];
    let riskScore = 0;

    // Analyze frequency of events
    if (userEvents.length > 10) {
      patterns.push('high_frequency_events');
      riskScore += 30;
    }

    // Analyze severity of events
    const criticalEvents = userEvents.filter(event => event.severity === 'critical');
    if (criticalEvents.length > 0) {
      patterns.push('critical_threats_detected');
      riskScore += 50;
    }

    // Analyze time patterns
    const recentEvents = userEvents.filter(event => 
      Date.now() - event.timestamp.getTime() < 24 * 60 * 60 * 1000
    );
    if (recentEvents.length > 5) {
      patterns.push('recent_suspicious_activity');
      riskScore += 20;
    }

    return { riskScore: Math.min(riskScore, 100), patterns };
  }

  private logThreatEvent(eventData: Partial<ThreatEvent>): void {
    const event: ThreatEvent = {
      id: `threat_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      eventType: eventData.eventType || 'unknown',
      severity: eventData.severity || 'low',
      timestamp: new Date(),
      userId: eventData.userId,
      details: eventData.details || {}
    };

    this.recentEvents.unshift(event);
    
    // Keep only the most recent 1000 events
    if (this.recentEvents.length > 1000) {
      this.recentEvents = this.recentEvents.slice(0, 1000);
    }

    productionLogger.warn('Threat detected', event, 'ThreatDetection');
  }
}

export const enhancedThreatDetection = new EnhancedThreatDetection();
