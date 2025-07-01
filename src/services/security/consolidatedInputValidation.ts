
import DOMPurify from 'dompurify';
import { productionLogger } from '@/utils/productionLogger';

interface ValidationResult {
  isValid: boolean;
  sanitizedValue?: string;
  errors: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

export class ConsolidatedInputValidation {
  private static instance: ConsolidatedInputValidation;

  static getInstance(): ConsolidatedInputValidation {
    if (!ConsolidatedInputValidation.instance) {
      ConsolidatedInputValidation.instance = new ConsolidatedInputValidation();
    }
    return ConsolidatedInputValidation.instance;
  }

  validateAndSanitize(input: any, context: string = 'general'): ValidationResult {
    const errors: string[] = [];
    let riskLevel: 'low' | 'medium' | 'high' = 'low';

    if (typeof input !== 'string') {
      return {
        isValid: false,
        errors: ['Input must be a string'],
        riskLevel: 'low'
      };
    }

    // Check for common attack patterns
    const dangerousPatterns = [
      { pattern: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, risk: 'high', type: 'XSS' },
      { pattern: /javascript:/gi, risk: 'high', type: 'JavaScript injection' },
      { pattern: /on\w+\s*=/gi, risk: 'high', type: 'Event handler injection' },
      { pattern: /(union|select|insert|update|delete|drop|create|alter)\s+/gi, risk: 'high', type: 'SQL injection' },
      { pattern: /\.\.\//g, risk: 'medium', type: 'Path traversal' },
      { pattern: /\${.*}/g, risk: 'medium', type: 'Template injection' },
      { pattern: /<iframe\b[^>]*>/gi, risk: 'high', type: 'Iframe injection' },
      { pattern: /<object\b[^>]*>/gi, risk: 'high', type: 'Object injection' },
      { pattern: /<embed\b[^>]*>/gi, risk: 'high', type: 'Embed injection' }
    ];

    for (const { pattern, risk, type } of dangerousPatterns) {
      if (pattern.test(input)) {
        errors.push(`Potentially dangerous ${type} detected`);
        if (risk === 'high') riskLevel = 'high';
        else if (risk === 'medium' && riskLevel !== 'high') riskLevel = 'medium';
      }
    }

    // Context-specific validation
    const contextValidation = this.validateByContext(input, context);
    errors.push(...contextValidation.errors);
    if (contextValidation.riskLevel === 'high') riskLevel = 'high';
    else if (contextValidation.riskLevel === 'medium' && riskLevel !== 'high') riskLevel = 'medium';

    // Sanitize input
    let sanitizedValue = this.sanitizeInput(input, context);

    // Final validation check
    const isValid = errors.length === 0 && riskLevel !== 'high';

    if (!isValid) {
      productionLogger.warn('Input validation failed', {
        context,
        riskLevel,
        errors,
        inputLength: input.length
      }, 'ConsolidatedInputValidation');
    }

    return {
      isValid,
      sanitizedValue,
      errors,
      riskLevel
    };
  }

  private validateByContext(input: string, context: string): { errors: string[]; riskLevel: 'low' | 'medium' | 'high' } {
    const errors: string[] = [];
    let riskLevel: 'low' | 'medium' | 'high' = 'low';

    switch (context) {
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)) {
          errors.push('Invalid email format');
          riskLevel = 'medium';
        }
        break;

      case 'password':
        if (input.length < 8) {
          errors.push('Password too short');
          riskLevel = 'medium';
        }
        break;

      case 'url':
        try {
          const url = new URL(input);
          if (!['http:', 'https:'].includes(url.protocol)) {
            errors.push('Invalid URL protocol');
            riskLevel = 'high';
          }
        } catch {
          errors.push('Invalid URL format');
          riskLevel = 'medium';
        }
        break;

      case 'filename':
        if (/[<>:"/\\|?*]/.test(input)) {
          errors.push('Invalid filename characters');
          riskLevel = 'medium';
        }
        break;

      case 'html':
        // More lenient for HTML content but still check for dangerous elements
        if (/<script|javascript:|on\w+=/gi.test(input)) {
          errors.push('Dangerous HTML content detected');
          riskLevel = 'high';
        }
        break;

      case 'query':
        // Database query context
        if (/(union|insert|update|delete|drop|create|alter)\s+/gi.test(input)) {
          errors.push('Potentially dangerous SQL content');
          riskLevel = 'high';
        }
        break;
    }

    return { errors, riskLevel };
  }

  private sanitizeInput(input: string, context: string): string {
    switch (context) {
      case 'html':
        return DOMPurify.sanitize(input, {
          ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'],
          ALLOWED_ATTR: []
        });

      case 'email':
        return input.toLowerCase().trim();

      case 'url':
        return encodeURI(input.trim());

      case 'filename':
        return input.replace(/[<>:"/\\|?*]/g, '').trim();

      case 'query':
        // Basic SQL injection prevention
        return input.replace(/['";\\]/g, '').trim();

      default:
        // General sanitization
        return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
    }
  }

  sanitizeObject(obj: Record<string, any>, contextMap: Record<string, string> = {}): Record<string, any> {
    const sanitized: Record<string, any> = {};

    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        const context = contextMap[key] || 'general';
        const validation = this.validateAndSanitize(value, context);
        sanitized[key] = validation.sanitizedValue || value;
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        sanitized[key] = this.sanitizeObject(value, contextMap);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  validateForm(formData: Record<string, any>, fieldContexts: Record<string, string> = {}): {
    isValid: boolean;
    errors: Record<string, string[]>;
    sanitizedData: Record<string, any>;
  } {
    const errors: Record<string, string[]> = {};
    const sanitizedData: Record<string, any> = {};
    let isValid = true;

    for (const [field, value] of Object.entries(formData)) {
      if (typeof value === 'string') {
        const context = fieldContexts[field] || 'general';
        const validation = this.validateAndSanitize(value, context);
        
        sanitizedData[field] = validation.sanitizedValue || value;
        
        if (!validation.isValid) {
          errors[field] = validation.errors;
          isValid = false;
        }
      } else {
        sanitizedData[field] = value;
      }
    }

    return { isValid, errors, sanitizedData };
  }
}

export const consolidatedInputValidation = ConsolidatedInputValidation.getInstance();
