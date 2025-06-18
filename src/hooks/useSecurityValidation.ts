
import { useState, useCallback } from 'react';
import { securityEnhancementService } from '@/services/securityEnhancementService';
import { useToast } from '@/hooks/use-toast';

interface UseSecurityValidationReturn {
  validateInput: (input: any, context: string) => Promise<boolean>;
  validateAuth: (email: string) => Promise<boolean>;
  validateSession: () => Promise<boolean>;
  isValidating: boolean;
}

export function useSecurityValidation(): UseSecurityValidationReturn {
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();

  const validateInput = useCallback(async (input: any, context: string): Promise<boolean> => {
    setIsValidating(true);
    try {
      const result = await securityEnhancementService.validateUserInput(input, context);
      
      if (!result.isValid) {
        toast({
          title: "Security Warning",
          description: "Invalid input detected. Please check your data and try again.",
          variant: "destructive",
        });
        return false;
      }
      
      return true;
    } catch (error) {
      toast({
        title: "Validation Error",
        description: "Unable to validate input. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsValidating(false);
    }
  }, [toast]);

  const validateAuth = useCallback(async (email: string): Promise<boolean> => {
    setIsValidating(true);
    try {
      const result = await securityEnhancementService.validateAuthenticationSecurity(email);
      
      if (!result.allowed) {
        toast({
          title: "Authentication Blocked",
          description: result.reason || "Authentication attempt blocked for security reasons.",
          variant: "destructive",
        });
        return false;
      }
      
      return true;
    } catch (error) {
      return true; // Allow on error to avoid blocking legitimate users
    } finally {
      setIsValidating(false);
    }
  }, [toast]);

  const validateSession = useCallback(async (): Promise<boolean> => {
    try {
      const isValid = await securityEnhancementService.validateSessionSecurity();
      
      if (!isValid) {
        toast({
          title: "Session Expired",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
        });
      }
      
      return isValid;
    } catch (error) {
      return false;
    }
  }, [toast]);

  return {
    validateInput,
    validateAuth,
    validateSession,
    isValidating
  };
}
