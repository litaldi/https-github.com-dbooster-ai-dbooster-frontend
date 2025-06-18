
import { auditLogger } from '../auditLogger';
import { productionLogger } from '@/utils/productionLogger';

interface SecurityValidationResult {
  isValid: boolean;
  errors: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

export class InputValidationService {
  private static instance: InputValidationService;

  static getInstance(): InputValidationService {
    if (!InputValidationService.instance) {
      InputValidationService.instance = new InputValidationService();
    }
    return InputValidationService.instance;
  }

  async validateUserInput(input: any, context: string): Promise<SecurityValidationResult> {
    const errors: string[] = [];
    let riskLevel: 'low' | 'medium' | 'high' = 'low';

    try {
      // Check for SQL injection patterns
      const sqlPatterns = [
        /['";]|--|#|\*|\s*\*/i,
        /(union|select|insert|update|delete|drop|create|alter)/i,
        /(script|javascript|vbscript|onload|onerror)/i
      ];

      const inputString = JSON.stringify(input).toLowerCase();
      
      for (const pattern of sqlPatterns) {
        if (pattern.test(inputString)) {
          errors.push('Potentially malicious input detected');
          riskLevel = 'high';
          
          // Log security violation
          await auditLogger.logSecurityEvent({
            event_type: 'input_validation_violation',
            event_data: {
              context,
              violationType: 'sql_injection_attempt',
              riskLevel: 'high'
            }
          });
          break;
        }
      }

      // Check for XSS patterns
      const xssPatterns = [
        /<script[^>]*>.*?<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi
      ];

      for (const pattern of xssPatterns) {
        if (pattern.test(inputString)) {
          errors.push('Cross-site scripting attempt detected');
          riskLevel = riskLevel === 'high' ? 'high' : 'medium';
          
          await auditLogger.logSecurityEvent({
            event_type: 'input_validation_violation',
            event_data: {
              context,
              violationType: 'xss_attempt',
              riskLevel
            }
          });
          break;
        }
      }

      return {
        isValid: errors.length === 0,
        errors,
        riskLevel
      };
    } catch (error) {
      productionLogger.error('Security validation failed', error, 'InputValidationService');
      return {
        isValid: false,
        errors: ['Security validation failed'],
        riskLevel: 'medium'
      };
    }
  }
}

export const inputValidationService = InputValidationService.getInstance();
