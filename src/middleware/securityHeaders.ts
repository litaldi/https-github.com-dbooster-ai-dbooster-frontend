
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

    // Add only effective client-side meta policies
    const referrerMeta = document.createElement('meta');
    referrerMeta.name = 'referrer';
    referrerMeta.content = 'strict-origin-when-cross-origin';
    document.head.appendChild(referrerMeta);
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
    const existingReferrer = document.querySelector('meta[name="referrer"]');
    if (existingReferrer) {
      existingReferrer.remove();
    }
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
