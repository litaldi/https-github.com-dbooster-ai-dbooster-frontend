import { productionLogger } from './productionLogger';

export interface PasswordStrengthResult {
  score: number; // 0-100
  strength: 'very-weak' | 'weak' | 'fair' | 'good' | 'strong' | 'very-strong';
  feedback: string[];
  isCompromised: boolean;
  entropy: number;
}

export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSymbols: boolean;
  maxConsecutiveRepeats: number;
  preventCommonPatterns: boolean;
  preventPersonalInfo: boolean;
}

const DEFAULT_POLICY: PasswordPolicy = {
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSymbols: true,
  maxConsecutiveRepeats: 2,
  preventCommonPatterns: true,
  preventPersonalInfo: true
};

// Common passwords and patterns
const COMMON_PASSWORDS = new Set([
  'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
  'admin', 'letmein', 'welcome', 'monkey', '1234567890', 'iloveyou',
  'princess', 'rockyou', '12345678', 'sunshine', 'password1', 'login'
]);

const COMMON_PATTERNS = [
  /^(.)\1+$/, // Repeated characters (aaa, 111)
  /^(01|12|23|34|45|56|67|78|89|90)+$/, // Sequential numbers
  /^(ab|bc|cd|de|ef|fg|gh|hi|ij|jk|kl|lm|mn|no|op|pq|qr|rs|st|tu|uv|vw|wx|xy|yz)+$/i, // Sequential letters
  /keyboard|qwerty|asdf|zxcv/i, // Keyboard patterns
  /password|admin|login|user|root/i // Common words
];

const LEAKED_PASSWORD_HASHES = new Set([
  // SHA-1 hashes of commonly leaked passwords (first 6 characters)
  '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', // 'password'
  'e99a18c428cb38d5f260853678922e03abd68b8bb1e5e9d06f7a8b8e6dbd78db', // '123456'
  '15e2b0d3c33891ebb0f1ef609ec419420c20e320ce94c65fbc8c3312448eb225', // '123456789'
  // Add more as needed - these would come from breach databases
]);

export class PasswordSecurityService {
  private static instance: PasswordSecurityService;
  private policy: PasswordPolicy;

  private constructor(policy: PasswordPolicy = DEFAULT_POLICY) {
    this.policy = policy;
  }

  static getInstance(policy?: PasswordPolicy): PasswordSecurityService {
    if (!PasswordSecurityService.instance) {
      PasswordSecurityService.instance = new PasswordSecurityService(policy);
    }
    return PasswordSecurityService.instance;
  }

  async analyzePassword(
    password: string, 
    userInfo?: { email?: string; name?: string; username?: string }
  ): Promise<PasswordStrengthResult> {
    try {
      const feedback: string[] = [];
      let score = 0;

      // Basic length check
      if (password.length < this.policy.minLength) {
        feedback.push(`Password must be at least ${this.policy.minLength} characters long`);
      } else {
        score += Math.min(25, password.length * 2); // Up to 25 points for length
      }

      // Character variety checks
      const hasUpper = /[A-Z]/.test(password);
      const hasLower = /[a-z]/.test(password);
      const hasNumbers = /\d/.test(password);
      const hasSymbols = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

      if (this.policy.requireUppercase && !hasUpper) {
        feedback.push('Password must contain uppercase letters');
      } else if (hasUpper) {
        score += 10;
      }

      if (this.policy.requireLowercase && !hasLower) {
        feedback.push('Password must contain lowercase letters');
      } else if (hasLower) {
        score += 10;
      }

      if (this.policy.requireNumbers && !hasNumbers) {
        feedback.push('Password must contain numbers');
      } else if (hasNumbers) {
        score += 10;
      }

      if (this.policy.requireSymbols && !hasSymbols) {
        feedback.push('Password must contain special characters');
      } else if (hasSymbols) {
        score += 15;
      }

      // Calculate entropy
      const entropy = this.calculateEntropy(password);
      score += Math.min(20, entropy / 3); // Up to 20 points for entropy

      // Check for consecutive repeating characters
      if (this.policy.maxConsecutiveRepeats > 0) {
        const consecutiveRepeats = this.findConsecutiveRepeats(password);
        if (consecutiveRepeats > this.policy.maxConsecutiveRepeats) {
          feedback.push(`Avoid ${consecutiveRepeats} consecutive repeating characters`);
          score -= 10;
        }
      }

      // Check for common patterns
      if (this.policy.preventCommonPatterns && this.hasCommonPatterns(password)) {
        feedback.push('Avoid common patterns and keyboard sequences');
        score -= 15;
      }

      // Check for personal information
      if (this.policy.preventPersonalInfo && userInfo && this.containsPersonalInfo(password, userInfo)) {
        feedback.push('Password should not contain personal information');
        score -= 10;
      }

      // Check if password is in common passwords list
      if (COMMON_PASSWORDS.has(password.toLowerCase())) {
        feedback.push('This password is too common and easily guessable');
        score -= 20;
      }

      // Check if password has been compromised
      const isCompromised = await this.checkPasswordCompromise(password);
      if (isCompromised) {
        feedback.push('This password has been found in data breaches');
        score -= 25;
      }

      // Ensure score is within bounds
      score = Math.max(0, Math.min(100, score));

      // Determine strength level
      const strength = this.getStrengthLevel(score);

      // Add positive feedback for strong passwords
      if (score >= 80) {
        feedback.unshift('Excellent password strength!');
      } else if (score >= 60) {
        feedback.unshift('Good password strength');
      } else if (score >= 40) {
        feedback.unshift('Fair password strength - consider improvements');
      }

      return {
        score,
        strength,
        feedback,
        isCompromised,
        entropy
      };

    } catch (error) {
      productionLogger.error('Password analysis failed', error, 'PasswordSecurityService');
      
      return {
        score: 0,
        strength: 'very-weak',
        feedback: ['Unable to analyze password strength'],
        isCompromised: false,
        entropy: 0
      };
    }
  }

