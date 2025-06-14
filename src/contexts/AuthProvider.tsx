
import React, { createContext, useContext, ReactNode } from 'react';
import { AuthContextType } from './auth-types';
import { AuthService } from '@/services/authService';
import { useAuthState } from '@/hooks/useAuthState';
import { formatApiError } from '@/utils/formatApiError';

// Create context as before
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

  const authService = new AuthService();

  // OAuth login (GitHub/Google)
  const login = async (provider: 'github' | 'google') => {
    try {
      setIsLoading(true);
      await authService.loginWithOAuth(provider);
    } catch (error: any) {
      console.error('OAuth login failed:', error);
      throw new Error(formatApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    if (!email?.trim() || !password?.trim()) {
      throw new Error('Email and password are required');
    }
    try {
      setIsLoading(true);
      await authService.loginWithCredentials({ email: email.trim(), password });
    } catch (error: any) {
      console.error('Email login failed:', error);
      throw new Error(formatApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithPhone = async (phone: string, password: string) => {
    if (!phone?.trim() || !password?.trim()) {
      throw new Error('Phone and password are required');
    }
    try {
      setIsLoading(true);
      await authService.loginWithCredentials({ phone: phone.trim(), password });
    } catch (error: any) {
      console.error('Phone login failed:', error);
      throw new Error(formatApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const signupWithEmail = async (email: string, password: string, name: string) => {
    if (!email?.trim() || !password?.trim() || !name?.trim()) {
      throw new Error('Email, password, and name are required');
    }
    try {
      setIsLoading(true);
      await authService.signupWithCredentials({ email: email.trim(), password, name: name.trim() });
    } catch (error: any) {
      console.error('Email signup failed:', error);
      throw new Error(formatApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const signupWithPhone = async (phone: string, password: string, name: string) => {
    if (!phone?.trim() || !password?.trim() || !name?.trim()) {
      throw new Error('Phone, password, and name are required');
    }
    try {
      setIsLoading(true);
      await authService.signupWithCredentials({ phone: phone.trim(), password, name: name.trim() });
    } catch (error: any) {
      console.error('Phone signup failed:', error);
      throw new Error(formatApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  // Generic sign in/out for forms
  const signIn = async (identifier: string, password: string) => {
    if (!identifier?.trim() || !password?.trim()) {
      return { error: { message: 'Email/phone and password are required' } };
    }
    try {
      setIsLoading(true);
      const isEmail = identifier.includes('@');
      await authService.loginWithCredentials({ [isEmail ? 'email' : 'phone']: identifier.trim(), password });
      return {};
    } catch (error: any) {
      console.error('Sign in failed:', error);
      return { error: { message: formatApiError(error) } };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (userData: any) => {
    if (!userData) return { error: { message: 'User data is required' } };
    try {
      setIsLoading(true);
      const name = userData.options?.data?.name || userData.options?.data?.full_name || '';
      if (userData.email) {
        if (!userData.email.trim() || !userData.password?.trim())
          return { error: { message: 'Email and password are required' } };
        await authService.signupWithCredentials({ email: userData.email.trim(), password: userData.password, name: name.trim() });
      } else if (userData.phone) {
        if (!userData.phone.trim() || !userData.password?.trim())
          return { error: { message: 'Phone and password are required' } };
        await authService.signupWithCredentials({ phone: userData.phone.trim(), password: userData.password, name: name.trim() });
      } else {
        return { error: { message: 'Email or phone is required' } };
      }
      return {};
    } catch (error: any) {
      console.error('Sign up failed:', error);
      return { error: { message: formatApiError(error) } };
    } finally {
      setIsLoading(false);
    }
  };

  const loginDemo = async () => {
    try {
      setIsLoading(true);
      const { user, session } = await authService.loginDemo();
      updateAuthState(user, session, true);
    } catch (error: any) {
      console.error('Demo login failed:', error);
      throw new Error(formatApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await authService.logout(isDemo);
      clearAuthState();
    } catch (error: any) {
      console.error('Logout failed:', error);
      throw new Error(formatApiError(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, session, login, loginWithEmail, loginWithPhone,
      signupWithEmail, signupWithPhone, signIn, signUp, loginDemo, logout,
      isLoading, githubAccessToken, isDemo
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Export the hook from useAuth.ts!
