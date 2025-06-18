
import { supabase } from '@/integrations/supabase/client';
import { auditLogger } from './auditLogger';

export class ThreatDetectionService {
  private static instance: ThreatDetectionService;

  static getInstance(): ThreatDetectionService {
    if (!ThreatDetectionService.instance) {
      ThreatDetectionService.instance = new ThreatDetectionService();
    }
    return ThreatDetectionService.instance;
  }

  async detectSuspiciousActivity(userId: string): Promise<boolean> {
    try {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      
      const { data: recentEvents } = await supabase
        .from('security_audit_log')
        .select('event_type, created_at, event_data')
        .eq('user_id', userId)
        .gte('created_at', oneHourAgo.toISOString())
        .order('created_at', { ascending: false });

      if (!recentEvents) return false;

      // Check for suspicious patterns
      const failedLogins = recentEvents.filter(e => 
        e.event_type === 'auth_login' && 
        e.event_data && 
        typeof e.event_data === 'object' && 
        'success' in e.event_data && 
        !e.event_data.success
      ).length;
      
      const multipleIPs = new Set(
        recentEvents
          .map(e => e.event_data && typeof e.event_data === 'object' && 'ip_address' in e.event_data ? e.event_data.ip_address : null)
          .filter(Boolean)
      ).size;
      
      const isSuspicious = failedLogins > 3 || multipleIPs > 2;
      
      if (isSuspicious) {
        await auditLogger.logSecurityEvent({
          event_type: 'suspicious_activity_detected',
          event_data: { userId, failedLogins, multipleIPs }
        });
      }
      
      return isSuspicious;
    } catch (error) {
      console.error('Suspicious activity detection failed:', error);
      return false;
    }
  }
}

export const threatDetectionService = ThreatDetectionService.getInstance();
