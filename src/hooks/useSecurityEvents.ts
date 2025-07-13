
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { productionLogger } from '@/utils/productionLogger';
import type { Json } from '@/integrations/supabase/types';

export interface SecurityEvent {
  id: string;
  event_type: string;
  event_data: Json;
  created_at: string;
  user_id?: string;
  ip_address?: string | null;
  user_agent?: string | null;
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
        .select('id, event_type, event_data, created_at, user_id, ip_address::text, user_agent')
        .order('created_at', { ascending: false })
        .limit(50);

      if (eventsError) {
        productionLogger.error('Failed to fetch security events', eventsError, 'useSecurityEvents');
        return;
      }

      // Map the data to ensure proper types
      const mappedEvents: SecurityEvent[] = (eventsData || []).map(event => ({
        id: event.id,
        event_type: event.event_type,
        event_data: event.event_data || {},
        created_at: event.created_at,
        user_id: event.user_id || undefined,
        ip_address: event.ip_address || null,
        user_agent: event.user_agent || null
      }));

      setEvents(mappedEvents);

      // Calculate stats
      const totalEvents = mappedEvents.length;
      const securityViolations = mappedEvents.filter(event => 
        event.event_type.includes('violation') || 
        event.event_type.includes('threat') || 
        event.event_type.includes('suspicious')
      ).length;
      
      const rateLimitHits = mappedEvents.filter(event => 
        event.event_type.includes('rate_limit') || 
        event.event_type.includes('blocked')
      ).length;

      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const recentActivity = mappedEvents.filter(event => 
        new Date(event.created_at) > oneHourAgo
      ).length;

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
