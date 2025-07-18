import { productionLogger } from '@/utils/productionLogger';
import { secureStorageService } from './secureStorageService';
import { enhancedSecurityValidation } from './enhancedSecurityValidation';
import { automaticSecurityResponse } from './automaticSecurityResponse';

interface SecureDemoSession {
  id: string;
  token: string;
  createdAt: number;
  expiresAt: number;
  capabilities: string[];
  fingerprint: string;
  bindingToken: string; // New: for session binding
  lastValidation: number; // New: for validation tracking
}

class EnhancedDemoSecurity {
  private static instance: EnhancedDemoSecurity;
  private readonly DEMO_SESSION_DURATION = 60 * 60 * 1000; // 1 hour
  private readonly MAX_DEMO_SESSIONS = 5;
  private readonly VALIDATION_INTERVAL = 5 * 60 * 1000; // 5 minutes
  private activeDemoSessions = new Map<string, SecureDemoSession>();

  static getInstance(): EnhancedDemoSecurity {
    if (!EnhancedDemoSecurity.instance) {
      EnhancedDemoSecurity.instance = new EnhancedDemoSecurity();
    }
    return EnhancedDemoSecurity.instance;
  }

  private generateSecureToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
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

  async createSecureDemoSession(): Promise<SecureDemoSession> {
    // Check if we've exceeded max demo sessions
    if (this.activeDemoSessions.size >= this.MAX_DEMO_SESSIONS) {
      // Remove oldest session
      const oldestSession = Array.from(this.activeDemoSessions.values())
        .sort((a, b) => a.createdAt - b.createdAt)[0];
      if (oldestSession) {
        this.destroyDemoSession(oldestSession.id);
      }
    }

    const sessionId = await this.generateSecureToken();
    const token = await this.generateSecureToken();
    const bindingToken = await this.generateSecureToken(); // New: session binding
    const fingerprint = await this.generateDeviceFingerprint();
    const now = Date.now();

    const session: SecureDemoSession = {
      id: sessionId,
      token,
      createdAt: now,
      expiresAt: now + this.DEMO_SESSION_DURATION,
      capabilities: [
        'view_dashboard',
        'explore_features',
        'limited_api_access'
      ],
      fingerprint,
      bindingToken,
      lastValidation: now
    };

    this.activeDemoSessions.set(sessionId, session);
    
    // Store in secure storage with TTL
    await secureStorageService.setSecureItem(
      `demo_session_${sessionId}`, 
      session, 
      this.DEMO_SESSION_DURATION
    );

    // Store session binding separately for enhanced security
    localStorage.setItem(`session_binding_${sessionId}`, bindingToken);

    productionLogger.info('Secure demo session created', {
      sessionId: sessionId.substring(0, 8),
      capabilities: session.capabilities,
      expiresAt: session.expiresAt
    });

    return session;
  }

