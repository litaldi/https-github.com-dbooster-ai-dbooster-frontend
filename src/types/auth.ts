
export type AuthMode = 'login' | 'register';

export interface AuthFormData {
  email: string;
  password: string;
  name?: string;
  confirmPassword?: string;
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
