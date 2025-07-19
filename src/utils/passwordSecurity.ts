
import { productionLogger } from './productionLogger';

// Common compromised passwords (partial list for demonstration)
const COMPROMISED_PASSWORDS = new Set([
  'password123',
  '123456789',
  'qwerty123',
  'password1',
  'admin123',
  'letmein',
  'welcome123'
]);

interface PasswordStrengthResult {
  score: number;
  feedback: string[];
  isStrong: boolean;
  isCompromised: boolean;
}

export class PasswordSecurity {
  private static readonly MIN_LENGTH = 12;
  private static readonly REQUIRED_COMPLEXITY = 4; // uppercase, lowercase, numbers, symbols

  static analyzePassword(password: string): PasswordStrengthResult {
    let score = 0;
    const feedback: string[] = [];
    
    // Length check
    if (password.length >= this.MIN_LENGTH) {
      score += 20;
    } else {
      feedback.push(`Password must be at least ${this.MIN_LENGTH} characters long`);
    }

    // Complexity checks
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSymbols = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    const complexityCount = [hasLowercase, hasUppercase, hasNumbers, hasSymbols].filter(Boolean).length;
    score += complexityCount * 15;

    if (!hasLowercase) feedback.push('Add lowercase letters');
    if (!hasUppercase) feedback.push('Add uppercase letters');
    if (!hasNumbers) feedback.push('Add numbers');
    if (!hasSymbols) feedback.push('Add special characters');

    // Pattern checks
    if (!/(.)\1{2,}/.test(password)) { // No repeated characters
      score += 10;
    } else {
      feedback.push('Avoid repeated characters');
    }

    if (!/(?:012|123|234|345|456|567|678|789|890|abc|bcd|def)/.test(password.toLowerCase())) { // No sequences
      score += 10;
    } else {
      feedback.push('Avoid sequential characters');
    }

    // Dictionary/compromised check
    const isCompromised = this.isPasswordCompromised(password);
    if (!isCompromised) {
      score += 15;
    } else {
      feedback.push('This password has been found in data breaches');
    }

    // Entropy bonus for longer passwords
    if (password.length >= 16) score += 10;
    if (password.length >= 20) score += 10;

    const isStrong = score >= 80 && complexityCount >= this.REQUIRED_COMPLEXITY && !isCompromised;

    return {
      score: Math.min(score, 100),
      feedback,
      isStrong,
      isCompromised
    };
  }

  static isPasswordCompromised(password: string): boolean {
    // Simple check against known compromised passwords
    const lowercasePassword = password.toLowerCase();
    
    // Check exact matches
    if (COMPROMISED_PASSWORDS.has(lowercasePassword)) {
      return true;
    }

    // Check common patterns
    const commonPatterns = [
      /^password\d*$/i,
      /^admin\d*$/i,
      /^welcome\d*$/i,
      /^qwerty\d*$/i,
      /^\d{6,}$/,
      /^[a-z]+\d{1,4}$/i
    ];

    return commonPatterns.some(pattern => pattern.test(password));
  }

  static generateSecurePassword(length: number = 16): string {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    const allChars = lowercase + uppercase + numbers + symbols;
    
    // Ensure at least one character from each category
    let password = '';
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    
    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
  }

  static logPasswordAnalysis(userId: string, result: PasswordStrengthResult): void {
    productionLogger.info('Password analysis completed', {
      userId: userId.substring(0, 8), // Partial ID for privacy
      score: result.score,
      isStrong: result.isStrong,
      isCompromised: result.isCompromised,
      feedbackCount: result.feedback.length
    }, 'PasswordSecurity');
  }
}

export const passwordSecurity = PasswordSecurity;
