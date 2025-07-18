
import { supabase } from '@/integrations/supabase/client';
import { productionLogger } from '@/utils/productionLogger';

interface ThreatPattern {
  name: string;
  pattern: RegExp;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

interface ThreatAnalysisResult {
  threatLevel: 'none' | 'low' | 'medium' | 'high' | 'critical';
  detectedThreats: string[];
  riskScore: number;
  shouldBlock: boolean;
  recommendedAction: string;
}

export class AdvancedThreatDetection {
  private static instance: AdvancedThreatDetection;
  
  private threatPatterns: ThreatPattern[] = [
    {
      name: 'sql_injection',
      pattern: /(\bUNION\b|\bSELECT\b|\bINSERT\b|\bDELETE\b|\bDROP\b|\bUPDATE\b).*(\bFROM\b|\bWHERE\b|\bINTO\b)/gi,
      severity: 'critical',
      description: 'Potential SQL injection attempt detected'
    },
    {
      name: 'xss_script',
      pattern: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      severity: 'high',
      description: 'Cross-site scripting (XSS) attempt detected'
    },
    {
      name: 'command_injection',
      pattern: /(\||;|`|&|\$\(|\${).*(\bcat\b|\bls\b|\bwhoami\b|\bps\b|\bnetstat\b)/gi,
      severity: 'high',
      description: 'Command injection attempt detected'
    },
    {
      name: 'path_traversal',
      pattern: /(\.\.[\/\\]){2,}/g,
      severity: 'medium',
      description: 'Path traversal attempt detected'
    },
    {
      name: 'ldap_injection',
      pattern: /(\*|\(|\)|\\|\/|@|=|!|&|\|).*(\badmin\b|\broot\b|\bguest\b)/gi,
      severity: 'medium',
      description: 'LDAP injection attempt detected'
    },
    {
      name: 'nosql_injection',
      pattern: /(\$where|\$ne|\$gt|\$lt|\$regex|\$or|\$and).*[:=]/gi,
      severity: 'high',
      description: 'NoSQL injection attempt detected'
    }
  ];

  private ipRiskScores: Map<string, { score: number; lastUpdate: number }> = new Map();
  private failedAttempts: Map<string, { count: number; lastAttempt: number }> = new Map();

  static getInstance(): AdvancedThreatDetection {
    if (!AdvancedThreatDetection.instance) {
      AdvancedThreatDetection.instance = new AdvancedThreatDetection();
    }
    return AdvancedThreatDetection.instance;
  }

  async analyzeThreat(input: string, metadata: {
    ipAddress?: string;
    userAgent?: string;
    userId?: string;
    context?: string;
  }): Promise<ThreatAnalysisResult> {
    const detectedThreats: string[] = [];
    let riskScore = 0;
    let maxSeverity: 'none' | 'low' | 'medium' | 'high' | 'critical' = 'none';

    // Pattern-based threat detection
    for (const threat of this.threatPatterns) {
      if (threat.pattern.test(input)) {
        detectedThreats.push(threat.name);
        const severityScore = this.getSeverityScore(threat.severity);
        riskScore += severityScore;
        
        if (this.compareSeverity(threat.severity, maxSeverity) > 0) {
          maxSeverity = threat.severity;
        }

        // Log the threat detection
        await this.logThreatDetection(threat, metadata);
      }
    }

    // IP-based risk assessment
    if (metadata.ipAddress) {
      const ipRisk = await this.assessIPRisk(metadata.ipAddress);
      riskScore += ipRisk;
      
      if (ipRisk > 50) {
        detectedThreats.push('high_risk_ip');
        maxSeverity = this.maxSeverity(maxSeverity, 'medium');
      }
    }

    // Behavioral analysis
    const behaviorRisk = await this.analyzeBehavior(metadata.userId, metadata.ipAddress);
    riskScore += behaviorRisk;

    if (behaviorRisk > 30) {
      detectedThreats.push('suspicious_behavior');
      maxSeverity = this.maxSeverity(maxSeverity, 'medium');
    }

    const shouldBlock = riskScore >= 75 || maxSeverity === 'critical';
    
    return {
      threatLevel: maxSeverity,
      detectedThreats,
      riskScore: Math.min(riskScore, 100),
      shouldBlock,
      recommendedAction: this.getRecommendedAction(maxSeverity, riskScore)
    };
  }

  private getSeverityScore(severity: string): number {
    switch (severity) {
      case 'low': return 10;
      case 'medium': return 25;
      case 'high': return 50;
      case 'critical': return 100;
      default: return 0;
    }
  }

  private compareSeverity(a: string, b: string): number {
    const scores = { none: 0, low: 1, medium: 2, high: 3, critical: 4 };
    return (scores[a as keyof typeof scores] || 0) - (scores[b as keyof typeof scores] || 0);
  }

  private maxSeverity(a: string, b: string): 'none' | 'low' | 'medium' | 'high' | 'critical' {
    return this.compareSeverity(a, b) > 0 ? a as any : b as any;
  }

  private async assessIPRisk(ipAddress: string): Promise<number> {
    const cached = this.ipRiskScores.get(ipAddress);
    const now = Date.now();
    
    // Use cached score if less than 1 hour old
    if (cached && (now - cached.lastUpdate) < 3600000) {
      return cached.score;
    }

    let riskScore = 0;

    // Check failed attempts
    const failedData = this.failedAttempts.get(ipAddress);
    if (failedData) {
      const recentFailures = (now - failedData.lastAttempt) < 3600000 ? failedData.count : 0;
      riskScore += Math.min(recentFailures * 10, 50);
    }

    // Check against known threat databases (simplified)
    if (this.isKnownThreatIP(ipAddress)) {
      riskScore += 60;
    }

    // Geographic risk assessment (simplified)
    const geoRisk = await this.assessGeographicRisk(ipAddress);
    riskScore += geoRisk;

    this.ipRiskScores.set(ipAddress, { score: riskScore, lastUpdate: now });
    return riskScore;
  }

  private isKnownThreatIP(ipAddress: string): boolean {
    // Simplified threat IP detection
    const knownThreats = [
      /^192\.168\./,  // Local network (for demo purposes)
      /^10\./,        // Private network (for demo purposes)
    ];
    
    return knownThreats.some(pattern => pattern.test(ipAddress));
  }

  private async assessGeographicRisk(ipAddress: string): Promise<number> {
    // Simplified geographic risk assessment
    // In production, this would use a real IP geolocation service
    return 0;
  }

  private async analyzeBehavior(userId?: string, ipAddress?: string): Promise<number> {
    if (!userId) return 0;

    try {
      // Analyze recent user behavior patterns
      const { data: recentEvents } = await supabase
        .from('security_audit_log')
        .select('event_type, created_at')
        .eq('user_id', userId)
        .gte('created_at', new Date(Date.now() - 3600000).toISOString()) // Last hour
        .order('created_at', { ascending: false })
        .limit(50);

      if (!recentEvents) return 0;

      let riskScore = 0;

      // Check for unusual activity patterns
      const eventTypes = recentEvents.map(e => e.event_type);
      const uniqueEvents = new Set(eventTypes);

      // High frequency of different event types
      if (uniqueEvents.size > 10) {
        riskScore += 20;
      }

      // Multiple failed login attempts
      const failedLogins = eventTypes.filter(type => type.includes('login_failure')).length;
      if (failedLogins > 3) {
        riskScore += failedLogins * 5;
      }

      return Math.min(riskScore, 50);
    } catch (error) {
      productionLogger.error('Failed to analyze user behavior', error, 'AdvancedThreatDetection');
      return 0;
    }
  }

  private async logThreatDetection(threat: ThreatPattern, metadata: any): Promise<void> {
    try {
      await supabase.from('security_events_enhanced').insert({
        event_type: `threat_detected_${threat.name}`,
        severity: threat.severity,
        user_id: metadata.userId,
        ip_address: metadata.ipAddress,
        user_agent: metadata.userAgent,
        event_data: {
          threat_name: threat.name,
          description: threat.description,
          context: metadata.context
        },
        threat_score: this.getSeverityScore(threat.severity),
        auto_blocked: threat.severity === 'critical'
      });
    } catch (error) {
      productionLogger.error('Failed to log threat detection', error, 'AdvancedThreatDetection');
    }
  }

  private getRecommendedAction(severity: string, riskScore: number): string {
    if (severity === 'critical' || riskScore >= 75) {
      return 'Block request immediately and alert administrators';
    } else if (severity === 'high' || riskScore >= 50) {
      return 'Flag for review and increase monitoring';
    } else if (severity === 'medium' || riskScore >= 25) {
      return 'Log for analysis and continue monitoring';
    } else {
      return 'Continue normal processing with basic logging';
    }
  }

  recordFailedAttempt(ipAddress: string): void {
    const now = Date.now();
    const existing = this.failedAttempts.get(ipAddress);
    
    if (existing && (now - existing.lastAttempt) < 3600000) {
      this.failedAttempts.set(ipAddress, {
        count: existing.count + 1,
        lastAttempt: now
      });
    } else {
      this.failedAttempts.set(ipAddress, {
        count: 1,
        lastAttempt: now
      });
    }
  }

  async getIPBlocklist(): Promise<string[]> {
    const blockedIPs: string[] = [];
    
    for (const [ip, data] of this.ipRiskScores.entries()) {
      if (data.score >= 75) {
        blockedIPs.push(ip);
      }
    }
    
    return blockedIPs;
  }
}

export const advancedThreatDetection = AdvancedThreatDetection.getInstance();
