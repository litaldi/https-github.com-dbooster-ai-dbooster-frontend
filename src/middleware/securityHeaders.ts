
export interface SecurityHeadersConfig {
  contentSecurityPolicy?: boolean;
  strictTransportSecurity?: boolean;
  xFrameOptions?: boolean;
  xContentTypeOptions?: boolean;
  referrerPolicy?: boolean;
  permissionsPolicy?: boolean;
  crossOriginEmbedderPolicy?: boolean;
  crossOriginOpenerPolicy?: boolean;
  crossOriginResourcePolicy?: boolean;
}

export class SecurityHeaders {
  private static defaultConfig: SecurityHeadersConfig = {
    contentSecurityPolicy: true,
    strictTransportSecurity: true,
    xFrameOptions: true,
    xContentTypeOptions: true,
    referrerPolicy: true,
    permissionsPolicy: true,
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: true,
  };

  static getHeaders(config: SecurityHeadersConfig = {}): Record<string, string> {
    const finalConfig = { ...this.defaultConfig, ...config };
    const headers: Record<string, string> = {};

    if (finalConfig.contentSecurityPolicy) {
      headers['Content-Security-Policy'] = this.getCSPHeader();
    }

    if (finalConfig.strictTransportSecurity) {
      headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload';
    }

    if (finalConfig.xFrameOptions) {
      headers['X-Frame-Options'] = 'DENY';
    }

    if (finalConfig.xContentTypeOptions) {
      headers['X-Content-Type-Options'] = 'nosniff';
    }

    if (finalConfig.referrerPolicy) {
      headers['Referrer-Policy'] = 'strict-origin-when-cross-origin';
    }

    if (finalConfig.permissionsPolicy) {
      headers['Permissions-Policy'] = this.getPermissionsPolicyHeader();
    }

    if (finalConfig.crossOriginEmbedderPolicy) {
      headers['Cross-Origin-Embedder-Policy'] = 'require-corp';
    }

    if (finalConfig.crossOriginOpenerPolicy) {
      headers['Cross-Origin-Opener-Policy'] = 'same-origin';
    }

    if (finalConfig.crossOriginResourcePolicy) {
      headers['Cross-Origin-Resource-Policy'] = 'same-origin';
    }

    return headers;
  }

  private static getCSPHeader(): string {
    const isDevelopment = import.meta.env.DEV;
    
    if (isDevelopment) {
      // Development CSP - more permissive
      return [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com data:",
        "img-src 'self' data: https: blob:",
        "connect-src 'self' ws: wss: https://sxcbpmqsbcpsljwwwwyv.supabase.co",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'"
      ].join('; ');
    } else {
      // Production CSP - strict security
      return [
        "default-src 'self'",
        "script-src 'self'",
        "style-src 'self' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        "img-src 'self' data: https:",
        "connect-src 'self' https://sxcbpmqsbcpsljwwwwyv.supabase.co wss://sxcbpmqsbcpsljwwwwyv.supabase.co",
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "upgrade-insecure-requests",
        "block-all-mixed-content"
      ].join('; ');
    }
  }

  private static getPermissionsPolicyHeader(): string {
    return [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'payment=()',
      'usb=()',
      'magnetometer=()',
      'gyroscope=()',
      'accelerometer=()',
      'ambient-light-sensor=()',
      'autoplay=()',
      'battery=()',
      'display-capture=()',
      'document-domain=()',
      'encrypted-media=()',
      'fullscreen=(self)',
      'gamepad=()',
      'navigation-override=()',
      'publickey-credentials-get=()',
      'screen-wake-lock=()',
      'sync-xhr=()',
      'xr-spatial-tracking=()'
    ].join(', ');
  }

  static applyToDocument(): void {
    const headers = this.getHeaders();
    
    // Remove existing security meta tags
    this.removeExistingSecurityTags();
    
    // Apply CSP via meta tag
    if (headers['Content-Security-Policy']) {
      const cspMeta = document.createElement('meta');
      cspMeta.httpEquiv = 'Content-Security-Policy';
      cspMeta.content = headers['Content-Security-Policy'];
      document.head.appendChild(cspMeta);
    }

    // Apply other security headers via meta tags where possible
    const metaHeaders = [
      'X-Content-Type-Options',
      'X-Frame-Options',
      'Referrer-Policy'
    ];

    metaHeaders.forEach(headerName => {
      if (headers[headerName]) {
        const meta = document.createElement('meta');
        meta.httpEquiv = headerName;
        meta.content = headers[headerName];
        document.head.appendChild(meta);
      }
    });

    // Add security-related meta tags
    this.addSecurityMetaTags();
  }

  private static removeExistingSecurityTags(): void {
    const securitySelectors = [
      'meta[http-equiv="Content-Security-Policy"]',
      'meta[http-equiv="X-Content-Type-Options"]',
      'meta[http-equiv="X-Frame-Options"]',
      'meta[http-equiv="Referrer-Policy"]'
    ];

    securitySelectors.forEach(selector => {
      const existing = document.querySelector(selector);
      if (existing) {
        existing.remove();
      }
    });
  }

  private static addSecurityMetaTags(): void {
    // Add robots meta for production
    if (import.meta.env.PROD) {
      const robotsMeta = document.createElement('meta');
      robotsMeta.name = 'robots';
      robotsMeta.content = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
      document.head.appendChild(robotsMeta);
    }

    // Add security contact info
    const securityMeta = document.createElement('meta');
    securityMeta.name = 'security';
    securityMeta.content = 'For security concerns, please contact security@querymaster.app';
    document.head.appendChild(securityMeta);
  }
}
