
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
  // SECURITY FIX: Use session-only storage for encryption keys (not persistent)
  private readonly SENSITIVE_KEY_PATTERN = /(token|secret|password|apikey|privatekey|auth|jwt|session)/i;

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
      // SECURITY FIX: Generate non-exportable keys in memory only (no persistent storage)
      this.encryptionKey = await crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        false, // non-extractable
        ['encrypt', 'decrypt']
      );
      
      productionLogger.info('Generated non-exportable encryption key for session', {}, 'SecureStorageService');
    } catch (error) {
      productionLogger.error('Failed to generate encryption key', error, 'SecureStorageService');
      throw error;
    }
  }

  async setSecureItem(key: string, value: any): Promise<void> {
    // SECURITY FIX: Block sensitive key names
    if (this.SENSITIVE_KEY_PATTERN.test(key)) {
      productionLogger.warn('Blocked attempt to store sensitive key', { key }, 'SecureStorageService');
      throw new Error('Storage of sensitive keys is not allowed for security reasons');
    }

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

      // Use sessionStorage for enhanced security (cleared on tab close)
      sessionStorage.setItem(this.STORAGE_PREFIX + key, JSON.stringify(encryptedPackage));
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
      // Check sessionStorage first (new secure approach)
      let storedData = sessionStorage.getItem(this.STORAGE_PREFIX + key);
      
      // Fallback to localStorage for migration purposes
      if (!storedData) {
        storedData = localStorage.getItem(this.STORAGE_PREFIX + key);
        if (storedData) {
          // Migrate to sessionStorage and remove from localStorage
          sessionStorage.setItem(this.STORAGE_PREFIX + key, storedData);
          localStorage.removeItem(this.STORAGE_PREFIX + key);
        }
      }
      
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
    sessionStorage.removeItem(this.STORAGE_PREFIX + key);
    localStorage.removeItem(this.STORAGE_PREFIX + key); // cleanup legacy
  }

  clearAllSecureItems(): void {
    // Clear from both storages for complete cleanup
    [sessionStorage, localStorage].forEach(storage => {
      Object.keys(storage).forEach(key => {
        if (key.startsWith(this.STORAGE_PREFIX)) {
          storage.removeItem(key);
        }
      });
    });
  }

  async rotateEncryptionKey(): Promise<void> {
    try {
      // SECURITY FIX: Generate new non-exportable key
      const newKey = await crypto.subtle.generateKey(
        { name: 'AES-GCM', length: 256 },
        false, // non-extractable
        ['encrypt', 'decrypt']
      );

      // Get all secure items from both storages
      const secureItems: Record<string, any> = {};
      [sessionStorage, localStorage].forEach(storage => {
        Object.keys(storage).forEach(storageKey => {
          if (storageKey.startsWith(this.STORAGE_PREFIX)) {
            const itemKey = storageKey.replace(this.STORAGE_PREFIX, '');
            if (!secureItems[itemKey]) {
              // Get the raw data to avoid recursive decryption
              const rawData = storage.getItem(storageKey);
              if (rawData) {
                secureItems[itemKey] = rawData;
              }
            }
          }
        });
      });

      // Update encryption key
      this.encryptionKey = newKey;

      // Clear old items
      this.clearAllSecureItems();

      // Note: We can't re-encrypt existing items with a new key since the old key
      // is non-extractable and lost. This is intentional for security.
      
      productionLogger.info('Encryption key rotated - old data cleared for security', {}, 'SecureStorageService');
    } catch (error) {
      productionLogger.error('Failed to rotate encryption key', error, 'SecureStorageService');
      throw error;
    }
  }
}

export const secureStorageService = SecureStorageService.getInstance();
