
import { createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { loginDemoUser, logoutDemoUser } from '@/services/demo';
import { RateLimiter } from '@/utils/rateLimiting';
import { AuthMethods } from '@/services/authMethods';
import { useAuthState } from '@/hooks/useAuthState';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (provider: 'github' | 'google') => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  loginWithPhone: (phone: string, password: string) => Promise<void>;
  signupWithEmail: (email: string, password: string, name: string) => Promise<void>;
  signupWithPhone: (phone: string, password: string, name: string) => Promise<void>;
  loginDemo: () => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  githubAccessToken: string | null;
  isDemo: boolean;
}

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

  // Initialize rate limiter and auth methods
  const rateLimiter = new RateLimiter();
  const authMethods = new AuthMethods(rateLimiter);

  const login = async (provider: 'github' | 'google') => {
    try {
      setIsLoading(true);
      await authMethods.loginWithOAuth(provider);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await authMethods.loginWithEmail(email, password);
      // Reset rate limiting on successful login
      rateLimiter.resetAttempts();
    } catch (error) {
      console.error('Email login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithPhone = async (phone: string, password: string) => {
    try {
      setIsLoading(true);
      await authMethods.loginWithPhone(phone, password);
      // Reset rate limiting on successful login
      rateLimiter.resetAttempts();
    } catch (error) {
      console.error('Phone login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signupWithEmail = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      await authMethods.signupWithEmail(email, password, name);
    } catch (error) {
      console.error('Email signup failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signupWithPhone = async (phone: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      await authMethods.signupWithPhone(phone, password, name);
    } catch (error) {
      console.error('Phone signup failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginDemo = async () => {
    try {
      setIsLoading(true);
      const { user, session } = await loginDemoUser();
      updateAuthState(user, session, true);
      console.log('Demo user logged in successfully');
    } catch (error) {
      console.error('Demo login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      
      if (isDemo) {
        logoutDemoUser();
        clearAuthState();
        console.log('Demo user logged out');
        return;
      }

      await authMethods.logout();
      clearAuthState();
    } catch (error) {
      console.error('Logout failed:', error);
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
