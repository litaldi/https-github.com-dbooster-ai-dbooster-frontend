
import { productionLogger } from '@/utils/productionLogger';
import { auditLogger } from '../auditLogger';

interface ThreatAnalysis {
  threats: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
  }>;
  riskScore: number;
  shouldBlock: boolean;
}

interface UserBehaviorAnalysis {
  riskLevel: 'low' | 'medium' | 'high';
  suspiciousActivities: string[];
  recommendedActions: string[];
}

export class AdvancedThreatDetectionService {
  private static instance: AdvancedThreatDetectionService;

  static getInstance(): AdvancedThreatDetectionService {
    if (!AdvancedThreatDetectionService.instance) {
      AdvancedThreatDetectionService.instance = new AdvancedThreatDetectionService();
    }
    return AdvancedThreatDetectionService.instance;
  }

  async analyzeInput(input: string, context: string): Promise<ThreatAnalysis> {
    const threats: Array<{
      type: string;
      severity: 'low' | 'medium' | 'high' | 'critical';
      description: string;
    }> = [];
    let riskScore = 0;

    try {
      // SQL Injection Detection
      const sqlPatterns = [
        { pattern: /('|''|;|--|\/\*|\*\/)/i, severity: 'high' as const, type: 'sql_injection' },
        { pattern: /(union|select|insert|update|delete|drop|create|alter|exec|execute)\s/i, severity: 'critical' as const, type: 'sql_injection' },
        { pattern: /(\bor\b|\band\b)\s+\d+\s*=\s*\d+/i, severity: 'high' as const, type: 'sql_injection' }
      ];

      for (const { pattern, severity, type } of sqlPatterns) {
        if (pattern.test(input)) {
          threats.push({
            type,
            severity,
            description: 'SQL injection pattern detected'
          });
          riskScore += severity === 'critical' ? 50 : severity === 'high' ? 30 : 20;
          break;
        }
      }

      // XSS Detection
      const xssPatterns = [
        { pattern: /<script[^>]*>.*?<\/script>/gi, severity: 'critical' as const, type: 'xss' },
        { pattern: /javascript:/gi, severity: 'high' as const, type: 'xss' },
        { pattern: /on\w+\s*=/gi, severity: 'medium' as const, type: 'xss' },
        { pattern: /<iframe[^>]*>/gi, severity: 'high' as const, type: 'xss' },
        { pattern: /<object[^>]*>/gi, severity: 'medium' as const, type: 'xss' }
      ];

      for (const { pattern, severity, type } of xssPatterns) {
        if (pattern.test(input)) {
          threats.push({
            type,
            severity,
            description: 'Cross-site scripting pattern detected'
          });
          riskScore += severity === 'critical' ? 50 : severity === 'high' ? 30 : 20;
          break;
        }
      }

      // Command Injection Detection
      const commandPatterns = [
        { pattern: /[;&|`$(){}[\]]/, severity: 'high' as const, type: 'command_injection' },
        { pattern: /(curl|wget|nc|netcat|bash|sh|cmd|powershell)/i, severity: 'critical' as const, type: 'command_injection' }
      ];

      for (const { pattern, severity, type } of commandPatterns) {
        if (pattern.test(input)) {
          threats.push({
            type,
            severity,
            description: 'Command injection pattern detected'
          });
          riskScore += severity === 'critical' ? 50 : 30;
          break;
        }
      }

      // Path Traversal Detection
      if (/\.\.(\/|\\)/.test(input)) {
        threats.push({
          type: 'path_traversal',
          severity: 'medium',
          description: 'Path traversal attempt detected'
        });
        riskScore += 25;
      }

      // DoS Detection (excessive length)
      if (input.length > 10000) {
        threats.push({
          type: 'dos_attempt',
          severity: 'medium',
          description: 'Input exceeds safe length limits'
        });
        riskScore += 20;
      }

      // Log threats if any
      if (threats.length > 0) {
        await auditLogger.logSecurityEvent({
          event_type: 'threat_detection',
          event_data: {
            context,
            threats: threats.map(t => t.type),
            riskScore,
            inputLength: input.length
          }
        });
      }

      return {
        threats,
        riskScore,
        shouldBlock: riskScore >= 50 || threats.some(t => t.severity === 'critical')
      };
    } catch (error) {
      productionLogger.error('Threat analysis failed', error, 'AdvancedThreatDetectionService');
      return {
        threats: [],
        riskScore: 0,
        shouldBlock: false
      };
    }
  }

  async analyzeUserBehavior(userId: string): Promise<UserBehaviorAnalysis> {
    try {
      // This would typically analyze patterns in user behavior
      // For now, we'll return a basic implementation
      return {
        riskLevel: 'low',
        suspiciousActivities: [],
        recommendedActions: []
      };
    } catch (error) {
      productionLogger.error('User behavior analysis failed', error, 'AdvancedThreatDetectionService');
      return {
        riskLevel: 'low',
        suspiciousActivities: [],
        recommendedActions: []
      };
    }
  }
}

export const advancedThreatDetectionService = AdvancedThreatDetectionService.getInstance();
