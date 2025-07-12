
import { supabase } from '@/integrations/supabase/client';
import { productionLogger } from '@/utils/productionLogger';
import type { SecurityEvent } from '../types/securityEvent';
import { SecurityEventHandler } from './securityEventHandler';

export class RealtimeMonitor {
  constructor(private eventHandler: SecurityEventHandler) {}

  setupRealtimeSecurityMonitoring(): void {
    // Subscribe to security audit log changes
    supabase
      .channel('security_monitoring')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'security_audit_log'
        },
        (payload) => {
          this.eventHandler.handleSecurityEvent(payload.new as SecurityEvent);
        }
      )
      .subscribe();
  }
}
