
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextType } from '@/types/auth';
import { User } from '@/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [githubAccessToken, setGithubAccessToken] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading completion
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string, options?: { rememberMe?: boolean }) => {
    try {
      // Mock sign in - in real app this would call Supabase
      const mockUser: User = {
        id: 'mock-user-id',
        email,
        user_metadata: {
          full_name: 'Mock User',
          name: 'Mock User'
        }
      };
      setUser(mockUser);
      return {};
    } catch (error) {
      return { error: 'Sign in failed' };
    }
  };

  const signUp = async (email: string, password: string, fullName: string, acceptedTerms: boolean) => {
    try {
      // Mock sign up - in real app this would call Supabase
      if (!acceptedTerms) {
        return { error: 'You must accept the terms and conditions' };
      }
      const mockUser: User = {
        id: 'mock-user-id',
        email,
        user_metadata: {
          full_name: fullName,
          name: fullName
        }
      };
      setUser(mockUser);
      return {};
    } catch (error) {
      return { error: 'Sign up failed' };
    }
  };

  const signOut = async () => {
    setUser(null);
    setSession(null);
    setIsDemo(false);
    setGithubAccessToken(null);
  };

  const logout = async () => {
    await signOut();
  };

  const loginDemo = async () => {
    const demoUser: User = {
      id: 'demo-user-id',
      email: 'demo@dbooster.com',
      user_metadata: {
        full_name: 'Demo User',
        name: 'Demo User'
      }
    };
    setUser(demoUser);
    setIsDemo(true);
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    isDemo,
    githubAccessToken,
    signIn,
    signUp,
    signOut,
    logout,
    loginDemo,
  };

  return (
    <AuthContext.Provider value={value}>
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
