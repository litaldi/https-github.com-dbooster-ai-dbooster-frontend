
import { User, Session } from '@supabase/supabase-js';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (provider: 'github' | 'google') => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  loginWithPhone: (phone: string, password: string) => Promise<void>;
  signupWithEmail: (email: string, password: string, name: string) => Promise<void>;
  signupWithPhone: (phone: string, password: string, name: string) => Promise<void>;
  signIn: (identifier: string, password: string) => Promise<{ error?: { message: string } }>;
  signUp: (userData: any) => Promise<{ error?: { message: string } }>;
  loginDemo: () => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  githubAccessToken: string | null;
  isDemo: boolean;
}
