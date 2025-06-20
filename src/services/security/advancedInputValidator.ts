
import { auditLogger } from '../auditLogger';
import { productionLogger } from '@/utils/productionLogger';

interface ValidationResult {
  isValid: boolean;
  sanitizedInput: string;
  threats: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export class AdvancedInputValidator {
  private static instance: AdvancedInputValidator;

  static getInstance(): AdvancedInputValidator {
    if (!AdvancedInputValidator.instance) {
      AdvancedInputValidator.instance = new AdvancedInputValidator();
    }
    return AdvancedInputValidator.instance;
  }

  async validateAndSanitize(input: string, context: string): Promise<ValidationResult> {
    const threats: string[] = [];
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';

    try {
      // Advanced XSS detection patterns
      const xssPatterns = [
        /<script[^>]*>.*?<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /eval\s*\(/gi,
        /expression\s*\(/gi,
        /<iframe[^>]*>.*?<\/iframe>/gi,
        /<object[^>]*>.*?<\/object>/gi,
        /<embed[^>]*>/gi,
        /vbscript:/gi,
        /data:text\/html/gi
      ];

      // Advanced SQL injection patterns
      const sqlPatterns = [
        /(\bUNION\b.*\bSELECT\b)/gi,
        /(\bINSERT\b.*\bINTO\b)/gi,
        /(\bUPDATE\b.*\bSET\b)/gi,
        /(\bDELETE\b.*\bFROM\b)/gi,
        /(\bDROP\b.*\bTABLE\b)/gi,
        /(\bALTER\b.*\bTABLE\b)/gi,
        /(\bCREATE\b.*\bTABLE\b)/gi,
        /(\bEXEC\b.*\()/gi,
        /(\bSELECT\b.*\bFROM\b.*\bWHERE\b.*['"]\s*OR\s*['"])/gi,
        /(;|\s)(DROP|ALTER|CREATE|INSERT|UPDATE|DELETE|EXEC|UNION|SELECT)\s/gi
      ];

      // Path traversal patterns
      const pathTraversalPatterns = [
        /\.\.[\/\\]/g,
        /[\/\\]\.\.[\/\\]/g,
        /%2e%2e[\/\\]/gi,
        /\.\.%2f/gi,
        /\.\.%5c/gi
      ];

      // Command injection patterns
      const commandInjectionPatterns = [
        /;\s*(rm|del|format|shutdown|reboot|halt)/gi,
        /\|\s*(rm|del|format|shutdown|reboot|halt)/gi,
        /&&\s*(rm|del|format|shutdown|reboot|halt)/gi,
        /`[^`]*`/g,
        /\$\([^)]*\)/g
      ];

      let sanitizedInput = input;

      // Check for XSS
      for (const pattern of xssPatterns) {
        if (pattern.test(input)) {
          threats.push('XSS attempt detected');
          riskLevel = 'high';
          sanitizedInput = sanitizedInput.replace(pattern, '[REMOVED]');
        }
      }

      // Check for SQL injection
      for (const pattern of sqlPatterns) {
        if (pattern.test(input)) {
          threats.push('SQL injection attempt detected');
          riskLevel = 'critical';
          sanitizedInput = sanitizedInput.replace(pattern, '[REMOVED]');
        }
      }

      // Check for path traversal
      for (const pattern of pathTraversalPatterns) {
        if (pattern.test(input)) {
          threats.push('Path traversal attempt detected');
          riskLevel = riskLevel === 'critical' ? 'critical' : 'high';
          sanitizedInput = sanitizedInput.replace(pattern, '[REMOVED]');
        }
      }

      // Check for command injection
      for (const pattern of commandInjectionPatterns) {
        if (pattern.test(input)) {
          threats.push('Command injection attempt detected');
          riskLevel = 'critical';
          sanitizedInput = sanitizedInput.replace(pattern, '[REMOVED]');
        }
      }

      // Additional sanitization
      sanitizedInput = this.sanitizeHtml(sanitizedInput);

      const isValid = threats.length === 0;

      if (!isValid) {
        await auditLogger.logSecurityEvent({
          event_type: 'advanced_input_validation_violation',
          event_data: {
            context,
            threats,
            riskLevel,
            inputLength: input.length,
            sanitizedLength: sanitizedInput.length
          }
        });
      }

      return {
        isValid,
        sanitizedInput,
        threats,
        riskLevel
      };
    } catch (error) {
      productionLogger.error('Advanced input validation failed', error, 'AdvancedInputValidator');
      return {
        isValid: false,
        sanitizedInput: input,
        threats: ['Validation error'],
        riskLevel: 'medium'
      };
    }
  }

  private sanitizeHtml(input: string): string {
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  async validateFileUpload(file: File): Promise<{ isValid: boolean; reason?: string }> {
    // Allowed file types
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'text/plain',
      'application/pdf',
      'text/csv',
      'application/json'
    ];

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        reason: 'File type not allowed'
      };
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        isValid: false,
        reason: 'File size exceeds limit'
      };
    }

    // Check for malicious file names
    const maliciousPatterns = [
      /\.(exe|bat|cmd|com|pif|scr|vbs|js)$/i,
      /\.\./,
      /[<>:"|?*]/
    ];

    if (maliciousPatterns.some(pattern => pattern.test(file.name))) {
      return {
        isValid: false,
        reason: 'Malicious file name detected'
      };
    }

    return { isValid: true };
  }
}

export const advancedInputValidator = AdvancedInputValidator.getInstance();
