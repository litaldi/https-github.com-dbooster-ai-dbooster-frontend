
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useDebounce } from '@/hooks/useDebounce';

interface SecurityEvent {
  id: string;
  event_type: string;
  event_data: any;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  user_id: string | null;
}

interface SecurityStats {
  totalEvents: number;
  securityViolations: number;
  rateLimitHits: number;
  recentActivity: number;
}

export function useSecurityEvents(refreshInterval = 30000) {
  const [limit, setLimit] = useState(50);
  const [filter, setFilter] = useState<string>('');
  const debouncedFilter = useDebounce(filter, 300);

  const fetchSecurityEvents = useCallback(async (): Promise<SecurityEvent[]> => {
    try {
      let query = supabase
        .from('security_audit_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (debouncedFilter) {
        query = query.ilike('event_type', `%${debouncedFilter}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching security events:', error);
        throw error;
      }

      // Transform the data to match our SecurityEvent interface
      return (data || []).map(item => ({
        id: item.id,
        event_type: item.event_type,
        event_data: item.event_data,
        ip_address: item.ip_address ? String(item.ip_address) : null,
        user_agent: item.user_agent,
        created_at: item.created_at,
        user_id: item.user_id
      }));
    } catch (error) {
      console.error('Failed to fetch security events:', error);
      return [];
    }
  }, [limit, debouncedFilter]);

  const {
    data: events = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['security-events', limit, debouncedFilter],
    queryFn: fetchSecurityEvents,
    refetchInterval: refreshInterval,
    staleTime: 10000, // Consider data stale after 10 seconds
    retry: 3,
  });

  const stats = useMemo((): SecurityStats => {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    const recentEvents = events.filter(event => 
      new Date(event.created_at) > oneHourAgo
    );

    const securityViolations = events.filter(event =>
      event.event_type.includes('violation') || 
      event.event_type.includes('suspicious') ||
      event.event_type.includes('failure')
    ).length;

    const rateLimitHits = events.filter(event =>
      event.event_type.includes('rate_limit')
    ).length;

    return {
      totalEvents: events.length,
      securityViolations,
      rateLimitHits,
      recentActivity: recentEvents.length,
    };
  }, [events]);

  const refreshEvents = useCallback(() => {
    refetch();
  }, [refetch]);

  const updateLimit = useCallback((newLimit: number) => {
    setLimit(newLimit);
  }, []);

  const updateFilter = useCallback((newFilter: string) => {
    setFilter(newFilter);
  }, []);

  return {
    events,
    stats,
    loading: isLoading,
    error,
    refreshEvents,
    updateLimit,
    updateFilter,
    filter,
  };
}
