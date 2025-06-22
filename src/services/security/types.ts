
export interface SecurityThreat {
  level: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  description: string;
  recommended_action: string;
}

export interface EnhancedSecurityValidation {
  isValid: boolean;
  threats: SecurityThreat[];
  riskScore: number;
  blockRequest: boolean;
  sanitizedInput?: string;
}

export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';

export interface SecurityHealthCheck {
  overall: 'healthy' | 'warning' | 'critical';
  checks: Array<{ name: string; status: 'pass' | 'warn' | 'fail'; message: string }>;
  score: number;
}
