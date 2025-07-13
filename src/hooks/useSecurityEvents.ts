
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { productionLogger } from '@/utils/productionLogger';

export interface SecurityEvent {
  id: string;
  event_type: string;
  created_at: string;
  user_id?: string;
  ip_address?: string;
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('security_audit_log')
        .select('id, event_type, created_at, user_id, ip_address')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        throw error;
      }

      // Fix type issue by ensuring ip_address is properly typed
      const typedEvents: SecurityEvent[] = (data || []).map(event => ({
        id: event.id,
        event_type: event.event_type,
        created_at: event.created_at,
        user_id: event.user_id || undefined,
        ip_address: event.ip_address ? String(event.ip_address) : undefined
      }));

      setEvents(typedEvents);

      // Calculate stats
      const now = new Date();
      const hourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      
      setStats({
        totalEvents: typedEvents.length,
        securityViolations: typedEvents.filter(e => 
          e.event_type.includes('violation') || 
          e.event_type.includes('threat') || 
          e.event_type.includes('suspicious')
        ).length,
        rateLimitHits: typedEvents.filter(e => 
          e.event_type.includes('rate_limit') || 
          e.event_type.includes('blocked')
        ).length,
        recentActivity: typedEvents.filter(e => 
          new Date(e.created_at) > hourAgo
        ).length
      });

      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch security events';
      setError(errorMessage);
      productionLogger.error('Failed to fetch security events', err, 'useSecurityEvents');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const refreshEvents = async () => {
    await fetchEvents();
  };

  return { 
    events, 
    stats, 
    isLoading, 
    loading: isLoading, // Add alias for backward compatibility
    error: error || '',
    refreshEvents 
  };
}
