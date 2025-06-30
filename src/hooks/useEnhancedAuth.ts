
import { useState, useCallback } from 'react';
import { enhancedAuthService } from '@/services/enhancedAuthService';
import { rateLimitService } from '@/services/security/rateLimitService';
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

export function useEnhancedAuth(): UseEnhancedAuthReturn {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = useCallback(async (data: AuthFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      // Rate limiting using consolidated service
      const rateLimitResult = await rateLimitService.checkRateLimit(data.email, authMode);
      if (!rateLimitResult.allowed) {
        throw new Error(`Too many attempts. Try again in ${rateLimitResult.retryAfter} seconds.`);
      }

      if (authMode === 'login') {
        const result = await enhancedAuthService.signIn(data.email, data.password);
        if (result.error) {
          throw new Error(result.error.message);
        }
      } else if (authMode === 'signup') {
        if (!data.firstName || !data.lastName) {
          throw new Error('First name and last name are required');
        }
        const result = await enhancedAuthService.signUp(data.email, data.password, {
          firstName: data.firstName,
          lastName: data.lastName
        });
        if (result.error) {
          throw new Error(result.error.message);
        }
      } else if (authMode === 'reset') {
        const result = await enhancedAuthService.resetPassword(data.email);
        if (result.error) {
          throw new Error(result.error.message);
        }
        setError(null);
        console.log('Password reset email sent successfully');
        return;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      setError(errorMessage);
      console.error('Authentication error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [authMode]);

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
