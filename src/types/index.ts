
// Shared type definitions for the application

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role?: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Session {
  user: User;
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

export type UserRole = 'admin' | 'moderator' | 'user';

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  success: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedValue?: string;
}

export interface SecurityEvent {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  userId?: string;
  details: Record<string, unknown>;
}

export interface RateLimitResult {
  allowed: boolean;
  remainingAttempts: number;
  resetTime: number;
  retryAfter?: number;
}

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'tel' | 'textarea';
  required?: boolean;
  placeholder?: string;
  validation?: (value: string) => string | null;
}

export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
  children?: NavigationItem[];
}
