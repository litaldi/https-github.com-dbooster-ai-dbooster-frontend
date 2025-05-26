
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { isDemoMode, getDemoUser, getDemoSession, loginDemoUser, logoutDemoUser } from '@/services/demo';

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
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [githubAccessToken, setGithubAccessToken] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  // Rate limiting state
  const [attemptCount, setAttemptCount] = useState(0);
  const [lastAttempt, setLastAttempt] = useState(0);

  const checkRateLimit = () => {
    const now = Date.now();
    const timeDiff = now - lastAttempt;
    
    // Reset attempt count after 15 minutes
    if (timeDiff > 15 * 60 * 1000) {
      setAttemptCount(0);
    }
    
    // Block if more than 5 attempts in 15 minutes
    if (attemptCount >= 5 && timeDiff < 15 * 60 * 1000) {
      throw new Error('Too many login attempts. Please try again later.');
    }
    
    setAttemptCount(prev => prev + 1);
    setLastAttempt(now);
  };

  useEffect(() => {
    // Check for demo mode first
    if (isDemoMode()) {
      const demoSession = getDemoSession();
      if (demoSession) {
        setUser(demoSession.user);
        setSession(demoSession);
        setIsDemo(true);
        setIsLoading(false);
        return;
      } else {
        // Demo session expired, clear demo data
        logoutDemoUser();
      }
    }

    // Set up auth state listener for regular auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setIsDemo(false);
        
        // Extract GitHub access token if available
        if (session?.provider_token && session.user?.app_metadata?.provider === 'github') {
          setGithubAccessToken(session.provider_token);
          console.log('GitHub access token obtained');
        } else {
          setGithubAccessToken(null);
        }
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('User signed in:', session.user);
          console.log('Provider:', session.user.app_metadata?.provider);
          // Reset rate limiting on successful login
          setAttemptCount(0);
        }
        
        if (event === 'SIGNED_OUT') {
          console.log('User signed out');
          setGithubAccessToken(null);
        }
        
        setIsLoading(false);
      }
    );

    // Check for existing session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
          setIsDemo(false);
          
          // Check for GitHub token in existing session
          if (session?.provider_token && session.user?.app_metadata?.provider === 'github') {
            setGithubAccessToken(session.provider_token);
          }
        }
      } catch (error) {
        console.error('Error in getSession:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (!isDemoMode()) {
      getInitialSession();
    }

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (provider: 'github' | 'google') => {
    try {
      checkRateLimit();
      setIsLoading(true);
      console.log(`Attempting to sign in with ${provider}`);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: `${window.location.origin}/`,
          scopes: provider === 'github' ? 'repo read:user user:email' : undefined,
        },
      });

      if (error) {
        console.error('Login error:', error);
        throw error;
      }

      console.log('OAuth login initiated:', data);
    } catch (error) {
      console.error('Login failed:', error);
      setIsLoading(false);
      throw error;
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    try {
      checkRateLimit();
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        console.error('Email login error:', error);
        throw new Error(error.message || 'Invalid email or password');
      }

      console.log('Email login successful:', data.user?.email);
    } catch (error) {
      console.error('Email login failed:', error);
      setIsLoading(false);
      throw error;
    }
  };

  const loginWithPhone = async (phone: string, password: string) => {
    try {
      checkRateLimit();
      setIsLoading(true);
      
      // Clean phone number (remove spaces, dashes, parentheses)
      const cleanPhone = phone.replace(/\D/g, '');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        phone: `+${cleanPhone}`,
        password,
      });

      if (error) {
        console.error('Phone login error:', error);
        throw new Error(error.message || 'Invalid phone number or password');
      }

      console.log('Phone login successful:', data.user?.phone);
    } catch (error) {
      console.error('Phone login failed:', error);
      setIsLoading(false);
      throw error;
    }
  };

  const signupWithEmail = async (email: string, password: string, name: string) => {
    try {
      checkRateLimit();
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: {
            full_name: name.trim(),
            name: name.trim(),
          }
        }
      });

      if (error) {
        console.error('Email signup error:', error);
        throw new Error(error.message || 'Failed to create account');
      }

      if (data.user && !data.session) {
        throw new Error('Please check your email to confirm your account');
      }

      console.log('Email signup successful:', data.user?.email);
    } catch (error) {
      console.error('Email signup failed:', error);
      setIsLoading(false);
      throw error;
    }
  };

  const signupWithPhone = async (phone: string, password: string, name: string) => {
    try {
      checkRateLimit();
      setIsLoading(true);
      
      // Clean phone number (remove spaces, dashes, parentheses)
      const cleanPhone = phone.replace(/\D/g, '');
      
      const { data, error } = await supabase.auth.signUp({
        phone: `+${cleanPhone}`,
        password,
        options: {
          data: {
            full_name: name.trim(),
            name: name.trim(),
          }
        }
      });

      if (error) {
        console.error('Phone signup error:', error);
        throw new Error(error.message || 'Failed to create account');
      }

      if (data.user && !data.session) {
        throw new Error('Please check your phone for a verification code');
      }

      console.log('Phone signup successful:', data.user?.phone);
    } catch (error) {
      console.error('Phone signup failed:', error);
      setIsLoading(false);
      throw error;
    }
  };

  const loginDemo = async () => {
    try {
      setIsLoading(true);
      const { user, session } = await loginDemoUser();
      setUser(user);
      setSession(session);
      setIsDemo(true);
      console.log('Demo user logged in');
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
        setUser(null);
        setSession(null);
        setIsDemo(false);
        setGithubAccessToken(null);
        console.log('Demo user logged out');
        return;
      }

      console.log('Signing out...');
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        throw error;
      }
      
      console.log('Successfully signed out');
      
      // Clear local state
      setUser(null);
      setSession(null);
      setIsDemo(false);
      setGithubAccessToken(null);
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
