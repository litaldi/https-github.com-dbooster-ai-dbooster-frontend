
import { supabase } from '@/integrations/supabase/client';
import { auditLogger } from '../auditLogger';
import { productionLogger } from '@/utils/productionLogger';
import { advancedThreatDetectionService } from './advancedThreatDetectionService';
import { inputSanitizationService } from './inputSanitizationService';
import { environmentSecurityService } from './environmentSecurityService';

interface SecurityThreat {
  level: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  description: string;
  recommended_action: string;
}

interface EnhancedSecurityValidation {
  isValid: boolean;
  threats: SecurityThreat[];
  riskScore: number;
  blockRequest: boolean;
  sanitizedInput?: string;
}

export class EnhancedSecurityService {
  private static instance: EnhancedSecurityService;

  // Enhanced suspicious user agent patterns
  private readonly SUSPICIOUS_USER_AGENTS = [
    /bot|crawler|spider|scraper/i,
    /sqlmap|nmap|nikto|burp|owasp|acunetix/i,
    /python-requests|curl|wget|postman/i,
    /^$/,
    /.{0,10}$|.{500,}$/,
    /masscan|zmap|gobuster|dirb/i
  ];

  // Enhanced suspicious email patterns
  private readonly SUSPICIOUS_EMAIL_PATTERNS = [
    /^(admin|root|test|demo|null|undefined|system|service)@/i,
    /\+.*\+.*@/,
    /@(temp|trash|guerrilla|10minute|throwaway|disposable)/i,
    /\d{10,}@/,
    /(.)\1{5,}@/,
    /@[0-9]+\./,
    /\.(tk|ml|ga|cf)$/i
  ];

  static getInstance(): EnhancedSecurityService {
    if (!EnhancedSecurityService.instance) {
      EnhancedSecurityService.instance = new EnhancedSecurityService();
    }
    return EnhancedSecurityService.instance;
  }

  async validateEnhancedInput(input: any, context: string): Promise<EnhancedSecurityValidation> {
    const threats: SecurityThreat[] = [];
    let riskScore = 0;

    try {
      const inputString = typeof input === 'string' ? input : JSON.stringify(input);

      // Use advanced threat detection
      const threatAnalysis = await advancedThreatDetectionService.analyzeInput(inputString, context);
      
      // Convert threat analysis to SecurityThreat format
      for (const threat of threatAnalysis.threats) {
        threats.push({
          level: threat.severity as 'low' | 'medium' | 'high' | 'critical',
          type: threat.type,
          description: threat.description,
          recommended_action: this.getRecommendedAction(threat.severity)
        });
      }

      riskScore = threatAnalysis.riskScore;

      // Additional context-specific validation
      if (context === 'email') {
        const emailThreats = await this.validateEmailSecurity(inputString);
        if (!emailThreats.isSecure) {
          threats.push({
            level: 'medium',
            type: 'suspicious_email',
            description: 'Suspicious email pattern detected',
            recommended_action: 'Block registration and log incident'
          });
          riskScore += 20;
        }
      }

      // Sanitize input if not blocking
      let sanitizedInput: string | undefined;
      if (!threatAnalysis.shouldBlock) {
        sanitizedInput = inputSanitizationService.sanitizeInput(inputString);
      }

      // Log security validation
      if (threats.length > 0) {
        await auditLogger.logSecurityEvent({
          event_type: 'enhanced_security_validation',
          event_data: {
            context,
            threatCount: threats.length,
            riskScore,
            threatTypes: threats.map(t => t.type),
            blocked: threatAnalysis.shouldBlock
          }
        });
      }

      return {
        isValid: threats.length === 0,
        threats,
        riskScore,
        blockRequest: threatAnalysis.shouldBlock,
        sanitizedInput
      };
    } catch (error) {
      productionLogger.error('Enhanced security validation failed', error, 'EnhancedSecurityService');
      return {
        isValid: false,
        threats: [],
        riskScore: 0,
        blockRequest: false
      };
    }
  }

  async validateUserAgent(userAgent: string): Promise<{ isSuspicious: boolean; reason?: string; riskLevel?: string }> {
    for (const pattern of this.SUSPICIOUS_USER_AGENTS) {
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
    for (const pattern of this.SUSPICIOUS_EMAIL_PATTERNS) {
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

  async getUserSecurityRiskLevel(userId: string): Promise<'low' | 'medium' | 'high'> {
    try {
      // Use the database function we created
      const { data } = await supabase.rpc('get_user_security_risk_level', { user_id: userId });
      return data || 'low';
    } catch (error) {
      productionLogger.error('Failed to get user security risk level', error, 'EnhancedSecurityService');
      return 'low';
    }
  }

  async validateEnvironmentSecurity(): Promise<{ isSecure: boolean; issues: string[]; score: number }> {
    const result = await environmentSecurityService.validateEnvironment();
    return {
      isSecure: result.isSecure,
      issues: [...result.issues, ...result.warnings],
      score: result.score
    };
  }

  async performSecurityHealthCheck(): Promise<{
    overall: 'healthy' | 'warning' | 'critical';
    checks: Array<{ name: string; status: 'pass' | 'warn' | 'fail'; message: string }>;
    score: number;
  }> {
    const checks: Array<{ name: string; status: 'pass' | 'warn' | 'fail'; message: string }> = [];
    let totalScore = 0;

    try {
      // Environment security check
      const envCheck = await environmentSecurityService.validateEnvironment();
      checks.push({
        name: 'Environment Security',
        status: envCheck.isSecure ? 'pass' : envCheck.issues.length > 0 ? 'fail' : 'warn',
        message: envCheck.isSecure ? 'Environment is secure' : `${envCheck.issues.length} issues, ${envCheck.warnings.length} warnings`
      });
      totalScore += envCheck.score * 0.3;

      // Session security check
      const sessionValid = await environmentSecurityService.validateSessionSecurity();
      checks.push({
        name: 'Session Security',
        status: sessionValid ? 'pass' : 'fail',
        message: sessionValid ? 'Session is secure' : 'Session security issues detected'
      });
      totalScore += sessionValid ? 30 : 0;

      // Database connectivity check
      try {
        const { error } = await supabase.from('security_audit_log').select('id').limit(1);
        checks.push({
          name: 'Database Security',
          status: error ? 'fail' : 'pass',
          message: error ? 'Database connection issues' : 'Database is accessible'
        });
        totalScore += error ? 0 : 20;
      } catch {
        checks.push({
          name: 'Database Security',
          status: 'fail',
          message: 'Cannot connect to database'
        });
      }

      // Security headers check
      const hasCSP = !!document.querySelector('meta[http-equiv="Content-Security-Policy"]');
      checks.push({
        name: 'Security Headers',
        status: hasCSP ? 'pass' : 'warn',
        message: hasCSP ? 'CSP is configured' : 'Missing Content Security Policy'
      });
      totalScore += hasCSP ? 20 : 10;

      const overall = totalScore >= 80 ? 'healthy' : totalScore >= 60 ? 'warning' : 'critical';

      return { overall, checks, score: Math.round(totalScore) };
    } catch (error) {
      productionLogger.error('Security health check failed', error, 'EnhancedSecurityService');
      return {
        overall: 'critical',
        checks: [{ name: 'Health Check', status: 'fail', message: 'Security health check failed' }],
        score: 0
      };
    }
  }

  private getRecommendedAction(severity: string): string {
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
}

export const enhancedSecurityService = EnhancedSecurityService.getInstance();
