
import { productionLogger } from '@/utils/productionLogger';

interface EncryptedData {
  iv: number[];
  data: number[];
  timestamp: number;
}

class SecureStorageService {
  private static instance: SecureStorageService;
  private encryptionKey: CryptoKey | null = null;
  private readonly STORAGE_PREFIX = 'secure_';
  private readonly KEY_STORAGE = 'encryption_key';

  static getInstance(): SecureStorageService {
    if (!SecureStorageService.instance) {
      SecureStorageService.instance = new SecureStorageService();
    }
    return SecureStorageService.instance;
  }

  async initialize(): Promise<void> {
    try {
      await this.loadOrGenerateKey();
    } catch (error) {
      productionLogger.error('Failed to initialize secure storage', error, 'SecureStorageService');
      throw error;
    }
  }

  private async loadOrGenerateKey(): Promise<void> {
    try {
      const storedKey = localStorage.getItem(this.KEY_STORAGE);
      if (storedKey) {
        const keyData = JSON.parse(storedKey);
        this.encryptionKey = await crypto.subtle.importKey(
          'raw',
          new Uint8Array(keyData),
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
        localStorage.setItem(this.KEY_STORAGE, JSON.stringify(Array.from(new Uint8Array(keyBuffer))));
      }
    } catch (error) {
      productionLogger.error('Failed to load or generate encryption key', error, 'SecureStorageService');
      throw error;
    }
  }

  async setSecureItem(key: string, value: any): Promise<void> {
    if (!this.encryptionKey) {
      await this.initialize();
    }

    try {
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encodedData = new TextEncoder().encode(JSON.stringify({
        value,
        timestamp: Date.now()
      }));
      
      const encryptedData = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        this.encryptionKey!,
        encodedData
      );

      const encryptedPackage: EncryptedData = {
        iv: Array.from(iv),
        data: Array.from(new Uint8Array(encryptedData)),
        timestamp: Date.now()
      };

      localStorage.setItem(this.STORAGE_PREFIX + key, JSON.stringify(encryptedPackage));
    } catch (error) {
      productionLogger.error('Failed to set secure item', error, 'SecureStorageService');
      throw error;
    }
  }

  async getSecureItem<T>(key: string): Promise<T | null> {
    if (!this.encryptionKey) {
      await this.initialize();
    }

    try {
      const storedData = localStorage.getItem(this.STORAGE_PREFIX + key);
      if (!storedData) return null;

      const encryptedPackage: EncryptedData = JSON.parse(storedData);
      
      const decryptedData = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: new Uint8Array(encryptedPackage.iv) },
        this.encryptionKey!,
        new Uint8Array(encryptedPackage.data)
      );

      const decryptedText = new TextDecoder().decode(decryptedData);
      const parsedData = JSON.parse(decryptedText);
      
      return parsedData.value;
    } catch (error) {
      productionLogger.warn('Failed to get secure item, removing corrupted data', { key }, 'SecureStorageService');
      this.removeSecureItem(key);
      return null;
    }
  }

  removeSecureItem(key: string): void {
    localStorage.removeItem(this.STORAGE_PREFIX + key);
  }

  clearAllSecureItems(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }

  async rotateEncryptionKey(): Promise<void> {
    try {
      // Generate new key
      const newKey = await crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );

      // Get all secure items
      const secureItems: Record<string, any> = {};
      const keys = Object.keys(localStorage);
      
      for (const storageKey of keys) {
        if (storageKey.startsWith(this.STORAGE_PREFIX)) {
          const itemKey = storageKey.replace(this.STORAGE_PREFIX, '');
          const value = await this.getSecureItem(itemKey);
          if (value !== null) {
            secureItems[itemKey] = value;
          }
        }
      }

      // Update encryption key
      this.encryptionKey = newKey;
      const keyBuffer = await crypto.subtle.exportKey('raw', this.encryptionKey);
      localStorage.setItem(this.KEY_STORAGE, JSON.stringify(Array.from(new Uint8Array(keyBuffer))));

      // Re-encrypt all items with new key
      for (const [key, value] of Object.entries(secureItems)) {
        await this.setSecureItem(key, value);
      }

      productionLogger.info('Encryption key rotated successfully', {}, 'SecureStorageService');
    } catch (error) {
      productionLogger.error('Failed to rotate encryption key', error, 'SecureStorageService');
      throw error;
    }
  }
}

export const secureStorageService = SecureStorageService.getInstance();
