
import { useCallback, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { cleanLogger } from '@/utils/cleanLogger';

interface PasswordStrengthResult {
  score: number;
  feedback: string[];
  isValid: boolean;
}

export function useConsolidatedSecurity() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const validateSession = useCallback(async () => {
    try {
      setIsLoading(true);
      
      if (!user) {
        cleanLogger.warn('Session validation failed - no user', {}, 'ConsolidatedSecurity');
        return false;
      }

      // For demo users, always validate as expired to show the warning
      if (user.id === 'demo-user-id') {
        cleanLogger.warn('Session expired', { userId: user.id }, 'ConsolidatedSecurity');
        return false;
      }

      cleanLogger.info('Session validated successfully', { userId: user.id }, 'ConsolidatedSecurity');
      return true;
    } catch (error) {
      cleanLogger.error('Session validation error', error, 'ConsolidatedSecurity');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const checkPasswordStrength = useCallback(async (password: string): Promise<PasswordStrengthResult> => {
    try {
      setIsLoading(true);
      
      // Basic password strength checking
      let score = 0;
      const feedback: string[] = [];
      
      if (password.length < 8) {
        feedback.push('Password should be at least 8 characters long');
      } else {
        score += 25;
      }
      
      if (!/[A-Z]/.test(password)) {
        feedback.push('Add uppercase letters');
      } else {
        score += 25;
      }
      
      if (!/[a-z]/.test(password)) {
        feedback.push('Add lowercase letters');
      } else {
        score += 25;
      }
      
      if (!/\d/.test(password)) {
        feedback.push('Add numbers');
      } else {
        score += 25;
      }
      
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        feedback.push('Add special characters');
      } else {
        score += 10;
      }
      
      const isValid = score >= 75 && feedback.length === 0;
      
      return {
        score: Math.min(score, 100),
        feedback,
        isValid
      };
    } catch (error) {
      cleanLogger.error('Password strength check error', error, 'ConsolidatedSecurity');
      return {
        score: 0,
        feedback: ['Unable to check password strength'],
        isValid: false
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    validateSession,
    checkPasswordStrength,
    isLoading
  };
}
