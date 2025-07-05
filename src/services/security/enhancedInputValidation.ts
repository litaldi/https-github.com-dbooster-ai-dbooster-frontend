
import DOMPurify from 'dompurify';
import { enhancedProductionLogger } from '@/utils/enhancedProductionLogger';
import { enhancedSecurityConfig } from './enhancedSecurityConfig';

export interface EnhancedValidationResult {
  isValid: boolean;
  sanitizedValue?: string;
  errors: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  metadata: {
    originalLength: number;
    sanitizedLength: number;
    maxLength: number;
    detectedThreats: string[];
  };
}

export class EnhancedInputValidationService {
  private static instance: EnhancedInputValidationService;
  private threatPatterns: Record<string, RegExp> = {
    xss: /<script|javascript:|on\w+=/i,
    sqlInjection: /(union|select|insert|update|delete|drop|exec|execute)\s+/i,
    pathTraversal: /\.\.[\/\\]/,
    commandInjection: /[;&|`$(){}[\]]/,
    htmlInjection: /<[^>]+>/,
    noSql: /\$where|\$ne|\$gt|\$lt|\$regex/i,
    ldapInjection: /[()&|!*]/,
    xmlInjection: /<!(?:DOCTYPE|ENTITY|ELEMENT|ATTLIST)/i
  };

  static getInstance(): EnhancedInputValidationService {
    if (!EnhancedInputValidationService.instance) {
      EnhancedInputValidationService.instance = new EnhancedInputValidationService();
    }
    return EnhancedInputValidationService.instance;
  }

  validateAndSanitize(input: string, context: string = 'general'): EnhancedValidationResult {
    const errors: string[] = [];
    const detectedThreats: string[] = [];
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';

    // Basic input validation
    if (!input || typeof input !== 'string') {
      return {
        isValid: false,
        errors: ['Invalid input type'],
        riskLevel: 'medium',
        metadata: {
          originalLength: 0,
          sanitizedLength: 0,
          maxLength: 0,
          detectedThreats: []
        }
      };
    }

    const originalLength = input.length;

    // Length validation using enhanced security config
    const lengthValidation = enhancedSecurityConfig.validateInputLength(input, context);
    if (!lengthValidation.isValid) {
      errors.push(`Input too long (${lengthValidation.actualLength}/${lengthValidation.maxLength} characters)`);
      riskLevel = 'medium';
    }

    // Threat detection
    for (const [threatType, pattern] of Object.entries(this.threatPatterns)) {
      if (pattern.test(input)) {
        detectedThreats.push(threatType);
        errors.push(`Potential ${threatType} detected`);
        riskLevel = threatType === 'xss' || threatType === 'sqlInjection' ? 'critical' : 'high';
      }
    }

    // Context-specific validation
    switch (context) {
      case 'email':
        const emailValidation = enhancedSecurityConfig.validateEmail(input);
        if (!emailValidation.isValid) {
          errors.push(...emailValidation.errors);
          riskLevel = Math.max(riskLevel === 'low' ? 0 : riskLevel === 'medium' ? 1 : riskLevel === 'high' ? 2 : 3, 1) === 1 ? 'medium' : riskLevel;
        }
        break;
      case 'password':
        const passwordValidation = enhancedSecurityConfig.validatePassword(input);
        if (!passwordValidation.isValid) {
          errors.push(...passwordValidation.errors);
          riskLevel = Math.max(riskLevel === 'low' ? 0 : riskLevel === 'medium' ? 1 : riskLevel === 'high' ? 2 : 3, 1) === 1 ? 'medium' : riskLevel;
        }
        break;
      case 'url':
        try {
          new URL(input);
        } catch {
          errors.push('Invalid URL format');
          riskLevel = 'medium';
        }
        break;
      case 'filename':
        if (/[<>:"/\\|?*\x00-\x1f]/.test(input)) {
          errors.push('Invalid filename characters');
          riskLevel = 'medium';
        }
        break;
    }

    // Sanitize the input
    let sanitizedValue = input;
    
    try {
      // Use DOMPurify for HTML sanitization
      sanitizedValue = DOMPurify.sanitize(input, {
        ALLOWED_TAGS: context === 'html' ? ['p', 'br', 'strong', 'em', 'u'] : [],
        ALLOWED_ATTR: [],
        KEEP_CONTENT: true
      });

      // Additional sanitization for specific contexts
      if (context === 'sql' || context === 'database') {
        sanitizedValue = sanitizedValue.replace(/['"`;]/g, '');
      }

      // Normalize whitespace
      sanitizedValue = sanitizedValue.replace(/\s+/g, ' ').trim();

    } catch (error) {
      enhancedProductionLogger.error('Sanitization failed', error, 'EnhancedInputValidation');
      sanitizedValue = input.replace(/[<>"'&]/g, ''); // Fallback sanitization
    }

    const isValid = errors.length === 0;
    const sanitizedLength = sanitizedValue.length;

    if (!isValid) {
      enhancedProductionLogger.warn('Input validation failed', {
        context,
        errors,
        riskLevel,
        detectedThreats,
        originalLength,
        sanitizedLength
      }, 'EnhancedInputValidation');
    }

    return {
      isValid,
      sanitizedValue,
      errors,
      riskLevel,
      metadata: {
        originalLength,
        sanitizedLength,
        maxLength: lengthValidation.maxLength,
        detectedThreats
      }
    };
  }

  validateBatch(inputs: Record<string, { value: string; context: string }>): Record<string, EnhancedValidationResult> {
    const results: Record<string, EnhancedValidationResult> = {};
    
    for (const [key, { value, context }] of Object.entries(inputs)) {
      results[key] = this.validateAndSanitize(value, context);
    }

    return results;
  }

  isSecureInput(input: string, context: string = 'general'): boolean {
    const result = this.validateAndSanitize(input, context);
    return result.isValid && result.riskLevel === 'low';
  }

  sanitizeForDatabase(input: string): string {
    const result = this.validateAndSanitize(input, 'database');
    return result.sanitizedValue || '';
  }

  sanitizeForDisplay(input: string): string {
    const result = this.validateAndSanitize(input, 'html');
    return result.sanitizedValue || '';
  }
}

export const enhancedInputValidation = EnhancedInputValidationService.getInstance();
