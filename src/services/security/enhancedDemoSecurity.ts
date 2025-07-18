
import { productionLogger } from '@/utils/productionLogger';

interface SecureDemoSession {
  id: string;
  token: string;
  expiresAt: number;
  deviceFingerprint: string;
  capabilities: string[];
  securityScore: number;
  validationKey: string;
}

interface DemoSessionValidation {
  isValid: boolean;
  reason?: string;
  securityLevel: 'low' | 'medium' | 'high';
  requiresRevalidation: boolean;
}

class EnhancedDemoSecurity {
  private static instance: EnhancedDemoSecurity;
  private activeSessions: Map<string, SecureDemoSession> = new Map();
  private readonly SESSION_DURATION = 2 * 60 * 60 * 1000; // 2 hours
  private readonly MAX_CONCURRENT_SESSIONS = 3;

  static getInstance(): EnhancedDemoSecurity {
    if (!EnhancedDemoSecurity.instance) {
      EnhancedDemoSecurity.instance = new EnhancedDemoSecurity();
    }
    return EnhancedDemoSecurity.instance;
  }

  async createSecureDemoSession(): Promise<SecureDemoSession> {
    try {
      // Clean up expired sessions first
      await this.cleanupExpiredSessions();

      // Check session limits
      if (this.activeSessions.size >= this.MAX_CONCURRENT_SESSIONS) {
        throw new Error('Maximum concurrent demo sessions reached');
      }

      // Generate secure session data
      const sessionId = await this.generateSecureSessionId();
      const deviceFingerprint = await this.generateDeviceFingerprint();
      const token = this.generateSimpleSecureToken();
      const validationKey = await this.generateValidationKey(sessionId, deviceFingerprint);

      const session: SecureDemoSession = {
        id: sessionId,
        token,
        expiresAt: Date.now() + this.SESSION_DURATION,
        deviceFingerprint,
        capabilities: [
          'view_dashboard',
          'view_sample_data',
          'view_optimizations',
          'demo_queries'
        ],
        securityScore: this.calculateSimpleSecurityScore(),
        validationKey
      };

      // Store session
      this.activeSessions.set(sessionId, session);

      // Store client-side validation data
      localStorage.setItem('demo_session_validation', JSON.stringify({
        sessionId,
        fingerprint: deviceFingerprint,
        timestamp: Date.now()
      }));

      productionLogger.info('Secure demo session created', {
        sessionId: sessionId.substring(0, 8),
        securityScore: session.securityScore,
        expiresAt: new Date(session.expiresAt).toISOString()
      }, 'EnhancedDemoSecurity');

      return session;
    } catch (error) {
      productionLogger.error('Failed to create secure demo session', error, 'EnhancedDemoSecurity');
      throw error;
    }
  }

  async validateDemoSession(sessionId: string): Promise<DemoSessionValidation> {
    try {
      const session = this.activeSessions.get(sessionId);
      
      if (!session) {
        return {
          isValid: false,
          reason: 'Session not found',
          securityLevel: 'low',
          requiresRevalidation: true
        };
      }

      // Check expiration
      if (Date.now() > session.expiresAt) {
        this.activeSessions.delete(sessionId);
        return {
          isValid: false,
          reason: 'Session expired',
          securityLevel: 'low',
          requiresRevalidation: true
        };
      }

      // Validate device fingerprint
      const currentFingerprint = await this.generateDeviceFingerprint();
      const fingerprintValid = this.validateFingerprint(session.deviceFingerprint, currentFingerprint);
      
      if (!fingerprintValid) {
        productionLogger.warn('Demo session fingerprint mismatch', {
          sessionId: sessionId.substring(0, 8)
        }, 'EnhancedDemoSecurity');
        
        return {
          isValid: false,
          reason: 'Device fingerprint mismatch',
          securityLevel: 'low',
          requiresRevalidation: true
        };
      }

      // Validate client-side data
      const clientValidation = this.validateClientSideData(sessionId);
      if (!clientValidation.valid) {
        return {
          isValid: false,
          reason: clientValidation.reason,
          securityLevel: 'medium',
          requiresRevalidation: true
        };
      }

      // Calculate security level
      const securityLevel = this.assessSessionSecurity(session);

      return {
        isValid: true,
        securityLevel,
        requiresRevalidation: securityLevel === 'low'
      };
    } catch (error) {
      productionLogger.error('Demo session validation failed', error, 'EnhancedDemoSecurity');
      return {
        isValid: false,
        reason: 'Validation error',
        securityLevel: 'low',
        requiresRevalidation: true
      };
    }
  }

