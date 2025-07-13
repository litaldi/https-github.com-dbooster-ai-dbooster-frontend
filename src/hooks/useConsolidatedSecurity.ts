
import { useState } from 'react';
import { consolidatedAuthenticationSecurity } from '@/services/security/consolidatedAuthenticationSecurity';

export function useConsolidatedSecurity() {
  const [isLoading, setIsLoading] = useState(false);

  const validateSession = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const isValid = await consolidatedAuthenticationSecurity.validateSessionSecurity();
      return isValid;
    } catch (error) {
      console.error('Session validation error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const checkPasswordStrength = async (password: string, email?: string) => {
    return consolidatedAuthenticationSecurity.validateStrongPassword(password, email);
  };

  const generateDeviceFingerprint = () => {
    return consolidatedAuthenticationSecurity.generateDeviceFingerprint();
  };

  return {
    validateSession,
    checkPasswordStrength,
    generateDeviceFingerprint,
    isLoading
  };
}
