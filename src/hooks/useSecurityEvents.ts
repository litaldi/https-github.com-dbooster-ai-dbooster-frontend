
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

export function useSecurityEvents() {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

        setEvents(data || []);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch security events';
        setError(errorMessage);
        productionLogger.error('Failed to fetch security events', err, 'useSecurityEvents');
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return { events, isLoading, error };
}
