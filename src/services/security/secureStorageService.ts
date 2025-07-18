
import { productionLogger } from '@/utils/productionLogger';

interface EncryptedData {
  data: string;
  iv: string;
  salt: string;
}

class SecureStorageService {
  private static instance: SecureStorageService;
  private encryptionKey: CryptoKey | null = null;
  private readonly ALGORITHM = 'AES-GCM';
  private readonly KEY_LENGTH = 256;
  private readonly IV_LENGTH = 12;
  private readonly SALT_LENGTH = 16;

  static getInstance(): SecureStorageService {
    if (!SecureStorageService.instance) {
      SecureStorageService.instance = new SecureStorageService();
    }
    return SecureStorageService.instance;
  }

  private async deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);
    
    const importedKey = await crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      'PBKDF2',
      false,
      ['deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: 100000,
        hash: 'SHA-256'
      },
      importedKey,
      {
        name: this.ALGORITHM,
        length: this.KEY_LENGTH
      },
      false,
      ['encrypt', 'decrypt']
    );
  }

  private async getOrCreateEncryptionKey(): Promise<CryptoKey> {
    if (this.encryptionKey) {
      return this.encryptionKey;
    }

    // Use a combination of factors to create a consistent key
    const keyMaterial = [
      navigator.userAgent,
      window.location.origin,
      'secure-storage-key-v1'
    ].join('|');

    const salt = new Uint8Array(this.SALT_LENGTH);
    crypto.getRandomValues(salt);

    this.encryptionKey = await this.deriveKey(keyMaterial, salt);
    return this.encryptionKey;
  }

  async setSecureItem<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      const dataToEncrypt = JSON.stringify({
        value,
        timestamp: Date.now(),
        ttl: ttl ? Date.now() + ttl : null
      });

      const encoder = new TextEncoder();
      const data = encoder.encode(dataToEncrypt);
      
      const iv = new Uint8Array(this.IV_LENGTH);
      crypto.getRandomValues(iv);
      
      const salt = new Uint8Array(this.SALT_LENGTH);
      crypto.getRandomValues(salt);

      const encryptionKey = await this.deriveKey(key, salt);
      
      const encryptedData = await crypto.subtle.encrypt(
        {
          name: this.ALGORITHM,
          iv: iv
        },
        encryptionKey,
        data
      );

      const encryptedItem: EncryptedData = {
        data: Array.from(new Uint8Array(encryptedData)).map(b => b.toString(16).padStart(2, '0')).join(''),
        iv: Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join(''),
        salt: Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join('')
      };

      localStorage.setItem(`secure_${key}`, JSON.stringify(encryptedItem));
    } catch (error) {
      productionLogger.error('Failed to store secure item', error, 'SecureStorageService');
      throw error;
    }
  }

  async getSecureItem<T>(key: string): Promise<T | null> {
    try {
      const storedData = localStorage.getItem(`secure_${key}`);
      if (!storedData) {
        return null;
      }

      const encryptedItem: EncryptedData = JSON.parse(storedData);
      
      const data = new Uint8Array(encryptedItem.data.match(/.{2}/g)?.map(byte => parseInt(byte, 16)) || []);
      const iv = new Uint8Array(encryptedItem.iv.match(/.{2}/g)?.map(byte => parseInt(byte, 16)) || []);
      const salt = new Uint8Array(encryptedItem.salt.match(/.{2}/g)?.map(byte => parseInt(byte, 16)) || []);

      const encryptionKey = await this.deriveKey(key, salt);
      
      const decryptedData = await crypto.subtle.decrypt(
        {
          name: this.ALGORITHM,
          iv: iv
        },
        encryptionKey,
        data
      );

      const decoder = new TextDecoder();
      const decryptedString = decoder.decode(decryptedData);
      const parsedData = JSON.parse(decryptedString);

      // Check TTL
      if (parsedData.ttl && Date.now() > parsedData.ttl) {
        this.removeSecureItem(key);
        return null;
      }

      return parsedData.value;
    } catch (error) {
      productionLogger.error('Failed to retrieve secure item', error, 'SecureStorageService');
      return null;
    }
  }

  removeSecureItem(key: string): void {
    localStorage.removeItem(`secure_${key}`);
  }

  clearAllSecureItems(): void {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('secure_')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }
}

export const secureStorageService = SecureStorageService.getInstance();
