
import { productionLogger } from '@/utils/productionLogger';

interface EncryptionConfig {
  algorithm: string;
  keyLength: number;
  ivLength: number;
  saltLength: number;
  iterations: number;
}

interface SecureKeyDerivation {
  masterKey: CryptoKey | null;
  keyRotationInterval: number;
  lastRotation: number;
}

class EnhancedEncryption {
  private static instance: EnhancedEncryption;
  private config: EncryptionConfig = {
    algorithm: 'AES-GCM',
    keyLength: 256,
    ivLength: 12,
    saltLength: 32, // Increased from 16
    iterations: 250000 // Increased from 100000
  };
  private keyDerivation: SecureKeyDerivation = {
    masterKey: null,
    keyRotationInterval: 24 * 60 * 60 * 1000, // 24 hours
    lastRotation: 0
  };

  static getInstance(): EnhancedEncryption {
    if (!EnhancedEncryption.instance) {
      EnhancedEncryption.instance = new EnhancedEncryption();
    }
    return EnhancedEncryption.instance;
  }

  async generateSecureKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(password);
    
    // Import password as key material
    const importedKey = await crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      'PBKDF2',
      false,
      ['deriveKey']
    );

    // Derive key with enhanced parameters
    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: salt,
        iterations: this.config.iterations,
        hash: 'SHA-512' // Upgraded from SHA-256
      },
      importedKey,
      {
        name: this.config.algorithm,
        length: this.config.keyLength
      },
      false,
      ['encrypt', 'decrypt']
    );
  }

  async generateMasterKey(): Promise<CryptoKey> {
    // Use hardware entropy when available
    const entropy = await this.collectHardwareEntropy();
    const enhancedSalt = new Uint8Array(this.config.saltLength);
    crypto.getRandomValues(enhancedSalt);
    
    // Mix hardware entropy with crypto random
    for (let i = 0; i < enhancedSalt.length && i < entropy.length; i++) {
      enhancedSalt[i] ^= entropy[i];
    }

    const masterPassword = this.generateMasterPassword(entropy);
    return this.generateSecureKey(masterPassword, enhancedSalt);
  }

  private async collectHardwareEntropy(): Promise<Uint8Array> {
    const entropy = new Uint8Array(32);
    crypto.getRandomValues(entropy);

    try {
      // Additional entropy sources when available
      const deviceMemory = (navigator as any).deviceMemory || 4;
      const hardwareConcurrency = navigator.hardwareConcurrency || 4;
      const connection = (navigator as any).connection;
      
      // Mix in timing entropy
      const timingEntropy = performance.now() % 256;
      entropy[0] ^= timingEntropy;
      
      // Mix in device characteristics
      entropy[1] ^= deviceMemory;
      entropy[2] ^= hardwareConcurrency;
      
      if (connection) {
        entropy[3] ^= (connection.downlink || 1) % 256;
      }

      // Add mouse/touch entropy if available
      const mouseEntropy = await this.collectMouseEntropy();
      for (let i = 0; i < Math.min(entropy.length, mouseEntropy.length); i++) {
        entropy[i] ^= mouseEntropy[i];
      }
    } catch (error) {
      productionLogger.warn('Failed to collect additional entropy, using crypto.getRandomValues only');
    }

    return entropy;
  }

  private async collectMouseEntropy(): Promise<Uint8Array> {
    return new Promise((resolve) => {
      const entropy = new Uint8Array(16);
      let collected = 0;
      
      const collectEntropy = (event: MouseEvent) => {
        if (collected < entropy.length) {
          entropy[collected] = (event.clientX + event.clientY + performance.now()) % 256;
          collected++;
          
          if (collected >= entropy.length) {
            document.removeEventListener('mousemove', collectEntropy);
            resolve(entropy);
          }
        }
      };

      document.addEventListener('mousemove', collectEntropy);
      
      // Timeout after 100ms if no mouse movement
      setTimeout(() => {
        document.removeEventListener('mousemove', collectEntropy);
        crypto.getRandomValues(entropy.subarray(collected));
        resolve(entropy);
      }, 100);
    });
  }

  private generateMasterPassword(entropy: Uint8Array): string {
    const components = [
      navigator.userAgent,
      window.location.origin,
      performance.timeOrigin.toString(),
      entropy.join(','),
      Date.now().toString()
    ];
    
    return components.join('|');
  }

  async rotateKeysIfNeeded(): Promise<boolean> {
    const now = Date.now();
    const timeSinceRotation = now - this.keyDerivation.lastRotation;
    
    if (timeSinceRotation > this.keyDerivation.keyRotationInterval) {
      try {
        this.keyDerivation.masterKey = await this.generateMasterKey();
        this.keyDerivation.lastRotation = now;
        
        productionLogger.info('Encryption keys rotated successfully');
        return true;
      } catch (error) {
        productionLogger.error('Key rotation failed', error, 'EnhancedEncryption');
        return false;
      }
    }
    
    return false;
  }

  async encryptWithAutoRotation(data: string, keyMaterial: string): Promise<{
    encryptedData: string;
    iv: string;
    salt: string;
    rotated: boolean;
  }> {
    const rotated = await this.rotateKeysIfNeeded();
    
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    
    const salt = new Uint8Array(this.config.saltLength);
    crypto.getRandomValues(salt);
    
    const iv = new Uint8Array(this.config.ivLength);
    crypto.getRandomValues(iv);
    
    const key = await this.generateSecureKey(keyMaterial, salt);
    
    const encryptedBuffer = await crypto.subtle.encrypt(
      {
        name: this.config.algorithm,
        iv: iv
      },
      key,
      dataBuffer
    );
    
    return {
      encryptedData: Array.from(new Uint8Array(encryptedBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join(''),
      iv: Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join(''),
      salt: Array.from(salt).map(b => b.toString(16).padStart(2, '0')).join(''),
      rotated
    };
  }

  async decryptWithValidation(
    encryptedData: string,
    iv: string,
    salt: string,
    keyMaterial: string
  ): Promise<string | null> {
    try {
      const dataArray = new Uint8Array(
        encryptedData.match(/.{2}/g)?.map(byte => parseInt(byte, 16)) || []
      );
      const ivArray = new Uint8Array(
        iv.match(/.{2}/g)?.map(byte => parseInt(byte, 16)) || []
      );
      const saltArray = new Uint8Array(
        salt.match(/.{2}/g)?.map(byte => parseInt(byte, 16)) || []
      );
      
      const key = await this.generateSecureKey(keyMaterial, saltArray);
      
      const decryptedBuffer = await crypto.subtle.decrypt(
        {
          name: this.config.algorithm,
          iv: ivArray
        },
        key,
        dataArray
      );
      
      const decoder = new TextDecoder();
      return decoder.decode(decryptedBuffer);
    } catch (error) {
      productionLogger.error('Decryption failed', error, 'EnhancedEncryption');
      return null;
    }
  }

  getEncryptionStrength(): {
    algorithm: string;
    keyLength: number;
    iterations: number;
    strength: 'weak' | 'moderate' | 'strong' | 'very_strong';
  } {
    let strength: 'weak' | 'moderate' | 'strong' | 'very_strong' = 'weak';
    
    if (this.config.iterations >= 200000 && this.config.keyLength >= 256) {
      strength = 'very_strong';
    } else if (this.config.iterations >= 100000 && this.config.keyLength >= 256) {
      strength = 'strong';
    } else if (this.config.iterations >= 50000) {
      strength = 'moderate';
    }
    
    return {
      algorithm: this.config.algorithm,
      keyLength: this.config.keyLength,
      iterations: this.config.iterations,
      strength
    };
  }
}

export const enhancedEncryption = EnhancedEncryption.getInstance();
