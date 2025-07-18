
interface SecurityHeaderConfig {
  contentSecurityPolicy?: {
    directives: Record<string, string[]>;
    reportOnly?: boolean;
  };
  strictTransportSecurity?: {
    maxAge: number;
    includeSubDomains?: boolean;
    preload?: boolean;
  };
  frameOptions?: 'DENY' | 'SAMEORIGIN' | string;
  contentTypeOptions?: 'nosniff';
  referrerPolicy?: string;
  permissionsPolicy?: Record<string, string[]>;
}

class EnhancedSecurityHeaders {
  private static instance: EnhancedSecurityHeaders;
  private config: SecurityHeaderConfig;
  private currentNonce: string;

  static getInstance(): EnhancedSecurityHeaders {
    if (!EnhancedSecurityHeaders.instance) {
      EnhancedSecurityHeaders.instance = new EnhancedSecurityHeaders();
    }
    return EnhancedSecurityHeaders.instance;
  }

  constructor() {
    this.currentNonce = this.generateNonce();
    this.config = {
      contentSecurityPolicy: {
        directives: {
          'default-src': ["'self'"],
          'script-src': ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://api.ipify.org'],
          'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          'font-src': ["'self'", 'https://fonts.gstatic.com'],
          'img-src': ["'self'", 'data:', 'https:'],
          'connect-src': ["'self'", 'https://api.pwnedpasswords.com', 'https://api.ipify.org', 'wss:', 'https:'],
          'frame-ancestors': ["'none'"],
          'base-uri': ["'self'"],
          'form-action': ["'self'"]
        }
      },
      strictTransportSecurity: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true
      },
      frameOptions: 'DENY',
      contentTypeOptions: 'nosniff',
      referrerPolicy: 'strict-origin-when-cross-origin',
      permissionsPolicy: {
        'camera': [],
        'microphone': [],
        'geolocation': [],
        'payment': [],
        'usb': [],
        'magnetometer': []
      }
    };
  }

  applyStrictSecurityHeaders(): void {
    this.applyContentSecurityPolicy();
    this.applySecurityHeaders();
    this.setupSecurityEventListeners();
  }

  private applyContentSecurityPolicy(): void {
    if (!this.config.contentSecurityPolicy) return;

    const directives = this.config.contentSecurityPolicy.directives;
    const cspString = Object.entries(directives)
      .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
      .join('; ');

    const metaElement = document.createElement('meta');
    metaElement.httpEquiv = 'Content-Security-Policy';
    metaElement.content = cspString;
    
    // Remove existing CSP meta tag if present
    const existingCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (existingCSP) {
      existingCSP.remove();
    }
    
    document.head.appendChild(metaElement);
  }

  private applySecurityHeaders(): void {
    // These headers are typically set by the server, but we can add meta equivalents where possible
    
    // Referrer Policy
    if (this.config.referrerPolicy) {
      let referrerMeta = document.querySelector('meta[name="referrer"]') as HTMLMetaElement;
      if (!referrerMeta) {
        referrerMeta = document.createElement('meta');
        referrerMeta.name = 'referrer';
        document.head.appendChild(referrerMeta);
      }
      referrerMeta.content = this.config.referrerPolicy;
    }

    // Permissions Policy (Feature Policy)
    if (this.config.permissionsPolicy) {
      const permissionsString = Object.entries(this.config.permissionsPolicy)
        .map(([feature, allowlist]) => {
          const sources = allowlist.length > 0 ? allowlist.join(' ') : '()';
          return `${feature}=${sources}`;
        })
        .join(', ');

      let permissionsMeta = document.querySelector('meta[http-equiv="Permissions-Policy"]') as HTMLMetaElement;
      if (!permissionsMeta) {
        permissionsMeta = document.createElement('meta');
        permissionsMeta.httpEquiv = 'Permissions-Policy';
        document.head.appendChild(permissionsMeta);
      }
      permissionsMeta.content = permissionsString;
    }
  }

  private setupSecurityEventListeners(): void {
    // CSP Violation Reporting
    document.addEventListener('securitypolicyviolation', (event) => {
      console.error('CSP Violation:', {
        blockedURI: event.blockedURI,
        documentURI: event.documentURI,
        effectiveDirective: event.effectiveDirective,
        originalPolicy: event.originalPolicy,
        referrer: event.referrer,
        sample: event.sample,
        statusCode: event.statusCode,
        violatedDirective: event.violatedDirective
      });

      // Report to security monitoring
      import('@/services/security/realTimeSecurityMonitor').then(({ realTimeSecurityMonitor }) => {
        realTimeSecurityMonitor.logSecurityEvent({
          type: 'security_violation',
          severity: 'high',
          message: 'Content Security Policy violation detected',
          metadata: {
            blockedURI: event.blockedURI,
            effectiveDirective: event.effectiveDirective,
            violatedDirective: event.violatedDirective
          }
        });
      });
    });

    // Detect potential XSS attempts
    window.addEventListener('error', (event) => {
      if (event.error && event.error.toString().includes('script')) {
        import('@/services/security/realTimeSecurityMonitor').then(({ realTimeSecurityMonitor }) => {
          realTimeSecurityMonitor.logSecurityEvent({
            type: 'security_violation',
            severity: 'medium',
            message: 'Potential XSS attempt detected',
            metadata: {
              error: event.error.toString(),
              filename: event.filename,
              lineno: event.lineno,
              colno: event.colno
            }
          });
        });
      }
    });
  }

  updateCSPDirective(directive: string, sources: string[]): void {
    if (this.config.contentSecurityPolicy) {
      this.config.contentSecurityPolicy.directives[directive] = sources;
      this.applyContentSecurityPolicy();
    }
  }

  addCSPSource(directive: string, source: string): void {
    if (this.config.contentSecurityPolicy?.directives[directive]) {
      if (!this.config.contentSecurityPolicy.directives[directive].includes(source)) {
        this.config.contentSecurityPolicy.directives[directive].push(source);
        this.applyContentSecurityPolicy();
      }
    }
  }

  getSecurityHeadersStatus(): Record<string, boolean> {
    return {
      cspApplied: !!document.querySelector('meta[http-equiv="Content-Security-Policy"]'),
      referrerPolicyApplied: !!document.querySelector('meta[name="referrer"]'),
      permissionsPolicyApplied: !!document.querySelector('meta[http-equiv="Permissions-Policy"]'),
      httpsEnforced: location.protocol === 'https:',
      secureContext: window.isSecureContext
    };
  }

  // Add missing methods
  validateSecureUrl(url: string): { isValid: boolean; reason?: string; sanitizedUrl?: string } {
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

  getNonce(): string {
    return this.currentNonce;
  }

  private generateNonce(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
}

export const enhancedSecurityHeaders = EnhancedSecurityHeaders.getInstance();
