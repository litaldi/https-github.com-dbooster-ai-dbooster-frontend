
export type AuthMode = 'login' | 'register';
export type LoginType = 'email' | 'phone';
export type OAuthProvider = 'github' | 'google';

export interface AuthFormData {
  email: string;
  password: string;
  phone: string;
  name: string;
  confirmPassword: string;
}

export interface AuthError {
  message: string;
  field?: string;
}

export interface AuthResponse {
  success: boolean;
  error?: AuthError;
  user?: any;
}

export interface ValidationResult {
  isValid: boolean;
  hasError: boolean;
  errorMessage?: string;
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

export interface AuthContextValue {
  signIn: (identifier: string, password: string) => Promise<{ error?: any }>;
  signUp: (userData: any) => Promise<{ error?: any }>;
}
