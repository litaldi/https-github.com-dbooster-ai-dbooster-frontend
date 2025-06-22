
import { auditLogger } from '../auditLogger';
import { productionLogger } from '@/utils/productionLogger';
import { inputSanitizationService } from './inputSanitizationService';
import { securityPatternsService } from './securityPatternsService';
import type { SeverityLevel } from './types';

export class SecurityValidationService {
  private static instance: SecurityValidationService;

  static getInstance(): SecurityValidationService {
    if (!SecurityValidationService.instance) {
      SecurityValidationService.instance = new SecurityValidationService();
    }
    return SecurityValidationService.instance;
  }

  async validateUserAgent(userAgent: string): Promise<{ isSuspicious: boolean; reason?: string; riskLevel?: string }> {
    for (const pattern of securityPatternsService.SUSPICIOUS_USER_AGENTS) {
      if (pattern.test(userAgent)) {
        await auditLogger.logSecurityEvent({
          event_type: 'suspicious_user_agent',
          event_data: {
            userAgent: userAgent.substring(0, 100),
            pattern: pattern.source,
            riskLevel: 'high'
          }
        });
        
        return {
          isSuspicious: true,
          reason: 'Suspicious user agent pattern detected',
          riskLevel: 'high'
        };
      }
    }

    // Check for anomalous user agent characteristics
    if (userAgent.length > 1000) {
      return {
        isSuspicious: true,
        reason: 'Unusually long user agent string',
        riskLevel: 'medium'
      };
    }

    return { isSuspicious: false };
  }

  async validateEmailSecurity(email: string): Promise<{ isSecure: boolean; reason?: string; riskLevel?: string }> {
    for (const pattern of securityPatternsService.SUSPICIOUS_EMAIL_PATTERNS) {
      if (pattern.test(email)) {
        await auditLogger.logSecurityEvent({
          event_type: 'suspicious_email_pattern',
          event_data: {
            email: email.replace(/(.{2}).*(@.*)/, "$1***$2"),
            pattern: pattern.source,
            riskLevel: 'medium'
          }
        });
        
        return {
          isSecure: false,
          reason: 'Suspicious email pattern detected',
          riskLevel: 'medium'
        };
      }
    }

    // Additional email validation
    const sanitizedEmail = inputSanitizationService.sanitizeEmail(email);
    if (sanitizedEmail !== email.toLowerCase().trim()) {
      return {
        isSecure: false,
        reason: 'Email contains suspicious characters',
        riskLevel: 'low'
      };
    }

    return { isSecure: true };
  }

  getRecommendedAction(severity: SeverityLevel): string {
    switch (severity) {
      case 'critical':
        return 'Immediately block request and alert security team';
      case 'high':
        return 'Block request and log incident';
      case 'medium':
        return 'Log incident and monitor user';
      case 'low':
        return 'Log for analysis';
      default:
        return 'Monitor activity';
    }
  }

  normalizeSeverityLevel(severity: any): SeverityLevel {
    const validLevels: SeverityLevel[] = ['low', 'medium', 'high', 'critical'];
    if (typeof severity === 'string' && validLevels.includes(severity as SeverityLevel)) {
      return severity as SeverityLevel;
    }
    return 'low'; // Default fallback
  }
}

export const securityValidationService = SecurityValidationService.getInstance();
