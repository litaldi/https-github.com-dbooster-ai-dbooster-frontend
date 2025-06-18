
export interface SecurityHeadersConfig {
  contentSecurityPolicy?: boolean;
  strictTransportSecurity?: boolean;
  xFrameOptions?: boolean;
  xContentTypeOptions?: boolean;
  referrerPolicy?: boolean;
  permissionsPolicy?: boolean;
}

export class SecurityHeaders {
  private static defaultConfig: SecurityHeadersConfig = {
    contentSecurityPolicy: true,
    strictTransportSecurity: true,
    xFrameOptions: true,
    xContentTypeOptions: true,
    referrerPolicy: true,
    permissionsPolicy: true,
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

    return headers;
  }

  private static getCSPHeader(): string {
    const isDevelopment = import.meta.env.DEV;
    
    const directives = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Relaxed for React development
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://sxcbpmqsbcpsljwwwwyv.supabase.co wss://sxcbpmqsbcpsljwwwwyv.supabase.co",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ];

    if (isDevelopment) {
      // Add development-specific sources
      directives.push("connect-src 'self' ws: wss: https://sxcbpmqsbcpsljwwwwyv.supabase.co");
    }

    return directives.join('; ');
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
    ].join(', ');
  }

  static applyToDocument(): void {
    const headers = this.getHeaders();
    
    // Apply CSP via meta tag if not already present
    if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
      const cspMeta = document.createElement('meta');
      cspMeta.httpEquiv = 'Content-Security-Policy';
      cspMeta.content = headers['Content-Security-Policy'];
      document.head.appendChild(cspMeta);
    }

    // Apply other security headers via meta tags where possible
    if (!document.querySelector('meta[http-equiv="X-Content-Type-Options"]')) {
      const nosniffMeta = document.createElement('meta');
      nosniffMeta.httpEquiv = 'X-Content-Type-Options';
      nosniffMeta.content = 'nosniff';
      document.head.appendChild(nosniffMeta);
    }
  }
}
