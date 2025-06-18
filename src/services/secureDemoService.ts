
import { securityService } from '@/services/securityService';

interface DemoSession {
  user: any;
  session: any;
  expiresAt: number;
  fingerprint: string;
}

const DEMO_SESSION_DURATION = 30 * 60 * 1000; // 30 minutes
const DEMO_SESSION_KEY = 'dbooster_demo_session';

export class SecureDemoService {
  private generateFingerprint(): string {
    const components = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().toDateString(), // Change daily for added security
    ];
    
    const hash = components.join('|');
    let hashValue = 0;
    for (let i = 0; i < hash.length; i++) {
      const char = hash.charCodeAt(i);
      hashValue = ((hashValue << 5) - hashValue) + char;
      hashValue = hashValue & hashValue;
    }
    return Math.abs(hashValue).toString(36);
  }

  private encryptData(data: string): string {
    // Simple XOR encryption for demo purposes
    // In a real application, use proper encryption
    const key = this.generateFingerprint();
    let encrypted = '';
    for (let i = 0; i < data.length; i++) {
      const keyChar = key.charCodeAt(i % key.length);
      const dataChar = data.charCodeAt(i);
      encrypted += String.fromCharCode(dataChar ^ keyChar);
    }
    return btoa(encrypted);
  }

  private decryptData(encryptedData: string): string | null {
    try {
      const key = this.generateFingerprint();
      const encrypted = atob(encryptedData);
      let decrypted = '';
      for (let i = 0; i < encrypted.length; i++) {
        const keyChar = key.charCodeAt(i % key.length);
        const encryptedChar = encrypted.charCodeAt(i);
        decrypted += String.fromCharCode(encryptedChar ^ keyChar);
      }
      return decrypted;
    } catch {
      return null;
    }
  }

  async createDemoSession(): Promise<{ user: any; session: any }> {
    const currentFingerprint = this.generateFingerprint();
    const expiresAt = Date.now() + DEMO_SESSION_DURATION;
    
    const demoUser = {
      id: 'demo-user-' + currentFingerprint,
      email: 'demo@dbooster.com',
      user_metadata: { name: 'Demo User' },
      app_metadata: { provider: 'demo' }
    };

    const demoSession = {
      user: demoUser,
      access_token: 'demo-token-' + currentFingerprint,
      refresh_token: null,
      expires_at: Math.floor(expiresAt / 1000),
      token_type: 'bearer'
    };

    const sessionData: DemoSession = {
      user: demoUser,
      session: demoSession,
      expiresAt,
      fingerprint: currentFingerprint
    };

    // Encrypt and store session
    const encryptedSession = this.encryptData(JSON.stringify(sessionData));
    localStorage.setItem(DEMO_SESSION_KEY, encryptedSession);

    // Log demo session creation
    await securityService.logSecurityEvent({
      event_type: 'demo_session_created',
      event_data: { fingerprint: currentFingerprint, expiresAt }
    });

    return { user: demoUser, session: demoSession };
  }

  getDemoSession(): { user: any; session: any } | null {
    try {
      const encryptedSession = localStorage.getItem(DEMO_SESSION_KEY);
      if (!encryptedSession) return null;

      const decrypted = this.decryptData(encryptedSession);
      if (!decrypted) return null;

      const sessionData: DemoSession = JSON.parse(decrypted);
      const currentFingerprint = this.generateFingerprint();

      // Validate fingerprint and expiration
      if (sessionData.fingerprint !== currentFingerprint || 
          Date.now() > sessionData.expiresAt) {
        this.clearDemoSession();
        return null;
      }

      return { user: sessionData.user, session: sessionData.session };
    } catch (error) {
      console.error('Error retrieving demo session:', error);
      this.clearDemoSession();
      return null;
    }
  }

  async clearDemoSession(): Promise<void> {
    localStorage.removeItem(DEMO_SESSION_KEY);
    
    await securityService.logSecurityEvent({
      event_type: 'demo_session_cleared',
      event_data: { timestamp: Date.now() }
    });
  }

  isDemoMode(): boolean {
    const session = this.getDemoSession();
    return session !== null;
  }

  async extendDemoSession(): Promise<boolean> {
    const session = this.getDemoSession();
    if (!session) return false;

    try {
      // Create a new session with extended time
      await this.createDemoSession();
      return true;
    } catch (error) {
      console.error('Failed to extend demo session:', error);
      return false;
    }
  }
}

export const secureDemoService = new SecureDemoService();
