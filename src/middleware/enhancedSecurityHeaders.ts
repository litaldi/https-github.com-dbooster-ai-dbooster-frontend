
export interface EnhancedSecurityHeadersConfig {
  contentSecurityPolicy?: {
    enabled: boolean;
    nonce?: string;
    reportUri?: string;
  };
  strictTransportSecurity?: boolean;
  xFrameOptions?: boolean;
  xContentTypeOptions?: boolean;
  referrerPolicy?: boolean;
  permissionsPolicy?: boolean;
  crossOriginEmbedderPolicy?: boolean;
  crossOriginOpenerPolicy?: boolean;
  crossOriginResourcePolicy?: boolean;
}

export class EnhancedSecurityHeaders {
  private static defaultConfig: EnhancedSecurityHeadersConfig = {
    contentSecurityPolicy: {
      enabled: true,
      reportUri: '/api/csp-report'
    },
    strictTransportSecurity: true,
    xFrameOptions: true,
    xContentTypeOptions: true,
    referrerPolicy: true,
    permissionsPolicy: true,
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
    crossOriginResourcePolicy: true,
  };

  static getHeaders(config: EnhancedSecurityHeadersConfig = {}): Record<string, string> {
    const finalConfig = { ...this.defaultConfig, ...config };
    const headers: Record<string, string> = {};
    const isDevelopment = import.meta.env.DEV;

    if (finalConfig.contentSecurityPolicy?.enabled) {
      headers['Content-Security-Policy'] = this.getEnhancedCSPHeader(finalConfig.contentSecurityPolicy);
    }

    if (finalConfig.strictTransportSecurity && !isDevelopment) {
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
      headers['Permissions-Policy'] = this.getEnhancedPermissionsPolicyHeader();
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

    // Additional security headers
    headers['X-XSS-Protection'] = '1; mode=block';
    headers['X-Permitted-Cross-Domain-Policies'] = 'none';
    headers['X-Download-Options'] = 'noopen';
    headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, proxy-revalidate';
    headers['Pragma'] = 'no-cache';
    headers['Expires'] = '0';

    return headers;
  }

  private static getEnhancedCSPHeader(cspConfig: { nonce?: string; reportUri?: string }): string {
    const isDevelopment = import.meta.env.DEV;
    const nonce = cspConfig.nonce;
    
    const directives = [
      "default-src 'self'",
      isDevelopment 
        ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'" 
        : nonce 
          ? `script-src 'self' 'nonce-${nonce}'`
          : "script-src 'self'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://sxcbpmqsbcpsljwwwwyv.supabase.co wss://sxcbpmqsbcpsljwwwwyv.supabase.co",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      "media-src 'self'",
      "worker-src 'self'",
      "manifest-src 'self'",
      "upgrade-insecure-requests"
    ];

    if (isDevelopment) {
      directives.push("connect-src 'self' ws: wss: https://sxcbpmqsbcpsljwwwwyv.supabase.co");
    }

    if (cspConfig.reportUri) {
      directives.push(`report-uri ${cspConfig.reportUri}`);
    }

    return directives.join('; ');
  }

  private static getEnhancedPermissionsPolicyHeader(): string {
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
      'fullscreen=()',
      'picture-in-picture=()',
      'publickey-credentials-get=()',
      'screen-wake-lock=()',
      'web-share=()',
      'xr-spatial-tracking=()',
    ].join(', ');
  }

  static applyToDocument(config?: EnhancedSecurityHeadersConfig): void {
    const headers = this.getHeaders(config);
    
    // Apply CSP via meta tag if not already present
    if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]') && headers['Content-Security-Policy']) {
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
      const headerValue = headers[headerName];
      if (headerValue && !document.querySelector(`meta[http-equiv="${headerName}"]`)) {
        const meta = document.createElement('meta');
        meta.httpEquiv = headerName;
        meta.content = headerValue;
        document.head.appendChild(meta);
      }
    });
  }
}
