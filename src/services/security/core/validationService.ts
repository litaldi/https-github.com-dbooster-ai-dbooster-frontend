
import { productionLogger } from '@/utils/productionLogger';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  sanitizedValue?: any;
}

export interface ValidationRule {
  name: string;
  validator: (value: any, context?: any) => ValidationResult;
  priority: number;
}

export class ValidationService {
  private static instance: ValidationService;
  private rules: Map<string, ValidationRule[]> = new Map();

  static getInstance(): ValidationService {
    if (!ValidationService.instance) {
      ValidationService.instance = new ValidationService();
    }
    return ValidationService.instance;
  }

  registerRule(type: string, rule: ValidationRule): void {
    if (!this.rules.has(type)) {
      this.rules.set(type, []);
    }
    
    const rules = this.rules.get(type)!;
    rules.push(rule);
    rules.sort((a, b) => b.priority - a.priority);
  }

  async validate(type: string, value: any, context?: any): Promise<ValidationResult> {
    const rules = this.rules.get(type) || [];
    
    if (rules.length === 0) {
      productionLogger.warn(`No validation rules found for type: ${type}`, { type }, 'ValidationService');
      return {
        isValid: true,
        errors: [],
        warnings: [],
        riskLevel: 'low'
      };
    }

    let overallResult: ValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      riskLevel: 'low',
      sanitizedValue: value
    };

    for (const rule of rules) {
      try {
        const result = rule.validator(overallResult.sanitizedValue || value, context);
        
        overallResult.errors.push(...result.errors);
        overallResult.warnings.push(...result.warnings);
        
        if (!result.isValid) {
          overallResult.isValid = false;
        }
        
        // Update risk level to highest found
        if (this.getRiskLevelPriority(result.riskLevel) > this.getRiskLevelPriority(overallResult.riskLevel)) {
          overallResult.riskLevel = result.riskLevel;
        }
        
        if (result.sanitizedValue !== undefined) {
          overallResult.sanitizedValue = result.sanitizedValue;
        }
        
      } catch (error) {
        productionLogger.error(`Validation rule '${rule.name}' failed`, error, 'ValidationService');
        overallResult.errors.push(`Validation error in rule: ${rule.name}`);
        overallResult.isValid = false;
        overallResult.riskLevel = 'high';
      }
    }

    return overallResult;
  }

  async validateUserInput(input: string, context: string = 'general'): Promise<{
    valid: boolean;
    sanitized: string;
    threats: string[];
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
  }> {
    const result = await this.validate('user_input', input, context);
    return {
      valid: result.isValid,
      sanitized: result.sanitizedValue || input,
      threats: result.errors,
      riskLevel: result.riskLevel
    };
  }

  async validateFormData(formData: Record<string, any>, context: string): Promise<{
    valid: boolean;
    errors: Record<string, string[]>;
    sanitized: Record<string, any>;
  }> {
    const errors: Record<string, string[]> = {};
    const sanitized: Record<string, any> = {};
    let valid = true;

    for (const [key, value] of Object.entries(formData)) {
      if (typeof value === 'string') {
        const result = await this.validate('form_field', value, `${context}.${key}`);
        if (!result.isValid) {
          errors[key] = result.errors;
          valid = false;
        }
        sanitized[key] = result.sanitizedValue || value;
      } else {
        sanitized[key] = value;
      }
    }

    return { valid, errors, sanitized };
  }

  sanitizeInput(input: string, context: string = 'general'): string {
    // Basic sanitization
    let sanitized = input.trim();
    
    // Remove potentially harmful characters based on context
    switch (context) {
      case 'html':
        sanitized = sanitized.replace(/[<>]/g, '');
        break;
      case 'sql':
        sanitized = sanitized.replace(/[';--]/g, '');
        break;
      case 'general':
      default:
        sanitized = sanitized.replace(/[<>'"]/g, '');
        break;
    }
    
    return sanitized;
  }

  private getRiskLevelPriority(level: ValidationResult['riskLevel']): number {
    const priorities = { low: 1, medium: 2, high: 3, critical: 4 };
    return priorities[level] || 1;
  }
}

export const validationService = ValidationService.getInstance();
