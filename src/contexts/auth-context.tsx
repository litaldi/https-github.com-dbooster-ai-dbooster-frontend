
import React, { createContext, useContext } from 'react';
import { useAuth as useSimplifiedAuth, AuthProvider as SimplifiedAuthProvider } from '@/hooks/useSimplifiedAuth';
import type { User, Session } from '@/types';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isLoading: boolean; // Alias for loading
  isDemo: boolean;
  githubAccessToken: string | null;
  signIn: (email: string, password: string, options?: { rememberMe?: boolean }) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, name: string, acceptedTerms: boolean) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>; // Alias for signOut
  secureLogin: (email: string, password: string, options?: { rememberMe?: boolean }) => Promise<{ error?: string }>; // Alias for signIn
  secureSignup: (email: string, password: string, name: string, acceptedTerms?: boolean) => Promise<{ error?: string }>; // Alias for signUp
  loginDemo: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const simplifiedAuth = useSimplifiedAuth();

  // Create aliases and computed properties to match expected interface
  const contextValue: AuthContextType = {
    ...simplifiedAuth,
    isLoading: simplifiedAuth.loading, // Alias
    logout: simplifiedAuth.signOut, // Alias
    secureLogin: simplifiedAuth.signIn, // Alias
    secureSignup: (email: string, password: string, name: string, acceptedTerms: boolean = true) => {
      return simplifiedAuth.signUp(email, password, name, acceptedTerms);
    },
    isDemo: simplifiedAuth.user?.email === 'demo@dbooster.com' || false,
    githubAccessToken: null, // Not implemented yet
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SimplifiedAuthProvider>
      <AuthContextProvider>
        {children}
      </AuthContextProvider>
    </SimplifiedAuthProvider>
  );
}
