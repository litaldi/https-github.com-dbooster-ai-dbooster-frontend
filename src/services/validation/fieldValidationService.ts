
import { comprehensiveInputValidation } from '@/services/security/comprehensiveInputValidation';
import { productionLogger } from '@/utils/productionLogger';
import { auditLogger } from '@/services/auditLogger';
import { ValidationRule, ValidationResult } from './baseValidationRules';

export class FieldValidationService {
  private static instance: FieldValidationService;

  static getInstance(): FieldValidationService {
    if (!FieldValidationService.instance) {
      FieldValidationService.instance = new FieldValidationService();
    }
    return FieldValidationService.instance;
  }

  async validateField(
    fieldName: string,
    value: any,
    rule: ValidationRule,
    context?: string
  ): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';

    try {
      const stringValue = String(value || '');

      // Required field check
      if (rule.required && !stringValue.trim()) {
        errors.push(`${fieldName} is required`);
        return {
          isValid: false,
          errors,
          warnings,
          sanitizedValue: '',
          riskLevel: 'medium'
        };
      }

      // Length checks
      if (rule.minLength && stringValue.length < rule.minLength) {
        errors.push(`${fieldName} must be at least ${rule.minLength} characters long`);
      }

      if (rule.maxLength && stringValue.length > rule.maxLength) {
        errors.push(`${fieldName} must not exceed ${rule.maxLength} characters`);
        // Truncate for safety
        value = stringValue.substring(0, rule.maxLength);
      }

      // Pattern validation
      if (rule.pattern && !rule.pattern.test(stringValue)) {
        errors.push(`${fieldName} format is invalid`);
      }

      // Type-specific validation using comprehensive service
      let validationResult;
      if (rule.type === 'custom' && rule.customValidator) {
        validationResult = rule.customValidator(stringValue);
        errors.push(...validationResult.errors);
      } else if (rule.type !== 'custom') {
        validationResult = comprehensiveInputValidation.validateInput(stringValue, rule.type);
        errors.push(...validationResult.errors);
      } else {
        // Default validation for custom type without validator
        validationResult = { errors: [], isValid: true, sanitized: stringValue };
      }

      // Determine risk level based on validation results
      if (validationResult.errors.some(error => 
        error.includes('SQL injection') || 
        error.includes('script') ||
        error.includes('dangerous pattern')
      )) {
        riskLevel = 'critical';
      } else if (validationResult.errors.length > 2) {
        riskLevel = 'high';
      } else if (validationResult.errors.length > 0) {
        riskLevel = 'medium';
      }

      // Sanitize if requested
      let sanitizedValue = stringValue;
      if (rule.sanitize !== false) {
        sanitizedValue = comprehensiveInputValidation.sanitizeInput(stringValue, {
          allowHtml: false,
          maxLength: rule.maxLength || 1000,
          stripScripts: true
        });
      }

      // Log high-risk validation attempts
      if (riskLevel === 'critical' || riskLevel === 'high') {
        await auditLogger.logSecurityEvent({
          event_type: 'high_risk_input_validation',
          event_data: {
            fieldName,
            riskLevel,
            errorCount: errors.length,
            context: context || 'unknown',
            hasScript: stringValue.includes('<script'),
            hasSql: /\b(SELECT|INSERT|UPDATE|DELETE|DROP)\b/i.test(stringValue)
          }
        });
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        sanitizedValue,
        riskLevel
      };
    } catch (error) {
      productionLogger.error('Field validation error', error, 'FieldValidationService');
      return {
        isValid: false,
        errors: ['Validation failed'],
        warnings: [],
        sanitizedValue: String(value || ''),
        riskLevel: 'medium'
      };
    }
  }
}

export const fieldValidationService = FieldValidationService.getInstance();
