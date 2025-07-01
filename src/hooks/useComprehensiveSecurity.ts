
import { useState, useCallback } from 'react';
import { enhancedInputValidation } from '@/services/security/enhancedInputValidation';
import { BaseValidationRules } from '@/services/validation/baseValidationRules';
import { enhancedToast } from '@/components/ui/enhanced-toast';

export function useComprehensiveSecurity() {
  const [isLoading, setIsLoading] = useState(false);

  const validateField = useCallback(async (fieldName: string, value: any, fieldType: 'email' | 'password' | 'name' | 'url' | 'phone' | 'general' = 'general') => {
    setIsLoading(true);
    
    try {
      const rule = BaseValidationRules.COMMON_RULES[fieldType] || BaseValidationRules.COMMON_RULES.generalText;
      const result = await enhancedInputValidation.validateField(fieldName, value, rule);
      
      if (result.riskLevel === 'critical' || result.riskLevel === 'high') {
        enhancedToast.error({
          title: "Security Alert",
          description: "Potentially dangerous input detected and blocked.",
        });
      }
      
      return result;
    } catch (error) {
      enhancedToast.error({
        title: "Validation Error",
        description: "Unable to validate input. Please try again.",
      });
      
      return {
        isValid: false,
        errors: ['Validation failed'],
        warnings: [],
        sanitizedValue: String(value || ''),
        riskLevel: 'medium' as const
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const validateForm = useCallback(async (formData: Record<string, any>, rules: Record<string, any> = {}) => {
    setIsLoading(true);
    
    try {
      const config = Object.entries(rules).reduce((acc, [field, type]) => {
        acc[field] = BaseValidationRules.COMMON_RULES[type as string] || BaseValidationRules.COMMON_RULES.generalText;
        return acc;
      }, {} as Record<string, any>);

      const result = await enhancedInputValidation.validateForm(formData, config);
      
      if (result.overallRiskLevel === 'critical' || result.overallRiskLevel === 'high') {
        enhancedToast.error({
          title: "Security Alert",
          description: "Form contains potentially dangerous content and has been blocked.",
        });
      }
      
      return result;
    } catch (error) {
      enhancedToast.error({
        title: "Form Validation Error",
        description: "Unable to validate form. Please try again.",
      });
      
      return {
        isValid: false,
        fieldResults: {},
        overallRiskLevel: 'medium' as const,
        sanitizedData: formData
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const validateFileUpload = useCallback(async (file: File, allowedTypes: string[] = [], maxSize: number = 5 * 1024 * 1024) => {
    setIsLoading(true);
    
    try {
      const result = await enhancedInputValidation.validateFileUpload(file, allowedTypes, maxSize);
      
      if (result.riskLevel === 'critical' || result.riskLevel === 'high') {
        enhancedToast.error({
          title: "Security Alert",
          description: "File contains potentially dangerous content and has been blocked.",
        });
      }
      
      return result;
    } catch (error) {
      enhancedToast.error({
        title: "File Validation Error",
        description: "Unable to validate file. Please try again.",
      });
      
      return {
        isValid: false,
        errors: ['File validation failed'],
        warnings: [],
        sanitizedValue: file.name,
        riskLevel: 'medium' as const
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    validateField,
    validateForm,
    validateFileUpload,
    isLoading
  };
}
