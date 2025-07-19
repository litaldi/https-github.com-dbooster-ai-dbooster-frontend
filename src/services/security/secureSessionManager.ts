
import { supabase } from '@/integrations/supabase/client';
import { productionLogger } from '@/utils/productionLogger';

export interface SecureSession {
  id: string;
  userId: string;
  deviceFingerprint: string;
  ipAddress: string;
  userAgent: string;
  securityScore: number;
  isDemo: boolean;
  expiresAt: Date;
  encrypted: boolean;
}

export class SecureSessionManager {
  private static instance: SecureSessionManager;
  private encryptionKey: CryptoKey | null = null;

  static getInstance(): SecureSessionManager {
    if (!SecureSessionManager.instance) {
      SecureSessionManager.instance = new SecureSessionManager();
    }
    return SecureSessionManager.instance;
  }

  async initializeEncryption(): Promise<void> {
    try {
      // Generate or retrieve encryption key for session data
      const keyData = localStorage.getItem('session_key');
      if (keyData) {
        const keyBuffer = new Uint8Array(JSON.parse(keyData));
        this.encryptionKey = await crypto.subtle.importKey(
          'raw',
          keyBuffer,
          { name: 'AES-GCM' },
          false,
          ['encrypt', 'decrypt']
        );
      } else {
        this.encryptionKey = await crypto.subtle.generateKey(
          { name: 'AES-GCM', length: 256 },
          true,
          ['encrypt', 'decrypt']
        );
        
        const keyBuffer = await crypto.subtle.exportKey('raw', this.encryptionKey);
        localStorage.setItem('session_key', JSON.stringify(Array.from(new Uint8Array(keyBuffer))));
      }
    } catch (error) {
      productionLogger.error('Failed to initialize session encryption', error, 'SecureSessionManager');
    }
  }

  async createSecureSession(userId: string, isDemo: boolean = false): Promise<string> {
    try {
      await this.initializeEncryption();
      
      const sessionId = crypto.randomUUID();
      const deviceFingerprint = await this.generateDeviceFingerprint();
      const ipAddress = await this.getUserIP();
      const userAgent = navigator.userAgent;
      const securityScore = await this.calculateSecurityScore();
      const expiresAt = new Date(Date.now() + (isDemo ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000));

      // Create session in database
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

      // Store encrypted session data locally for demo sessions
      if (isDemo && this.encryptionKey) {
        const sessionData: SecureSession = {
          id: sessionId,
          userId,
          deviceFingerprint,
          ipAddress,
          userAgent,
          securityScore,
          isDemo,
          expiresAt,
          encrypted: true
        };

        const encryptedData = await this.encryptSessionData(sessionData);
        localStorage.setItem(`secure_session_${sessionId}`, encryptedData);
      }

      // Log session creation
      await this.logSecurityEvent('secure_session_created', {
        session_id: sessionId,
        is_demo: isDemo,
        security_score: securityScore,
        device_fingerprint: deviceFingerprint.substring(0, 8) + '...'
      });

      return sessionId;
    } catch (error) {
      productionLogger.error('Failed to create secure session', error, 'SecureSessionManager');
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

      // Validate session via Supabase function
      const { data, error } = await supabase.rpc('validate_session_security', {
        p_session_id: sessionId,
        p_device_fingerprint: deviceFingerprint,
        p_ip_address: ipAddress,
        p_user_agent: userAgent
      });

      if (error || !data?.valid) {
        await this.logSecurityEvent('session_validation_failed', {
          session_id: sessionId,
          reason: data?.reason || 'Unknown validation failure'
        });
        return false;
      }

      // Additional client-side validation for demo sessions
      const localSessionData = localStorage.getItem(`secure_session_${sessionId}`);
      if (localSessionData) {
        const decryptedSession = await this.decryptSessionData(localSessionData);
        if (decryptedSession && new Date() > decryptedSession.expiresAt) {
          localStorage.removeItem(`secure_session_${sessionId}`);
          return false;
        }
      }

      return true;
    } catch (error) {
      productionLogger.error('Session validation failed', error, 'SecureSessionManager');
      return false;
    }
  }

  async invalidateSession(sessionId: string): Promise<void> {
    try {
      // Remove from database
      await supabase
        .from('enhanced_session_tracking')
        .update({ status: 'invalidated' })
        .eq('session_id', sessionId);

      // Remove from local storage
      localStorage.removeItem(`secure_session_${sessionId}`);

      await this.logSecurityEvent('session_invalidated', { session_id: sessionId });
    } catch (error) {
      productionLogger.error('Failed to invalidate session', error, 'SecureSessionManager');
    }
  }

  async rotateSessionKey(): Promise<void> {
    try {
      // Generate new encryption key
      this.encryptionKey = await crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );
      
      const keyBuffer = await crypto.subtle.exportKey('raw', this.encryptionKey);
      localStorage.setItem('session_key', JSON.stringify(Array.from(new Uint8Array(keyBuffer))));

      await this.logSecurityEvent('session_key_rotated', {});
    } catch (error) {
      productionLogger.error('Failed to rotate session key', error, 'SecureSessionManager');
    }
  }

  private async encryptSessionData(sessionData: SecureSession): Promise<string> {
    if (!this.encryptionKey) {
      throw new Error('Encryption key not initialized');
    }

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encodedData = new TextEncoder().encode(JSON.stringify(sessionData));
    
    const encryptedData = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      this.encryptionKey,
      encodedData
    );

    return JSON.stringify({
      iv: Array.from(iv),
      data: Array.from(new Uint8Array(encryptedData))
    });
  }

  private async decryptSessionData(encryptedData: string): Promise<SecureSession | null> {
    try {
      if (!this.encryptionKey) {
        await this.initializeEncryption();
        if (!this.encryptionKey) return null;
      }

      const { iv, data } = JSON.parse(encryptedData);
      const decryptedData = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: new Uint8Array(iv) },
        this.encryptionKey,
        new Uint8Array(data)
      );

      const sessionData = JSON.parse(new TextDecoder().decode(decryptedData));
      sessionData.expiresAt = new Date(sessionData.expiresAt);
      
      return sessionData;
    } catch (error) {
      productionLogger.error('Failed to decrypt session data', error, 'SecureSessionManager');
      return null;
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

  private async getUserIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip || 'unknown';
    } catch {
      return 'unknown';
    }
  }

  private async logSecurityEvent(eventType: string, eventData: any): Promise<void> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      await supabase.from('comprehensive_security_log').insert({
        user_id: user.user?.id,
        event_type: eventType,
        event_category: 'session_management',
        severity: 'info',
        event_data: eventData,
        ip_address: await this.getUserIP(),
        user_agent: navigator.userAgent
      });
    } catch (error) {
      productionLogger.error('Failed to log session security event', error, 'SecureSessionManager');
    }
  }
}

export const secureSessionManager = SecureSessionManager.getInstance();
