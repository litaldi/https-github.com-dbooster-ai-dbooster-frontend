import { breachDetectionService } from './breachDetectionService';
import { productionLogger } from '@/utils/productionLogger';

export interface PasswordValidationResult {
  isValid: boolean;
  score: number;
  feedback: string[];
  breachInfo?: {
    isBreached: boolean;
    breachCount: number;
  };
}

const COMMON_PASSWORDS = [
  'password', '123456', '123456789', 'qwerty', 'abc123', 'password123',
  'admin', 'letmein', 'welcome', 'monkey', '1234567890', 'dragon',
  'master', 'hello', 'freedom', 'whatever', 'qazwsx', 'trustno1'
];

const KEYBOARD_PATTERNS = [
  'qwerty', 'asdf', 'zxcv', '1234', 'abcd', 'qwertyuiop',
  'asdfghjkl', 'zxcvbnm', '1234567890'
];

function containsCommonPassword(password: string): boolean {
  const lowerPassword = password.toLowerCase();
  return COMMON_PASSWORDS.some(common => lowerPassword.includes(common));
}

function containsKeyboardPattern(password: string): boolean {
  const lowerPassword = password.toLowerCase();
  return KEYBOARD_PATTERNS.some(pattern => lowerPassword.includes(pattern));
}

function calculateEntropy(password: string): number {
  const charSets = [
    /[a-z]/.test(password) ? 26 : 0,
    /[A-Z]/.test(password) ? 26 : 0,
    /\d/.test(password) ? 10 : 0,
    /[!@#$%^&*(),.?":{}|<>]/.test(password) ? 32 : 0
  ];
  
  const charSetSize = charSets.reduce((sum, size) => sum + size, 0);
  return password.length * Math.log2(charSetSize);
}

export class EnhancedPasswordValidator {
  private static instance: EnhancedPasswordValidator;
  private passwordHistory: Set<string> = new Set();

  static getInstance(): EnhancedPasswordValidator {
    if (!EnhancedPasswordValidator.instance) {
      EnhancedPasswordValidator.instance = new EnhancedPasswordValidator();
    }
    return EnhancedPasswordValidator.instance;
  }

  async validatePassword(password: string, userInfo?: { email?: string; name?: string }): Promise<PasswordValidationResult> {
    const feedback: string[] = [];
    let score = 0;

    // Basic validation
    if (password.length < 8) {
      feedback.push('Password must be at least 8 characters long');
    } else if (password.length < 12) {
      feedback.push('Consider using a longer password for better security');
      score += 10;
    } else {
      score += 20;
    }

    // Character variety
    if (!/[a-z]/.test(password)) {
      feedback.push('Password should contain lowercase letters');
    } else score += 15;

    if (!/[A-Z]/.test(password)) {
      feedback.push('Password should contain uppercase letters');
    } else score += 15;

    if (!/\d/.test(password)) {
      feedback.push('Password should contain numbers');
    } else score += 15;

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      feedback.push('Password should contain special characters');
    } else score += 15;

    // Check for common patterns
    if (/(.)\1{2,}/.test(password)) {
      feedback.push('Avoid repeating characters');
      score -= 10;
    }

    if (/123|abc|qwerty/i.test(password)) {
      feedback.push('Avoid common sequences');
      score -= 15;
    }

    // Check common passwords
    if (containsCommonPassword(password)) {
      feedback.push('Avoid common passwords');
      score -= 20;
    }

    // Check keyboard patterns
    if (containsKeyboardPattern(password)) {
      feedback.push('Avoid keyboard patterns');
      score -= 15;
    }

    // Entropy check
    const entropy = calculateEntropy(password);
    if (entropy < 40) {
      feedback.push('Password complexity is too low');
      score -= 10;
    } else if (entropy > 60) {
      score += 10;
    }

    // Check against user info
    if (userInfo) {
      if (userInfo.email && password.toLowerCase().includes(userInfo.email.split('@')[0].toLowerCase())) {
        feedback.push('Password should not contain your email');
        score -= 20;
      }
      if (userInfo.name && password.toLowerCase().includes(userInfo.name.toLowerCase())) {
        feedback.push('Password should not contain your name');
        score -= 20;
      }
    }

    // Check password history
    if (this.passwordHistory.has(password)) {
      feedback.push('Please choose a password you haven\'t used recently');
      score -= 25;
    }

    // Check against breach database
    let breachInfo;
    try {
      breachInfo = await breachDetectionService.checkPasswordBreach(password);
      if (breachInfo.isBreached) {
        feedback.push(`This password has been found in ${breachInfo.breachCount} data breaches. Please choose a different password.`);
        score -= 30;
      } else {
        score += 10;
      }
    } catch (error) {
      productionLogger.warn('Could not check password against breach database', error);
      feedback.push('Unable to verify password against known breaches');
    }

    score = Math.max(0, Math.min(100, score));

    const isValid = score >= 60 && feedback.filter(f => f.includes('must') || f.includes('should')).length === 0;

    if (isValid) {
      this.addToHistory(password);
    }

    return {
      isValid,
      score,
      feedback,
      breachInfo
    };
  }

  private addToHistory(password: string): void {
    this.passwordHistory.add(password);
    // Keep only last 5 passwords
    if (this.passwordHistory.size > 5) {
      const first = this.passwordHistory.values().next().value;
      this.passwordHistory.delete(first);
    }
  }

  clearHistory(): void {
    this.passwordHistory.clear();
  }
}

export const enhancedPasswordValidator = EnhancedPasswordValidator.getInstance();
