
import { productionLogger } from '@/utils/productionLogger';

export class SecurityHeadersService {
  private static instance: SecurityHeadersService;

  static getInstance(): SecurityHeadersService {
    if (!SecurityHeadersService.instance) {
      SecurityHeadersService.instance = new SecurityHeadersService();
    }
    return SecurityHeadersService.instance;
  }

  initializeSecurityHeaders(): void {
    try {
      // Set Content Security Policy
      this.setContentSecurityPolicy();
      
      // Set other security headers via meta tags
      this.setSecurityMetaTags();
      
      productionLogger.warn('Security headers initialized', {}, 'SecurityHeadersService');
    } catch (error) {
      productionLogger.error('Failed to initialize security headers', error, 'SecurityHeadersService');
    }
  }

  private setContentSecurityPolicy(): void {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.github.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests"
    ].join('; ');

    // Try to set via meta tag
    let metaTag = document.querySelector('meta[http-equiv="Content-Security-Policy"]') as HTMLMetaElement;
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.httpEquiv = 'Content-Security-Policy';
      document.head.appendChild(metaTag);
    }
    metaTag.content = csp;
  }

  private setSecurityMetaTags(): void {
    const securityHeaders = [
      { name: 'X-Content-Type-Options', content: 'nosniff' },
      { name: 'X-Frame-Options', content: 'DENY' },
      { name: 'X-XSS-Protection', content: '1; mode=block' },
      { name: 'Referrer-Policy', content: 'strict-origin-when-cross-origin' },
      { name: 'Permissions-Policy', content: 'camera=(), microphone=(), geolocation=()' }
    ];

    securityHeaders.forEach(header => {
      let metaTag = document.querySelector(`meta[http-equiv="${header.name}"]`) as HTMLMetaElement;
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.httpEquiv = header.name;
        document.head.appendChild(metaTag);
      }
      metaTag.content = header.content;
    });
  }

  validateSecurityHeaders(): { isSecure: boolean; missingHeaders: string[]; warnings: string[] } {
    const missingHeaders: string[] = [];
    const warnings: string[] = [];

    // Check for CSP
    const csp = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (!csp) {
      missingHeaders.push('Content-Security-Policy');
    }

    // Check for X-Frame-Options
    const xFrameOptions = document.querySelector('meta[http-equiv="X-Frame-Options"]');
    if (!xFrameOptions) {
      missingHeaders.push('X-Frame-Options');
    }

    // Check for X-Content-Type-Options
    const xContentType = document.querySelector('meta[http-equiv="X-Content-Type-Options"]');
    if (!xContentType) {
      missingHeaders.push('X-Content-Type-Options');
    }

    // Check HTTPS
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
      warnings.push('Site is not served over HTTPS');
    }

    return {
      isSecure: missingHeaders.length === 0,
      missingHeaders,
      warnings
    };
  }
}

export const securityHeadersService = SecurityHeadersService.getInstance();
