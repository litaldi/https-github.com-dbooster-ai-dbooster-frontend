
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { productionLogger } from '@/utils/productionLogger';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isDemo: boolean;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo] = useState(false); // Set to true if you want demo mode

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          productionLogger.error('Error getting initial session', error, 'AuthContext');
        } else {
          setUser(session?.user ?? null);
        }
      } catch (error) {
        productionLogger.error('Error in getInitialSession', error, 'AuthContext');
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        productionLogger.info('Auth state changed', { event }, 'AuthContext');
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        productionLogger.error('Error signing out', error, 'AuthContext');
        throw error;
      }
    } catch (error) {
      productionLogger.error('Sign out failed', error, 'AuthContext');
      throw error;
    }
  };

  const logout = signOut; // Alias for consistency

  const value = {
    user,
    loading,
    isDemo,
    signOut,
    logout
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
