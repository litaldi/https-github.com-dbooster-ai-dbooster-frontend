
import { productionLogger } from '@/utils/productionLogger';
import { secureStorageService } from './secureStorageService';

interface SecureDemoSession {
  id: string;
  token: string;
  createdAt: number;
  expiresAt: number;
  capabilities: string[];
  fingerprint: string;
}

class EnhancedDemoSecurity {
  private static instance: EnhancedDemoSecurity;
  private readonly DEMO_SESSION_DURATION = 60 * 60 * 1000; // 1 hour
  private readonly MAX_DEMO_SESSIONS = 5;
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
      fingerprint
    };

    this.activeDemoSessions.set(sessionId, session);
    
    // Store in secure storage with TTL
    await secureStorageService.setSecureItem(
      `demo_session_${sessionId}`, 
      session, 
      this.DEMO_SESSION_DURATION
    );

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
        return false;
      }

      // Validate device fingerprint
      const currentFingerprint = await this.generateDeviceFingerprint();
      if (session.fingerprint !== currentFingerprint) {
        productionLogger.warn('Demo session fingerprint mismatch', {
          sessionId: sessionId.substring(0, 8)
        });
        this.destroyDemoSession(sessionId);
        return false;
      }

      return true;
    } catch (error) {
      productionLogger.error('Demo session validation failed', error);
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
