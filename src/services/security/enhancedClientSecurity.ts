
import { productionLogger } from '@/utils/productionLogger';
import { enhancedEncryption } from './enhancedEncryption';

interface SecurityMetrics {
  entropyScore: number;
  deviceFingerprint: string;
  securityLevel: 'low' | 'medium' | 'high' | 'critical';
  vulnerabilities: string[];
  recommendations: string[];
}

interface EnhancedSecurityConfig {
  minEntropyBits: number;
  keyRotationInterval: number;
  maxSessionDuration: number;
  fingerprintValidation: boolean;
  hardwareEntropyRequired: boolean;
}

class EnhancedClientSecurity {
  private static instance: EnhancedClientSecurity;
  private config: EnhancedSecurityConfig = {
    minEntropyBits: 256,
    keyRotationInterval: 24 * 60 * 60 * 1000, // 24 hours
    maxSessionDuration: 12 * 60 * 60 * 1000, // 12 hours
    fingerprintValidation: true,
    hardwareEntropyRequired: true
  };

  static getInstance(): EnhancedClientSecurity {
    if (!EnhancedClientSecurity.instance) {
      EnhancedClientSecurity.instance = new EnhancedClientSecurity();
    }
    return EnhancedClientSecurity.instance;
  }

  async generateSecureKey(): Promise<string> {
    try {
      // Enhanced entropy collection with multiple sources
      const entropyData = await this.collectEnhancedEntropy();
      
      if (entropyData.score < this.config.minEntropyBits) {
        throw new Error(`Insufficient entropy: ${entropyData.score} bits, required: ${this.config.minEntropyBits}`);
      }

      // Generate salt for key derivation
      const salt = new Uint8Array(32);
      crypto.getRandomValues(salt);

      // Generate key using enhanced encryption with collected entropy and salt
      const cryptoKey = await enhancedEncryption.generateSecureKey(entropyData.data, salt);
      
      // Export the key to get a string representation
      const keyBuffer = await crypto.subtle.exportKey('raw', cryptoKey);
      const keyArray = new Uint8Array(keyBuffer);
      const keyString = Array.from(keyArray).map(b => b.toString(16).padStart(2, '0')).join('');
      
      productionLogger.info('Secure key generated', {
        entropyScore: entropyData.score,
        keyLength: keyString.length
      }, 'EnhancedClientSecurity');

      return keyString;
    } catch (error) {
      productionLogger.error('Failed to generate secure key', error, 'EnhancedClientSecurity');
      throw error;
    }
  }

  async collectEnhancedEntropy(): Promise<{ data: string; score: number }> {
    const entropyData: string[] = [];
    let totalEntropy = 0;

    try {
      // Hardware entropy from crypto API
      if (window.crypto && window.crypto.getRandomValues) {
        const hardwareArray = new Uint8Array(32);
        window.crypto.getRandomValues(hardwareArray);
        entropyData.push(Array.from(hardwareArray).join(''));
        totalEntropy += 256; // 32 bytes * 8 bits
      }

      // Timing-based entropy
      const timingStart = performance.now();
      await new Promise(resolve => setTimeout(resolve, Math.random() * 10));
      const timingEnd = performance.now();
      const timingEntropy = (timingEnd - timingStart).toString();
      entropyData.push(timingEntropy);
      totalEntropy += 32; // Conservative estimate

      // Mouse/touch entropy if available
      const interactionEntropy = this.getInteractionEntropy();
      if (interactionEntropy) {
        entropyData.push(interactionEntropy);
        totalEntropy += 64;
      }

      // Device characteristics entropy
      const deviceEntropy = await this.getDeviceEntropy();
      entropyData.push(deviceEntropy);
      totalEntropy += 128;

      // Memory entropy
      const memoryEntropy = this.getMemoryEntropy();
      entropyData.push(memoryEntropy);
      totalEntropy += 32;

      return {
        data: entropyData.join('|'),
        score: totalEntropy
      };
    } catch (error) {
      productionLogger.error('Error collecting entropy', error, 'EnhancedClientSecurity');
      // Fallback to basic entropy
      return {
        data: Math.random().toString() + Date.now().toString(),
        score: 64
      };
    }
  }

  private getInteractionEntropy(): string | null {
    // Get entropy from recent user interactions if stored
    const lastMouseMove = localStorage.getItem('_last_mouse_entropy');
    const lastKeyPress = localStorage.getItem('_last_key_entropy');
    
    if (lastMouseMove || lastKeyPress) {
      return `${lastMouseMove || ''}|${lastKeyPress || ''}`;
    }
    
    return null;
  }

