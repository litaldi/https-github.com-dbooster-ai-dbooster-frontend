
import { productionLogger } from '@/utils/productionLogger';

interface AuditEvent {
  userId?: string;
  action: string;
  resource: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export class AuditLogger {
  private static instance: AuditLogger;

  static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger();
    }
    return AuditLogger.instance;
  }

  async logEvent(event: AuditEvent) {
    try {
      productionLogger.secureInfo('Audit event', event, 'AuditLogger');
    } catch (error) {
      productionLogger.error('Failed to log audit event', error, 'AuditLogger');
    }
  }

  async logAuthEvent(userId: string, action: string, success: boolean, metadata?: Record<string, any>) {
    await this.logEvent({
      userId,
      action: `auth_${action}`,
      resource: 'authentication',
      timestamp: new Date(),
      metadata: { success, ...metadata }
    });
  }
}

export const auditLogger = AuditLogger.getInstance();
