
import { productionLogger } from '@/utils/productionLogger';
import { enhancedEncryption } from './enhancedEncryption';

interface EncryptedData {
  data: string;
  iv: string;
  salt: string;
  rotated?: boolean;
}

interface TestData {
  test: string;
  timestamp: number;
}

class SecureStorageService {
  private static instance: SecureStorageService;
  private encryptionKey: CryptoKey | null = null;
  private readonly ALGORITHM = 'AES-GCM';
  private readonly KEY_LENGTH = 256;
  private readonly IV_LENGTH = 12;
  private readonly SALT_LENGTH = 32; // Increased from 16

  static getInstance(): SecureStorageService {
    if (!SecureStorageService.instance) {
      SecureStorageService.instance = new SecureStorageService();
    }
    return SecureStorageService.instance;
  }

  async setSecureItem<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      const dataToEncrypt = JSON.stringify({
        value,
        timestamp: Date.now(),
        ttl: ttl ? Date.now() + ttl : null
      });

      // Use enhanced encryption with auto-rotation
      const encryptionResult = await enhancedEncryption.encryptWithAutoRotation(dataToEncrypt, key);

      const encryptedItem: EncryptedData = {
        data: encryptionResult.encryptedData,
        iv: encryptionResult.iv,
        salt: encryptionResult.salt,
        rotated: encryptionResult.rotated
      };

      localStorage.setItem(`secure_${key}`, JSON.stringify(encryptedItem));

      if (encryptionResult.rotated) {
        productionLogger.info('Storage encryption keys rotated', { key: key.substring(0, 8) });
      }
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
      
      // Use enhanced decryption with validation
      const decryptedString = await enhancedEncryption.decryptWithValidation(
        encryptedItem.data,
        encryptedItem.iv,
        encryptedItem.salt,
        key
      );

      if (!decryptedString) {
        productionLogger.warn('Failed to decrypt secure item', { key: key.substring(0, 8) });
        return null;
      }

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

  async performStorageHealthCheck(): Promise<{
    status: 'healthy' | 'warning' | 'error';
    issues: string[];
    encryptionStrength: any;
  }> {
    const issues: string[] = [];
    
    try {
      // Test encryption/decryption
      const testKey = 'health_check_test';
      const testData: TestData = { test: 'data', timestamp: Date.now() };
      
      await this.setSecureItem(testKey, testData);
      const retrieved = await this.getSecureItem<TestData>(testKey);
      this.removeSecureItem(testKey);
      
      if (!retrieved || retrieved.test !== testData.test) {
        issues.push('Encryption/decryption test failed');
      }
    } catch (error) {
      issues.push('Storage encryption test failed');
    }

    // Check encryption strength
    const encryptionStrength = enhancedEncryption.getEncryptionStrength();
    if (encryptionStrength.strength === 'weak' || encryptionStrength.strength === 'moderate') {
      issues.push('Encryption strength below recommended level');
    }

    // Check storage availability
    try {
      localStorage.setItem('storage_test', 'test');
      localStorage.removeItem('storage_test');
    } catch {
      issues.push('Local storage not available');
    }

    const status = issues.length === 0 ? 'healthy' : issues.length <= 2 ? 'warning' : 'error';
    
    return {
      status,
      issues,
      encryptionStrength
    };
  }
}

export const secureStorageService = SecureStorageService.getInstance();
