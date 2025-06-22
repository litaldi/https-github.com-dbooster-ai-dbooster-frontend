
import { supabase } from '@/integrations/supabase/client';
import { productionLogger } from '@/utils/productionLogger';

interface SecurityEvent {
  event_type: string;
  event_data?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}

export class AuditLogger {
  private static instance: AuditLogger;

  static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger();
    }
    return AuditLogger.instance;
  }

  private getClientInfo() {
    return {
      ip_address: this.getClientIP(),
      user_agent: navigator.userAgent,
    };
  }

  private getClientIP(): string | null {
    // In production, IP should be set by server-side middleware
    // For now, we'll return null to avoid database errors
    // The server should set this via headers or edge functions
    return null;
  }

  async logSecurityEvent(event: SecurityEvent): Promise<void> {
    try {
      const clientInfo = this.getClientInfo();
      const { data: { user } } = await supabase.auth.getUser();
      
      // Only include IP address if it's valid
      const logData: any = {
        user_id: user?.id || null,
        event_type: event.event_type,
        event_data: event.event_data || {},
        user_agent: event.user_agent || clientInfo.user_agent,
      };

      // Only add IP address if we have a valid one
      if (event.ip_address || clientInfo.ip_address) {
        logData.ip_address = event.ip_address || clientInfo.ip_address;
      }

      await supabase.from('security_audit_log').insert(logData);

      // Use production-safe logging
      productionLogger.secureInfo('Security event logged', { eventType: event.event_type }, 'AuditLogger');
    } catch (error) {
      productionLogger.error('Failed to log security event', { error, eventType: event.event_type }, 'AuditLogger');
      // Don't throw here to avoid breaking the main flow
    }
  }

  async logAuthEvent(eventType: string, success: boolean, details?: Record<string, any>): Promise<void> {
    await this.logSecurityEvent({
      event_type: `auth_${eventType}`,
      event_data: {
        success,
        timestamp: new Date().toISOString(),
        ...details
      }
    });

    // Log authentication events with appropriate level
    if (success) {
      productionLogger.warn('Authentication event', { eventType, success }, 'AuditLogger');
    } else {
      productionLogger.error('Authentication failed', { eventType, success }, 'AuditLogger');
    }
  }
}

export const auditLogger = AuditLogger.getInstance();
