
import DOMPurify from 'dompurify';
import { productionLogger } from '@/utils/productionLogger';

export interface ValidationResult {
  isValid: boolean;
  sanitizedValue?: string;
  errors: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export class ConsolidatedInputValidation {
  private static instance: ConsolidatedInputValidation;

  static getInstance(): ConsolidatedInputValidation {
    if (!ConsolidatedInputValidation.instance) {
      ConsolidatedInputValidation.instance = new ConsolidatedInputValidation();
    }
    return ConsolidatedInputValidation.instance;
  }

  validateAndSanitize(input: string, context: string = 'general'): ValidationResult {
    const errors: string[] = [];
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';

    // Basic input validation
    if (!input || typeof input !== 'string') {
      errors.push('Invalid input type');
      return {
        isValid: false,
        errors,
        riskLevel: 'medium'
      };
    }

    // Length validation
    if (input.length > 10000) {
      errors.push('Input too long');
      riskLevel = 'medium';
    }

    // Detect potential XSS
    if (/<script|javascript:|on\w+=/i.test(input)) {
      errors.push('Potential XSS detected');
      riskLevel = 'critical';
    }

    // Detect potential SQL injection
    if (/(union|select|insert|update|delete|drop)\s+/i.test(input)) {
      errors.push('Potential SQL injection detected');
      riskLevel = 'critical';
    }

    // Context-specific validation
    switch (context) {
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)) {
          errors.push('Invalid email format');
          riskLevel = 'medium';
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
        if (/[<>:"/\\|?*]/.test(input)) {
          errors.push('Invalid filename characters');
          riskLevel = 'medium';
        }
        break;
    }

    // Sanitize the input
    const sanitizedValue = DOMPurify.sanitize(input, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: []
    });

    const isValid = errors.length === 0;

    if (!isValid) {
      productionLogger.warn('Input validation failed', {
        context,
        errors,
        riskLevel
      }, 'InputValidation');
    }

    return {
      isValid,
      sanitizedValue,
      errors,
      riskLevel
    };
  }
}

export const consolidatedInputValidation = ConsolidatedInputValidation.getInstance();
