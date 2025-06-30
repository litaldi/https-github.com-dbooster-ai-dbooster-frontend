
import { useState, useCallback } from 'react';
import { comprehensiveInputValidation } from '@/services/security/comprehensiveInputValidation';
import { enhancedToast } from '@/components/ui/enhanced-toast';

export function useSecureInputValidation() {
  const [isValidating, setIsValidating] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({});

  const validateInput = useCallback(async (
    value: any, 
    type: 'email' | 'url' | 'filename' | 'sql' | 'general' = 'general',
    fieldName: string
  ): Promise<{ isValid: boolean; sanitizedValue: any; riskLevel: 'low' | 'medium' | 'high' }> => {
    setIsValidating(true);
    
    try {
      const result = comprehensiveInputValidation.validateInput(value, type);
      
      // Update field-specific errors
      setValidationErrors(prev => ({
        ...prev,
        [fieldName]: result.errors
      }));

      // Determine risk level based on errors
      let riskLevel: 'low' | 'medium' | 'high' = 'low';
      if (result.errors.length > 0) {
        const hasHighRiskPatterns = result.errors.some(error => 
          error.includes('SQL injection') || 
          error.includes('script') || 
          error.includes('dangerous pattern')
        );
        riskLevel = hasHighRiskPatterns ? 'high' : 'medium';
      }

      // Show security warnings for high-risk inputs
      if (riskLevel === 'high') {
        enhancedToast.error({
          title: "Security Alert",
          description: "Potentially dangerous input detected and blocked.",
        });
      } else if (riskLevel === 'medium') {
        enhancedToast.warning({
          title: "Security Warning",
          description: "Input appears suspicious. Please review your data.",
        });
      }

      return {
        isValid: result.isValid,
        sanitizedValue: result.sanitized,
        riskLevel
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
    rules: Record<string, { type?: 'email' | 'url' | 'filename' | 'sql' | 'general' }> = {}
  ): Promise<{
    isValid: boolean;
    sanitizedData: Record<string, any>;
    overallRiskLevel: 'low' | 'medium' | 'high';
  }> => {
    setIsValidating(true);
    
    try {
      const sanitizedData: Record<string, any> = {};
      const allErrors: Record<string, string[]> = {};
      let overallRiskLevel: 'low' | 'medium' | 'high' = 'low';

      // Validate each field
      for (const [fieldName, value] of Object.entries(data)) {
        const fieldType = rules[fieldName]?.type || 'general';
        const result = comprehensiveInputValidation.validateInput(value, fieldType);
        
        sanitizedData[fieldName] = result.sanitized;
        allErrors[fieldName] = result.errors;

        // Determine risk level
        if (result.errors.length > 0) {
          const hasHighRiskPatterns = result.errors.some(error => 
            error.includes('SQL injection') || 
            error.includes('script') || 
            error.includes('dangerous pattern')
          );
          if (hasHighRiskPatterns && overallRiskLevel !== 'high') {
            overallRiskLevel = 'high';
          } else if (overallRiskLevel === 'low') {
            overallRiskLevel = 'medium';
          }
        }
      }

      setValidationErrors(allErrors);

      const isValid = Object.values(allErrors).every(errors => errors.length === 0);

      // Show appropriate security messages
      if (overallRiskLevel === 'high') {
        enhancedToast.error({
          title: "Security Alert",
          description: "Form contains potentially dangerous content and has been blocked.",
        });
      } else if (overallRiskLevel === 'medium') {
        enhancedToast.warning({
          title: "Security Warning",
          description: "Form contains suspicious content. Please review your data.",
        });
      }

      return {
        isValid,
        sanitizedData,
        overallRiskLevel
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
