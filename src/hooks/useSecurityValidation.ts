
import { useState, useCallback } from 'react';
import { securityEnhancementService } from '@/services/security/securityEnhancementService';
import { enhancedToast } from '@/components/ui/enhanced-toast';

interface UseSecurityValidationReturn {
  validateInput: (input: any, context: string) => Promise<boolean>;
  validateAuth: (email: string) => Promise<boolean>;
  validateSession: () => Promise<boolean>;
  isValidating: boolean;
}

export function useSecurityValidation(): UseSecurityValidationReturn {
  const [isValidating, setIsValidating] = useState(false);

  const validateInput = useCallback(async (input: any, context: string): Promise<boolean> => {
    setIsValidating(true);
    try {
      const result = await securityEnhancementService.validateUserInput(input, context);
      
      if (!result.isValid) {
        enhancedToast.warning({
          title: "Security Warning",
          description: "Invalid input detected. Please check your data and try again.",
        });
        return false;
      }
      
      return true;
    } catch (error) {
      enhancedToast.error({
        title: "Validation Error",
        description: "Unable to validate input. Please try again.",
      });
      return false;
    } finally {
      setIsValidating(false);
    }
  }, []);

  const validateAuth = useCallback(async (email: string): Promise<boolean> => {
    setIsValidating(true);
    try {
      const result = await securityEnhancementService.validateAuthenticationSecurity(email);
      
      if (!result.allowed) {
        enhancedToast.error({
          title: "Authentication Blocked",
          description: result.reason || "Authentication attempt blocked for security reasons.",
        });
        return false;
      }
      
      return true;
    } catch (error) {
      return true; // Allow on error to avoid blocking legitimate users
    } finally {
      setIsValidating(false);
    }
  }, []);

  const validateSession = useCallback(async (): Promise<boolean> => {
    try {
      const isValid = await securityEnhancementService.validateSessionSecurity();
      
      if (!isValid) {
        enhancedToast.warning({
          title: "Session Expired",
          description: "Your session has expired. Please log in again.",
        });
      }
      
      return isValid;
    } catch (error) {
      return false;
    }
  }, []);

  return {
    validateInput,
    validateAuth,
    validateSession,
    isValidating
  };
}
