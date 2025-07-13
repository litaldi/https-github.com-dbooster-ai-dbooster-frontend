
import { productionLogger } from '@/utils/productionLogger';

interface ThreatDetectionResult {
  isThreat: boolean;
  confidence: number;
  threatType?: string;
  details?: string;
}

export class ThreatDetectionService {
  private static instance: ThreatDetectionService;

  static getInstance(): ThreatDetectionService {
    if (!ThreatDetectionService.instance) {
      ThreatDetectionService.instance = new ThreatDetectionService();
    }
    return ThreatDetectionService.instance;
  }

  async detectThreats(input: string, context?: any): Promise<ThreatDetectionResult> {
    try {
      // Basic threat detection patterns
      const sqlInjectionPatterns = [
        /(\bor\b|\band\b).*=.*=/i,
        /union\s+select/i,
        /drop\s+table/i,
        /delete\s+from/i
      ];

      const xssPatterns = [
        /<script[^>]*>.*?<\/script>/gi,
        /javascript:/i,
        /on\w+\s*=/i
      ];

      for (const pattern of sqlInjectionPatterns) {
        if (pattern.test(input)) {
          return {
            isThreat: true,
            confidence: 0.8,
            threatType: 'sql_injection',
            details: 'Potential SQL injection detected'
          };
        }
      }

      for (const pattern of xssPatterns) {
        if (pattern.test(input)) {
          return {
            isThreat: true,
            confidence: 0.7,
            threatType: 'xss',
            details: 'Potential XSS attack detected'
          };
        }
      }

      return {
        isThreat: false,
        confidence: 0.1
      };
    } catch (error) {
      productionLogger.error('Threat detection failed', error, 'ThreatDetectionService');
      return {
        isThreat: false,
        confidence: 0
      };
    }
  }
}

export const threatDetectionService = ThreatDetectionService.getInstance();
