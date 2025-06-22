
import { useState, useCallback } from 'react';
import { comprehensiveInputValidation } from '@/services/security/comprehensiveInputValidation';
import { enhancedToast } from '@/components/ui/enhanced-toast';

interface ValidationRule {
  required?: boolean;
  type?: 'email' | 'phone' | 'password' | 'url' | 'text' | 'number';
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  customValidator?: (value: any) => boolean;
}

export function useSecureInputValidation() {
  const [isValidating, setIsValidating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

  const validateInput = useCallback(async (
    value: any, 
    rules: ValidationRule, 
    fieldName: string,
    context: string = 'form'
  ): Promise<{ isValid: boolean; sanitizedValue: any; riskLevel: 'low' | 'medium' | 'high' }> => {
    setIsValidating(true);
    
    try {
      const result = await comprehensiveInputValidation.validateInput(value, rules, `${context}.${fieldName}`);
      
      // Update field-specific errors
      setValidationErrors(prev => ({
        ...prev,
        [fieldName]: result.errors
      }));

      // Show security warnings for high-risk inputs
      if (result.riskLevel === 'high') {
        enhancedToast.error({
          title: "Security Alert",
          description: "Potentially dangerous input detected and blocked.",
        });
      } else if (result.riskLevel === 'medium') {
        enhancedToast.warning({
          title: "Security Warning",
          description: "Input appears suspicious. Please review your data.",
        });
      }

      return {
        isValid: result.isValid,
        sanitizedValue: result.sanitizedValue,
        riskLevel: result.riskLevel
      };
    } catch (error) {
      enhancedToast.error({
        title: "Validation Error",
        description: "Unable to validate input. Please try again.",
      });
      
      return {
        isValid: false,
        sanitizedValue: value,
        riskLevel: 'medium' as const
      };
    } finally {
      setIsValidating(false);
    }
  }, []);

  const validateForm = useCallback(async (
    data: Record<string, any>,
    rules: Record<string, ValidationRule>,
    context: string = 'form'
  ): Promise<{
    isValid: boolean;
    sanitizedData: Record<string, any>;
    overallRiskLevel: 'low' | 'medium' | 'high';
  }> => {
    setIsValidating(true);
    
    try {
      const result = await comprehensiveInputValidation.validateForm(data, rules, context);
      
      setValidationErrors(result.errors);

      // Show appropriate security messages
      if (result.overallRiskLevel === 'high') {
        enhancedToast.error({
          title: "Security Alert",
          description: "Form contains potentially dangerous content and has been blocked.",
        });
      } else if (result.overallRiskLevel === 'medium') {
        enhancedToast.warning({
          title: "Security Warning",
          description: "Form contains suspicious content. Please review your data.",
        });
      }

      return {
        isValid: result.isValid,
        sanitizedData: result.sanitizedData,
        overallRiskLevel: result.overallRiskLevel
      };
    } catch (error) {
      enhancedToast.error({
        title: "Form Validation Error",
        description: "Unable to validate form. Please try again.",
      });
      
      return {
        isValid: false,
        sanitizedData: data,
        overallRiskLevel: 'medium' as const
      };
    } finally {
      setIsValidating(false);
    }
  }, []);

  const clearValidationErrors = useCallback((fieldName?: string) => {
    if (fieldName) {
      setValidationErrors(prev => ({
        ...prev,
        [fieldName]: []
      }));
    } else {
      setValidationErrors({});
    }
  }, []);

  const getFieldErrors = useCallback((fieldName: string): string[] => {
    return validationErrors[fieldName] || [];
  }, [validationErrors]);

  const hasFieldErrors = useCallback((fieldName: string): boolean => {
    return (validationErrors[fieldName]?.length || 0) > 0;
  }, [validationErrors]);

  return {
    validateInput,
    validateForm,
    clearValidationErrors,
    getFieldErrors,
    hasFieldErrors,
    isValidating,
    validationErrors
  };
}
