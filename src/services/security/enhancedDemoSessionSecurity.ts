
import { productionLogger } from '@/utils/productionLogger';
import { supabase } from '@/integrations/supabase/client';

interface SecureSessionToken {
  id: string;
  token: string;
  expiresAt: number;
  deviceFingerprint: string;
  serverValidated: boolean;
  securityScore: number;
}

interface SessionValidationResult {
  isValid: boolean;
  reason?: string;
  requiresRevalidation: boolean;
  securityLevel: 'low' | 'medium' | 'high';
}

class EnhancedDemoSessionSecurity {
  private static instance: EnhancedDemoSessionSecurity;
  private readonly SESSION_DURATION = 2 * 60 * 60 * 1000; // 2 hours
  private readonly MAX_SESSIONS_PER_IP = 3;

  static getInstance(): EnhancedDemoSessionSecurity {
    if (!EnhancedDemoSessionSecurity.instance) {
      EnhancedDemoSessionSecurity.instance = new EnhancedDemoSessionSecurity();
    }
    return EnhancedDemoSessionSecurity.instance;
  }

  async createSecureDemoSession(): Promise<SecureSessionToken> {
    try {
      const sessionId = await this.generateSecureSessionId();
      const deviceFingerprint = await this.generateEnhancedDeviceFingerprint();
      const securityScore = await this.calculateSecurityScore();
      
      // Create session via secure edge function
      const { data, error } = await supabase.functions.invoke('secure-demo-session', {
        body: {
          action: 'create',
          sessionId,
          deviceFingerprint,
          securityScore,
          userAgent: navigator.userAgent
        }
      });

      if (error || !data?.token) {
        throw new Error('Failed to create secure demo session');
      }

      const session: SecureSessionToken = {
        id: sessionId,
        token: data.token,
        expiresAt: Date.now() + this.SESSION_DURATION,
        deviceFingerprint,
        serverValidated: true,
        securityScore
      };

      // Store only essential client-side validation data
      this.storeClientValidationData(sessionId, deviceFingerprint);

      productionLogger.secureInfo('Secure demo session created', {
        sessionId: sessionId.substring(0, 8),
        securityScore
      });

      return session;
    } catch (error) {
      productionLogger.error('Failed to create secure demo session', error, 'EnhancedDemoSessionSecurity');
      throw error;
    }
  }

  async validateDemoSession(sessionId: string, token: string): Promise<SessionValidationResult> {
    try {
      // Server-side validation via edge function
      const { data, error } = await supabase.functions.invoke('secure-demo-session', {
        body: {
          action: 'validate',
          sessionId,
          token,
          deviceFingerprint: await this.generateEnhancedDeviceFingerprint(),
          userAgent: navigator.userAgent
        }
      });

      if (error) {
        productionLogger.warn('Demo session validation failed', { sessionId: sessionId.substring(0, 8), error });
        return {
          isValid: false,
          reason: 'Validation service error',
          requiresRevalidation: true,
          securityLevel: 'low'
        };
      }

      if (!data?.valid) {
        return {
          isValid: false,
          reason: data?.reason || 'Invalid session',
          requiresRevalidation: true,
          securityLevel: 'low'
        };
      }

      // Additional client-side verification
      const clientValidation = this.validateClientSideData(sessionId);
      if (!clientValidation.valid) {
        return {
          isValid: false,
          reason: clientValidation.reason,
          requiresRevalidation: true,
          securityLevel: 'medium'
        };
      }

      return {
        isValid: true,
        securityLevel: data.securityLevel || 'medium',
        requiresRevalidation: false
      };
    } catch (error) {
      productionLogger.error('Demo session validation error', error, 'EnhancedDemoSessionSecurity');
      return {
        isValid: false,
        reason: 'Validation error',
        requiresRevalidation: true,
        securityLevel: 'low'
      };
    }
  }

  private async generateSecureSessionId(): Promise<string> {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  private async generateEnhancedDeviceFingerprint(): Promise<string> {
    const components = [
      navigator.userAgent,
      screen.width + 'x' + screen.height + 'x' + screen.colorDepth,
      navigator.language,
      navigator.languages?.join(',') || '',
      Intl.DateTimeFormat().resolvedOptions().timeZone,
      navigator.hardwareConcurrency?.toString() || '0',
      navigator.platform || 'unknown',
      navigator.cookieEnabled.toString()
    ];

    // Add WebGL fingerprint if available
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        const renderer = gl.getParameter(gl.RENDERER);
        const vendor = gl.getParameter(gl.VENDOR);
        components.push(`${vendor}|${renderer}`);
      }
    } catch {
      components.push('webgl_unavailable');
    }

    const combined = components.join('|');
    const encoder = new TextEncoder();
    const data = encoder.encode(combined);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private async calculateSecurityScore(): Promise<number> {
    let score = 50; // Base score

    // Protocol security
    if (location.protocol === 'https:') score += 20;
    
    // Browser security features
    if ('crypto' in window && 'subtle' in crypto) score += 15;
    if (window.isSecureContext) score += 10;
    if ('serviceWorker' in navigator) score += 5;

    return Math.min(score, 100);
  }

  private storeClientValidationData(sessionId: string, fingerprint: string): void {
    const validationData = {
      sessionId,
      fingerprint: fingerprint.substring(0, 16), // Only store partial fingerprint
      timestamp: Date.now(),
      checksum: this.generateChecksum(sessionId, fingerprint)
    };

    try {
      localStorage.setItem('demo_validation', JSON.stringify(validationData));
    } catch (error) {
      productionLogger.warn('Failed to store client validation data', error, 'EnhancedDemoSessionSecurity');
    }
  }

  private validateClientSideData(sessionId: string): { valid: boolean; reason?: string } {
    try {
      const storedData = localStorage.getItem('demo_validation');
      if (!storedData) {
        return { valid: false, reason: 'No client validation data' };
      }

      const parsed = JSON.parse(storedData);
      if (parsed.sessionId !== sessionId) {
        return { valid: false, reason: 'Session ID mismatch' };
      }

      // Validate checksum
      const expectedChecksum = this.generateChecksum(sessionId, parsed.fingerprint);
      if (parsed.checksum !== expectedChecksum) {
        return { valid: false, reason: 'Validation data tampered' };
      }

      return { valid: true };
    } catch {
      return { valid: false, reason: 'Invalid validation data format' };
    }
  }

  private generateChecksum(sessionId: string, fingerprint: string): string {
    // Simple checksum for tamper detection
    const combined = `${sessionId}${fingerprint}${Date.now().toString().slice(0, -3)}`;
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(36);
  }

  async revokeDemoSession(sessionId: string): Promise<void> {
    try {
      await supabase.functions.invoke('secure-demo-session', {
        body: {
          action: 'revoke',
          sessionId
        }
      });

      localStorage.removeItem('demo_validation');
      productionLogger.info('Demo session revoked', { sessionId: sessionId.substring(0, 8) });
    } catch (error) {
      productionLogger.error('Failed to revoke demo session', error, 'EnhancedDemoSessionSecurity');
    }
  }
}

export const enhancedDemoSessionSecurity = EnhancedDemoSessionSecurity.getInstance();
