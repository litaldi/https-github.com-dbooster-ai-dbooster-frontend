
interface SecurityHeaders {
  'Content-Security-Policy': string;
  'Strict-Transport-Security': string;
  'X-Frame-Options': string;
  'X-Content-Type-Options': string;
  'Referrer-Policy': string;
  'Permissions-Policy': string;
}

export class SecurityHeadersService {
  private static instance: SecurityHeadersService;

  static getInstance(): SecurityHeadersService {
    if (!SecurityHeadersService.instance) {
      SecurityHeadersService.instance = new SecurityHeadersService();
    }
    return SecurityHeadersService.instance;
  }

  getSecurityHeaders(): SecurityHeaders {
    return {
      'Content-Security-Policy': this.generateCSP(),
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
    };
  }

  private generateCSP(): string {
    const nonce = this.generateNonce();
    return [
      "default-src 'self'",
      `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
      "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
      "font-src 'self' fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https://sxcbpmqsbcpsljwwwwyv.supabase.co https://api.ipify.org",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; ');
  }

  private generateNonce(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }

  applySecurityHeaders(): void {
    if (typeof document !== 'undefined') {
      const headers = this.getSecurityHeaders();
      
      // Create meta tags for CSP
      const cspMeta = document.createElement('meta');
      cspMeta.httpEquiv = 'Content-Security-Policy';
      cspMeta.content = headers['Content-Security-Policy'];
      document.head.appendChild(cspMeta);

      // Set other security headers via meta tags where possible
      const frameMeta = document.createElement('meta');
      frameMeta.httpEquiv = 'X-Frame-Options';
      frameMeta.content = headers['X-Frame-Options'];
      document.head.appendChild(frameMeta);
    }
  }
}

export const securityHeadersService = SecurityHeadersService.getInstance();
