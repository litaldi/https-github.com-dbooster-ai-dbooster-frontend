
import { supabase } from '@/integrations/supabase/client';
import { productionLogger } from '@/utils/productionLogger';
import { secureStorageService } from './secureStorageService';

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

interface SessionValidationResponse {
  valid: boolean;
  reason?: string;
  securityScore?: number;
}

export class SecureSessionManager {
  private static instance: SecureSessionManager;

  static getInstance(): SecureSessionManager {
    if (!SecureSessionManager.instance) {
      SecureSessionManager.instance = new SecureSessionManager();
    }
    return SecureSessionManager.instance;
  }

  async createSecureSession(userId: string, isDemo: boolean = false): Promise<string> {
    try {
      // Initialize secure storage
      await secureStorageService.initialize();
      
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

      // Store session data using secure storage instead of localStorage
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

      await secureStorageService.setSecureItem(`session_${sessionId}`, sessionData);

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

      if (error) {
        await this.logSecurityEvent('session_validation_failed', {
          session_id: sessionId,
          reason: 'Database validation error',
          error: error.message
        });
        return false;
      }

      // Safely parse the response data with proper type checking
      let validationResponse: SessionValidationResponse;
      
      try {
        // Handle different response formats from Supabase RPC
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          // Check if the object has the expected structure
          const responseObj = data as Record<string, unknown>;
          if (typeof responseObj.valid === 'boolean') {
            validationResponse = {
              valid: responseObj.valid,
              reason: typeof responseObj.reason === 'string' ? responseObj.reason : undefined,
              securityScore: typeof responseObj.security_score === 'number' ? responseObj.security_score : undefined
            };
          } else {
            validationResponse = { valid: false, reason: 'Invalid response structure' };
          }
        } else {
          // If data is not in expected format, treat as invalid
          validationResponse = { valid: false, reason: 'Invalid response format' };
        }
      } catch (parseError) {
        await this.logSecurityEvent('session_validation_failed', {
          session_id: sessionId,
          reason: 'Response parsing error'
        });
        return false;
      }
      
      if (!validationResponse?.valid) {
        await this.logSecurityEvent('session_validation_failed', {
          session_id: sessionId,
          reason: validationResponse?.reason || 'Unknown validation failure'
        });
        return false;
      }

      // Additional client-side validation using secure storage
      const localSessionData = await secureStorageService.getSecureItem<SecureSession>(`session_${sessionId}`);
      if (localSessionData && new Date() > new Date(localSessionData.expiresAt)) {
        await secureStorageService.removeSecureItem(`session_${sessionId}`);
        return false;
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

      // Remove from secure storage
      await secureStorageService.removeSecureItem(`session_${sessionId}`);

      await this.logSecurityEvent('session_invalidated', { session_id: sessionId });
    } catch (error) {
      productionLogger.error('Failed to invalidate session', error, 'SecureSessionManager');
    }
  }

  async rotateSessionKey(): Promise<void> {
    try {
      // Rotate the encryption key in secure storage
      await secureStorageService.rotateEncryptionKey();

      await this.logSecurityEvent('session_key_rotated', {});
    } catch (error) {
      productionLogger.error('Failed to rotate session key', error, 'SecureSessionManager');
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
