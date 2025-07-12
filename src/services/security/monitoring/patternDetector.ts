
import { supabase } from '@/integrations/supabase/client';
import { productionLogger } from '@/utils/productionLogger';
import type { SecurityEvent } from '../types/securityEvent';

export class PatternDetector {
  async analyzeSecurityPatterns(): Promise<void> {
    try {
      const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

      // Look for patterns in recent security events
      const { data: recentEvents } = await supabase
        .from('security_audit_log')
        .select('*')
        .gte('created_at', fifteenMinutesAgo.toISOString())
        .order('created_at', { ascending: false });

      if (!recentEvents || recentEvents.length === 0) return;

      // Analyze patterns
      const ipCounts: Record<string, number> = {};
      const userCounts: Record<string, number> = {};
      const threatTypes: Record<string, number> = {};

      recentEvents.forEach(event => {
        // Count events by IP (with proper type checking)
        const ipAddress = event.ip_address as string | null;
        if (ipAddress) {
          ipCounts[ipAddress] = (ipCounts[ipAddress] || 0) + 1;
        }

        // Count events by user (with proper type checking)
        const userId = event.user_id as string | null;
        if (userId) {
          userCounts[userId] = (userCounts[userId] || 0) + 1;
        }

        // Count threat types (with proper type checking)
        const eventData = event.event_data as { threatTypes?: string[] } | null;
        if (eventData?.threatTypes) {
          eventData.threatTypes.forEach((threat: string) => {
            threatTypes[threat] = (threatTypes[threat] || 0) + 1;
          });
        }
      });

      // Alert on suspicious patterns
      Object.entries(ipCounts).forEach(([ip, count]) => {
        if (count > 10) { // More than 10 events from one IP in 15 minutes
          this.logSuspiciousActivity('high_frequency_ip_activity', { ip, count });
        }
      });

      Object.entries(userCounts).forEach(([userId, count]) => {
        if (count > 15) { // More than 15 events from one user in 15 minutes
          this.logSuspiciousActivity('high_frequency_user_activity', { userId, count });
        }
      });

    } catch (error) {
      productionLogger.error('Pattern analysis failed', error, 'SecurityMonitor');
    }
  }

  private async logSuspiciousActivity(activityType: string, details: any): Promise<void> {
    await supabase.from('security_audit_log').insert({
      event_type: 'suspicious_pattern_detected',
      event_data: { activityType, details },
      ip_address: null,
      user_agent: null
    });
  }
}
