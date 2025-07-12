
import { consolidatedInputValidation } from '../consolidatedInputValidation';
import { enhancedThreatDetection } from '../threatDetectionEnhanced';
import { productionLogger } from '@/utils/productionLogger';

export class ValidationService {
  private static instance: ValidationService;

  static getInstance(): ValidationService {
    if (!ValidationService.instance) {
      ValidationService.instance = new ValidationService();
    }
    return ValidationService.instance;
  }

  async validateUserInput(input: string, context: string = 'general'): Promise<{ 
    valid: boolean; 
    errors?: string[]; 
    riskLevel?: string;
    threatTypes?: string[];
    sanitizedInput?: string;
  }> {
    // Client-side validation first
    const clientValidation = consolidatedInputValidation.validateAndSanitize(input, context);
    
    // Enhanced threat detection for string inputs
    const threatResult = await enhancedThreatDetection.detectThreats(input, {
      inputType: context,
      userAgent: navigator.userAgent
    });
    
    // Server-side validation for critical inputs
    let serverValidation = null;
    if (context.includes('database') || context.includes('auth') || threatResult.shouldBlock) {
      try {
        const { serverSideValidationService } = await import('../serverSideValidationService');
        serverValidation = await serverSideValidationService.validateInput(input, 'general', context);
      } catch (error) {
        productionLogger.error('Server-side validation failed', error, 'SecurityService');
      }
    }
    
    const isValid = clientValidation.isValid && 
                   !threatResult.shouldBlock && 
                   (serverValidation?.isValid !== false);

    return {
      valid: isValid,
      errors: clientValidation.errors,
      riskLevel: serverValidation?.riskLevel || clientValidation.riskLevel,
      threatTypes: [
        ...(threatResult.threatTypes || []),
        ...(serverValidation?.threatTypes || [])
      ],
      sanitizedInput: serverValidation?.sanitizedInput || clientValidation.sanitizedValue
    };
  }

  async validateFormData(formData: Record<string, any>, context: string): Promise<{
    isValid: boolean;
    errors: Record<string, string[]>;
    sanitizedData: Record<string, any>;
  }> {
    try {
      const { serverSideValidationService } = await import('../serverSideValidationService');
      return await serverSideValidationService.validateFormData(formData, context);
    } catch (error) {
      productionLogger.error('Form validation failed', error, 'SecurityService');
      
      // Fallback to client-side validation
      const errors: Record<string, string[]> = {};
      const sanitizedData: Record<string, any> = {};
      let isValid = true;

      for (const [key, value] of Object.entries(formData)) {
        if (typeof value === 'string') {
          const validation = consolidatedInputValidation.validateAndSanitize(value, context);
          if (!validation.isValid) {
            errors[key] = validation.errors || ['Invalid input'];
            isValid = false;
          }
          sanitizedData[key] = validation.sanitizedValue || value;
        } else {
          sanitizedData[key] = value;
        }
      }

      return { isValid, errors, sanitizedData };
    }
  }

  sanitizeInput(input: string, context: string = 'general'): string {
    const result = consolidatedInputValidation.validateAndSanitize(input, context);
    return result.sanitizedValue || input;
  }
}
