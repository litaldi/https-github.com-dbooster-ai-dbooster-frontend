
import { supabase } from '@/integrations/supabase/client';
import { auditLogger } from '../auditLogger';
import { productionLogger } from '@/utils/productionLogger';

export class SessionSecurityEnhancer {
  private static instance: SessionSecurityEnhancer;
  private readonly maxConcurrentSessions = 3;
  private readonly sessionRotationInterval = 15 * 60 * 1000; // 15 minutes

  static getInstance(): SessionSecurityEnhancer {
    if (!SessionSecurityEnhancer.instance) {
      SessionSecurityEnhancer.instance = new SessionSecurityEnhancer();
    }
    return SessionSecurityEnhancer.instance;
  }

  async validateSessionIntegrity(): Promise<boolean> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return false;
      }

      // Check session age
      const sessionAge = Date.now() - new Date(session.user?.created_at || 0).getTime();
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours

      if (sessionAge > maxAge) {
        await this.invalidateSession('session_expired');
        return false;
      }

      // Check for session hijacking indicators
      const currentFingerprint = await this.getCurrentFingerprint();
      const storedFingerprint = localStorage.getItem('session_fingerprint');
      
      if (storedFingerprint && storedFingerprint !== currentFingerprint) {
        await this.invalidateSession('session_hijacking_detected');
        return false;
      }

      // Store current fingerprint if not exists
      if (!storedFingerprint) {
        localStorage.setItem('session_fingerprint', currentFingerprint);
      }

      return true;
    } catch (error) {
      productionLogger.error('Session integrity validation failed', error, 'SessionSecurityEnhancer');
      return false;
    }
  }

  async rotateSessionOnSensitiveAction(): Promise<void> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return;
      }

      // Force token refresh
      const { error } = await supabase.auth.refreshSession();
      
      if (error) {
        throw error;
      }

      await auditLogger.logSecurityEvent({
        event_type: 'session_rotation',
        event_data: {
          userId: session.user?.id,
          reason: 'sensitive_action'
        }
      });

      productionLogger.secureInfo('Session rotated for sensitive action', {
        userId: session.user?.id
      }, 'SessionSecurityEnhancer');
    } catch (error) {
      productionLogger.error('Session rotation failed', error, 'SessionSecurityEnhancer');
    }
  }

  async limitConcurrentSessions(userId: string): Promise<boolean> {
    try {
      // This would typically be implemented with a sessions table
      // For now, we'll simulate the check
      const activeSessions = await this.getActiveSessionsCount(userId);
      
      if (activeSessions >= this.maxConcurrentSessions) {
        await auditLogger.logSecurityEvent({
          event_type: 'concurrent_session_limit_exceeded',
          event_data: {
            userId,
            activeSessionsCount: activeSessions,
            maxAllowed: this.maxConcurrentSessions
          }
        });
        
        return false;
      }
      
      return true;
    } catch (error) {
      productionLogger.error('Concurrent session check failed', error, 'SessionSecurityEnhancer');
      return true; // Allow on error to avoid blocking legitimate users
    }
  }

  private async getCurrentFingerprint(): Promise<string> {
    const components = [
      navigator.userAgent,
      screen.width + 'x' + screen.height,
      Intl.DateTimeFormat().resolvedOptions().timeZone,
      navigator.language
    ];
    
    const fingerprint = components.join('|');
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    return Math.abs(hash).toString(36);
  }

  private async invalidateSession(reason: string): Promise<void> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        await auditLogger.logSecurityEvent({
          event_type: 'session_invalidated',
          event_data: {
            userId: session.user?.id,
            reason
          }
        });
      }

      await supabase.auth.signOut();
      localStorage.removeItem('session_fingerprint');
      
      productionLogger.warn('Session invalidated', { reason }, 'SessionSecurityEnhancer');
    } catch (error) {
      productionLogger.error('Session invalidation failed', error, 'SessionSecurityEnhancer');
    }
  }

  private async getActiveSessionsCount(userId: string): Promise<number> {
    // Mock implementation - in production, this would query a sessions table
    return 1;
  }
}

export const sessionSecurityEnhancer = SessionSecurityEnhancer.getInstance();
