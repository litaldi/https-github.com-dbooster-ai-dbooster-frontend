
import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { RateLimiter } from '@/utils/rateLimiting';
import type { AuthMode } from '@/types/auth';

interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  rememberMe?: boolean;
}

interface UseEnhancedAuthReturn {
  authMode: AuthMode;
  isLoading: boolean;
  error: string | null;
  setAuthMode: (mode: AuthMode) => void;
  handleAuth: (data: AuthFormData) => Promise<void>;
  clearError: () => void;
}

const authRateLimiter = new RateLimiter(5, 15 * 60 * 1000); // 5 attempts per 15 minutes

export function useEnhancedAuth(): UseEnhancedAuthReturn {
  const { signIn, signUp } = useAuth();
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = useCallback(async (data: AuthFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Rate limiting
      authRateLimiter.checkRateLimit(data.email);

      if (authMode === 'login') {
        await signIn(data.email, data.password);
      } else if (authMode === 'signup') {
        if (!data.firstName || !data.lastName) {
          throw new Error('First name and last name are required');
        }
        await signUp(data.email, data.password, {
          firstName: data.firstName,
          lastName: data.lastName
        });
      }

      // Reset rate limiter on successful auth
      authRateLimiter.resetAttempts(data.email);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      setError(errorMessage);
      console.error('Authentication error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [authMode, signIn, signUp]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    authMode,
    isLoading,
    error,
    setAuthMode,
    handleAuth,
    clearError
  };
}
