
import { supabase } from '@/integrations/supabase/client';
import { auditLogger } from '../auditLogger';
import { productionLogger } from '@/utils/productionLogger';

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
}

export class EnhancedSecurityService {
  private static instance: EnhancedSecurityService;

  // Enhanced SQL injection patterns
  private readonly SQL_INJECTION_PATTERNS = [
    /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\s)/gi,
    /(\b(or|and)\s+[\w\s]*\s*=\s*[\w\s]*)/gi,
    /(--|\/\*|\*\/|;)/g,
    /(\b(script|javascript|vbscript|onload|onerror)\b)/gi,
    /('|\"|`)(.*?)\1\s*(or|and)\s*\1/gi,
    /(0x[0-9a-f]+)/gi,
    /(\b(char|nchar|varchar|nvarchar)\s*\(\s*\d+\s*\))/gi
  ];

  // Enhanced XSS patterns
  private readonly XSS_PATTERNS = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe\b[^>]*>/gi,
    /<object\b[^>]*>/gi,
    /<embed\b[^>]*>/gi,
    /<applet\b[^>]*>/gi,
    /<meta\b[^>]*>/gi,
    /vbscript:/gi,
    /expression\s*\(/gi
  ];

  // Suspicious user agent patterns
  private readonly SUSPICIOUS_USER_AGENTS = [
    /bot|crawler|spider|scraper/i,
    /sqlmap|nmap|nikto|burp|owasp/i,
    /python-requests|curl|wget/i,
    /^$/,
    /.{0,10}$|.{500,}$/
  ];

  // Suspicious email patterns
  private readonly SUSPICIOUS_EMAIL_PATTERNS = [
    /^(admin|root|test|demo|null|undefined)@/i,
    /\+.*\+.*@/,
    /@(temp|trash|guerrilla|10minute)/i,
    /\d{10,}@/,
    /(.)\1{5,}@/
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

      // SQL Injection Detection
      const sqlThreats = this.detectSQLInjection(inputString);
      threats.push(...sqlThreats);
      riskScore += sqlThreats.length * 30;

      // XSS Detection
      const xssThreats = this.detectXSS(inputString);
      threats.push(...xssThreats);
      riskScore += xssThreats.length * 25;

      // Path Traversal Detection
      const pathThreats = this.detectPathTraversal(inputString);
      threats.push(...pathThreats);
      riskScore += pathThreats.length * 20;

      // Command Injection Detection
      const cmdThreats = this.detectCommandInjection(inputString);
      threats.push(...cmdThreats);
      riskScore += cmdThreats.length * 35;

      // Log security validation
      if (threats.length > 0) {
        await auditLogger.logSecurityEvent({
          event_type: 'enhanced_security_validation',
          event_data: {
            context,
            threatCount: threats.length,
            riskScore,
            threatTypes: threats.map(t => t.type)
          }
        });
      }

      return {
        isValid: threats.length === 0,
        threats,
        riskScore,
        blockRequest: riskScore >= 50 || threats.some(t => t.level === 'critical')
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

  async validateUserAgent(userAgent: string): Promise<{ isSuspicious: boolean; reason?: string }> {
    for (const pattern of this.SUSPICIOUS_USER_AGENTS) {
      if (pattern.test(userAgent)) {
        await auditLogger.logSecurityEvent({
          event_type: 'suspicious_user_agent',
          event_data: {
            userAgent: userAgent.substring(0, 100), // Truncate for security
            pattern: pattern.source
          }
        });
        
        return {
          isSuspicious: true,
          reason: 'Suspicious user agent pattern detected'
        };
      }
    }
    return { isSuspicious: false };
  }

  async validateEmailSecurity(email: string): Promise<{ isSecure: boolean; reason?: string }> {
    for (const pattern of this.SUSPICIOUS_EMAIL_PATTERNS) {
      if (pattern.test(email)) {
        await auditLogger.logSecurityEvent({
          event_type: 'suspicious_email_pattern',
          event_data: {
            email: email.replace(/(.{2}).*(@.*)/, "$1***$2"),
            pattern: pattern.source
          }
        });
        
        return {
          isSecure: false,
          reason: 'Suspicious email pattern detected'
        };
      }
    }
    return { isSecure: true };
  }

  async getUserSecurityRiskLevel(userId: string): Promise<'low' | 'medium' | 'high'> {
    try {
      const { data: violations } = await supabase
        .from('security_audit_log')
        .select('event_type')
        .eq('user_id', userId)
        .like('event_type', '%violation%')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      const violationCount = violations?.length || 0;

      if (violationCount >= 10) return 'high';
      if (violationCount >= 5) return 'medium';
      return 'low';
    } catch (error) {
      productionLogger.error('Failed to get user security risk level', error, 'EnhancedSecurityService');
      return 'low';
    }
  }

  private detectSQLInjection(input: string): SecurityThreat[] {
    const threats: SecurityThreat[] = [];

    for (const pattern of this.SQL_INJECTION_PATTERNS) {
      if (pattern.test(input)) {
        threats.push({
          level: 'high',
          type: 'sql_injection',
          description: 'Potential SQL injection pattern detected',
          recommended_action: 'Block request and log incident'
        });
      }
    }

    return threats;
  }

  private detectXSS(input: string): SecurityThreat[] {
    const threats: SecurityThreat[] = [];

    for (const pattern of this.XSS_PATTERNS) {
      if (pattern.test(input)) {
        threats.push({
          level: 'high',
          type: 'xss_attempt',
          description: 'Potential XSS attack pattern detected',
          recommended_action: 'Sanitize input and block request'
        });
      }
    }

    return threats;
  }

  private detectPathTraversal(input: string): SecurityThreat[] {
    const threats: SecurityThreat[] = [];
    const pathTraversalPatterns = [
      /\.\.\//g,
      /\.\.\\/g,
      /%2e%2e%2f/gi,
      /%2e%2e%5c/gi,
      /\.\./g
    ];

    for (const pattern of pathTraversalPatterns) {
      if (pattern.test(input)) {
        threats.push({
          level: 'medium',
          type: 'path_traversal',
          description: 'Potential path traversal attack detected',
          recommended_action: 'Block file system access and log incident'
        });
      }
    }

    return threats;
  }

  private detectCommandInjection(input: string): SecurityThreat[] {
    const threats: SecurityThreat[] = [];
    const cmdPatterns = [
      /[;&|`$(){}[\]]/g,
      /\b(rm|del|format|exec|eval|system)\b/gi,
      /\b(chmod|chown|sudo|passwd)\b/gi
    ];

    for (const pattern of cmdPatterns) {
      if (pattern.test(input)) {
        threats.push({
          level: 'critical',
          type: 'command_injection',
          description: 'Potential command injection attack detected',
          recommended_action: 'Immediately block request and alert security team'
        });
      }
    }

    return threats;
  }
}

export const enhancedSecurityService = EnhancedSecurityService.getInstance();
