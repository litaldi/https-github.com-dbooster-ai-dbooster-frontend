
import { createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { loginDemoUser, logoutDemoUser } from '@/services/demo';
import { RateLimiter } from '@/utils/rateLimiting';
import { AuthMethods } from '@/services/authMethods';
import { useAuthState } from '@/hooks/useAuthState';
import { enhancedToast } from '@/components/ui/enhanced-toast';
import { handleApiError } from '@/utils/errorHandling';

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
      enhancedToast.success({
        title: 'Signed in successfully',
        description: `Welcome back! You're now signed in with ${provider}.`
      });
    } catch (error) {
      console.error('Login failed:', error);
      enhancedToast.error({
        title: 'Sign in failed',
        description: handleApiError(error)
      });
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
      enhancedToast.success({
        title: 'Welcome back!',
        description: 'You have been signed in successfully.'
      });
    } catch (error) {
      console.error('Email login failed:', error);
      enhancedToast.error({
        title: 'Sign in failed',
        description: handleApiError(error)
      });
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
      enhancedToast.success({
        title: 'Welcome back!',
        description: 'You have been signed in successfully.'
      });
    } catch (error) {
      console.error('Phone login failed:', error);
      enhancedToast.error({
        title: 'Sign in failed',
        description: handleApiError(error)
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signupWithEmail = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      await authMethods.signupWithEmail(email, password, name);
      enhancedToast.success({
        title: 'Account created!',
        description: 'Welcome to DBooster! Your account has been created successfully.'
      });
    } catch (error) {
      console.error('Email signup failed:', error);
      enhancedToast.error({
        title: 'Account creation failed',
        description: handleApiError(error)
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signupWithPhone = async (phone: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      await authMethods.signupWithPhone(phone, password, name);
      enhancedToast.success({
        title: 'Account created!',
        description: 'Welcome to DBooster! Your account has been created successfully.'
      });
    } catch (error) {
      console.error('Phone signup failed:', error);
      enhancedToast.error({
        title: 'Account creation failed',
        description: handleApiError(error)
      });
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
      enhancedToast.success({
        title: 'Demo mode activated',
        description: 'You can now explore DBooster with sample data.'
      });
      console.log('Demo user logged in successfully');
    } catch (error) {
      console.error('Demo login failed:', error);
      enhancedToast.error({
        title: 'Demo mode failed',
        description: handleApiError(error)
      });
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
        enhancedToast.info({
          title: 'Demo session ended',
          description: 'Thanks for trying DBooster!'
        });
        console.log('Demo user logged out');
        return;
      }

      await authMethods.logout();
      clearAuthState();
      enhancedToast.success({
        title: 'Signed out',
        description: 'You have been signed out successfully.'
      });
    } catch (error) {
      console.error('Logout failed:', error);
      enhancedToast.error({
        title: 'Sign out failed',
        description: handleApiError(error)
      });
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
