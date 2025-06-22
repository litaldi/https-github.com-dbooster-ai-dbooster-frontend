
import { inputSanitizationService } from './inputSanitizationService';
import { auditLogger } from '../auditLogger';
import { productionLogger } from '@/utils/productionLogger';

interface ValidationRule {
  required?: boolean;
  type?: 'email' | 'phone' | 'password' | 'url' | 'text' | 'number';
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  customValidator?: (value: any) => boolean;
}

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedValue?: any;
  riskLevel: 'low' | 'medium' | 'high';
}

export class ComprehensiveInputValidation {
  private static instance: ComprehensiveInputValidation;

  static getInstance(): ComprehensiveInputValidation {
    if (!ComprehensiveInputValidation.instance) {
      ComprehensiveInputValidation.instance = new ComprehensiveInputValidation();
    }
    return ComprehensiveInputValidation.instance;
  }

  async validateInput(value: any, rules: ValidationRule, context: string = 'general'): Promise<ValidationResult> {
    const errors: string[] = [];
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    let sanitizedValue = value;

    try {
      // Required validation
      if (rules.required && (!value || value.toString().trim() === '')) {
        errors.push('This field is required');
        return { isValid: false, errors, riskLevel: 'low' };
      }

      // Skip further validation if value is empty and not required
      if (!value || value.toString().trim() === '') {
        return { isValid: true, errors: [], sanitizedValue: '', riskLevel: 'low' };
      }

      const stringValue = value.toString();

      // Security threat detection
      const threatCheck = this.detectSecurityThreats(stringValue);
      if (threatCheck.hasThreats) {
        errors.push(...threatCheck.threats);
        riskLevel = threatCheck.riskLevel;

        // Log security threat
        await auditLogger.logSecurityEvent({
          event_type: 'input_security_threat',
          event_data: {
            context,
            threats: threatCheck.threats,
            riskLevel,
            inputLength: stringValue.length
          }
        });
      }

      // Length validation
      if (rules.minLength && stringValue.length < rules.minLength) {
        errors.push(`Must be at least ${rules.minLength} characters long`);
      }

      if (rules.maxLength && stringValue.length > rules.maxLength) {
        errors.push(`Must be no more than ${rules.maxLength} characters long`);
        riskLevel = 'medium'; // Long inputs can be DoS attempts
      }

      // Type-specific validation
      if (rules.type) {
        const typeValidation = this.validateByType(stringValue, rules.type);
        if (!typeValidation.isValid) {
          errors.push(...typeValidation.errors);
        }
      }

      // Pattern validation
      if (rules.pattern && !rules.pattern.test(stringValue)) {
        errors.push('Invalid format');
      }

      // Custom validation
      if (rules.customValidator && !rules.customValidator(value)) {
        errors.push('Custom validation failed');
      }

      // Sanitize input if no major threats
      if (riskLevel !== 'high') {
        sanitizedValue = inputSanitizationService.sanitizeInput(stringValue);
      }

      return {
        isValid: errors.length === 0,
        errors,
        sanitizedValue,
        riskLevel
      };

    } catch (error) {
      productionLogger.error('Input validation error', error, 'ComprehensiveInputValidation');
      return {
        isValid: false,
        errors: ['Validation failed'],
        riskLevel: 'medium'
      };
    }
  }

  private detectSecurityThreats(input: string): { hasThreats: boolean; threats: string[]; riskLevel: 'low' | 'medium' | 'high' } {
    const threats: string[] = [];
    let riskLevel: 'low' | 'medium' | 'high' = 'low';

    // SQL Injection patterns
    const sqlPatterns = [
      /('|('')|;|--|\/\*|\*\/)/i,
      /(union|select|insert|update|delete|drop|create|alter|exec|execute)\s/i,
      /(\bor\b|\band\b)\s+\d+\s*=\s*\d+/i
    ];

    for (const pattern of sqlPatterns) {
      if (pattern.test(input)) {
        threats.push('Potential SQL injection attempt detected');
        riskLevel = 'high';
        break;
      }
    }

    // XSS patterns
    const xssPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe[^>]*>/gi,
      /<object[^>]*>/gi,
      /<embed[^>]*>/gi
    ];

    for (const pattern of xssPatterns) {
      if (pattern.test(input)) {
        threats.push('Cross-site scripting attempt detected');
        riskLevel = riskLevel === 'high' ? 'high' : 'medium';
        break;
      }
    }

    // Command injection patterns
    const commandPatterns = [
      /[;&|`$(){}[\]]/,
      /(curl|wget|nc|netcat|bash|sh|cmd|powershell)/i
    ];

    for (const pattern of commandPatterns) {
      if (pattern.test(input)) {
        threats.push('Potential command injection detected');
        riskLevel = 'high';
        break;
      }
    }

    // Path traversal
    if (/\.\.(\/|\\)/.test(input)) {
      threats.push('Path traversal attempt detected');
      riskLevel = 'medium';
    }

    // Excessive length (potential DoS)
    if (input.length > 10000) {
      threats.push('Input exceeds safe length limits');
      riskLevel = riskLevel === 'high' ? 'high' : 'medium';
    }

    return {
      hasThreats: threats.length > 0,
      threats,
      riskLevel
    };
  }

  private validateByType(value: string, type: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    switch (type) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors.push('Invalid email format');
        }
        break;

      case 'phone':
        const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
          errors.push('Invalid phone number format');
        }
        break;

      case 'password':
        if (value.length < 8) {
          errors.push('Password must be at least 8 characters long');
        }
        if (!/(?=.*[a-z])/.test(value)) {
          errors.push('Password must contain at least one lowercase letter');
        }
        if (!/(?=.*[A-Z])/.test(value)) {
          errors.push('Password must contain at least one uppercase letter');
        }
        if (!/(?=.*\d)/.test(value)) {
          errors.push('Password must contain at least one number');
        }
        if (!/(?=.*[!@#$%^&*])/.test(value)) {
          errors.push('Password must contain at least one special character');
        }
        break;

      case 'url':
        try {
          new URL(value);
        } catch {
          errors.push('Invalid URL format');
        }
        break;

      case 'number':
        if (isNaN(Number(value))) {
          errors.push('Must be a valid number');
        }
        break;
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Batch validation for forms
  async validateForm(data: Record<string, any>, rules: Record<string, ValidationRule>, context: string = 'form'): Promise<{
    isValid: boolean;
    errors: Record<string, string[]>;
    sanitizedData: Record<string, any>;
    overallRiskLevel: 'low' | 'medium' | 'high';
  }> {
    const errors: Record<string, string[]> = {};
    const sanitizedData: Record<string, any> = {};
    let overallRiskLevel: 'low' | 'medium' | 'high' = 'low';

    for (const [field, rule] of Object.entries(rules)) {
      const result = await this.validateInput(data[field], rule, `${context}.${field}`);
      
      if (!result.isValid) {
        errors[field] = result.errors;
      }
      
      sanitizedData[field] = result.sanitizedValue;
      
      // Update overall risk level
      if (result.riskLevel === 'high') {
        overallRiskLevel = 'high';
      } else if (result.riskLevel === 'medium' && overallRiskLevel !== 'high') {
        overallRiskLevel = 'medium';
      }
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      sanitizedData,
      overallRiskLevel
    };
  }
}

export const comprehensiveInputValidation = ComprehensiveInputValidation.getInstance();