  private calculateEntropy(password: string): number {
    const charSets = [
      { chars: 'abcdefghijklmnopqrstuvwxyz', count: 26 },
      { chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', count: 26 },
      { chars: '0123456789', count: 10 },
      { chars: '!@#$%^&*()_+-=[]{}|;:,.<>?', count: 32 }
    ];

    let poolSize = 0;
    charSets.forEach(set => {
      if (password.split('').some(char => set.chars.includes(char))) {
        poolSize += set.count;
      }
    });

    return password.length * Math.log2(poolSize);
  }

  private findConsecutiveRepeats(password: string): number {
    let maxRepeats = 0;
    let currentRepeats = 1;

    for (let i = 1; i < password.length; i++) {
      if (password[i] === password[i - 1]) {
        currentRepeats++;
      } else {
        maxRepeats = Math.max(maxRepeats, currentRepeats);
        currentRepeats = 1;
      }
    }

    return Math.max(maxRepeats, currentRepeats);
  }

  private hasCommonPatterns(password: string): boolean {
    return COMMON_PATTERNS.some(pattern => pattern.test(password));
  }

  private containsPersonalInfo(password: string, userInfo: { email?: string; name?: string; username?: string }): boolean {
    const lowerPassword = password.toLowerCase();
    
    if (userInfo.email) {
      const emailParts = userInfo.email.toLowerCase().split('@')[0];
      if (lowerPassword.includes(emailParts)) return true;
    }

    if (userInfo.name) {
      const nameParts = userInfo.name.toLowerCase().split(' ');
      if (nameParts.some(part => part.length > 2 && lowerPassword.includes(part))) return true;
    }

    if (userInfo.username) {
      if (lowerPassword.includes(userInfo.username.toLowerCase())) return true;
    }

    return false;
  }

  private async checkPasswordCompromise(password: string): Promise<boolean> {
    try {
      // Create SHA-1 hash of password for HaveIBeenPwned API
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-1', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
      
      const prefix = hashHex.substring(0, 5);
      const suffix = hashHex.substring(5);
      
      // Use HaveIBeenPwned API to check for password breaches
      const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
      if (!response.ok) {
        // Fallback to local check if API is unavailable
        return LEAKED_PASSWORD_HASHES.has(hashHex.toLowerCase());
      }
      
      const text = await response.text();
      return text.includes(suffix);

    } catch (error) {
      productionLogger.error('Password compromise check failed', error, 'PasswordSecurityService');
      // Fallback to local check
      return this.checkLocalPasswordCompromise(password);
    }
  }

  private checkLocalPasswordCompromise(password: string): boolean {
    // Local fallback for common compromised passwords
    const commonCompromisedPasswords = [
      'password', '123456', 'password123', 'admin', 'qwerty', 
      'letmein', 'welcome', 'monkey', '1234567890', 'abc123',
      'password1', 'iloveyou', 'princess', 'rockyou', 'football'
    ];
    
    return commonCompromisedPasswords.includes(password.toLowerCase());
  }

  private getStrengthLevel(score: number): PasswordStrengthResult['strength'] {
    if (score >= 90) return 'very-strong';
    if (score >= 80) return 'strong';
    if (score >= 60) return 'good';
    if (score >= 40) return 'fair';
    if (score >= 20) return 'weak';
    return 'very-weak';
  }

  generateSecurePassword(length: number = 16): string {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    const allChars = lowercase + uppercase + numbers + symbols;
    let password = '';

    // Ensure at least one character from each required set
    if (this.policy.requireLowercase) password += lowercase[Math.floor(Math.random() * lowercase.length)];
    if (this.policy.requireUppercase) password += uppercase[Math.floor(Math.random() * uppercase.length)];
    if (this.policy.requireNumbers) password += numbers[Math.floor(Math.random() * numbers.length)];
    if (this.policy.requireSymbols) password += symbols[Math.floor(Math.random() * symbols.length)];

    // Fill remaining length with random characters
    for (let i = password.length; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Shuffle the password to avoid predictable patterns
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  updatePolicy(newPolicy: Partial<PasswordPolicy>): void {
    this.policy = { ...this.policy, ...newPolicy };
  }

  getPolicy(): PasswordPolicy {
    return { ...this.policy };
  }
}

export const passwordSecurity = PasswordSecurityService.getInstance();