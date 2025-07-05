
export class EnhancedSecurityHeaders {
  private static instance: EnhancedSecurityHeaders;

  static getInstance(): EnhancedSecurityHeaders {
    if (!EnhancedSecurityHeaders.instance) {
      EnhancedSecurityHeaders.instance = new EnhancedSecurityHeaders();
    }
    return EnhancedSecurityHeaders.instance;
  }

  private readonly NONCE = this.generateNonce();

  private generateNonce(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array));
  }

  private readonly STRICT_CSP_HEADERS = {
    // Strict Content Security Policy - removes unsafe-inline and unsafe-eval
    'Content-Security-Policy': [
      "default-src 'self'",
      `script-src 'self' 'nonce-${this.NONCE}' https://cdn.gpteng.co https://www.googletagmanager.com`,
      "style-src 'self' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https://lovable.dev https://www.google-analytics.com",
      "connect-src 'self' https://sxcbpmqsbcpsljwwwwyv.supabase.co wss://sxcbpmqsbcpsljwwwwyv.supabase.co https://www.google-analytics.com",
      "media-src 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
      "block-all-mixed-content"
    ].join('; '),

    // Enhanced security headers
    'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Expect-CT': 'max-age=86400, enforce',
    
    // Feature Policy / Permissions Policy
    'Permissions-Policy': [
      'accelerometer=()',
      'camera=()',
      'geolocation=()',
      'gyroscope=()',
      'magnetometer=()',
      'microphone=()',
      'payment=()',
      'usb=()',
      'interest-cohort=()',
      'browsing-topics=()'
    ].join(', '),

    // Cross-Origin Policies
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin'
  };

  applyStrictSecurityHeaders(): void {
    // Remove existing headers first
    this.removeExistingHeaders();

    // Apply strict security headers
    Object.entries(this.STRICT_CSP_HEADERS).forEach(([name, content]) => {
      const meta = document.createElement('meta');
      meta.setAttribute('http-equiv', name);
      meta.setAttribute('content', content);
      document.head.appendChild(meta);
    });

    // Add security.txt meta tag for vulnerability disclosure
    const securityMeta = document.createElement('meta');
    securityMeta.setAttribute('name', 'security');
    securityMeta.setAttribute('content', '/.well-known/security.txt');
    document.head.appendChild(securityMeta);
  }

  private removeExistingHeaders(): void {
    const headerNames = Object.keys(this.STRICT_CSP_HEADERS);
    headerNames.forEach(name => {
      const existing = document.querySelector(`meta[http-equiv="${name}"]`);
      if (existing) {
        existing.remove();
      }
    });
  }

  getNonce(): string {
    return this.NONCE;
  }

  // Validate external URLs with enhanced security checks
  validateSecureUrl(url: string): { isValid: boolean; reason?: string; sanitizedUrl?: string } {
    try {
      const urlObj = new URL(url);
      
      // Only allow HTTPS in production
      if (import.meta.env.PROD && urlObj.protocol !== 'https:') {
        return {
          isValid: false,
          reason: 'Only HTTPS URLs are allowed in production'
        };
      }

      // Block suspicious or dangerous domains
      const dangerousDomains = [
        'bit.ly', 'tinyurl.com', 'goo.gl', 't.co',
        'suspicious-domain.com', 'malware-site.net'
      ];

      if (dangerousDomains.some(domain => urlObj.hostname.includes(domain))) {
        return {
          isValid: false,
          reason: 'URL contains potentially dangerous domain'
        };
      }

      // Enhanced private IP detection
      const hostname = urlObj.hostname;
      const privateIpRanges = [
        /^10\./,
        /^192\.168\./,
        /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
        /^127\./,
        /^169\.254\./,
        /^::1$/,
        /^fe80:/i,
        /^fc00:/i,
        /^fd00:/i
      ];

      if (privateIpRanges.some(range => range.test(hostname))) {
        return {
          isValid: false,
          reason: 'Requests to private IP addresses are not allowed'
        };
      }

      return {
        isValid: true,
        sanitizedUrl: urlObj.toString()
      };
    } catch (error) {
      return {
        isValid: false,
        reason: 'Invalid URL format'
      };
    }
  }
}

export const enhancedSecurityHeaders = EnhancedSecurityHeaders.getInstance();
