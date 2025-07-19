
import { productionLogger } from '@/utils/productionLogger';
import { secureStorageService } from './secureStorageService';

export interface SessionData {
  id: string;
  userId: string;
  isDemo: boolean;
  createdAt: string;
  expiresAt: string;
  deviceFingerprint?: string;
}

class SecureSessionManager {
  private encryptionKey: CryptoKey | null = null;
  private initialized = false;

  // Add the missing initializeEncryption method
  async initializeEncryption(): Promise<void> {
    if (this.initialized) return;

    try {
      // Generate or retrieve encryption key
      await this.generateEncryptionKey();
      this.initialized = true;
      productionLogger.info('Session encryption initialized', {}, 'SecureSessionManager');
    } catch (error) {
      productionLogger.error('Failed to initialize session encryption', error, 'SecureSessionManager');
      throw error;
    }
  }

  async createSecureSession(userId: string, isDemo: boolean = false): Promise<string> {
    if (!this.initialized) {
      await this.initializeEncryption();
    }

    const sessionId = crypto.randomUUID();
    const expirationTime = isDemo ? 
      Date.now() + (60 * 60 * 1000) : // 1 hour for demo
      Date.now() + (24 * 60 * 60 * 1000); // 24 hours for regular

    const sessionData: SessionData = {
      id: sessionId,
      userId,
      isDemo,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(expirationTime).toISOString(),
      deviceFingerprint: await this.generateDeviceFingerprint()
    };

    try {
      const encryptedData = await this.encryptSessionData(sessionData);
      const storageKey = `secure_session_${sessionId}`;
      
      await secureStorageService.setSecureItem(storageKey, encryptedData);
      
      productionLogger.info('Secure session created', { 
        sessionId: sessionId.substring(0, 8),
        isDemo,
        expiresAt: sessionData.expiresAt
      }, 'SecureSessionManager');

      return sessionId;
    } catch (error) {
      productionLogger.error('Failed to create secure session', error, 'SecureSessionManager');
      throw error;
    }
  }

  async validateSession(sessionId: string): Promise<boolean> {
    if (!sessionId) return false;

    try {
      const storageKey = `secure_session_${sessionId}`;
      const encryptedData = await secureStorageService.getSecureItem(storageKey);
      
      if (!encryptedData) {
        return false;
      }

      const sessionData = await this.decryptSessionData(String(encryptedData)); // Fixed type cast
      
      // Check expiration
      if (new Date() > new Date(sessionData.expiresAt)) {
        await this.destroySession(sessionId);
        return false;
      }

      // Validate device fingerprint
      const currentFingerprint = await this.generateDeviceFingerprint();
      if (sessionData.deviceFingerprint && sessionData.deviceFingerprint !== currentFingerprint) {
        productionLogger.warn('Session device fingerprint mismatch', {
          sessionId: sessionId.substring(0, 8)
        }, 'SecureSessionManager');
        await this.destroySession(sessionId);
        return false;
      }

      return true;
    } catch (error) {
      productionLogger.error('Session validation failed', error, 'SecureSessionManager');
      return false;
    }
  }

  async destroySession(sessionId: string): Promise<void> {
    try {
      const storageKey = `secure_session_${sessionId}`;
      await secureStorageService.removeSecureItem(storageKey);
      
      productionLogger.info('Session destroyed', {
        sessionId: sessionId.substring(0, 8)
      }, 'SecureSessionManager');
    } catch (error) {
      productionLogger.error('Failed to destroy session', error, 'SecureSessionManager');
    }
  }

  private async generateEncryptionKey(): Promise<void> {
    try {
      this.encryptionKey = await crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
      );
    } catch (error) {
      productionLogger.error('Failed to generate encryption key', error, 'SecureSessionManager');
      throw error;
    }
  }

  private async encryptSessionData(sessionData: SessionData): Promise<string> {
    if (!this.encryptionKey) {
      throw new Error('Encryption key not initialized');
    }

    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(JSON.stringify(sessionData));
      const iv = crypto.getRandomValues(new Uint8Array(12));

      const encryptedData = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        this.encryptionKey,
        data
      );

      return JSON.stringify({
        iv: Array.from(iv),
        data: Array.from(new Uint8Array(encryptedData))
      });
    } catch (error) {
      productionLogger.error('Session encryption failed', error, 'SecureSessionManager');
      throw error;
    }
  }

  private async decryptSessionData(encryptedData: string): Promise<SessionData> {
    if (!this.encryptionKey) {
      throw new Error('Encryption key not initialized');
    }

    try {
      const { iv, data } = JSON.parse(encryptedData);
      const ivArray = new Uint8Array(iv);
      const dataArray = new Uint8Array(data);

      const decryptedData = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: ivArray },
        this.encryptionKey,
        dataArray
      );

      const decoder = new TextDecoder();
      const sessionString = decoder.decode(decryptedData);
      
      return JSON.parse(sessionString) as SessionData;
    } catch (error) {
      productionLogger.error('Session decryption failed', error, 'SecureSessionManager');
      throw error;
    }
  }

  private async generateDeviceFingerprint(): Promise<string> {
    try {
      const components = [
        navigator.userAgent,
        navigator.language,
        screen.width + 'x' + screen.height,
        new Date().getTimezoneOffset().toString()
      ];

      const fingerprint = components.join('|');
      const encoder = new TextEncoder();
      const data = encoder.encode(fingerprint);
      
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (error) {
      productionLogger.warn('Failed to generate device fingerprint', error, 'SecureSessionManager');
      return 'unknown';
    }
  }
}

export const secureSessionManager = new SecureSessionManager();
