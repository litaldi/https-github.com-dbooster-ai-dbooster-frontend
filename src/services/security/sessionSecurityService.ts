
import { supabase } from '@/integrations/supabase/client';
import { auditLogger } from '../auditLogger';
import { productionLogger } from '@/utils/productionLogger';

export class SessionSecurityService {
  private static instance: SessionSecurityService;

  static getInstance(): SessionSecurityService {
    if (!SessionSecurityService.instance) {
      SessionSecurityService.instance = new SessionSecurityService();
    }
    return SessionSecurityService.instance;
  }

  async validateSessionSecurity(): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return false;
      }

      // Check session age (24 hours max)
      const sessionAge = Date.now() - new Date(session.user?.created_at || 0).getTime();
      const maxSessionAge = 24 * 60 * 60 * 1000; // 24 hours

      if (sessionAge > maxSessionAge) {
        await auditLogger.logSecurityEvent({
          event_type: 'session_expired',
          event_data: {
            userId: session.user?.id,
            sessionAge: Math.floor(sessionAge / 1000 / 60) // minutes
          }
        });
        return false;
      }

      return true;
    } catch (error) {
      productionLogger.error('Session security validation failed', error, 'SessionSecurityService');
      return false;
    }
  }
}

export const sessionSecurityService = SessionSecurityService.getInstance();
