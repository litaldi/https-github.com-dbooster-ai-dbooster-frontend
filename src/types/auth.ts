
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
