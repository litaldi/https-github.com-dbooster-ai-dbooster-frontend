
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { productionLogger } from '@/utils/productionLogger';

interface SecurityEvent {
  id: string;
  event_type: string;
  event_data?: Record<string, any>;
  created_at: string;
  user_id?: string;
}

interface SecurityStats {
  totalEvents: number;
  securityViolations: number;
  rateLimitHits: number;
  recentActivity: number;
}

export function useSecurityEvents() {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [stats, setStats] = useState<SecurityStats>({
    totalEvents: 0,
    securityViolations: 0,
    rateLimitHits: 0,
    recentActivity: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    try {
      const { data: eventsData, error: eventsError } = await supabase
        .from('security_audit_log')
        .select('id, event_type, event_data, created_at, user_id')
        .order('created_at', { ascending: false })
        .limit(50);

      if (eventsError) {
        productionLogger.error('Failed to fetch security events', eventsError, 'useSecurityEvents');
        return;
      }

      setEvents(eventsData || []);

      // Calculate stats
      const totalEvents = eventsData?.length || 0;
      const securityViolations = eventsData?.filter(event => 
        event.event_type.includes('violation') || 
        event.event_type.includes('threat') || 
        event.event_type.includes('suspicious')
      ).length || 0;
      
      const rateLimitHits = eventsData?.filter(event => 
        event.event_type.includes('rate_limit') || 
        event.event_type.includes('blocked')
      ).length || 0;

      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const recentActivity = eventsData?.filter(event => 
        new Date(event.created_at) > oneHourAgo
      ).length || 0;

      setStats({
        totalEvents,
        securityViolations,
        rateLimitHits,
        recentActivity
      });
    } catch (error) {
      productionLogger.error('Error fetching security events', error, 'useSecurityEvents');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshEvents = useCallback(async () => {
    setLoading(true);
    await fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return {
    events,
    stats,
    loading,
    refreshEvents
  };
}
