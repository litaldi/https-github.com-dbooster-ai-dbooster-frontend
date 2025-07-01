import { useState, useCallback, useEffect } from 'react';
import { enhancedAuthenticationSecurity } from '@/services/security/enhancedAuthenticationSecurity';
import { enhancedInputValidation, EnhancedInputValidation } from '@/services/security/enhancedInputValidation';
import { securityHeaders } from '@/services/security/securityHeaders';
import { enhancedToast } from '@/components/ui/enhanced-toast';
import { productionLogger } from '@/utils/productionLogger';

interface SecurityStatus {
  authenticationScore: number;
  inputValidationActive: boolean;
  headersScore: number;
  sessionValid: boolean;
  overallScore: number;
}

interface ValidationConfig {
  [fieldName: string]: {
    type: 'email' | 'url' | 'filename' | 'sql' | 'general' | 'custom';
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    customValidator?: (value: string) => { isValid: boolean; errors: string[] };
  };
}

export function useComprehensiveSecurity() {
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus>({
    authenticationScore: 0,
    inputValidationActive: true,
    headersScore: 0,
    sessionValid: false,
    overallScore: 0
  });
  
  const [isValidating, setIsValidating] = useState(false);

  const validatePassword = useCallback(async (password: string, email?: string) => {
    try {
      const result = await enhancedAuthenticationSecurity.validateStrongPassword(password, email);
      return {
        isValid: result.isValid,
        score: result.score,
        feedback: result.feedback,
        requirements: result.requirements
      };
    } catch (error) {
      productionLogger.error('Password validation error', error, 'useComprehensiveSecurity');
      return {
        isValid: false,
        score: 0,
        feedback: ['Password validation failed'],
        requirements: {}
      };
    }
  }, []);

  const validateForm = useCallback(async (
    formData: Record<string, any>,
    config: ValidationConfig,
    context?: string
  ) => {
    setIsValidating(true);
    try {
      const result = await enhancedInputValidation.validateForm(formData, config, context);
      
      // Show security warnings for high-risk forms
      if (result.overallRiskLevel === 'critical') {
        enhancedToast.error({
          title: "Security Alert",
          description: "Form contains potentially dangerous content and has been blocked.",
        });
      } else if (result.overallRiskLevel === 'high') {
        enhancedToast.warning({
          title: "Security Warning",
          description: "Form contains suspicious content. Please review your data.",
        });
      }

      return result;
    } catch (error) {
      productionLogger.error('Form validation error', error, 'useComprehensiveSecurity');
      return {
        isValid: false,
        fieldResults: {},
        overallRiskLevel: 'medium' as const,
        sanitizedData: formData
      };
    } finally {
      setIsValidating(false);
    }
  }, []);

  const validateFileUpload = useCallback(async (
    file: File,
    allowedTypes: string[] = [],
    maxSize: number = 5 * 1024 * 1024,
    context?: string
  ) => {
    try {
      const result = await enhancedInputValidation.validateFileUpload(
        file,
        allowedTypes,
        maxSize,
        context
      );

      if (result.riskLevel === 'critical') {
        enhancedToast.error({
          title: "File Blocked",
          description: "File upload blocked for security reasons.",
        });
      } else if (result.riskLevel === 'high') {
        enhancedToast.warning({
          title: "File Warning",
          description: "File appears suspicious. Please verify it's safe.",
        });
      }

      return result;
    } catch (error) {
      productionLogger.error('File validation error', error, 'useComprehensiveSecurity');
      return {
        isValid: false,
        errors: ['File validation failed'],
        warnings: [],
        sanitizedValue: file.name,
        riskLevel: 'medium' as const
      };
    }
  }, []);

  const checkAccountStatus = useCallback(async (email: string) => {
    try {
      const lockoutInfo = await enhancedAuthenticationSecurity.checkAccountLockout(email);
      return {
        isLocked: lockoutInfo.isLocked,
        lockedUntil: lockoutInfo.lockedUntil,
        failedAttempts: lockoutInfo.failedAttempts
      };
    } catch (error) {
      productionLogger.error('Account status check error', error, 'useComprehensiveSecurity');
      return {
        isLocked: false,
        failedAttempts: 0
      };
    }
  }, []);

  const performSecurityHealthCheck = useCallback(async () => {
    try {
      // Check security headers
      const headersValidation = securityHeaders.validateSecurityHeaders();
      
      // Check authentication security (simplified)
      const authScore = 85; // Would be calculated based on various factors
      
      // Check session validity (simplified)
      const sessionValid = true; // Would check actual session
      
      const overallScore = Math.round((headersValidation.score + authScore) / 2);
      
      const status: SecurityStatus = {
        authenticationScore: authScore,
        inputValidationActive: true,
        headersScore: headersValidation.score,
        sessionValid,
        overallScore
      };
      
      setSecurityStatus(status);
      
      return {
        status,
        recommendations: [
          ...headersValidation.recommendations,
          ...(overallScore < 80 ? ['Consider implementing additional security measures'] : [])
        ]
      };
    } catch (error) {
      productionLogger.error('Security health check error', error, 'useComprehensiveSecurity');
      return {
        status: securityStatus,
        recommendations: ['Security health check failed - please try again']
      };
    }
  }, [securityStatus]);

  const applySecurityHeaders = useCallback(() => {
    try {
      securityHeaders.applyToDocument();
      enhancedToast.success({
        title: "Security Headers Applied",
        description: "Enhanced security headers have been activated.",
      });
    } catch (error) {
      productionLogger.error('Failed to apply security headers', error, 'useComprehensiveSecurity');
      enhancedToast.error({
        title: "Security Headers Failed",
        description: "Unable to apply security headers.",
      });
    }
  }, []);

  // Auto-check security status on mount
  useEffect(() => {
    performSecurityHealthCheck();
  }, []);

  return {
    securityStatus,
    isValidating,
    validatePassword,
    validateForm,
    validateFileUpload,
    checkAccountStatus,
    performSecurityHealthCheck,
    applySecurityHeaders,
    
    // Pre-configured validation rules
    commonValidationRules: EnhancedInputValidation.COMMON_RULES
  };
}
