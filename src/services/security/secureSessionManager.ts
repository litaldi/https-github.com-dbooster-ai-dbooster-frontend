
import { supabase } from '@/integrations/supabase/client';
import { productionLogger } from '@/utils/productionLogger';

interface SessionValidationResult {
  valid: boolean;
  securityScore: number;
  reason?: string;
}

interface SecureSession {
  sessionId: string;
  deviceFingerprint: string;
  expiresAt: Date;
  securityScore: number;
}

class SecureSessionManager {
  private static instance: SecureSessionManager;
  private currentSession: SecureSession | null = null;

  static getInstance(): SecureSessionManager {
    if (!SecureSessionManager.instance) {
      SecureSessionManager.instance = new SecureSessionManager();
    }
    return SecureSessionManager.instance;
  }

  async initializeSecureSession(userId: string): Promise<string | null> {
    try {
      const deviceFingerprint = await this.generateDeviceFingerprint();
      const sessionId = this.generateSecureSessionId();
      
      const { error } = await supabase
        .from('secure_session_validation')
        .insert({
          user_id: userId,
          session_id: sessionId,
          device_fingerprint: deviceFingerprint,
          ip_address: await this.getUserIP(),
          user_agent: navigator.userAgent,
          security_score: 80, // Initial score
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        });

      if (error) {
        productionLogger.error('Failed to initialize secure session', error, 'SecureSessionManager');
        return null;
      }

      this.currentSession = {
        sessionId,
        deviceFingerprint,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        securityScore: 80
      };

      productionLogger.info('Secure session initialized', {
        sessionId: sessionId.substring(0, 8),
        securityScore: 80
      });

      return sessionId;
    } catch (error) {
      productionLogger.error('Error initializing secure session', error, 'SecureSessionManager');
      return null;
    }
  }

  async validateCurrentSession(): Promise<SessionValidationResult> {
    if (!this.currentSession) {
      return {
        valid: false,
        securityScore: 0,
        reason: 'No active session'
      };
    }

    try {
      const response = await fetch('/functions/v1/secure-session-validation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          sessionId: this.currentSession.sessionId,
          deviceFingerprint: this.currentSession.deviceFingerprint
        })
      });

      if (!response.ok) {
        return {
          valid: false,
          securityScore: 0,
          reason: 'Session validation failed'
        };
      }

      const result = await response.json();
      
      // Update current session with new security score
      this.currentSession.securityScore = result.security_score || 0;

      return {
        valid: result.valid,
        securityScore: result.security_score || 0,
        reason: result.reason
      };
    } catch (error) {
      productionLogger.error('Session validation error', error, 'SecureSessionManager');
      return {
        valid: false,
        securityScore: 0,
        reason: 'Validation error'
      };
    }
  }

  private async generateDeviceFingerprint(): Promise<string> {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('Security fingerprint', 2, 2);
      }
      
      const fingerprint = [
        navigator.userAgent,
        navigator.language,
        screen.width + 'x' + screen.height,
        Intl.DateTimeFormat().resolvedOptions().timeZone,
        canvas.toDataURL()
      ].join('|');

      // Simple hash function
      let hash = 0;
      for (let i = 0; i < fingerprint.length; i++) {
        const char = fingerprint.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32-bit integer
      }
      
      return Math.abs(hash).toString(16);
    } catch (error) {
      // Fallback fingerprint
      return 'fallback_' + Date.now().toString(16);
    }
  }

  private generateSecureSessionId(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  private async getUserIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip || 'unknown';
    } catch {
      return 'unknown';
    }
  }

  getCurrentSession(): SecureSession | null {
    return this.currentSession;
  }

  clearSession(): void {
    this.currentSession = null;
  }
}

export const secureSessionManager = SecureSessionManager.getInstance();
