
export type AuthMode = 'login' | 'signup' | 'reset';

export interface User {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    name?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export interface Session {
  user: User;
  access_token?: string;
  refresh_token?: string;
  [key: string]: any;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
}
