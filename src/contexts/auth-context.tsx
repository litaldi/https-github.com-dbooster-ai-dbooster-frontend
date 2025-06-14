
import { createContext, useContext, ReactNode } from 'react';
import { AuthContextType } from './auth-types';
import { AuthService } from '@/services/authService';
import { useAuthState } from '@/hooks/useAuthState';
import { handleApiError } from '@/utils/errorHandling';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const {
    user,
    session,
    isLoading,
    githubAccessToken,
    isDemo,
    setIsLoading,
    updateAuthState,
    clearAuthState
  } = useAuthState();

  // Initialize auth service
  const authService = new AuthService();

  const login = async (provider: 'github' | 'google') => {
    try {
      setIsLoading(true);
      await authService.loginWithOAuth(provider);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await authService.loginWithEmail(email, password);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithPhone = async (phone: string, password: string) => {
    try {
      setIsLoading(true);
      await authService.loginWithPhone(phone, password);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signupWithEmail = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      await authService.signupWithEmail(email, password, name);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signupWithPhone = async (phone: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      await authService.signupWithPhone(phone, password, name);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Generic signIn method for the auth form
  const signIn = async (identifier: string, password: string) => {
    try {
      setIsLoading(true);
      // Determine if identifier is email or phone
      const isEmail = identifier.includes('@');
      if (isEmail) {
        await authService.loginWithEmail(identifier, password);
      } else {
        await authService.loginWithPhone(identifier, password);
      }
      return {};
    } catch (error: any) {
      return { error: { message: error.message } };
    } finally {
      setIsLoading(false);
    }
  };

  // Generic signUp method for the auth form
  const signUp = async (userData: any) => {
    try {
      setIsLoading(true);
      if (userData.email) {
        await authService.signupWithEmail(userData.email, userData.password, userData.options?.data?.name || '');
      } else if (userData.phone) {
        await authService.signupWithPhone(userData.phone, userData.password, userData.options?.data?.name || '');
      }
      return {};
    } catch (error: any) {
      return { error: { message: error.message } };
    } finally {
      setIsLoading(false);
    }
  };

  const loginDemo = async () => {
    try {
      setIsLoading(true);
      const { user, session } = await authService.loginDemo();
      updateAuthState(user, session, true);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout(isDemo);
      clearAuthState();
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      login,
      loginWithEmail,
      loginWithPhone,
      signupWithEmail,
      signupWithPhone,
      signIn,
      signUp,
      loginDemo,
      logout, 
      isLoading, 
      githubAccessToken,
      isDemo
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