  getDemoSessionStats(): { activeSessions: number; totalSessions: number; averageSecurityScore: number } {
    const sessions = Array.from(this.activeSessions.values());
    const averageSecurityScore = sessions.length > 0 
      ? sessions.reduce((sum, session) => sum + session.securityScore, 0) / sessions.length 
      : 0;

    return {
      activeSessions: sessions.length,
      totalSessions: sessions.length,
      averageSecurityScore: Math.round(averageSecurityScore)
    };
  }

  private async generateSecureSessionId(): Promise<string> {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36);
    const entropy = this.generateSimpleEntropy();
    
    return btoa(`${entropy}|${timestamp}|${random}`).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
  }

  private generateSimpleEntropy(): string {
    return Math.random().toString(36) + Date.now().toString(36);
  }

  private async generateDeviceFingerprint(): Promise<string> {
    const components = [
      navigator.userAgent,
      screen.width + 'x' + screen.height,
      screen.colorDepth.toString(),
      navigator.language,
      navigator.hardwareConcurrency?.toString() || '4',
      Intl.DateTimeFormat().resolvedOptions().timeZone,
      new Date().getTimezoneOffset().toString()
    ];

    // Add canvas fingerprint
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('Demo fingerprint', 2, 2);
        components.push(canvas.toDataURL());
      }
    } catch {
      components.push('canvas_unavailable');
    }

    const combined = components.join('|');
    
    // Simple hash function for fingerprinting
    let hash = 0;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return hash.toString(36);
  }

  private generateSimpleSecureToken(): string {
    const randomBytes = new Uint8Array(32);
    crypto.getRandomValues(randomBytes);
    return Array.from(randomBytes, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  private async generateValidationKey(sessionId: string, fingerprint: string): Promise<string> {
    const data = `${sessionId}|${fingerprint}|${Date.now()}`;
    return btoa(data);
  }

  private validateFingerprint(stored: string, current: string): boolean {
    // Allow some tolerance for minor changes (like timezone changes)
    if (stored === current) {
      return true;
    }

    // Calculate similarity (basic approach)
    const similarity = this.calculateSimilarity(stored, current);
    return similarity > 0.85; // 85% similarity threshold
  }

  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) {
      return 1.0;
    }
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  private validateClientSideData(sessionId: string): { valid: boolean; reason?: string } {
    try {
      const storedData = localStorage.getItem('demo_session_validation');
      if (!storedData) {
        return { valid: false, reason: 'No client validation data' };
      }

      const parsed = JSON.parse(storedData);
      if (parsed.sessionId !== sessionId) {
        return { valid: false, reason: 'Session ID mismatch' };
      }

      // Check if validation data is too old (indicates tampering)
      const age = Date.now() - parsed.timestamp;
      if (age > this.SESSION_DURATION) {
        return { valid: false, reason: 'Validation data expired' };
      }

      return { valid: true };
    } catch {
      return { valid: false, reason: 'Invalid validation data format' };
    }
  }

  private assessSessionSecurity(session: SecureDemoSession): 'low' | 'medium' | 'high' {
    let score = 0;

    // Security score from creation
    if (session.securityScore >= 80) score += 3;
    else if (session.securityScore >= 60) score += 2;
    else score += 1;

    // Age factor
    const age = Date.now() - (session.expiresAt - this.SESSION_DURATION);
    if (age < 30 * 60 * 1000) score += 2; // Fresh session
    else if (age < 60 * 60 * 1000) score += 1;

    // Capabilities
    if (session.capabilities.length <= 4) score += 1; // Limited capabilities

    if (score >= 5) return 'high';
    if (score >= 3) return 'medium';
    return 'low';
  }

  private calculateSimpleSecurityScore(): number {
    let score = 50; // Base score

    // Add randomness-based score
    score += Math.floor(Math.random() * 30) + 20; // 20-50 points

    // Browser security features
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) score += 10;
    if (typeof navigator.hardwareConcurrency !== 'undefined') score += 5;

    return Math.max(0, Math.min(100, score));
  }

  private async cleanupExpiredSessions(): Promise<void> {
    const now = Date.now();
    for (const [sessionId, session] of this.activeSessions.entries()) {
      if (now > session.expiresAt) {
        this.activeSessions.delete(sessionId);
        productionLogger.info('Expired demo session cleaned up', {
          sessionId: sessionId.substring(0, 8)
        }, 'EnhancedDemoSecurity');
      }
    }
  }

  async revokeDemoSession(sessionId: string): Promise<void> {
    this.activeSessions.delete(sessionId);
    localStorage.removeItem('demo_session_validation');
    
    productionLogger.info('Demo session revoked', {
      sessionId: sessionId.substring(0, 8)
    }, 'EnhancedDemoSecurity');
  }

  getActiveSessions(): number {
    return this.activeSessions.size;
  }
}

export const enhancedDemoSecurity = EnhancedDemoSecurity.getInstance();
