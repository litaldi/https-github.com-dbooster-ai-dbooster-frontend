
export type AuthMode = 'login' | 'signup' | 'reset';

export type LoginType = 'email' | 'phone';

export interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  phone?: string;
  rememberMe?: boolean;
  acceptedTerms?: boolean;
}

export interface AuthContextType {
  user: any | null;
  session: any | null;
  loading: boolean;
  isDemo: boolean;
  githubAccessToken: string | null;
  signIn: (email: string, password: string, options?: { rememberMe?: boolean }) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, fullName: string, acceptedTerms: boolean) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
  loginDemo: () => Promise<void>;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: any;
  session?: any;
}
