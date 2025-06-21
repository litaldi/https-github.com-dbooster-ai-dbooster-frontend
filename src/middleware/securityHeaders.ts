
export class SecurityHeaders {
  private static instance: SecurityHeaders;

  static getInstance(): SecurityHeaders {
    if (!SecurityHeaders.instance) {
      SecurityHeaders.instance = new SecurityHeaders();
    }
    return SecurityHeaders.instance;
  }

  static applyToDocument() {
    const instance = SecurityHeaders.getInstance();
    instance.addSecurityHeaders();
  }

  private addSecurityHeaders() {
    // Remove existing security headers to avoid duplicates
    this.removeExistingHeaders();

    // Add security headers
    const headers = [
      { name: 'X-Content-Type-Options', content: 'nosniff' },
      { name: 'X-Frame-Options', content: 'DENY' },
      { name: 'X-XSS-Protection', content: '1; mode=block' },
      { name: 'Referrer-Policy', content: 'strict-origin-when-cross-origin' },
      { name: 'Permissions-Policy', content: 'camera=(), microphone=(), geolocation=(), payment=()' }
    ];

    headers.forEach(({ name, content }) => {
      const meta = document.createElement('meta');
      meta.httpEquiv = name;
      meta.content = content;
      document.head.appendChild(meta);
    });
  }

  private removeExistingHeaders() {
    const headerNames = [
      'X-Content-Type-Options',
      'X-Frame-Options', 
      'X-XSS-Protection',
      'Referrer-Policy',
      'Permissions-Policy'
    ];

    headerNames.forEach(name => {
      const existing = document.querySelector(`meta[http-equiv="${name}"]`);
      if (existing) {
        existing.remove();
      }
    });
  }

  addCSPHeader(policy: string) {
    // Remove existing CSP
    const existingCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (existingCSP) {
      existingCSP.remove();
    }

    // Add new CSP
    const cspMeta = document.createElement('meta');
    cspMeta.httpEquiv = 'Content-Security-Policy';
    cspMeta.content = policy;
    document.head.appendChild(cspMeta);
  }
}

export const securityHeaders = SecurityHeaders.getInstance();
