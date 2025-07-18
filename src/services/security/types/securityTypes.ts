
export type SecurityEventType = 'login_failure' | 'suspicious_activity' | 'rate_limit_hit' | 'security_violation';
export type SecuritySeverity = 'low' | 'medium' | 'high' | 'critical';

export interface SecurityEvent {
  type: SecurityEventType;
  severity: SecuritySeverity;
  message: string;
  metadata: Record<string, any>;
  timestamp: number;
}

export interface SecurityMetrics {
  failedLogins: number;
  suspiciousActivities: number;
  blockedRequests: number;
  activeThreats: number;
}

export interface SecurityHealthCheck {
  score: number;
  status: 'healthy' | 'warning' | 'critical';
  issues: string[];
}
