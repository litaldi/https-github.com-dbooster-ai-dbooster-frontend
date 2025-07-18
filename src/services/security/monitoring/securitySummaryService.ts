
import { supabase } from '@/integrations/supabase/client';
import { productionLogger } from '@/utils/productionLogger';
import type { SecuritySummary, SecurityEvent } from '../types/securityEvent';

export class SecuritySummaryService {
  async getSecuritySummary(): Promise<SecuritySummary> {
    try {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const [eventsResult, threatsResult, blockedResult, highRiskResult] = await Promise.all([
        supabase
          .from('security_audit_log')
          .select('id', { count: 'exact' })
          .gte('created_at', twentyFourHoursAgo.toISOString()),
        
        supabase
          .from('security_audit_log')
          .select('id', { count: 'exact' })
          .eq('event_type', 'security_validation_threat_detected')
          .gte('created_at', twentyFourHoursAgo.toISOString()),
        
        supabase
          .from('rate_limit_tracking')
          .select('id', { count: 'exact' })
          .eq('action_type', 'security_block')
          .gt('blocked_until', new Date().toISOString()),
        
        supabase
          .from('security_audit_log')
          .select('*')
          .in('event_type', [
            'security_validation_threat_detected',
            'suspicious_activity_detected',
            'suspicious_pattern_detected'
          ])
          .gte('created_at', twentyFourHoursAgo.toISOString())
          .order('created_at', { ascending: false })
          .limit(10)
      ]);

      // Transform the data to match SecurityEvent type
      const recentHighRiskEvents: SecurityEvent[] = (highRiskResult.data || []).map(event => ({
        id: event.id,
        event_type: event.event_type,
        event_data: event.event_data,
        created_at: event.created_at,
        user_id: event.user_id || undefined,
        ip_address: (event.ip_address as string) || null,
        user_agent: event.user_agent || null
      }));

      return {
        totalEvents: eventsResult.count || 0,
        threatsDetected: threatsResult.count || 0,
        blockedIPs: blockedResult.count || 0,
        recentHighRiskEvents
      };
    } catch (error) {
      productionLogger.error('Failed to get security summary', error, 'SecurityMonitor');
      return {
        totalEvents: 0,
        threatsDetected: 0,
        blockedIPs: 0,
        recentHighRiskEvents: []
      };
    }
  }
}
