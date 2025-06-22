
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

  private async getClientIP(): Promise<string | null> {
    // In a real production environment, this would get the actual client IP
    // For now, we'll return null to prevent database errors
    // The IP should ideally be set by server-side middleware or edge functions
    try {
      // This could be enhanced to call an IP detection service
      // For example: const response = await fetch('https://api.ipify.org?format=json');
      return null;
    } catch (error) {
      productionLogger.error('Failed to get client IP', error, 'AuditLogger');
      return null;
    }
  }

  private getClientInfo() {
    return {
      user_agent: navigator.userAgent,
    };
  }

  async logSecurityEvent(event: SecurityEvent): Promise<void> {
    try {
      const clientInfo = this.getClientInfo();
      const { data: { user } } = await supabase.auth.getUser();
      const clientIP = await this.getClientIP();
      
      // Prepare log data - only include IP if we have one
      const logData: any = {
        user_id: user?.id || null,
        event_type: event.event_type,
        event_data: event.event_data || {},
        user_agent: event.user_agent || clientInfo.user_agent,
      };

      // Only add IP address if we have a valid one
      if (event.ip_address || clientIP) {
        logData.ip_address = event.ip_address || clientIP;
      }

      const { error } = await supabase.from('security_audit_log').insert(logData);
      
      if (error) {
        productionLogger.error('Failed to insert security event', error, 'AuditLogger');
        return;
      }

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
