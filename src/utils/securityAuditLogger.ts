
import { productionLogger } from './productionLogger';

interface SecurityEvent {
  type: 'authentication' | 'authorization' | 'input_validation' | 'rate_limit' | 'suspicious_activity';
  action: string;
  success: boolean;
  userId?: string;
  metadata?: Record<string, any>;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

class SecurityAuditLogger {
  private static instance: SecurityAuditLogger;

  static getInstance(): SecurityAuditLogger {
    if (!SecurityAuditLogger.instance) {
      SecurityAuditLogger.instance = new SecurityAuditLogger();
    }
    return SecurityAuditLogger.instance;
  }

  logSecurityEvent(event: SecurityEvent): void {
    const timestamp = new Date().toISOString();
    const sanitizedMetadata = this.sanitizeMetadata(event.metadata);

    const logData = {
      ...event,
      timestamp,
      metadata: sanitizedMetadata,
      environment: import.meta.env.MODE
    };

    // Log based on risk level
    switch (event.riskLevel) {
      case 'critical':
        productionLogger.error(`CRITICAL SECURITY EVENT: ${event.action}`, logData, 'SecurityAudit');
        this.triggerSecurityAlert(logData);
        break;
      case 'high':
        productionLogger.error(`HIGH RISK SECURITY EVENT: ${event.action}`, logData, 'SecurityAudit');
        break;
      case 'medium':
        productionLogger.warn(`MEDIUM RISK SECURITY EVENT: ${event.action}`, logData, 'SecurityAudit');
        break;
      default:
        productionLogger.secureInfo(`SECURITY EVENT: ${event.action}`, logData, 'SecurityAudit');
    }
  }

  private sanitizeMetadata(metadata?: Record<string, any>): Record<string, any> | undefined {
    if (!metadata) return undefined;

    const sanitized: Record<string, any> = {};
    const sensitiveKeys = ['password', 'token', 'secret', 'key', 'email', 'phone', 'ssn', 'credit'];

    for (const [key, value] of Object.entries(metadata)) {
      const isSensitive = sensitiveKeys.some(sensitiveKey => 
        key.toLowerCase().includes(sensitiveKey)
      );

      if (isSensitive && typeof value === 'string') {
        sanitized[key] = value.length > 0 ? '*'.repeat(Math.min(value.length, 8)) : '';
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  private triggerSecurityAlert(logData: any): void {
    // In a real-world scenario, this would trigger immediate security alerts
    // For now, we'll just log it with high priority
    if (import.meta.env.PROD) {
      // This would integrate with security monitoring services
      productionLogger.error('SECURITY ALERT TRIGGERED', {
        alertId: `alert_${Date.now()}`,
        ...logData
      }, 'SecurityAlert');
    }
  }

  // Convenience methods for common security events
  logFailedAuthentication(email?: string, reason?: string): void {
    this.logSecurityEvent({
      type: 'authentication',
      action: 'login_failed',
      success: false,
      metadata: { 
        email: email?.replace(/(.{2}).*(@.*)/, "$1***$2"),
        reason 
      },
      riskLevel: 'medium'
    });
  }

  logSuspiciousActivity(activity: string, userId?: string, metadata?: Record<string, any>): void {
    this.logSecurityEvent({
      type: 'suspicious_activity',
      action: activity,
      success: false,
      userId,
      metadata,
      riskLevel: 'high'
    });
  }

  logInputValidationFailure(field: string, errors: string[], riskLevel: SecurityEvent['riskLevel']): void {
    this.logSecurityEvent({
      type: 'input_validation',
      action: 'validation_failed',
      success: false,
      metadata: { field, errors },
      riskLevel
    });
  }
}

export const securityAuditLogger = SecurityAuditLogger.getInstance();
