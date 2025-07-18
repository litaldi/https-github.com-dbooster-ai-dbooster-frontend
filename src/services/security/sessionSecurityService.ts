
import { productionLogger } from '@/utils/productionLogger';

interface SessionMetadata {
  deviceFingerprint: string;
  lastActivity: number;
  createdAt: number;
  ipAddress: string;
  userAgent: string;
  securityScore: number;
}

interface DemoSession {
  id: string;
  token: string;
  expiresAt: number;
  metadata: SessionMetadata;
}

class SessionSecurityService {
  private static instance: SessionSecurityService;
  private readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  private readonly DEMO_SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hour
  private activeSessions = new Map<string, SessionMetadata>();

  static getInstance(): SessionSecurityService {
    if (!SessionSecurityService.instance) {
      SessionSecurityService.instance = new SessionSecurityService();
    }
    return SessionSecurityService.instance;
  }

  async createSecureDemoSession(): Promise<DemoSession> {
    const sessionId = crypto.randomUUID();
    const token = await this.generateSecureToken();
    const deviceFingerprint = await this.generateDeviceFingerprint();
    
    const metadata: SessionMetadata = {
      deviceFingerprint,
      lastActivity: Date.now(),
      createdAt: Date.now(),
      ipAddress: await this.getUserIP(),
      userAgent: navigator.userAgent,
      securityScore: this.calculateSecurityScore()
    };

    const session: DemoSession = {
      id: sessionId,
      token,
      expiresAt: Date.now() + this.DEMO_SESSION_TIMEOUT,
      metadata
    };

    this.activeSessions.set(sessionId, metadata);
    
    // Store in localStorage as fallback since secureStorageService might not be available
    try {
      localStorage.setItem(`demo_session_${sessionId}`, JSON.stringify(session));
    } catch (error) {
      productionLogger.warn('Failed to store session in localStorage', error, 'SessionSecurityService');
    }

    productionLogger.secureInfo('Demo session created', {
      sessionId,
      deviceFingerprint: deviceFingerprint.substring(0, 8),
      securityScore: metadata.securityScore
    });

    return session;
  }

  async validateSession(sessionId: string): Promise<boolean> {
    try {
      // Try to get from memory first
      const metadata = this.activeSessions.get(sessionId);
      if (metadata) {
        // Check expiration
        if (Date.now() - metadata.lastActivity > this.SESSION_TIMEOUT) {
          this.activeSessions.delete(sessionId);
          return false;
        }
        
        // Update last activity
        metadata.lastActivity = Date.now();
        return true;
      }

      // Try to get from localStorage
      const storedSession = localStorage.getItem(`demo_session_${sessionId}`);
      if (storedSession) {
        const session: DemoSession = JSON.parse(storedSession);
        
        // Check expiration
        if (Date.now() > session.expiresAt) {
          await this.cleanupSession(sessionId);
          return false;
        }

        // Restore to memory
        this.activeSessions.set(sessionId, session.metadata);
        return true;
      }

      return false;
    } catch (error) {
      productionLogger.error('Session validation failed', error, 'SessionSecurityService');
      return false;
    }
  }

  async detectAnomalousActivity(sessionId: string): Promise<boolean> {
    const metadata = this.activeSessions.get(sessionId);
    if (!metadata) return true; // Session not found is anomalous

    const currentFingerprint = await this.generateDeviceFingerprint();
    const fingerprintMatch = currentFingerprint === metadata.deviceFingerprint;

    if (!fingerprintMatch) {
      productionLogger.warn('Device fingerprint mismatch detected', {
        sessionId,
        expected: metadata.deviceFingerprint.substring(0, 8),
        actual: currentFingerprint.substring(0, 8)
      });
      return true;
    }

    // Check for session timeout
    const timeSinceLastActivity = Date.now() - metadata.lastActivity;
    if (timeSinceLastActivity > this.SESSION_TIMEOUT) {
      productionLogger.info('Session timeout detected', { sessionId });
      return true;
    }

    return false;
  }

  async cleanupSession(sessionId: string): Promise<void> {
    this.activeSessions.delete(sessionId);
    try {
      localStorage.removeItem(`demo_session_${sessionId}`);
    } catch (error) {
      productionLogger.warn('Failed to remove session from localStorage', error, 'SessionSecurityService');
    }
    productionLogger.info('Session cleaned up', { sessionId });
  }

  async cleanupExpiredSessions(): Promise<void> {
    const now = Date.now();
    for (const [sessionId, metadata] of this.activeSessions.entries()) {
      if (now - metadata.lastActivity > this.SESSION_TIMEOUT) {
        await this.cleanupSession(sessionId);
      }
    }
  }

  private async generateSecureToken(): Promise<string> {
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
    
    // Simple hash since we can't rely on crypto.subtle being available
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    return hash.toString(36);
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

  private calculateSecurityScore(): number {
    let score = 50; // Base score

    // HTTPS bonus
    if (location.protocol === 'https:') score += 20;

    // Modern browser features
    if ('crypto' in window && 'subtle' in crypto) score += 15;
    if ('serviceWorker' in navigator) score += 10;

    // Security headers (would be checked server-side in production)
    score += 5;

    return Math.min(score, 100);
  }
}

export const sessionSecurityService = SessionSecurityService.getInstance();
