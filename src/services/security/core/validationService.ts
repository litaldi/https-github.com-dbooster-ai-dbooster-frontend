
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

  private getRiskLevelPriority(level: ValidationResult['riskLevel']): number {
    const priorities = { low: 1, medium: 2, high: 3, critical: 4 };
    return priorities[level] || 1;
  }
}

export const validationService = ValidationService.getInstance();
