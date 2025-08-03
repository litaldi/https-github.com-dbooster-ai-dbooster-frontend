
import { useState, useEffect } from 'react';
import { enhancedPasswordValidator } from '@/services/security/enhancedPasswordValidation';
import type { PasswordValidationResult, PasswordValidationOptions } from '@/services/security/enhancedPasswordValidation';

export function useEnhancedPasswordValidation(
  password: string,
  options: PasswordValidationOptions = {}
) {
  const [validationResult, setValidationResult] = useState<PasswordValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    if (!password) {
      setValidationResult(null);
      return;
    }

    const validatePassword = async () => {
      setIsValidating(true);
      try {
        const result = await enhancedPasswordValidator.validatePassword(password, options);
        setValidationResult(result);
      } catch (error) {
        // Use production logger instead of console
        setValidationResult({
          isValid: false,
          score: 0,
          feedback: ['Password validation failed. Please try again.']
        });
      } finally {
        setIsValidating(false);
      }
    };

    // Debounce validation to avoid excessive API calls
    const timeoutId = setTimeout(validatePassword, 300);
    return () => clearTimeout(timeoutId);
  }, [password, options.email, options.name]);

  return {
    validationResult,
    isValidating,
    isValid: validationResult?.isValid || false,
    score: validationResult?.score || 0
  };
}
