
import { auditLogger } from './auditLogger';

export class InputValidationService {
  private static instance: InputValidationService;

  static getInstance(): InputValidationService {
    if (!InputValidationService.instance) {
      InputValidationService.instance = new InputValidationService();
    }
    return InputValidationService.instance;
  }

  async validateInput(input: any, schema: any): Promise<{ valid: boolean; errors?: string[] }> {
    const errors: string[] = [];

    try {
      // Basic validation rules
      if (schema.required && !input) {
        errors.push('Field is required');
        return { valid: false, errors };
      }

      if (schema.type === 'email' && input) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input)) {
          errors.push('Invalid email format');
        }
      }

      if (schema.type === 'phone' && input) {
        const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(input)) {
          errors.push('Invalid phone number format');
        }
      }

      if (schema.type === 'password' && input) {
        if (input.length < 8) {
          errors.push('Password must be at least 8 characters long');
        }
        if (!/(?=.*[a-z])/.test(input)) {
          errors.push('Password must contain at least one lowercase letter');
        }
        if (!/(?=.*[A-Z])/.test(input)) {
          errors.push('Password must contain at least one uppercase letter');
        }
        if (!/(?=.*\d)/.test(input)) {
          errors.push('Password must contain at least one number');
        }
      }

      if (schema.maxLength && input && input.length > schema.maxLength) {
        errors.push(`Field must be no more than ${schema.maxLength} characters`);
      }

      if (schema.minLength && input && input.length < schema.minLength) {
        errors.push(`Field must be at least ${schema.minLength} characters`);
      }

      // XSS prevention - basic sanitization check
      if (typeof input === 'string' && this.containsSuspiciousContent(input)) {
        errors.push('Input contains potentially harmful content');
      }

      return { valid: errors.length === 0, errors: errors.length > 0 ? errors : undefined };
    } catch (error) {
      console.error('Input validation error:', error);
      return { valid: false, errors: ['Validation failed'] };
    }
  }

  private containsSuspiciousContent(input: string): boolean {
    const suspiciousPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe[^>]*>/gi,
      /<object[^>]*>/gi,
      /<embed[^>]*>/gi,
    ];

    return suspiciousPatterns.some(pattern => pattern.test(input));
  }

  sanitizeInput(input: string): string {
    if (typeof input !== 'string') return input;
    
    return input
      .replace(/[<>]/g, '') // Remove < and > characters
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .trim();
  }
}

export const inputValidationService = InputValidationService.getInstance();
