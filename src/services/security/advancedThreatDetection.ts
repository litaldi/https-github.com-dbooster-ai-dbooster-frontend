
import { supabase } from '@/integrations/supabase/client';
import { auditLogger } from '../auditLogger';
import { productionLogger } from '@/utils/productionLogger';

interface ThreatDetectionResult {
  isSuspicious: boolean;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  reasons: string[];
  blockAction: boolean;
}

export class AdvancedThreatDetection {
  private static instance: AdvancedThreatDetection;

  static getInstance(): AdvancedThreatDetection {
    if (!AdvancedThreatDetection.instance) {
      AdvancedThreatDetection.instance = new AdvancedThreatDetection();
    }
    return AdvancedThreatDetection.instance;
  }

  async detectAnomalousLogin(email: string, userAgent: string, fingerprint: string): Promise<ThreatDetectionResult> {
    const reasons: string[] = [];
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';

    try {
      // Check for suspicious email patterns
      const suspiciousEmailPatterns = [
        /temp|disposable|fake|test|spam/i,
        /^[a-z0-9]+@[a-z0-9]+\.[a-z]{2,3}$/,
        /(.)\1{3,}/, // Repeated characters
      ];

      if (suspiciousEmailPatterns.some(pattern => pattern.test(email))) {
        reasons.push('Suspicious email pattern detected');
        riskLevel = 'medium';
      }

      // Check for suspicious user agent patterns
      const suspiciousUAPatterns = [
        /bot|crawler|spider|scraper/i,
        /curl|wget|python|php/i,
        /automated|script|tool/i
      ];

      if (suspiciousUAPatterns.some(pattern => pattern.test(userAgent))) {
        reasons.push('Automated client detected');
        riskLevel = 'high';
      }

      // Device fingerprint analysis
      if (fingerprint.length < 8) {
        reasons.push('Weak device fingerprint');
        riskLevel = riskLevel === 'high' ? 'high' : 'medium';
      }

      // Check recent failed attempts
      const recentFailures = await this.getRecentFailedAttempts(email);
      if (recentFailures > 3) {
        reasons.push('Multiple recent failed attempts');
        riskLevel = 'high';
      }

      // Geo-location anomaly detection (mock implementation)
      const isGeoAnomalous = await this.detectGeoAnomaly(email);
      if (isGeoAnomalous) {
        reasons.push('Unusual geographic location');
        riskLevel = riskLevel === 'high' ? 'high' : 'medium';
      }

      // Critical threat indicators
      if (reasons.length > 3 || (reasons.includes('Automated client detected') && recentFailures > 5)) {
        riskLevel = 'critical';
      }

      const isSuspicious = reasons.length > 0;
      const blockAction = riskLevel === 'critical' || (riskLevel === 'high' && reasons.length > 2);

      if (isSuspicious) {
        await auditLogger.logSecurityEvent({
          event_type: 'threat_detection_analysis',
          event_data: {
            email: email.replace(/(.{2}).*(@.*)/, "$1***$2"),
            riskLevel,
            reasons,
            blockAction,
            fingerprint: fingerprint.substring(0, 8) + '***'
          }
        });
      }

      return {
        isSuspicious,
        riskLevel,
        reasons,
        blockAction
      };
    } catch (error) {
      productionLogger.error('Threat detection failed', error, 'AdvancedThreatDetection');
      return {
        isSuspicious: false,
        riskLevel: 'low',
        reasons: [],
        blockAction: false
      };
    }
  }

  private async getRecentFailedAttempts(email: string): Promise<number> {
    try {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      
      const { data, error } = await supabase
        .from('security_audit_log')
        .select('id')
        .eq('event_type', 'auth_login')
        .like('event_data', `%${email.replace(/(.{2}).*(@.*)/, "$1***$2")}%`)
        .gte('created_at', oneHourAgo);

      if (error) throw error;
      return data?.length || 0;
    } catch (error) {
      productionLogger.error('Failed to get recent failed attempts', error, 'AdvancedThreatDetection');
      return 0;
    }
  }

  private async detectGeoAnomaly(email: string): Promise<boolean> {
    // Mock implementation - in production, this would use IP geolocation
    // and compare against user's historical login locations
    return false;
  }

  async generateDeviceFingerprint(): Promise<string> {
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      navigator.hardwareConcurrency || 0,
      Intl.DateTimeFormat().resolvedOptions().timeZone,
      navigator.platform,
      navigator.cookieEnabled ? '1' : '0'
    ];
    
    const fingerprint = components.join('|');
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    return Math.abs(hash).toString(36);
  }
}

export const advancedThreatDetection = AdvancedThreatDetection.getInstance();
