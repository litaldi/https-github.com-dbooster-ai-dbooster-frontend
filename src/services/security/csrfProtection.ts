
import { productionLogger } from '@/utils/productionLogger';

interface CSRFToken {
  token: string;
  timestamp: number;
  expiry: number;
}

class CSRFProtection {
  private static instance: CSRFProtection;
  private readonly TOKEN_EXPIRY = 60 * 60 * 1000; // 1 hour
  private readonly TOKEN_LENGTH = 32;
  private currentToken: CSRFToken | null = null;

  static getInstance(): CSRFProtection {
    if (!CSRFProtection.instance) {
      CSRFProtection.instance = new CSRFProtection();
    }
    return CSRFProtection.instance;
  }

  private generateSecureToken(): string {
    const array = new Uint8Array(this.TOKEN_LENGTH);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  getCSRFToken(): string {
    const now = Date.now();
    
    // Generate new token if none exists or current token is expired
    if (!this.currentToken || now > this.currentToken.expiry) {
      this.currentToken = {
        token: this.generateSecureToken(),
        timestamp: now,
        expiry: now + this.TOKEN_EXPIRY
      };
      
      productionLogger.info('New CSRF token generated', {
        timestamp: this.currentToken.timestamp,
        expiry: this.currentToken.expiry
      });
    }

    return this.currentToken.token;
  }

  validateCSRFToken(token: string): boolean {
    if (!this.currentToken) {
      productionLogger.warn('CSRF validation failed: No token exists');
      return false;
    }

    const now = Date.now();
    
    // Check if token is expired
    if (now > this.currentToken.expiry) {
      productionLogger.warn('CSRF validation failed: Token expired');
      return false;
    }

    // Validate token
    const isValid = token === this.currentToken.token;
    
    if (!isValid) {
      productionLogger.warn('CSRF validation failed: Token mismatch');
    }

    return isValid;
  }

  addCSRFTokenToRequest(options: RequestInit = {}): RequestInit {
    const token = this.getCSRFToken();
    
    return {
      ...options,
      headers: {
        ...options.headers,
        'X-CSRF-Token': token
      }
    };
  }

  addCSRFTokenToFormData(formData: FormData): FormData {
    const token = this.getCSRFToken();
    formData.append('_csrf', token);
    return formData;
  }

  addCSRFTokenToForm(form: HTMLFormElement): void {
    const token = this.getCSRFToken();
    
    // Remove existing CSRF token input if present
    const existingInput = form.querySelector('input[name="_csrf"]');
    if (existingInput) {
      existingInput.remove();
    }

    // Add new CSRF token input
    const csrfInput = document.createElement('input');
    csrfInput.type = 'hidden';
    csrfInput.name = '_csrf';
    csrfInput.value = token;
    form.appendChild(csrfInput);
  }

  validateFormCSRF(formData: FormData): boolean {
    const token = formData.get('_csrf') as string;
    return this.validateCSRFToken(token);
  }

  rotateToken(): void {
    this.currentToken = null;
    this.getCSRFToken(); // This will generate a new token
    productionLogger.info('CSRF token rotated');
  }
}

export const csrfProtection = CSRFProtection.getInstance();
