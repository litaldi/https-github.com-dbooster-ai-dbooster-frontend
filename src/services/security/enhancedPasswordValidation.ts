
import { productionLogger } from '@/utils/productionLogger';

interface PasswordValidationResult {
  isValid: boolean;
  score: number;
  feedback: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export class EnhancedPasswordValidation {
  private static instance: EnhancedPasswordValidation;
  
  // Common passwords list (top 100 most common passwords)
  private readonly commonPasswords = new Set([
    'password', '123456', '123456789', 'guest', 'qwerty', '12345678', '111111',
    '12345', 'col123456', '123123', '1234567', '1234', '1234567890', '000000',
    '555555', '666666', '999999', '123321', '654321', '7777777', '123',
    '1234qwer', 'qwertyui', '123654', 'superman', 'qwerty123', 'dragon',
    'monkey', 'letmein', 'baseball', 'trustno1', 'hello', 'football',
    'master', 'welcome', '696969', 'abc123', 'mustang', 'michael',
    'shadow', 'charlie', 'jordan', 'hunter', 'buster', 'soccer',
    'harley', 'ranger', 'jennifer', 'george', 'sunshine', 'andrew'
  ]);

  private readonly weakPatterns = [
    /^(.)\1+$/, // All same character
    /^(012|123|234|345|456|567|678|789|890|987|876|765|654|543|432|321|210)/, // Sequential numbers
    /^(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|zyx|yxw|xwv|wvu|vut|uts|tsr|srq|rqp|qpo|pon|onm|nml|mlk|lkj|kji|jih|ihg|hgf|gfe|fed|edc|dcb|cba)/i, // Sequential letters
    /^(.{1,2})\1+$/, // Repeated short patterns
  ];

  static getInstance(): EnhancedPasswordValidation {
    if (!EnhancedPasswordValidation.instance) {
      EnhancedPasswordValidation.instance = new EnhancedPasswordValidation();
    }
    return EnhancedPasswordValidation.instance;
  }

  async validatePassword(password: string, email?: string, userData?: {
    name?: string;
    username?: string;
  }): Promise<PasswordValidationResult> {
    const feedback: string[] = [];
    let score = 0;
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';

    try {
      // Length checks
      if (password.length < 8) {
        feedback.push('Password must be at least 8 characters long');
        riskLevel = 'high';
      } else if (password.length >= 8) {
        score += 1;
      }

      if (password.length >= 12) score += 1;
      if (password.length >= 16) score += 1;

      // Character variety checks
      if (/[a-z]/.test(password)) {
        score += 1;
      } else {
        feedback.push('Include lowercase letters (a-z)');
      }

      if (/[A-Z]/.test(password)) {
        score += 1;
      } else {
        feedback.push('Include uppercase letters (A-Z)');
      }

      if (/[0-9]/.test(password)) {
        score += 1;
      } else {
        feedback.push('Include numbers (0-9)');
      }

      if (/[^a-zA-Z0-9]/.test(password)) {
        score += 1;
      } else {
        feedback.push('Include special characters (!@#$%^&*)');
      }

      // Check for common passwords
      if (this.commonPasswords.has(password.toLowerCase())) {
        feedback.push('This password is too common and easily guessed');
        score = Math.max(0, score - 3);
        riskLevel = 'critical';
      }

      // Check for weak patterns
      for (const pattern of this.weakPatterns) {
        if (pattern.test(password.toLowerCase())) {
          feedback.push('Avoid predictable patterns like "123" or "abc"');
          score = Math.max(0, score - 2);
          riskLevel = 'high';
          break;
        }
      }

      // Personal information checks
      if (email) {
        const emailLocal = email.split('@')[0].toLowerCase();
        if (password.toLowerCase().includes(emailLocal) && emailLocal.length > 2) {
          feedback.push('Password should not contain your email address');
          score = Math.max(0, score - 2);
          riskLevel = 'high';
        }
      }

      if (userData?.name && userData.name.length > 2) {
        const name = userData.name.toLowerCase();
        if (password.toLowerCase().includes(name)) {
          feedback.push('Password should not contain your name');
          score = Math.max(0, score - 1);
          riskLevel = 'medium';
        }
      }

      // Keyboard pattern detection
      if (this.hasKeyboardPattern(password)) {
        feedback.push('Avoid keyboard patterns like "qwerty" or "asdf"');
        score = Math.max(0, score - 2);
        riskLevel = 'high';
      }

      // Calculate final risk level based on score
      if (score >= 6 && feedback.length === 0) {
        riskLevel = 'low';
      } else if (score >= 4) {
        riskLevel = Math.max(riskLevel as any, 'medium' as any) as any;
      } else if (score >= 2) {
        riskLevel = Math.max(riskLevel as any, 'high' as any) as any;
      } else {
        riskLevel = 'critical';
      }

      const isValid = score >= 4 && feedback.length === 0;

      productionLogger.secureInfo('Password validation completed', {
        score,
        isValid,
        riskLevel,
        feedbackCount: feedback.length
      }, 'PasswordValidation');

      return {
        isValid,
        score: Math.min(score, 8), // Cap at 8
        feedback,
        riskLevel
      };

    } catch (error) {
      productionLogger.error('Password validation failed', error, 'PasswordValidation');
      return {
        isValid: false,
        score: 0,
        feedback: ['Password validation failed. Please try again.'],
        riskLevel: 'critical'
      };
    }
  }

  private hasKeyboardPattern(password: string): boolean {
    const keyboardRows = [
      'qwertyuiopasdfghjklzxcvbnm',
      'qwertyuiop',
      'asdfghjkl',
      'zxcvbnm',
      '1234567890',
      '!@#$%^&*()'
    ];

    const lower = password.toLowerCase();
    
    for (const row of keyboardRows) {
      for (let i = 0; i <= row.length - 3; i++) {
        const pattern = row.substring(i, i + 3);
        const reversePattern = pattern.split('').reverse().join('');
        
        if (lower.includes(pattern) || lower.includes(reversePattern)) {
          return true;
        }
      }
    }
    
    return false;
  }

  getPasswordStrengthLabel(score: number): string {
    if (score >= 7) return 'Very Strong';
    if (score >= 5) return 'Strong';
    if (score >= 3) return 'Medium';
    if (score >= 1) return 'Weak';
    return 'Very Weak';
  }

  getPasswordStrengthColor(score: number): string {
    if (score >= 7) return 'text-green-600';
    if (score >= 5) return 'text-blue-600';
    if (score >= 3) return 'text-yellow-600';
    if (score >= 1) return 'text-orange-600';
    return 'text-red-600';
  }
}

export const enhancedPasswordValidation = EnhancedPasswordValidation.getInstance();
