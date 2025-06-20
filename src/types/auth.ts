
export interface AuthFormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export type AuthMode = 'login' | 'signup' | 'reset';
export type LoginType = 'email' | 'phone';
export type OAuthProvider = 'github' | 'google';

export interface ValidationResult {
  isValid: boolean;
  hasError: boolean;
  errorMessage?: string;
}

export interface AuthContextValue {
  signIn: (identifier: string, password: string) => Promise<{ error?: any }>;
  signUp: (userData: any) => Promise<{ error?: any }>;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  data?: any;
}

export interface AuthCredentials {
  email?: string;
  phone?: string;
  password: string;
  name?: string;
}
