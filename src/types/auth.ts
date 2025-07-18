
export type AuthMode = 'login' | 'signup';

export interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  rememberMe?: boolean;
  acceptedTerms?: boolean;
}
