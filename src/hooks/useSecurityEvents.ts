
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type SecurityAuditLog = Database['public']['Tables']['security_audit_log']['Row'];

interface SecurityEvent {
  id: string;
  event_type: string;
  event_data: any;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

interface SecurityStats {
  totalEvents: number;
  securityViolations: number;
  rateLimitHits: number;
  recentActivity: number;
}

export function useSecurityEvents() {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<SecurityStats>({
    totalEvents: 0,
    securityViolations: 0,
    rateLimitHits: 0,
    recentActivity: 0
  });

  const loadSecurityEvents = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      // Get recent security events
      const { data: recentEvents } = await supabase
        .from('security_audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (recentEvents) {
        // Transform the data to match our SecurityEvent interface
        const transformedEvents: SecurityEvent[] = recentEvents.map((event: SecurityAuditLog) => ({
          id: event.id,
          event_type: event.event_type,
          event_data: event.event_data,
          ip_address: event.ip_address as string | null,
          user_agent: event.user_agent,
          created_at: event.created_at || new Date().toISOString()
        }));

        setEvents(transformedEvents);
        
        // Calculate stats
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const recentActivity = transformedEvents.filter(
          e => new Date(e.created_at) > oneHourAgo
        ).length;
        
        const securityViolations = transformedEvents.filter(
          e => e.event_type.includes('violation') || 
               e.event_type.includes('suspicious') ||
               e.event_type.includes('failure')
        ).length;
        
        const rateLimitHits = transformedEvents.filter(
          e => e.event_type.includes('rate_limit')
        ).length;

        setStats({
          totalEvents: transformedEvents.length,
          securityViolations,
          rateLimitHits,
          recentActivity
        });
      }
    } catch (error) {
      console.error('Failed to load security events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSecurityEvents();
  }, []);

  return {
    events,
    stats,
    loading,
    refreshEvents: loadSecurityEvents
  };
}
