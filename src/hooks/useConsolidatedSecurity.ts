
import { useState, useCallback } from 'react';
import { consolidatedAuthenticationSecurity } from '@/services/security/consolidatedAuthenticationSecurity';
import { consolidatedInputValidation } from '@/services/security/consolidatedInputValidation';
import { enhancedToast } from '@/components/ui/enhanced-toast';

interface UseConsolidatedSecurityReturn {
  // Authentication
  secureLogin: (email: string, password: string, options?: { rememberMe?: boolean }) => Promise<boolean>;
  secureSignup: (email: string, password: string, name?: string) => Promise<boolean>;
  validatePassword: (password: string, email?: string) => Promise<{ isValid: boolean; feedback: string[] }>;
  
  // Input validation
  validateInput: (input: string, context?: string) => { isValid: boolean; sanitizedValue: string };
  validateForm: (formData: Record<string, any>, fieldContexts?: Record<string, string>) => {
    isValid: boolean;
    errors: Record<string, string[]>;
    sanitizedData: Record<string, any>;
  };
  
  // Session security
  validateSession: () => Promise<boolean>;
  
  // State
  isLoading: boolean;
}

export function useConsolidatedSecurity(): UseConsolidatedSecurityReturn {
  const [isLoading, setIsLoading] = useState(false);

  const secureLogin = useCallback(async (
    email: string, 
    password: string, 
    options: { rememberMe?: boolean } = {}
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const deviceFingerprint = consolidatedAuthenticationSecurity.generateDeviceFingerprint();
      const result = await consolidatedAuthenticationSecurity.secureLogin(email, password, {
        ...options,
        deviceFingerprint
      });

      if (!result.success) {
        enhancedToast.error({
          title: 'Login Failed',
          description: result.error || 'An unexpected error occurred'
        });
        return false;
      }

      if (result.requiresVerification) {
        enhancedToast.info({
          title: 'Email Verification Required',
          description: 'Please check your email to verify your account'
        });
      } else {
        enhancedToast.success({
          title: 'Welcome back!',
          description: 'You have been signed in successfully'
        });
      }

      return true;
    } catch (error) {
      enhancedToast.error({
        title: 'Login Error',
        description: 'An unexpected error occurred during login'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const secureSignup = useCallback(async (
    email: string, 
    password: string, 
    name?: string
  ): Promise<boolean> => {
    setIsLoading(true);
    try {
      const result = await consolidatedAuthenticationSecurity.secureSignup(email, password, {
        fullName: name,
        acceptedTerms: true
      });

      if (!result.success) {
        enhancedToast.error({
          title: 'Signup Failed',
          description: result.error || 'An unexpected error occurred'
        });
        return false;
      }

      if (result.requiresVerification) {
        enhancedToast.success({
          title: 'Account Created',
          description: 'Please check your email to verify your account'
        });
      } else {
        enhancedToast.success({
          title: 'Welcome!',
          description: 'Your account has been created successfully'
        });
      }

      return true;
    } catch (error) {
      enhancedToast.error({
        title: 'Signup Error',
        description: 'An unexpected error occurred during signup'
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const validatePassword = useCallback(async (password: string, email?: string) => {
    const result = await consolidatedAuthenticationSecurity.validateStrongPassword(password, email);
    return {
      isValid: result.isValid,
      feedback: result.feedback
    };
  }, []);

  const validateInput = useCallback((input: string, context: string = 'general') => {
    const result = consolidatedInputValidation.validateAndSanitize(input, context);
    
    if (!result.isValid && result.riskLevel === 'high') {
      enhancedToast.warning({
        title: 'Security Warning',
        description: 'Potentially harmful content detected and removed'
      });
    }

    return {
      isValid: result.isValid,
      sanitizedValue: result.sanitizedValue || input
    };
  }, []);

  const validateForm = useCallback((
    formData: Record<string, any>, 
    fieldContexts: Record<string, string> = {}
  ) => {
    return consolidatedInputValidation.validateForm(formData, fieldContexts);
  }, []);

  const validateSession = useCallback(async (): Promise<boolean> => {
    try {
      const isValid = await consolidatedAuthenticationSecurity.validateSessionSecurity();
      
      if (!isValid) {
        enhancedToast.warning({
          title: 'Session Expired',
          description: 'Please log in again to continue'
        });
      }
      
      return isValid;
    } catch (error) {
      return false;
    }
  }, []);

  return {
    secureLogin,
    secureSignup,
    validatePassword,
    validateInput,
    validateForm,
    validateSession,
    isLoading
  };
}
