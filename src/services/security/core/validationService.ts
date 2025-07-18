
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

/**
 * Optimized validation service with caching and performance improvements
 */
export class ValidationService {
  private static instance: ValidationService;
  private readonly rules: Map<string, ValidationRule[]> = new Map();
  private readonly cache: Map<string, { result: ValidationResult; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  static getInstance(): ValidationService {
    if (!ValidationService.instance) {
      ValidationService.instance = new ValidationService();
      ValidationService.instance.initializeDefaultRules();
    }
    return ValidationService.instance;
  }

  private initializeDefaultRules(): void {
    // Register default validation rules
    this.registerRule('user_input', {
      name: 'basic_sanitization',
      priority: 100,
      validator: (value: string) => ({
        isValid: typeof value === 'string',
        errors: typeof value !== 'string' ? ['Input must be a string'] : [],
        warnings: [],
        riskLevel: 'low' as const,
        sanitizedValue: typeof value === 'string' ? this.basicSanitize(value) : value
      })
    });

    this.registerRule('repository_id', {
      name: 'uuid_validation',
      priority: 90,
      validator: (value: string) => {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        const isValid = uuidRegex.test(value);
        return {
          isValid,
          errors: isValid ? [] : ['Invalid UUID format'],
          warnings: [],
          riskLevel: isValid ? 'low' : 'medium' as const
        };
      }
    });
  }

  registerRule(type: string, rule: ValidationRule): void {
    if (!this.rules.has(type)) {
      this.rules.set(type, []);
    }
    
    const rules = this.rules.get(type)!;
    rules.push(rule);
    rules.sort((a, b) => b.priority - a.priority);
    
    // Clear cache for this type when rules change
    this.clearCacheByType(type);
  }

  async validate(type: string, value: any, context?: any): Promise<ValidationResult> {
    const cacheKey = this.generateCacheKey(type, value, context);
    const cached = this.getFromCache(cacheKey);
    
    if (cached) {
      return cached;
    }

    const rules = this.rules.get(type) || [];
    
    if (rules.length === 0) {
      const result = this.getDefaultValidationResult(value);
      this.setCache(cacheKey, result);
      return result;
    }

    const result = await this.executeValidationRules(rules, value, context);
    this.setCache(cacheKey, result);
    
    return result;
  }

  private async executeValidationRules(
    rules: ValidationRule[], 
    value: any, 
    context?: any
  ): Promise<ValidationResult> {
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
    threatTypes?: string[];
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
  }> {
    const result = await this.validate('user_input', input, context);
    return {
      valid: result.isValid,
      sanitized: result.sanitizedValue || input,
      threats: result.errors,
      threatTypes: result.errors, // Map errors to threatTypes for compatibility
      riskLevel: result.riskLevel
    };
  }

  async validateFormData(formData: Record<string, any>, context: string): Promise<{
    isValid: boolean;
    valid: boolean;
    errors: Record<string, string[]>;
    sanitized: Record<string, any>;
  }> {
    const errors: Record<string, string[]> = {};
    const sanitized: Record<string, any> = {};
    let valid = true;

    // Process fields in parallel for better performance
    const validationPromises = Object.entries(formData).map(async ([key, value]) => {
      if (typeof value === 'string') {
        const result = await this.validate('form_field', value, `${context}.${key}`);
        return { key, result, value };
      }
      return { key, result: null, value };
    });

    const results = await Promise.all(validationPromises);

    for (const { key, result, value } of results) {
      if (result && !result.isValid) {
        errors[key] = result.errors;
        valid = false;
      }
      sanitized[key] = result?.sanitizedValue || value;
    }

    return { 
      isValid: valid,
      valid, 
      errors, 
      sanitized 
    };
  }

  sanitizeInput(input: string, context: string = 'general'): string {
    return this.basicSanitize(input);
  }

  private basicSanitize(input: string): string {
    // Remove potentially harmful characters
    return input
      .trim()
      .replace(/[<>'"]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/data:/gi, '')
      .substring(0, 10000); // Limit length
  }

  private getRiskLevelPriority(level: ValidationResult['riskLevel']): number {
    const priorities = { low: 1, medium: 2, high: 3, critical: 4 };
    return priorities[level] || 1;
  }

  private generateCacheKey(type: string, value: any, context?: any): string {
    return `${type}:${JSON.stringify(value)}:${context || ''}`;
  }

  private getFromCache(key: string): ValidationResult | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.result;
    }
    if (cached) {
      this.cache.delete(key);
    }
    return null;
  }

  private setCache(key: string, result: ValidationResult): void {
    // Limit cache size
    if (this.cache.size > 1000) {
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
    
    this.cache.set(key, { result, timestamp: Date.now() });
  }

  private clearCacheByType(type: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(`${type}:`)) {
        this.cache.delete(key);
      }
    }
  }

  private getDefaultValidationResult(value: any): ValidationResult {
    productionLogger.warn(`No validation rules found`, { value }, 'ValidationService');
    return {
      isValid: true,
      errors: [],
      warnings: ['No validation rules applied'],
      riskLevel: 'low'
    };
  }

  // Cleanup method for testing
  clearCache(): void {
    this.cache.clear();
  }
}

export const validationService = ValidationService.getInstance();
