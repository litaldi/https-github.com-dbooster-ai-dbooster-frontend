
import { auditLogger } from '@/services/auditLogger';
import { ValidationRule, ValidationResult } from './baseValidationRules';
import { fieldValidationService } from './fieldValidationService';

interface FormValidationConfig {
  [fieldName: string]: ValidationRule;
}

export class FormValidationService {
  private static instance: FormValidationService;

  static getInstance(): FormValidationService {
    if (!FormValidationService.instance) {
      FormValidationService.instance = new FormValidationService();
    }
    return FormValidationService.instance;
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
    const fieldResults: Record<string, ValidationResult> = {};
    const sanitizedData: Record<string, any> = {};
    let overallRiskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';

    // Validate each field according to its rule
    for (const [fieldName, rule] of Object.entries(config)) {
      const fieldValue = formData[fieldName];
      const result = await fieldValidationService.validateField(fieldName, fieldValue, rule, context);
      
      fieldResults[fieldName] = result;
      sanitizedData[fieldName] = result.sanitizedValue;

      // Update overall risk level
      if (result.riskLevel === 'critical') {
        overallRiskLevel = 'critical';
      } else if (result.riskLevel === 'high' && overallRiskLevel !== 'critical') {
        overallRiskLevel = 'high';
      } else if (result.riskLevel === 'medium' && overallRiskLevel === 'low') {
        overallRiskLevel = 'medium';
      }
    }

    const isValid = Object.values(fieldResults).every(result => result.isValid);

    // Log form validation summary
    if (overallRiskLevel === 'critical' || overallRiskLevel === 'high') {
      await auditLogger.logSecurityEvent({
        event_type: 'high_risk_form_validation',
        event_data: {
          context: context || 'unknown',
          overallRiskLevel,
          fieldCount: Object.keys(config).length,
          invalidFields: Object.entries(fieldResults)
            .filter(([_, result]) => !result.isValid)
            .map(([name, _]) => name),
          riskDistribution: Object.values(fieldResults).reduce((acc, result) => {
            acc[result.riskLevel]++;
            return acc;
          }, { low: 0, medium: 0, high: 0, critical: 0 } as Record<string, number>)
        }
      });
    }

    return {
      isValid,
      fieldResults,
      overallRiskLevel,
      sanitizedData
    };
  }
}

export const formValidationService = FormValidationService.getInstance();
