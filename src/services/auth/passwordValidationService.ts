
import { enhancedAuthenticationSecurity } from '@/services/security/enhancedAuthenticationSecurity';

export class PasswordValidationService {
  static async checkPasswordStrength(password: string, email?: string) {
    const result = await enhancedAuthenticationSecurity.validateStrongPassword(password, email);
    return {
      score: result.score,
      feedback: result.feedback,
      isValid: result.isValid
    };
  }
}
