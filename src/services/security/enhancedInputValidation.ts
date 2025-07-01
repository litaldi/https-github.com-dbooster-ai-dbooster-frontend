
import { fieldValidationService } from '@/services/validation/fieldValidationService';
import { formValidationService } from '@/services/validation/formValidationService';
import { fileValidationService } from '@/services/validation/fileValidationService';
import { BaseValidationRules, ValidationRule, ValidationResult } from '@/services/validation/baseValidationRules';

interface FormValidationConfig {
  [fieldName: string]: ValidationRule;
}

export class EnhancedInputValidation {
  private static instance: EnhancedInputValidation;

  static getInstance(): EnhancedInputValidation {
    if (!EnhancedInputValidation.instance) {
      EnhancedInputValidation.instance = new EnhancedInputValidation();
    }
    return EnhancedInputValidation.instance;
  }

  async validateField(
    fieldName: string,
    value: any,
    rule: ValidationRule,
    context?: string
  ): Promise<ValidationResult> {
    return fieldValidationService.validateField(fieldName, value, rule, context);
  }

  async validateForm(
    formData: Record<string, any>,
    config: FormValidationConfig,
    context?: string
  ): Promise<{
    isValid: boolean;
    fieldResults: Record<string, ValidationResult>;
    overallRiskLevel: 'low' | 'medium' | 'high' | 'critical';
    sanitizedData: Record<string, any>;
  }> {
    return formValidationService.validateForm(formData, config, context);
  }

  async validateFileUpload(
    file: File,
    allowedTypes: string[] = [],
    maxSize: number = 5 * 1024 * 1024,
    context?: string
  ): Promise<ValidationResult> {
    return fileValidationService.validateFileUpload(file, allowedTypes, maxSize, context);
  }

  // Predefined validation rules for common form fields
  static readonly COMMON_RULES = BaseValidationRules.COMMON_RULES;
}

export const enhancedInputValidation = EnhancedInputValidation.getInstance();
