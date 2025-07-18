
import DOMPurify from 'dompurify';
import { productionLogger } from '@/utils/productionLogger';

interface ValidationRule {
  pattern?: RegExp;
  minLength?: number;
  maxLength?: number;
  allowedChars?: string;
  blockedPatterns?: RegExp[];
  sanitize?: boolean;
}

interface ValidationContext {
  [key: string]: ValidationRule;
}

export class EnhancedInputValidation {
  private static instance: EnhancedInputValidation;
  
  private contexts: Record<string, ValidationContext> = {
    general: {
      default: {
        maxLength: 1000,
        sanitize: true,
        blockedPatterns: [
          /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
          /javascript:/gi,
          /on\w+\s*=/gi,
          /data:text\/html/gi
        ]
      }
    },
    repository_id: {
      default: {
        pattern: /^[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/,
        maxLength: 36,
        sanitize: false
      }
    },
    email: {
      default: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        maxLength: 254,
        sanitize: true
      }
    },
    password: {
      default: {
        minLength: 8,
        maxLength: 128,
        sanitize: false,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
      }
    },
    sql_query: {
      default: {
        maxLength: 5000,
        sanitize: true,
        blockedPatterns: [
          /;\s*(drop|delete|truncate|alter)\s+/gi,
          /union\s+select/gi,
          /exec\s*\(/gi,
          /xp_cmdshell/gi
        ]
      }
    }
  };

  static getInstance(): EnhancedInputValidation {
    if (!EnhancedInputValidation.instance) {
      EnhancedInputValidation.instance = new EnhancedInputValidation();
    }
    return EnhancedInputValidation.instance;
  }

  async validateInput(input: string, context: string = 'general'): Promise<{
    valid: boolean;
    sanitized: string;
    errors: string[];
    riskLevel: 'low' | 'medium' | 'high';
  }> {
    const errors: string[] = [];
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    
    const contextRules = this.contexts[context]?.default || this.contexts.general.default;
    
    // Length validation
    if (contextRules.minLength && input.length < contextRules.minLength) {
      errors.push(`Input must be at least ${contextRules.minLength} characters`);
    }
    
    if (contextRules.maxLength && input.length > contextRules.maxLength) {
      errors.push(`Input must not exceed ${contextRules.maxLength} characters`);
      riskLevel = 'medium';
    }

    // Pattern validation
    if (contextRules.pattern && !contextRules.pattern.test(input)) {
      errors.push('Input format is invalid');
    }

    // Check for blocked patterns
    if (contextRules.blockedPatterns) {
      for (const pattern of contextRules.blockedPatterns) {
        if (pattern.test(input)) {
          errors.push('Input contains potentially dangerous content');
          riskLevel = 'high';
          
          // Log security violation - using secureWarn correctly
          productionLogger.secureWarn('Blocked pattern detected in input', {
            context,
            pattern: pattern.source,
            inputLength: input.length
          });
        }
      }
    }

    // Sanitization
    let sanitized = input;
    if (contextRules.sanitize) {
      sanitized = this.sanitizeInput(input, context);
      if (sanitized !== input) {
        riskLevel = Math.max(riskLevel === 'low' ? 0 : riskLevel === 'medium' ? 1 : 2, 1) === 1 ? 'medium' : 'high';
      }
    }

    return {
      valid: errors.length === 0,
      sanitized,
      errors,
      riskLevel
    };
  }

  sanitizeInput(input: string, context: string = 'general'): string {
    let sanitized = input;

    // HTML sanitization
    sanitized = DOMPurify.sanitize(sanitized, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true
    });

    // Context-specific sanitization
    switch (context) {
      case 'sql_query':
        // Remove potential SQL injection patterns
        sanitized = sanitized.replace(/['"`;]/g, '');
        break;
      case 'email':
        // Keep only valid email characters
        sanitized = sanitized.replace(/[^a-zA-Z0-9@._-]/g, '');
        break;
      case 'repository_id':
        // Keep only UUID characters
        sanitized = sanitized.replace(/[^a-fA-F0-9-]/g, '');
        break;
    }

    // General cleanup
    sanitized = sanitized.trim();
    sanitized = sanitized.replace(/\s+/g, ' '); // Normalize whitespace

    return sanitized;
  }

  addCustomValidationRule(context: string, rule: ValidationRule): void {
    if (!this.contexts[context]) {
      this.contexts[context] = {};
    }
    this.contexts[context].default = { ...this.contexts[context].default, ...rule };
  }
}

export const enhancedInputValidation = EnhancedInputValidation.getInstance();
