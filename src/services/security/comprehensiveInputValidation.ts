
import DOMPurify from 'dompurify';
import { productionLogger } from '@/utils/productionLogger';

export class ComprehensiveInputValidation {
  private static instance: ComprehensiveInputValidation;
  
  // Dangerous patterns to detect
  private readonly dangerousPatterns = [
    // SQL injection patterns
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/gi,
    // XSS patterns
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    // Command injection
    /(\||;|&|`|\$\()/g,
    // Path traversal
    /\.\.\//g,
    // LDAP injection
    /[()&|!]/g
  ];

  private readonly htmlEntities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };

  static getInstance(): ComprehensiveInputValidation {
    if (!ComprehensiveInputValidation.instance) {
      ComprehensiveInputValidation.instance = new ComprehensiveInputValidation();
    }
    return ComprehensiveInputValidation.instance;
  }

  sanitizeInput(input: string, options: {
    allowHtml?: boolean,
    maxLength?: number,
    stripScripts?: boolean
  } = {}): string {
    if (!input || typeof input !== 'string') {
      return '';
    }

    const { allowHtml = false, maxLength = 1000, stripScripts = true } = options;

    // Truncate input if too long
    let sanitized = input.length > maxLength ? input.substring(0, maxLength) : input;

    // Remove null bytes
    sanitized = sanitized.replace(/\0/g, '');

    if (allowHtml) {
      // Use DOMPurify for HTML content
      sanitized = DOMPurify.sanitize(sanitized, {
        ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li'],
        ALLOWED_ATTR: []
      });
    } else {
      // HTML encode all entities
      sanitized = this.htmlEncode(sanitized);
    }

    if (stripScripts) {
      sanitized = this.removeScriptTags(sanitized);
    }

    return sanitized.trim();
  }

  validateInput(input: string, type: 'email' | 'url' | 'filename' | 'sql' | 'general' = 'general'): {
    isValid: boolean;
    errors: string[];
    sanitized: string;
  } {
    const errors: string[] = [];
    
    // Check for dangerous patterns
    for (const pattern of this.dangerousPatterns) {
      if (pattern.test(input)) {
        errors.push(`Potentially dangerous pattern detected: ${pattern.source}`);
      }
    }

    // Type-specific validation
    switch (type) {
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)) {
          errors.push('Invalid email format');
        }
        break;
      case 'url':
        try {
          new URL(input);
        } catch {
          errors.push('Invalid URL format');
        }
        break;
      case 'filename':
        if (/[<>:"|?*\x00-\x1f]/.test(input)) {
          errors.push('Invalid filename characters');
        }
        break;
      case 'sql':
        // More strict SQL validation
        if (this.dangerousPatterns.slice(0, 1).some(pattern => pattern.test(input))) {
          errors.push('Potential SQL injection detected');
        }
        break;
    }

    const sanitized = this.sanitizeInput(input);

    return {
      isValid: errors.length === 0,
      errors,
      sanitized
    };
  }

  private htmlEncode(str: string): string {
    return str.replace(/[&<>"'`=\/]/g, (char) => {
      return this.htmlEntities[char as keyof typeof this.htmlEntities] || char;
    });
  }

  private removeScriptTags(str: string): string {
    return str.replace(/<script[^>]*>.*?<\/script>/gi, '');
  }

  // Validate file uploads
  validateFileUpload(file: File, allowedTypes: string[] = [], maxSize: number = 5 * 1024 * 1024): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (file.size > maxSize) {
      errors.push(`File size exceeds ${maxSize / 1024 / 1024}MB limit`);
    }

    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      errors.push(`File type ${file.type} not allowed`);
    }

    // Check for dangerous file extensions
    const dangerousExtensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.com', '.vbs', '.js'];
    const fileName = file.name.toLowerCase();
    
    if (dangerousExtensions.some(ext => fileName.endsWith(ext))) {
      errors.push('File type not allowed for security reasons');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export const comprehensiveInputValidation = ComprehensiveInputValidation.getInstance();
