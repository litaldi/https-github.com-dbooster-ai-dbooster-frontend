import { productionLogger } from '@/utils/productionLogger';

export class InputSanitizationService {
  private static instance: InputSanitizationService;

  static getInstance(): InputSanitizationService {
    if (!InputSanitizationService.instance) {
      InputSanitizationService.instance = new InputSanitizationService();
    }
    return InputSanitizationService.instance;
  }

  sanitizeInput(input: string): string {
    if (typeof input !== 'string') {
      return '';
    }

    let sanitized = input;

    // Remove potentially dangerous characters
    sanitized = sanitized.replace(/[<>'"&]/g, (match) => {
      switch (match) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '"': return '&quot;';
        case "'": return '&#x27;';
        case '&': return '&amp;';
        default: return match;
      }
    });

    // Remove SQL injection patterns
    sanitized = sanitized.replace(/(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\s)/gi, '');
    sanitized = sanitized.replace(/(--|\/\*|\*\/|;)/g, '');

    // Remove script tags and event handlers
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    sanitized = sanitized.replace(/on\w+\s*=/gi, '');
    sanitized = sanitized.replace(/javascript:/gi, '');

    // Remove command injection patterns
    sanitized = sanitized.replace(/[;&|`$(){}[\]]/g, '');

    // Limit length to prevent DoS
    if (sanitized.length > 10000) {
      sanitized = sanitized.substring(0, 10000);
      productionLogger.warn('Input truncated due to excessive length', { 
        originalLength: input.length 
      }, 'InputSanitizationService');
    }

    return sanitized.trim();
  }

  sanitizeEmail(email: string): string {
    if (typeof email !== 'string') {
      return '';
    }

    // Basic email sanitization
    let sanitized = email.toLowerCase().trim();
    
    // Remove dangerous characters but keep valid email characters
    sanitized = sanitized.replace(/[^a-z0-9@._+-]/g, '');
    
    // Validate basic email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitized)) {
      return '';
    }

    return sanitized;
  }

  sanitizeFileName(fileName: string): string {
    if (typeof fileName !== 'string') {
      return '';
    }

    // Remove path traversal attempts
    let sanitized = fileName.replace(/\.\.\//g, '').replace(/\.\.\\/g, '');
    
    // Remove dangerous characters
    sanitized = sanitized.replace(/[<>:"/\\|?*]/g, '');
    
    // Remove control characters
    sanitized = sanitized.replace(/[\x00-\x1f\x80-\x9f]/g, '');
    
    // Limit length
    if (sanitized.length > 255) {
      sanitized = sanitized.substring(0, 255);
    }

    return sanitized.trim();
  }

  sanitizeUrl(url: string): string {
    if (typeof url !== 'string') {
      return '';
    }

    try {
      const urlObj = new URL(url);
      
      // Only allow http and https protocols
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return '';
      }

      // Remove potential XSS in URL
      const sanitizedUrl = url.replace(/javascript:/gi, '').replace(/data:/gi, '');
      
      return sanitizedUrl;
    } catch {
      return '';
    }
  }
}

export const inputSanitizationService = InputSanitizationService.getInstance();
