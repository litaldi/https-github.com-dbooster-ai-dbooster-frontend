
import { supabase } from '@/integrations/supabase/client';
import { productionLogger } from '@/utils/productionLogger';

interface SecurityMetrics {
  totalSessions: number;
  activeSessions: number;
  suspiciousSessions: number;
  roleChanges: number;
  securityEvents: number;
  averageSecurityScore: number;
}

interface SecurityAlert {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  message: string;
  timestamp: string;
  metadata?: any;
}

export class SecurityDashboardEnhanced {
  private static instance: SecurityDashboardEnhanced;

  static getInstance(): SecurityDashboardEnhanced {
    if (!SecurityDashboardEnhanced.instance) {
      SecurityDashboardEnhanced.instance = new SecurityDashboardEnhanced();
    }
    return SecurityDashboardEnhanced.instance;
  }

  async getSecurityMetrics(): Promise<SecurityMetrics> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      // Get session metrics
      const { data: sessions } = await supabase
        .from('enhanced_session_tracking')
        .select('*')
        .eq('user_id', user.user.id);

      const now = new Date();
      const activeSessions = sessions?.filter(s => 
        s.status === 'active' && new Date(s.expires_at) > now
      ) || [];
      
      const suspiciousSessions = sessions?.filter(s => s.status === 'suspicious') || [];
      
      const averageSecurityScore = sessions && sessions.length > 0
        ? sessions.reduce((sum, s) => sum + (s.security_score || 0), 0) / sessions.length
        : 0;

      // Get role change metrics (last 30 days)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const { data: roleChanges } = await supabase
        .from('role_change_audit')
        .select('*')
        .gte('created_at', thirtyDaysAgo.toISOString());

      // Get security events (last 7 days)
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const { data: securityEvents } = await supabase
        .from('security_audit_log')
        .select('*')
        .eq('user_id', user.user.id)
        .gte('created_at', sevenDaysAgo.toISOString());

      return {
        totalSessions: sessions?.length || 0,
        activeSessions: activeSessions.length,
        suspiciousSessions: suspiciousSessions.length,
        roleChanges: roleChanges?.length || 0,
        securityEvents: securityEvents?.length || 0,
        averageSecurityScore
      };
    } catch (error) {
      productionLogger.error('Failed to get security metrics', error, 'SecurityDashboardEnhanced');
      throw error;
    }
  }

  async getSecurityAlerts(): Promise<SecurityAlert[]> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const alerts: SecurityAlert[] = [];

      // Check for suspicious sessions
      const { data: suspiciousSessions } = await supabase
        .from('enhanced_session_tracking')
        .select('*')
        .eq('user_id', user.user.id)
        .eq('status', 'suspicious')
        .order('created_at', { ascending: false })
        .limit(5);

      suspiciousSessions?.forEach(session => {
        alerts.push({
          id: session.id,
          severity: 'high',
          type: 'suspicious_session',
          message: 'Suspicious session activity detected',
          timestamp: session.created_at,
          metadata: {
            session_id: session.session_id,
            ip_address: session.ip_address
          }
        });
      });

      // Check for recent security events
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const { data: recentEvents } = await supabase
        .from('security_audit_log')
        .select('*')
        .eq('user_id', user.user.id)
        .gte('created_at', oneDayAgo.toISOString())
        .order('created_at', { ascending: false })
        .limit(10);

      recentEvents?.forEach(event => {
        let severity: SecurityAlert['severity'] = 'low';
        
        if (event.event_type.includes('suspicious') || event.event_type.includes('threat')) {
          severity = 'high';
        } else if (event.event_type.includes('violation') || event.event_type.includes('blocked')) {
          severity = 'medium';
        }

        alerts.push({
          id: event.id,
          severity,
          type: event.event_type,
          message: `Security event: ${event.event_type}`,
          timestamp: event.created_at,
          metadata: event.event_data
        });
      });

      return alerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (error) {
      productionLogger.error('Failed to get security alerts', error, 'SecurityDashboardEnhanced');
      throw error;
    }
  }

  async getRoleChangeHistory(): Promise<any[]> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data: roleChanges } = await supabase
        .from('role_change_audit')
        .select('*')
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      return roleChanges || [];
    } catch (error) {
      productionLogger.error('Failed to get role change history', error, 'SecurityDashboardEnhanced');
      throw error;
    }
  }

  async invalidateAllSessions(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('enhanced_session_tracking')
        .update({ status: 'revoked' })
        .eq('user_id', userId)
        .eq('status', 'active');

      if (error) throw error;

      // Log the action
      await supabase.from('security_audit_log').insert({
        user_id: userId,
        event_type: 'all_sessions_invalidated',
        event_data: { reason: 'Security action' }
      });

      productionLogger.secureInfo('All sessions invalidated', { userId });
    } catch (error) {
      productionLogger.error('Failed to invalidate sessions', error, 'SecurityDashboardEnhanced');
      throw error;
    }
  }
}

export const securityDashboardEnhanced = SecurityDashboardEnhanced.getInstance();