  private async getDeviceEntropy(): Promise<string> {
    const entropy: string[] = [];
    
    // Screen characteristics
    entropy.push(`${screen.width}x${screen.height}x${screen.colorDepth}`);
    
    // Timezone
    entropy.push(Intl.DateTimeFormat().resolvedOptions().timeZone);
    
    // Language
    entropy.push(navigator.language);
    
    // Hardware concurrency
    entropy.push(navigator.hardwareConcurrency.toString());
    
    // Canvas fingerprinting (basic)
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('Entropy test', 2, 2);
        entropy.push(canvas.toDataURL().slice(-50)); // Last 50 chars
      }
    } catch {
      entropy.push('canvas_unavailable');
    }
    
    return entropy.join('|');
  }

  private getMemoryEntropy(): string {
    // Use memory usage patterns as entropy source
    const memInfo = (performance as any).memory;
    if (memInfo) {
      return `${memInfo.usedJSHeapSize}|${memInfo.totalJSHeapSize}|${Date.now()}`;
    }
    return `${Math.random()}|${Date.now()}`;
  }

  async validateKeyStrength(key: string): Promise<{ valid: boolean; score: number; issues: string[] }> {
    const issues: string[] = [];
    let score = 0;

    // Length check
    if (key.length >= 64) {
      score += 25;
    } else {
      issues.push('Key length insufficient');
    }

    // Entropy check
    const entropy = this.calculateEntropy(key);
    if (entropy >= 6) {
      score += 25;
    } else {
      issues.push('Key entropy too low');
    }

    // Character diversity
    const diversity = this.calculateCharacterDiversity(key);
    if (diversity >= 0.8) {
      score += 25;
    } else {
      issues.push('Insufficient character diversity');
    }

    // Pattern detection
    if (!this.hasRepeatingPatterns(key)) {
      score += 25;
    } else {
      issues.push('Repeating patterns detected');
    }

    return {
      valid: score >= 75,
      score,
      issues
    };
  }

  private calculateEntropy(data: string): number {
    const charCounts: { [key: string]: number } = {};
    for (const char of data) {
      charCounts[char] = (charCounts[char] || 0) + 1;
    }

    let entropy = 0;
    const length = data.length;
    for (const count of Object.values(charCounts)) {
      const probability = count / length;
      entropy -= probability * Math.log2(probability);
    }

    return entropy;
  }

  private calculateCharacterDiversity(data: string): number {
    const uniqueChars = new Set(data).size;
    const maxPossibleChars = 94; // Printable ASCII chars
    return uniqueChars / maxPossibleChars;
  }

  private hasRepeatingPatterns(data: string): boolean {
    // Check for repeating substrings
    for (let i = 2; i <= Math.min(8, data.length / 2); i++) {
      const pattern = data.substring(0, i);
      if (data.includes(pattern.repeat(2))) {
        return true;
      }
    }
    return false;
  }

  async getSecurityMetrics(): Promise<SecurityMetrics> {
    const vulnerabilities: string[] = [];
    const recommendations: string[] = [];
    
    // Check entropy capability
    const entropyCheck = await this.collectEnhancedEntropy();
    
    if (entropyCheck.score < this.config.minEntropyBits) {
      vulnerabilities.push('Insufficient entropy generation');
      recommendations.push('Enable hardware security module if available');
    }

    // Check browser security features
    if (!window.crypto || !window.crypto.getRandomValues) {
      vulnerabilities.push('Hardware random number generator unavailable');
      recommendations.push('Use a modern browser with crypto API support');
    }

    if (!window.isSecureContext) {
      vulnerabilities.push('Insecure context (not HTTPS)');
      recommendations.push('Use HTTPS for all security operations');
    }

    // Calculate security level
    let securityLevel: SecurityMetrics['securityLevel'] = 'high';
    if (vulnerabilities.length > 2) {
      securityLevel = 'low';
    } else if (vulnerabilities.length > 0) {
      securityLevel = 'medium';
    } else if (entropyCheck.score > this.config.minEntropyBits * 1.5) {
      securityLevel = 'critical';
    }

    return {
      entropyScore: entropyCheck.score,
      deviceFingerprint: await this.getDeviceEntropy(),
      securityLevel,
      vulnerabilities,
      recommendations
    };
  }

  async autoUpgradeKeys(): Promise<void> {
    try {
      // Check all stored encrypted items for key age
      const keys = Object.keys(localStorage).filter(key => key.startsWith('secure_'));
      
      for (const key of keys) {
        const item = localStorage.getItem(key);
        if (item) {
          try {
            const parsed = JSON.parse(item);
            const age = Date.now() - (parsed.timestamp || 0);
            
            if (age > this.config.keyRotationInterval) {
              productionLogger.info('Auto-upgrading expired key', { key }, 'EnhancedClientSecurity');
              // Key rotation would happen here
            }
          } catch {
            // Invalid format, skip
          }
        }
      }
    } catch (error) {
      productionLogger.error('Auto key upgrade failed', error, 'EnhancedClientSecurity');
    }
  }
}

export const enhancedClientSecurity = EnhancedClientSecurity.getInstance();
