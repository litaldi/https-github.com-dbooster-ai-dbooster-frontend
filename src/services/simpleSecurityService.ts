
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/utils/logger';

interface SecurityEvent {
  event_type: string;
  event_data?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}

export class SimpleSecurityService {
  private static instance: SimpleSecurityService;

  static getInstance(): SimpleSecurityService {
    if (!SimpleSecurityService.instance) {
      SimpleSecurityService.instance = new SimpleSecurityService();
    }
    return SimpleSecurityService.instance;
  }

  async logSecurityEvent(event: SecurityEvent): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.from('security_audit_log').insert({
        user_id: user?.id || null,
        event_type: event.event_type,
        event_data: event.event_data || {},
        ip_address: event.ip_address || null,
        user_agent: event.user_agent || navigator.userAgent,
      });

      logger.info('Security event logged', { eventType: event.event_type }, 'SimpleSecurityService');
    } catch (error) {
      logger.error('Failed to log security event', { error, eventType: event.event_type }, 'SimpleSecurityService');
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
  }

  sanitizeInput(input: string): string {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  }
}

export const simpleSecurityService = SimpleSecurityService.getInstance();
