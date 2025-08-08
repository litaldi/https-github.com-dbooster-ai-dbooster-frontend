
import { supabase } from '@/integrations/supabase/client';
import { productionLogger } from '@/utils/productionLogger';
import { enhancedRoleManager } from '../enhancedRoleManager';

export class EnhancedAuthenticationService {
  private static instance: EnhancedAuthenticationService;

  static getInstance(): EnhancedAuthenticationService {
    if (!EnhancedAuthenticationService.instance) {
      EnhancedAuthenticationService.instance = new EnhancedAuthenticationService();
    }
    return EnhancedAuthenticationService.instance;
  }

  async createSecureSession(userId: string, isDemo: boolean = false): Promise<string> {
    try {
      const sessionId = crypto.randomUUID();
      const deviceFingerprint = await this.generateDeviceFingerprint();
      const ipAddress = await this.getUserIP();
      const userAgent = navigator.userAgent;
      const securityScore = await this.calculateSecurityScore();
      const expiresAt = new Date(Date.now() + (isDemo ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000));

      const { error } = await supabase
        .from('enhanced_session_tracking')
        .insert({
          user_id: userId,
          session_id: sessionId,
          device_fingerprint: deviceFingerprint,
          ip_address: ipAddress,
          user_agent: userAgent,
          is_demo: isDemo,
          security_score: securityScore,
          expires_at: expiresAt.toISOString()
        });

      if (error) {
        throw error;
      }

      // Log session creation
      await this.logSecurityEvent('session_created', {
        session_id: sessionId,
        is_demo: isDemo,
        security_score: securityScore
      });

      return sessionId;
    } catch (error) {
      productionLogger.error('Failed to create secure session', error, 'EnhancedAuthenticationService');
      throw error;
    }
  }

  async validateSession(sessionId: string): Promise<boolean> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return false;

      const deviceFingerprint = await this.generateDeviceFingerprint();
      const ipAddress = await this.getUserIP();
      const userAgent = navigator.userAgent;

      // Call the secure session validation edge function
      const { data, error } = await supabase.functions.invoke('secure-session-validation', {
        body: {
          sessionId,
          deviceFingerprint,
          ipAddress,
          userAgent
        }
      });

      if (error || !data.valid) {
        if (data?.reason) {
          await this.logSecurityEvent('session_validation_failed', {
            session_id: sessionId,
            reason: data.reason
          });
        }
        return false;
      }

      return true;
    } catch (error) {
      productionLogger.error('Session validation failed', error, 'EnhancedAuthenticationService');
      return false;
    }
  }

  async assignUserRole(targetUserId: string, newRole: string, reason?: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke('secure-role-assignment', {
        body: {
          targetUserId,
          newRole,
          reason
        }
      });

      if (error || !data.success) {
        throw new Error(data?.error || 'Role assignment failed');
      }

      return true;
    } catch (error) {
      productionLogger.error('Role assignment failed', error, 'EnhancedAuthenticationService');
      throw error;
    }
  }

  async detectSuspiciousActivity(userId: string): Promise<boolean> {
    try {
      // Check for suspicious sessions
      const { data: suspiciousSessions } = await supabase
        .from('enhanced_session_tracking')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'suspicious');

      if (suspiciousSessions && suspiciousSessions.length > 0) {
        await this.logSecurityEvent('suspicious_activity_detected', {
          user_id: userId,
          suspicious_sessions: suspiciousSessions.length
        });
        return true;
      }

      // Check for multiple active sessions from different IPs
      const { data: activeSessions } = await supabase
        .from('enhanced_session_tracking')
        .select('ip_address')
        .eq('user_id', userId)
        .eq('status', 'active')
        .gte('expires_at', new Date().toISOString());

      if (activeSessions) {
        const uniqueIPs = new Set(activeSessions.map(s => s.ip_address)).size;
        if (uniqueIPs > 3) {
          await this.logSecurityEvent('multiple_ip_access', {
            user_id: userId,
            unique_ips: uniqueIPs
          });
          return true;
        }
      }

      return false;
    } catch (error) {
      productionLogger.error('Suspicious activity detection failed', error, 'EnhancedAuthenticationService');
      return false;
    }
  }

  private async generateDeviceFingerprint(): Promise<string> {
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset().toString(),
      navigator.hardwareConcurrency?.toString() || '0'
    ];

    const fingerprint = components.join('|');
    const encoder = new TextEncoder();
    const data = encoder.encode(fingerprint);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private async getUserIP(): Promise<string> {
    // Avoid client-side IP lookups for privacy; IP is captured server-side where needed
    return 'unknown';
  }

  private async calculateSecurityScore(): Promise<number> {
    let score = 50; // Base score

    // HTTPS bonus
    if (location.protocol === 'https:') score += 20;

    // Modern browser features
    if ('crypto' in window && 'subtle' in crypto) score += 15;
    if ('serviceWorker' in navigator) score += 10;
    if (window.isSecureContext) score += 5;

    return Math.min(score, 100);
  }

  private async logSecurityEvent(eventType: string, eventData: any): Promise<void> {
    try {
      const { data: user } = await supabase.auth.getUser();
      await supabase.from('security_audit_log').insert({
        user_id: user.user?.id,
        event_type: eventType,
        event_data: eventData,
        ip_address: await this.getUserIP(),
        user_agent: navigator.userAgent
      });
    } catch (error) {
      productionLogger.error('Failed to log security event', error, 'EnhancedAuthenticationService');
    }
  }
}

export const enhancedAuthenticationService = EnhancedAuthenticationService.getInstance();