  async validateDemoSession(sessionId: string, token: string): Promise<boolean> {
    try {
      let session = this.activeDemoSessions.get(sessionId);
      
      // If not in memory, try to retrieve from secure storage
      if (!session) {
        session = await secureStorageService.getSecureItem<SecureDemoSession>(`demo_session_${sessionId}`);
        if (session) {
          this.activeDemoSessions.set(sessionId, session);
        }
      }

      if (!session) {
        return false;
      }

      // Enhanced validation using the new security validation service
      const validationResult = await enhancedSecurityValidation.enhancedDemoSessionValidation(
        sessionId,
        token,
        {
          requireSecureContext: true,
          checkDeviceFingerprint: true,
          validateTimestamp: true
        }
      );

      if (!validationResult.isValid) {
        // Log security incident for failed validation
        await automaticSecurityResponse.processSecurityIncident({
          type: 'session_anomaly',
          severity: validationResult.riskScore > 70 ? 'high' : 'medium',
          metadata: {
            sessionId: sessionId.substring(0, 8),
            reason: validationResult.reason,
            riskScore: validationResult.riskScore
          }
        });

        this.destroyDemoSession(sessionId);
        return false;
      }

      // Check expiration
      if (Date.now() > session.expiresAt) {
        this.destroyDemoSession(sessionId);
        return false;
      }

      // Validate token
      if (session.token !== token) {
        productionLogger.warn('Demo session token mismatch', {
          sessionId: sessionId.substring(0, 8)
        });
        
        await automaticSecurityResponse.processSecurityIncident({
          type: 'session_anomaly',
          severity: 'high',
          metadata: {
            sessionId: sessionId.substring(0, 8),
            reason: 'Token mismatch'
          }
        });
        
        return false;
      }

      // Enhanced session binding validation
      const storedBinding = localStorage.getItem(`session_binding_${sessionId}`);
      if (!storedBinding || storedBinding !== session.bindingToken) {
        productionLogger.warn('Demo session binding validation failed', {
          sessionId: sessionId.substring(0, 8)
        });
        
        await automaticSecurityResponse.processSecurityIncident({
          type: 'session_anomaly',
          severity: 'critical',
          metadata: {
            sessionId: sessionId.substring(0, 8),
            reason: 'Session binding failure - possible session fixation attack'
          }
        });
        
        this.destroyDemoSession(sessionId);
        return false;
      }

      // Periodic validation check
      const timeSinceLastValidation = Date.now() - session.lastValidation;
      if (timeSinceLastValidation > this.VALIDATION_INTERVAL) {
        session.lastValidation = Date.now();
        
        // Re-validate device fingerprint
        const currentFingerprint = await this.generateDeviceFingerprint();
        if (session.fingerprint !== currentFingerprint) {
          productionLogger.warn('Demo session fingerprint changed during session', {
            sessionId: sessionId.substring(0, 8)
          });
          
          await automaticSecurityResponse.processSecurityIncident({
            type: 'session_anomaly',
            severity: 'high',
            metadata: {
              sessionId: sessionId.substring(0, 8),
              reason: 'Device fingerprint changed mid-session'
            }
          });
          
          this.destroyDemoSession(sessionId);
          return false;
        }
      }

      return true;
    } catch (error) {
      productionLogger.error('Demo session validation failed', error);
      
      await automaticSecurityResponse.processSecurityIncident({
        type: 'session_anomaly',
        severity: 'medium',
        metadata: {
          sessionId: sessionId.substring(0, 8),
          reason: 'Validation error',
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      });
      
      return false;
    }
  }

  getDemoSessionCapabilities(sessionId: string): string[] {
    const session = this.activeDemoSessions.get(sessionId);
    return session?.capabilities || [];
  }

  hasCapability(sessionId: string, capability: string): boolean {
    const capabilities = this.getDemoSessionCapabilities(sessionId);
    return capabilities.includes(capability);
  }

  async destroyDemoSession(sessionId: string): Promise<void> {
    this.activeDemoSessions.delete(sessionId);
    secureStorageService.removeSecureItem(`demo_session_${sessionId}`);
    localStorage.removeItem(`session_binding_${sessionId}`);
    
    productionLogger.info('Demo session destroyed', {
      sessionId: sessionId.substring(0, 8)
    });
  }

  getDemoSessionStats(): {
    activeSessions: number;
    totalCapabilities: number;
    oldestSession?: number;
    newestSession?: number;
  } {
    const sessions = Array.from(this.activeDemoSessions.values());
    
    return {
      activeSessions: sessions.length,
      totalCapabilities: [...new Set(sessions.flatMap(s => s.capabilities))].length,
      oldestSession: sessions.length > 0 ? Math.min(...sessions.map(s => s.createdAt)) : undefined,
      newestSession: sessions.length > 0 ? Math.max(...sessions.map(s => s.createdAt)) : undefined
    };
  }

  cleanupExpiredSessions(): void {
    const now = Date.now();
    const expiredSessions: string[] = [];

    for (const [sessionId, session] of this.activeDemoSessions.entries()) {
      if (now > session.expiresAt) {
        expiredSessions.push(sessionId);
      }
    }

    expiredSessions.forEach(sessionId => {
      this.destroyDemoSession(sessionId);
    });

    if (expiredSessions.length > 0) {
      productionLogger.info(`Cleaned up ${expiredSessions.length} expired demo sessions`);
    }
  }
}

export const enhancedDemoSecurity = EnhancedDemoSecurity.getInstance();

// Setup periodic cleanup
setInterval(() => {
  enhancedDemoSecurity.cleanupExpiredSessions();
}, 5 * 60 * 1000); // Run cleanup every 5 minutes
