
import { productionLogger } from '@/utils/productionLogger';

interface StorageItem {
  value: string;
  timestamp: number;
  expires?: number;
}

class SecureStorageService {
  private static instance: SecureStorageService;
  private readonly ENCRYPTION_KEY_NAME = 'app_storage_key';

  static getInstance(): SecureStorageService {
    if (!SecureStorageService.instance) {
      SecureStorageService.instance = new SecureStorageService();
    }
    return SecureStorageService.instance;
  }

  async setSecureItem(key: string, value: any, expiresInMs?: number): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      const encryptedValue = await this.encrypt(serializedValue);
      
      const storageItem: StorageItem = {
        value: encryptedValue,
        timestamp: Date.now(),
        expires: expiresInMs ? Date.now() + expiresInMs : undefined
      };

      localStorage.setItem(this.getSecureKey(key), JSON.stringify(storageItem));
    } catch (error) {
      productionLogger.error('Failed to store secure item', error, 'SecureStorageService');
    }
  }

  async getSecureItem<T>(key: string): Promise<T | null> {
    try {
      const stored = localStorage.getItem(this.getSecureKey(key));
      if (!stored) return null;

      const storageItem: StorageItem = JSON.parse(stored);
      
      // Check expiration
      if (storageItem.expires && Date.now() > storageItem.expires) {
        this.removeSecureItem(key);
        return null;
      }

      const decryptedValue = await this.decrypt(storageItem.value);
      return JSON.parse(decryptedValue);
    } catch (error) {
      productionLogger.error('Failed to retrieve secure item', error, 'SecureStorageService');
      return null;
    }
  }

  removeSecureItem(key: string): void {
    localStorage.removeItem(this.getSecureKey(key));
  }

  clearSecureStorage(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('secure_')) {
        localStorage.removeItem(key);
      }
    });
  }

  private async encrypt(text: string): Promise<string> {
    try {
      // In a production environment, you'd use a proper encryption key
      // For demo purposes, we'll use a simple base64 encoding with salt
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const encoded = new TextEncoder().encode(text);
      const saltedData = new Uint8Array(salt.length + encoded.length);
      saltedData.set(salt);
      saltedData.set(encoded, salt.length);
      
      return btoa(String.fromCharCode(...saltedData));
    } catch (error) {
      productionLogger.error('Encryption failed', error, 'SecureStorageService');
      return btoa(text); // Fallback to simple base64
    }
  }

  private async decrypt(encryptedText: string): Promise<string> {
    try {
      const data = new Uint8Array(atob(encryptedText).split('').map(char => char.charCodeAt(0)));
      const salt = data.slice(0, 16);
      const originalData = data.slice(16);
      
      return new TextDecoder().decode(originalData);
    } catch (error) {
      productionLogger.error('Decryption failed', error, 'SecureStorageService');
      return atob(encryptedText); // Fallback to simple base64
    }
  }

  private getSecureKey(key: string): string {
    return `secure_${key}`;
  }
}

export const secureStorageService = SecureStorageService.getInstance();
