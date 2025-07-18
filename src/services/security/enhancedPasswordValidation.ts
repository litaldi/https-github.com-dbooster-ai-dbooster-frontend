
import { productionLogger } from '@/utils/productionLogger';

export interface PasswordValidationResult {
  isValid: boolean;
  score: number;
  feedback: string[];
  breachInfo?: {
    isBreached: boolean;
    breachCount?: number;
  };
}

export interface PasswordValidationOptions {
  email?: string;
  name?: string;
  requireSpecialChars?: boolean;
  minLength?: number;
  maxLength?: number;
}

class EnhancedPasswordValidator {
  private static instance: EnhancedPasswordValidator;
  private readonly MIN_PASSWORD_LENGTH = 12;
  private readonly MAX_PASSWORD_LENGTH = 128;
  private readonly BREACH_CHECK_CACHE = new Map<string, boolean>();

  static getInstance(): EnhancedPasswordValidator {
    if (!EnhancedPasswordValidator.instance) {
      EnhancedPasswordValidator.instance = new EnhancedPasswordValidator();
    }
    return EnhancedPasswordValidator.instance;
  }

  async validatePassword(
    password: string, 
    options: PasswordValidationOptions = {}
  ): Promise<PasswordValidationResult> {
    const feedback: string[] = [];
    let score = 0;
    let isValid = true;

    const minLength = options.minLength || this.MIN_PASSWORD_LENGTH;
    const maxLength = options.maxLength || this.MAX_PASSWORD_LENGTH;

    // Length validation
    if (password.length < minLength) {
      feedback.push(`Password must be at least ${minLength} characters long`);
      isValid = false;
    } else {
      score += 20;
    }

    if (password.length > maxLength) {
      feedback.push(`Password must not exceed ${maxLength} characters`);
      isValid = false;
    }

    // Character variety validation
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    if (!hasUppercase) {
      feedback.push('Password must contain at least one uppercase letter');
      isValid = false;
    } else {
      score += 15;
    }

    if (!hasLowercase) {
      feedback.push('Password must contain at least one lowercase letter');
      isValid = false;
    } else {
      score += 15;
    }

    if (!hasNumbers) {
      feedback.push('Password must contain at least one number');
      isValid = false;
    } else {
      score += 15;
    }

    if (options.requireSpecialChars !== false && !hasSpecialChars) {
      feedback.push('Password must contain at least one special character');
      isValid = false;
    } else if (hasSpecialChars) {
      score += 20;
    }

    // Common patterns validation
    if (this.hasCommonPatterns(password)) {
      feedback.push('Password contains common patterns and is too predictable');
      score -= 20;
    } else {
      score += 10;
    }

    // Personal information validation
    if (options.email && this.containsPersonalInfo(password, options.email)) {
      feedback.push('Password should not contain your email address');
      score -= 15;
    }

    if (options.name && this.containsPersonalInfo(password, options.name)) {
      feedback.push('Password should not contain your name');
      score -= 15;
    }

    // Breach check
    const breachInfo = await this.checkPasswordBreach(password);
    if (breachInfo.isBreached) {
      feedback.push('This password has been found in data breaches and should not be used');
      isValid = false;
      score -= 50;
    } else {
      score += 5;
    }

    // Ensure score is between 0 and 100
    score = Math.max(0, Math.min(100, score));

    return {
      isValid,
      score,
      feedback,
      breachInfo
    };
  }

  private hasCommonPatterns(password: string): boolean {
    const commonPatterns = [
      /123456/,
      /password/i,
      /qwerty/i,
      /abc123/i,
      /admin/i,
      /letmein/i,
      /welcome/i,
      /monkey/i,
      /dragon/i,
      /(.)\1{2,}/, // Repeated characters
      /012345/,
      /987654/
    ];

    return commonPatterns.some(pattern => pattern.test(password));
  }

  private containsPersonalInfo(password: string, info: string): boolean {
    const lowerPassword = password.toLowerCase();
    const lowerInfo = info.toLowerCase();
    
    // Check if password contains significant parts of personal info
    if (lowerInfo.length >= 3) {
      return lowerPassword.includes(lowerInfo) || lowerInfo.includes(lowerPassword);
    }
    
    return false;
  }

  private async checkPasswordBreach(password: string): Promise<{ isBreached: boolean; breachCount?: number }> {
    try {
      // Create SHA-1 hash of password
      const encoder = new TextEncoder();
      const data = encoder.encode(password);
      const hashBuffer = await crypto.subtle.digest('SHA-1', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();

      // Check cache first
      if (this.BREACH_CHECK_CACHE.has(hashHex)) {
        return { isBreached: this.BREACH_CHECK_CACHE.get(hashHex)! };
      }

      // Use HaveIBeenPwned API with k-anonymity
      const prefix = hashHex.substring(0, 5);
      const suffix = hashHex.substring(5);

      const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
      
      if (!response.ok) {
        productionLogger.warn('Breach check service unavailable', {}, 'EnhancedPasswordValidator');
        return { isBreached: false };
      }

      const hashList = await response.text();
      const lines = hashList.split('\n');
      
      for (const line of lines) {
        const [hashSuffix, count] = line.split(':');
        if (hashSuffix.trim() === suffix) {
          const breachCount = parseInt(count.trim(), 10);
          this.BREACH_CHECK_CACHE.set(hashHex, true);
          return { isBreached: true, breachCount };
        }
      }

      this.BREACH_CHECK_CACHE.set(hashHex, false);
      return { isBreached: false };
    } catch (error) {
      productionLogger.error('Password breach check failed', error, 'EnhancedPasswordValidator');
      return { isBreached: false };
    }
  }
}

export const enhancedPasswordValidator = EnhancedPasswordValidator.getInstance();
