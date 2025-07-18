
import { supabase } from '@/integrations/supabase/client';
import { productionLogger } from '@/utils/productionLogger';

interface SessionValidationResult {
  valid: boolean;
  reason?: string;
  securityScore: number;
  suspicious: boolean;
}

interface SecureSessionMetadata {
  sessionId: string;
  deviceFingerprint: string;
  ipAddress: string;
  userAgent: string;
  securityScore: number;
}

class SecureSessionManager {
  private static instance: SecureSessionManager;
  private currentSessionMetadata: SecureSessionMetadata | null = null;

  static getInstance(): SecureSessionManager {
    if (!SecureSessionManager.instance) {
      SecureSessionManager.instance = new SecureSessionManager();
    }
    return SecureSessionManager.instance;
  }

  async createSecureSession(userId: string, isDemo: boolean = false): Promise<string | null> {
    try {
      const sessionId = crypto.randomUUID();
      const deviceFingerprint = await this.generateDeviceFingerprint();
      const ipAddress = await this.getUserIP();
      const userAgent = navigator.userAgent;

      const { error } = await supabase
        .from('secure_session_validation')
        .insert({
          session_id: sessionId,
          user_id: userId,
          device_fingerprint: deviceFingerprint,
          ip_address: ipAddress,
          user_agent: userAgent,
          security_score: await this.calculateInitialSecurityScore()
        });

      if (error) {
        productionLogger.error('Failed to create secure session', error, 'SecureSessionManager');
        return null;
      }

      this.currentSessionMetadata = {
        sessionId,
        deviceFingerprint,
        ipAddress,
        userAgent,
        securityScore: await this.calculateInitialSecurityScore()
      };

      productionLogger.secureInfo('Secure session created', {
        session_id: sessionId.substring(0, 8),
        security_score: this.currentSessionMetadata.securityScore
      });

      return sessionId;
    } catch (error) {
      productionLogger.error('Error creating secure session', error, 'SecureSessionManager');
      return null;
    }
  }

  async validateSession(sessionId: string): Promise<boolean> {
    try {
      const validation = await this.validateCurrentSession();
      return validation.valid;
    } catch (error) {
      productionLogger.error('Session validation failed', error, 'SecureSessionManager');
      return false;
    }
  }

  async initializeSecureSession(userId: string): Promise<string | null> {
    try {
      const sessionId = crypto.randomUUID();
      const deviceFingerprint = await this.generateDeviceFingerprint();
      const ipAddress = await this.getUserIP();
      const userAgent = navigator.userAgent;

      const { error } = await supabase
        .from('secure_session_validation')
        .insert({
          session_id: sessionId,
          user_id: userId,
          device_fingerprint: deviceFingerprint,
          ip_address: ipAddress,
          user_agent: userAgent,
          security_score: await this.calculateInitialSecurityScore()
        });

      if (error) {
        productionLogger.error('Failed to initialize secure session', error, 'SecureSessionManager');
        return null;
      }

      this.currentSessionMetadata = {
        sessionId,
        deviceFingerprint,
        ipAddress,
        userAgent,
        securityScore: await this.calculateInitialSecurityScore()
      };

      productionLogger.secureInfo('Secure session initialized', {
        session_id: sessionId.substring(0, 8),
        security_score: this.currentSessionMetadata.securityScore
      });

      return sessionId;
    } catch (error) {
      productionLogger.error('Error initializing secure session', error, 'SecureSessionManager');
      return null;
    }
  }

  async validateCurrentSession(): Promise<SessionValidationResult> {
    if (!this.currentSessionMetadata) {
      return {
        valid: false,
        reason: 'No active session metadata',
        securityScore: 0,
        suspicious: true
      };
    }

    try {
      const currentFingerprint = await this.generateDeviceFingerprint();
      const currentIP = await this.getUserIP();
      const currentUserAgent = navigator.userAgent;

      const { data, error } = await supabase.rpc('validate_session_security', {
        p_session_id: this.currentSessionMetadata.sessionId,
        p_device_fingerprint: currentFingerprint,
        p_ip_address: currentIP,
        p_user_agent: currentUserAgent
      });

      if (error) {
        productionLogger.error('Session validation failed', error, 'SecureSessionManager');
        return {
          valid: false,
          reason: 'Validation error',
          securityScore: 0,
          suspicious: true
        };
      }

      // Type-safe handling of database response
      const result = data as unknown as SessionValidationResult;
      
      if (!result.valid || result.suspicious) {
        productionLogger.warn('Session security issue detected', {
          session_id: this.currentSessionMetadata.sessionId.substring(0, 8),
          reason: result.reason,
          security_score: result.securityScore
        });
      }

      return result;
    } catch (error) {
      productionLogger.error('Error validating session', error, 'SecureSessionManager');
      return {
        valid: false,
        reason: 'Unexpected validation error',
        securityScore: 0,
        suspicious: true
      };
    }
  }

  async invalidateSession(sessionId?: string): Promise<void> {
    const targetSessionId = sessionId || this.currentSessionMetadata?.sessionId;
    
    if (!targetSessionId) {
      return;
    }

    try {
      await supabase
        .from('secure_session_validation')
        .update({ is_validated: false })
        .eq('session_id', targetSessionId);

      if (this.currentSessionMetadata?.sessionId === targetSessionId) {
        this.currentSessionMetadata = null;
      }

      productionLogger.info('Session invalidated', {
        session_id: targetSessionId.substring(0, 8)
      });
    } catch (error) {
      productionLogger.error('Error invalidating session', error, 'SecureSessionManager');
    }
  }

  private async generateDeviceFingerprint(): Promise<string> {
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset().toString(),
      navigator.hardwareConcurrency?.toString() || '0',
      navigator.platform
    ];

    const fingerprint = components.join('|');
    const encoder = new TextEncoder();
    const data = encoder.encode(fingerprint);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
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

  private async calculateInitialSecurityScore(): Promise<number> {
    let score = 50; // Base score

    // HTTPS bonus
    if (location.protocol === 'https:') score += 20;

    // Modern browser features
    if ('crypto' in window && 'subtle' in crypto) score += 15;
    if ('serviceWorker' in navigator) score += 10;
    if (window.isSecureContext) score += 5;

    return Math.min(score, 100);
  }
}

export const secureSessionManager = SecureSessionManager.getInstance();
