
import { createContext, useContext, ReactNode, useEffect } from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import { enhancedAuthService } from '@/services/enhancedAuthService';
import { secureDemoService } from '@/services/secureDemoService';
import { securityService } from '@/services/securityService';
import type { User, Session } from '@supabase/supabase-js';
import type { OAuthProvider, AuthCredentials } from '@/types/auth';

interface EnhancedAuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isDemo: boolean;
  githubAccessToken: string | null;
  loginWithOAuth: (provider: OAuthProvider) => Promise<void>;
  loginWithCredentials: (credentials: AuthCredentials) => Promise<void>;
  signupWithCredentials: (credentials: AuthCredentials) => Promise<void>;
  loginDemo: () => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const EnhancedAuthContext = createContext<EnhancedAuthContextType | undefined>(undefined);

export function EnhancedAuthProvider({ children }: { children: ReactNode }) {
  const {
    user,
    session,
    isLoading,
    isDemo,
    githubAccessToken,
    setIsLoading,
    updateAuthState,
    clearAuthState
  } = useAuthState();

  // Security monitoring
  useEffect(() => {
    let sessionTimeout: NodeJS.Timeout;

    const checkSuspiciousActivity = async () => {
      if (user?.id) {
        const isSuspicious = await securityService.detectSuspiciousActivity(user.id);
        if (isSuspicious) {
          await securityService.logSecurityEvent({
            event_type: 'suspicious_activity_detected',
            event_data: { userId: user.id }
          });
          // Could implement additional security measures here
        }
      }
    };

    const setupSessionTimeout = () => {
      if (session && !isDemo) {
        const expiresAt = session.expires_at ? session.expires_at * 1000 : Date.now() + 3600000;
        const timeUntilExpiry = expiresAt - Date.now() - 300000; // 5 minutes before expiry
        
        if (timeUntilExpiry > 0) {
          sessionTimeout = setTimeout(() => {
            console.log('Session expiring soon, logging user out for security');
            logout();
          }, timeUntilExpiry);
        }
      }
    };

    if (user) {
      checkSuspiciousActivity();
      setupSessionTimeout();
    }

    return () => {
      if (sessionTimeout) clearTimeout(sessionTimeout);
    };
  }, [user, session, isDemo]);

  const loginWithOAuth = async (provider: OAuthProvider) => {
    setIsLoading(true);
    try {
      await enhancedAuthService.loginWithOAuth(provider);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithCredentials = async (credentials: AuthCredentials) => {
    setIsLoading(true);
    try {
      await enhancedAuthService.loginWithCredentials(credentials);
    } finally {
      setIsLoading(false);
    }
  };

  const signupWithCredentials = async (credentials: AuthCredentials) => {
    setIsLoading(true);
    try {
      await enhancedAuthService.signupWithCredentials(credentials);
    } finally {
      setIsLoading(false);
    }
  };

  const loginDemo = async () => {
    setIsLoading(true);
    try {
      const { user: demoUser, session: demoSession } = await secureDemoService.createDemoSession();
      updateAuthState(demoUser, demoSession, true);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      if (isDemo) {
        await secureDemoService.clearDemoSession();
      } else {
        await enhancedAuthService.logout(false);
      }
      clearAuthState();
    } finally {
      setIsLoading(false);
    }
  };

  const refreshSession = async () => {
    if (isDemo) {
      const success = await secureDemoService.extendDemoSession();
      if (!success) {
        await logout();
      }
    }
    // For regular sessions, Supabase handles refresh automatically
  };

  const value: EnhancedAuthContextType = {
    user,
    session,
    isLoading,
    isDemo,
    githubAccessToken,
    loginWithOAuth,
    loginWithCredentials,
    signupWithCredentials,
    loginDemo,
    logout,
    refreshSession,
  };

  return (
    <EnhancedAuthContext.Provider value={value}>
      {children}
    </EnhancedAuthContext.Provider>
  );
}

export function useEnhancedAuth() {
  const context = useContext(EnhancedAuthContext);
  if (context === undefined) {
    throw new Error('useEnhancedAuth must be used within an EnhancedAuthProvider');
  }
  return context;
}
