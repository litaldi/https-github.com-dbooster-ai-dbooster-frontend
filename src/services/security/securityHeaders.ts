
export class SecurityHeaders {
  private static instance: SecurityHeaders;

  static getInstance(): SecurityHeaders {
    if (!SecurityHeaders.instance) {
      SecurityHeaders.instance = new SecurityHeaders();
    }
    return SecurityHeaders.instance;
  }

  private readonly SECURITY_HEADERS = {
    // Content Security Policy - strict policy
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'nonce-${this.generateNonce()}' https://cdn.jsdelivr.net https://unpkg.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
      "media-src 'self'",
      "object-src 'none'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; '),

    // Strict Transport Security
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',

    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',

    // Prevent clickjacking
    'X-Frame-Options': 'DENY',

    // XSS Protection
    'X-XSS-Protection': '1; mode=block',

    // Referrer Policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',

    // Permissions Policy
    'Permissions-Policy': [
      'accelerometer=()',
      'camera=()',
      'geolocation=(self)',
      'gyroscope=()',
      'magnetometer=()',
      'microphone=()',
      'payment=()',
      'usb=()'
    ].join(', '),

    // Cross-Origin Policies
    'Cross-Origin-Embedder-Policy': 'require-corp',
    'Cross-Origin-Opener-Policy': 'same-origin',
    'Cross-Origin-Resource-Policy': 'same-origin'
  };

  applyToDocument(): void {
    // Generate nonce for this session
    const nonce = this.generateNonce();
    const cspWithNonce = this.SECURITY_HEADERS['Content-Security-Policy'].replace(
      "'nonce-${this.generateNonce()}'", 
      `'nonce-${nonce}'`
    );
    
    // Apply meta tags for security headers that can be set client-side
    this.setMetaTag('Content-Security-Policy', cspWithNonce);
    this.setMetaTag('X-Content-Type-Options', this.SECURITY_HEADERS['X-Content-Type-Options']);
    this.setMetaTag('X-Frame-Options', this.SECURITY_HEADERS['X-Frame-Options']);
    this.setMetaTag('Referrer-Policy', this.SECURITY_HEADERS['Referrer-Policy']);
    this.setMetaTag('Permissions-Policy', this.SECURITY_HEADERS['Permissions-Policy']);
  }

  private setMetaTag(name: string, content: string): void {
    // Remove existing meta tag if present
    const existing = document.querySelector(`meta[http-equiv="${name}"]`);
    if (existing) {
      existing.remove();
    }

    // Create new meta tag
    const meta = document.createElement('meta');
    meta.setAttribute('http-equiv', name);
    meta.setAttribute('content', content);
    document.head.appendChild(meta);
  }

  validateSecurityHeaders(): { 
    score: number; 
    missing: string[]; 
    recommendations: string[] 
  } {
    const missing: string[] = [];
    const recommendations: string[] = [];
    let score = 0;

    // Check if headers are applied (simplified check for client-side)
    const metaTags = document.querySelectorAll('meta[http-equiv]');
    const appliedHeaders = Array.from(metaTags).map(tag => 
      tag.getAttribute('http-equiv')
    );

    const requiredHeaders = [
      'Content-Security-Policy',
      'X-Content-Type-Options',
      'X-Frame-Options',
      'Referrer-Policy'
    ];

    requiredHeaders.forEach(header => {
      if (appliedHeaders.includes(header)) {
        score += 25;
      } else {
        missing.push(header);
      }
    });

    if (missing.length > 0) {
      recommendations.push('Apply missing security headers to improve protection');
    }

    if (!window.location.protocol.startsWith('https') && window.location.hostname !== 'localhost') {
      recommendations.push('Use HTTPS to ensure secure communication');
      score = Math.max(0, score - 25);
    }

    return { score, missing, recommendations };
  }

  // CORS configuration for API requests
  getCorsHeaders(): Record<string, string> {
    return {
      'Access-Control-Allow-Origin': window.location.origin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '86400'
    };
  }

  // Validate external URLs before making requests
  validateExternalUrl(url: string): { 
    isValid: boolean; 
    reason?: string; 
    sanitizedUrl?: string 
  } {
    try {
      const urlObj = new URL(url);
      
      // Block dangerous protocols
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return {
          isValid: false,
          reason: 'Only HTTP and HTTPS protocols are allowed'
        };
      }

      // Block private IP ranges
      const hostname = urlObj.hostname;
      const privateIpRanges = [
        /^10\./,
        /^192\.168\./,
        /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
        /^127\./,
        /^169\.254\./,
        /^::1$/,
        /^fe80:/i
      ];

      if (privateIpRanges.some(range => range.test(hostname))) {
        return {
          isValid: false,
          reason: 'Requests to private IP addresses are not allowed'
        };
      }

      // Sanitize URL
      const sanitizedUrl = urlObj.toString();

      return {
        isValid: true,
        sanitizedUrl
      };
    } catch (error) {
      return {
        isValid: false,
        reason: 'Invalid URL format'
      };
    }
  }

  private generateNonce(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
}

export const securityHeaders = SecurityHeaders.getInstance();

// Auto-apply security headers when module loads
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    securityHeaders.applyToDocument();
  });
  
  // Apply immediately if DOM is already loaded
  if (document.readyState === 'loading') {
    securityHeaders.applyToDocument();
  }
}
