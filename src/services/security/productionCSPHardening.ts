
import { productionLogger } from '@/utils/productionLogger';

interface CSPDirectives {
  'default-src': string[];
  'script-src': string[];
  'style-src': string[];
  'img-src': string[];
  'connect-src': string[];
  'font-src': string[];
  'object-src': string[];
  'media-src': string[];
  'frame-src': string[];
  'worker-src': string[];
  'child-src': string[];
  'form-action': string[];
  'frame-ancestors': string[];
  'base-uri': string[];
  'upgrade-insecure-requests': boolean;
  'block-all-mixed-content': boolean;
}

class ProductionCSPHardening {
  private static instance: ProductionCSPHardening;
  private nonce: string = '';

  static getInstance(): ProductionCSPHardening {
    if (!ProductionCSPHardening.instance) {
      ProductionCSPHardening.instance = new ProductionCSPHardening();
    }
    return ProductionCSPHardening.instance;
  }

  generateNonce(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    this.nonce = btoa(String.fromCharCode(...array));
    return this.nonce;
  }

  getNonce(): string {
    return this.nonce;
  }

  applyStrictProductionCSP(): void {
    if (!import.meta.env.PROD) {
      productionLogger.info('Development mode detected, using relaxed CSP');
      this.applyDevelopmentCSP();
      return;
    }

    this.removeExistingCSP();
    const nonce = this.generateNonce();
    const strictDirectives = this.getStrictProductionDirectives(nonce);
    const cspString = this.buildCSPString(strictDirectives);

    this.applyCSpToDocument(cspString);
    this.setupCSPViolationReporting();
    
    productionLogger.secureInfo('Strict production CSP applied', { 
      nonce: nonce.substring(0, 8),
      directiveCount: Object.keys(strictDirectives).length
    });
  }

  private getStrictProductionDirectives(nonce: string): CSPDirectives {
    return {
      'default-src': ["'self'"],
      'script-src': [
        "'self'",
        `'nonce-${nonce}'`,
        // Remove 'unsafe-inline' and 'unsafe-eval' for production
      ],
      'style-src': [
        "'self'",
        `'nonce-${nonce}'`,
        'https://fonts.googleapis.com'
        // Remove 'unsafe-inline' - use nonce instead
      ],
      'img-src': [
        "'self'",
        'data:',
        'https:',
        'blob:'
      ],
      'connect-src': [
        "'self'",
        'https://sxcbpmqsbcpsljwwwwyv.supabase.co',
        'wss://sxcbpmqsbcpsljwwwwyv.supabase.co',
        // Remove external IP services for production
      ],
      'font-src': [
        "'self'",
        'https://fonts.gstatic.com',
        'data:'
      ],
      'object-src': ["'none'"],
      'media-src': ["'self'"],
      'frame-src': ["'none'"],
      'worker-src': ["'self'", 'blob:'],
      'child-src': ["'none'"],
      'form-action': ["'self'"],
      'frame-ancestors': ["'none'"],
      'base-uri': ["'self'"],
      'upgrade-insecure-requests': true,
      'block-all-mixed-content': true
    };
  }

  private applyDevelopmentCSP(): void {
    const relaxedDirectives: CSPDirectives = {
      'default-src': ["'self'"],
      'script-src': [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
        'http://localhost:*',
        'ws://localhost:*'
      ],
      'style-src': [
        "'self'",
        "'unsafe-inline'",
        'https://fonts.googleapis.com'
      ],
      'img-src': [
        "'self'",
        'data:',
        'https:',
        'blob:',
        'http:'
      ],
      'connect-src': [
        "'self'",
        'https://sxcbpmqsbcpsljwwwwyv.supabase.co',
        'wss://sxcbpmqsbcpsljwwwwyv.supabase.co',
        'https://api.ipify.org',
        'http://localhost:*',
        'ws://localhost:*'
      ],
      'font-src': [
        "'self'",
        'https://fonts.gstatic.com',
        'data:'
      ],
      'object-src': ["'none'"],
      'media-src': ["'self'"],
      'frame-src': ["'self'"],
      'worker-src': ["'self'", 'blob:'],
      'child-src': ["'self'"],
      'form-action': ["'self'"],
      'frame-ancestors': ["'none'"],
      'base-uri': ["'self'"],
      'upgrade-insecure-requests': false,
      'block-all-mixed-content': false
    };

    const cspString = this.buildCSPString(relaxedDirectives);
    this.applyCSpToDocument(cspString);
  }

  private buildCSPString(directives: CSPDirectives): string {
    const parts: string[] = [];

    Object.entries(directives).forEach(([key, value]) => {
      if (typeof value === 'boolean') {
        if (value) {
          parts.push(key.replace(/-/g, '-'));
        }
      } else if (Array.isArray(value) && value.length > 0) {
        parts.push(`${key} ${value.join(' ')}`);
      }
    });

    return parts.join('; ');
  }

  private applyCSpToDocument(cspString: string): void {
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = cspString;
    document.head.appendChild(meta);
  }

  private removeExistingCSP(): void {
    const existingCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (existingCSP) {
      existingCSP.remove();
    }
  }

  private setupCSPViolationReporting(): void {
    document.addEventListener('securitypolicyviolation', (event) => {
      productionLogger.error('CSP Violation detected', {
        blockedURI: event.blockedURI,
        documentURI: event.documentURI,
        effectiveDirective: event.effectiveDirective,
        violatedDirective: event.violatedDirective,
        lineNumber: event.lineNumber,
        sourceFile: event.sourceFile
      }, 'CSPViolation');

      // Report severe violations
      if (event.violatedDirective.includes('script-src') || 
          event.violatedDirective.includes('object-src')) {
        this.reportCriticalCSPViolation(event);
      }
    });
  }

  private async reportCriticalCSPViolation(event: SecurityPolicyViolationEvent): Promise<void> {
    try {
      // This would typically send to a security monitoring service
      productionLogger.error('CRITICAL CSP VIOLATION', {
        type: 'critical_csp_violation',
        blockedURI: event.blockedURI,
        violatedDirective: event.violatedDirective,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      });
    } catch (error) {
      console.error('Failed to report CSP violation:', error);
    }
  }

  addInlineStyleNonce(element: HTMLElement): void {
    if (this.nonce) {
      element.setAttribute('nonce', this.nonce);
    }
  }

  addInlineScriptNonce(element: HTMLScriptElement): void {
    if (this.nonce) {
      element.setAttribute('nonce', this.nonce);
    }
  }
}

export const productionCSPHardening = ProductionCSPHardening.getInstance();
