
export interface User {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    name?: string;
    avatar_url?: string;
  };
  app_metadata?: {
    provider?: string;
    providers?: string[];
  };
}

export interface Session {
  user: User;
  access_token: string;
  refresh_token: string;
  expires_at?: number;
  expires_in: number;
  token_type: string;
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors?: string[];
  riskLevel?: string;
  threatTypes?: string[];
}

export interface SecurityEvent {
  eventType: string;
  success: boolean;
  details?: Record<string, any>;
  timestamp?: string;
  userId?: string;
}
