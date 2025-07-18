
import { productionLogger } from '@/utils/productionLogger';
import { secureStorageService } from './secureStorageService';

interface SecureSession {
  id: string;
  userId: string;
  token: string;
  createdAt: number;
  expiresAt: number;
  lastActivity: number;
  deviceFingerprint: string;
  ipAddress: string;
  userAgent: string;
  isDemo: boolean;
  securityScore: number;
}

interface SessionSecurityMetrics {
  totalSessions: number;
  activeSessions: number;
  expiredSessions: number;
  suspiciousSessions: number;
  averageSecurityScore: number;
}

class SecureSessionManager {
  private static instance: SecureSessionManager;
  private readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  private readonly DEMO_SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hour
  private readonly MAX_INACTIVE_TIME = 15 * 60 * 1000; // 15 minutes
  private activeSessions = new Map<string, SecureSession>();
  private cleanupInterval: NodeJS.Timeout;

  static getInstance(): SecureSessionManager {
    if (!SecureSessionManager.instance) {
      SecureSessionManager.instance = new SecureSessionManager();
    }
    return SecureSessionManager.instance;
  }

  constructor() {
    // Set up automatic cleanup
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpiredSessions();
    }, 5 * 60 * 1000); // Run every 5 minutes
  }

  async createSecureSession(userId: string, isDemo: boolean = false): Promise<SecureSession> {
    const sessionId = await this.generateSecureId();
    const token = await this.generateSecureToken();
    const deviceFingerprint = await this.generateDeviceFingerprint();
    const ipAddress = await this.getUserIP();
    const securityScore = await this.calculateSecurityScore();

    const session: SecureSession = {
      id: sessionId,
      userId,
      token,
      createdAt: Date.now(),
      expiresAt: Date.now() + (isDemo ? this.DEMO_SESSION_TIMEOUT : this.SESSION_TIMEOUT),
      lastActivity: Date.now(),
      deviceFingerprint,
      ipAddress,
      userAgent: navigator.userAgent,
      isDemo,
      securityScore
    };

    this.activeSessions.set(sessionId, session);
    
    // Store in secure storage
    await secureStorageService.setSecureItem(
      `session_${sessionId}`, 
      session, 
      isDemo ? this.DEMO_SESSION_TIMEOUT : this.SESSION_TIMEOUT
    );

    productionLogger.secureInfo('Secure session created', {
      sessionId,
      userId,
      isDemo,
      securityScore,
      deviceFingerprint: deviceFingerprint.substring(0, 8)
    });

    return session;
  }

  async validateSession(sessionId: string): Promise<boolean> {
    try {
      const session = this.activeSessions.get(sessionId) || 
        await secureStorageService.getSecureItem<SecureSession>(`session_${sessionId}`);

      if (!session) {
        return false;
      }

      // Check expiration
      if (Date.now() > session.expiresAt) {
        await this.destroySession(sessionId);
        return false;
      }

      // Check for suspicious activity
      if (await this.detectAnomalousActivity(session)) {
        await this.destroySession(sessionId, 'Anomalous activity detected');
        return false;
      }

      // Update last activity
      session.lastActivity = Date.now();
      this.activeSessions.set(sessionId, session);

      return true;
    } catch (error) {
      productionLogger.error('Session validation failed', error, 'SecureSessionManager');
      return false;
    }
  }

  async refreshSession(sessionId: string): Promise<boolean> {
    const session = this.activeSessions.get(sessionId);
    if (!session) return false;

    // Extend expiration
    const newExpiration = Date.now() + (session.isDemo ? this.DEMO_SESSION_TIMEOUT : this.SESSION_TIMEOUT);
    session.expiresAt = newExpiration;
    session.lastActivity = Date.now();

    this.activeSessions.set(sessionId, session);
    await secureStorageService.setSecureItem(`session_${sessionId}`, session, newExpiration - Date.now());

    return true;
  }

  async destroySession(sessionId: string, reason?: string): Promise<void> {
    this.activeSessions.delete(sessionId);
    secureStorageService.removeSecureItem(`session_${sessionId}`);
    
    productionLogger.secureInfo('Session destroyed', {
      sessionId,
      reason: reason || 'User logout'
    });
  }

  async destroyAllUserSessions(userId: string): Promise<void> {
    const userSessions = Array.from(this.activeSessions.values())
      .filter(session => session.userId === userId);

    for (const session of userSessions) {
      await this.destroySession(session.id, 'All sessions destroyed');
    }
  }

  getSessionMetrics(): SessionSecurityMetrics {
    const sessions = Array.from(this.activeSessions.values());
    const now = Date.now();

    const activeSessions = sessions.filter(s => now < s.expiresAt);
    const expiredSessions = sessions.filter(s => now >= s.expiresAt);
    const suspiciousSessions = sessions.filter(s => s.securityScore < 50);

    return {
      totalSessions: sessions.length,
      activeSessions: activeSessions.length,
      expiredSessions: expiredSessions.length,
      suspiciousSessions: suspiciousSessions.length,
      averageSecurityScore: sessions.length > 0 
        ? sessions.reduce((sum, s) => sum + s.securityScore, 0) / sessions.length 
        : 0
    };
  }

  private async detectAnomalousActivity(session: SecureSession): Promise<boolean> {
    // Check device fingerprint
    const currentFingerprint = await this.generateDeviceFingerprint();
    if (currentFingerprint !== session.deviceFingerprint) {
      productionLogger.warn('Device fingerprint mismatch', {
        sessionId: session.id,
        expected: session.deviceFingerprint.substring(0, 8),
        actual: currentFingerprint.substring(0, 8)
      });
      return true;
    }

    // Check for session timeout
    if (Date.now() - session.lastActivity > this.MAX_INACTIVE_TIME) {
      return true;
    }

    // Check for rapid location changes (would need IP geolocation service)
    const currentIP = await this.getUserIP();
    if (currentIP !== session.ipAddress && currentIP !== 'unknown') {
      // In production, you'd check if IPs are from different geographic regions
      productionLogger.info('IP address change detected', {
        sessionId: session.id,
        originalIP: session.ipAddress,
        currentIP
      });
    }

    return false;
  }

  private async generateSecureId(): Promise<string> {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
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
      navigator.languages?.join(',') || '',
      screen.width + 'x' + screen.height + 'x' + screen.colorDepth,
      new Date().getTimezoneOffset().toString(),
      navigator.hardwareConcurrency?.toString() || '0',
      navigator.deviceMemory?.toString() || '0',
      navigator.cookieEnabled.toString()
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

  private async calculateSecurityScore(): Promise<number> {
    let score = 50; // Base score

    // Protocol security
    if (location.protocol === 'https:') score += 20;
    
    // Browser security features
    if ('crypto' in window && 'subtle' in crypto) score += 10;
    if ('serviceWorker' in navigator) score += 5;
    if (window.isSecureContext) score += 10;
    
    // Connection security
    if (navigator.connection) {
      const connection = navigator.connection as any;
      if (connection.effectiveType === '4g') score += 5;
    }

    return Math.min(score, 100);
  }

  private cleanupExpiredSessions(): void {
    const now = Date.now();
    const expiredSessions: string[] = [];

    for (const [sessionId, session] of this.activeSessions.entries()) {
      if (now > session.expiresAt || (now - session.lastActivity) > this.MAX_INACTIVE_TIME) {
        expiredSessions.push(sessionId);
      }
    }

    expiredSessions.forEach(sessionId => {
      this.destroySession(sessionId, 'Session expired');
    });

    if (expiredSessions.length > 0) {
      productionLogger.info('Cleaned up expired sessions', { count: expiredSessions.length });
    }
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}

export const secureSessionManager = SecureSessionManager.getInstance();
