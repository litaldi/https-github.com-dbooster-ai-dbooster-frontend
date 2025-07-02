
import { useState, useCallback } from 'react';
import { useConsolidatedSecurity } from '@/hooks/useConsolidatedSecurity';
import { useAuth } from '@/contexts/auth-context';
import { useNavigate } from 'react-router-dom';
import type { AuthMode } from '@/types/auth';

interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  rememberMe?: boolean;
}

interface UseConsolidatedAuthReturn {
  authMode: AuthMode;
  isLoading: boolean;
  error: string | null;
  setAuthMode: (mode: AuthMode) => void;
  handleAuth: (data: AuthFormData) => Promise<void>;
  clearError: () => void;
}

export function useConsolidatedAuth(): UseConsolidatedAuthReturn {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const { secureLogin, secureSignup, isLoading } = useConsolidatedSecurity();
  const { user } = useAuth();

  // Auto-redirect if already authenticated
  if (user) {
    navigate('/app', { replace: true });
  }

  const handleAuth = useCallback(async (data: AuthFormData) => {
    setError(null);

    try {
      if (authMode === 'login') {
        const success = await secureLogin(data.email, data.password, {
          rememberMe: data.rememberMe
        });
        
        if (success) {
          navigate('/app', { replace: true });
        }
      } else if (authMode === 'signup') {
        if (!data.firstName || !data.lastName) {
          throw new Error('First name and last name are required');
        }
        
        const fullName = `${data.firstName} ${data.lastName}`;
        const success = await secureSignup(data.email, data.password, fullName);
        
        if (success) {
          navigate('/app', { replace: true });
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      setError(errorMessage);
    }
  }, [authMode, secureLogin, secureSignup, navigate]);

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
