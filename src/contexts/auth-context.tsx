
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { enhancedToast } from '@/components/ui/enhanced-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isDemo: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  loginDemo: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo user data
const DEMO_USER = {
  id: 'demo-user-id',
  email: 'demo@example.com',
  user_metadata: { full_name: 'Demo User' },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  aud: 'authenticated',
  role: 'authenticated'
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setIsLoading(false);
        }
      } catch (error) {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setIsLoading(false);
          
          if (session?.user && isDemo) {
            setIsDemo(false);
          }
        }
      }
    );

    getInitialSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [isDemo]);

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      enhancedToast.error({
        title: "Login Failed",
        description: error.message,
      });
      throw error;
    }

    enhancedToast.success({
      title: "Welcome back!",
      description: "You have been successfully signed in.",
    });
  };

  const signup = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/`
      }
    });

    if (error) {
      enhancedToast.error({
        title: "Signup Failed",
        description: error.message,
      });
      throw error;
    }

    enhancedToast.success({
      title: "Account Created!",
      description: "Please check your email to verify your account.",
    });
  };

  const loginDemo = async () => {
    setIsDemo(true);
    setUser(DEMO_USER as User);
    setSession({
      access_token: 'demo-token',
      refresh_token: 'demo-refresh',
      expires_in: 3600,
      token_type: 'bearer',
      user: DEMO_USER as User
    } as Session);

    enhancedToast.success({
      title: "Demo Mode Activated",
      description: "Welcome to the demo environment!",
    });
  };

  const logout = async () => {
    if (isDemo) {
      setIsDemo(false);
      setUser(null);
      setSession(null);
      enhancedToast.info({
        title: "Demo session ended",
        description: "Thanks for trying DBooster!"
      });
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) {
      enhancedToast.error({
        title: "Logout Failed",
        description: error.message,
      });
      throw error;
    }

    enhancedToast.success({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      isLoading,
      isDemo,
      login,
      signup,
      loginDemo,
      logout
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
