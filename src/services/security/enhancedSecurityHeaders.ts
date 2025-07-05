
import { productionLogger } from '@/utils/productionLogger';

export class EnhancedSecurityHeaders {
  private static instance: EnhancedSecurityHeaders;
  private nonce: string;

  constructor() {
    this.nonce = this.generateNonce();
  }

  static getInstance(): EnhancedSecurityHeaders {
    if (!EnhancedSecurityHeaders.instance) {
      EnhancedSecurityHeaders.instance = new EnhancedSecurityHeaders();
    }
    return EnhancedSecurityHeaders.instance;
  }

  private generateNonce(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  getNonce(): string {
    return this.nonce;
  }

  applyStrictSecurityHeaders(): void {
    try {
      // Remove existing security headers to avoid conflicts
      this.removeExistingSecurityHeaders();

      // Content Security Policy with nonce
      const csp = [
        "default-src 'self'",
        `script-src 'self' 'nonce-${this.nonce}' 'strict-dynamic'`,
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com data:",
        "img-src 'self' data: https: blob:",
        "connect-src 'self' https://sxcbpmqsbcpsljwwwwyv.supabase.co wss://sxcbpmqsbcpsljwwwwyv.supabase.co",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "upgrade-insecure-requests",
        "block-all-mixed-content"
      ].join('; ');

      this.addMetaTag('Content-Security-Policy', csp);

      // Additional security headers
      const securityHeaders = [
        { name: 'X-Content-Type-Options', content: 'nosniff' },
        { name: 'X-Frame-Options', content: 'DENY' },
        { name: 'X-XSS-Protection', content: '1; mode=block' },
        { name: 'Referrer-Policy', content: 'strict-origin-when-cross-origin' },
        { name: 'Permissions-Policy', content: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
        { name: 'Cross-Origin-Embedder-Policy', content: 'require-corp' },
        { name: 'Cross-Origin-Opener-Policy', content: 'same-origin' },
        { name: 'Cross-Origin-Resource-Policy', content: 'same-origin' }
      ];

      securityHeaders.forEach(({ name, content }) => {
        this.addMetaTag(name, content);
      });

      productionLogger.secureInfo('Enhanced security headers applied successfully', {}, 'EnhancedSecurityHeaders');
    } catch (error) {
      productionLogger.error('Failed to apply enhanced security headers', error, 'EnhancedSecurityHeaders');
    }
  }

  private addMetaTag(name: string, content: string): void {
    const meta = document.createElement('meta');
    meta.httpEquiv = name;
    meta.content = content;
    document.head.appendChild(meta);
  }

  private removeExistingSecurityHeaders(): void {
    const headerNames = [
      'Content-Security-Policy',
      'X-Content-Type-Options',
      'X-Frame-Options', 
      'X-XSS-Protection',
      'Referrer-Policy',
      'Permissions-Policy',
      'Cross-Origin-Embedder-Policy',
      'Cross-Origin-Opener-Policy',
      'Cross-Origin-Resource-Policy'
    ];

    headerNames.forEach(name => {
      const existing = document.querySelector(`meta[http-equiv="${name}"]`);
      if (existing) {
        existing.remove();
      }
    });
  }

  validateSecureUrl(url: string): { isValid: boolean; reason?: string } {
    try {
      const urlObj = new URL(url);
      
      // Block dangerous protocols
      if (!['http:', 'https:', 'mailto:', 'tel:'].includes(urlObj.protocol)) {
        return { isValid: false, reason: 'Unsafe protocol detected' };
      }

      // Block potentially dangerous domains
      const dangerousDomains = ['bit.ly', 'tinyurl.com', 'short.link'];
      if (dangerousDomains.some(domain => urlObj.hostname.includes(domain))) {
        return { isValid: false, reason: 'Potentially unsafe shortened URL' };
      }

      return { isValid: true };
    } catch {
      return { isValid: false, reason: 'Invalid URL format' };
    }
  }
}

export const enhancedSecurityHeaders = EnhancedSecurityHeaders.getInstance();
