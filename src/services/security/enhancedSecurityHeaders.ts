
interface SecurityHeadersConfig {
  contentSecurityPolicy?: boolean;
  strictTransportSecurity?: boolean;
  xFrameOptions?: boolean;
  xContentTypeOptions?: boolean;
  referrerPolicy?: boolean;
  permissionsPolicy?: boolean;
}

interface UrlValidationResult {
  isValid: boolean;
  sanitizedUrl?: string;
  reason?: string;
}

export class EnhancedSecurityHeaders {
  private static instance: EnhancedSecurityHeaders;

  static getInstance(): EnhancedSecurityHeaders {
    if (!EnhancedSecurityHeaders.instance) {
      EnhancedSecurityHeaders.instance = new EnhancedSecurityHeaders();
    }
    return EnhancedSecurityHeaders.instance;
  }

  applyStrictSecurityHeaders(config: SecurityHeadersConfig = {}): void {
    const defaultConfig = {
      contentSecurityPolicy: true,
      strictTransportSecurity: true,
      xFrameOptions: true,
      xContentTypeOptions: true,
      referrerPolicy: true,
      permissionsPolicy: true,
      ...config
    };

    // Note: In a client-side React app, these headers would typically be set by the server
    // This is a placeholder implementation for the security service architecture
    console.log('Security headers configuration applied:', defaultConfig);
  }

  validateSecurityHeaders(): boolean {
    // Placeholder for header validation logic
    return true;
  }

  validateSecureUrl(url: string): UrlValidationResult {
    try {
      const urlObj = new URL(url);
      
      // Check for dangerous protocols
      const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:', 'about:'];
      if (dangerousProtocols.some(protocol => url.toLowerCase().startsWith(protocol))) {
        return {
          isValid: false,
          reason: 'Dangerous protocol detected'
        };
      }

      // Check for localhost in production
      if (import.meta.env.PROD && (urlObj.hostname === 'localhost' || urlObj.hostname === '127.0.0.1')) {
        return {
          isValid: false,
          reason: 'Localhost URLs not allowed in production'
        };
      }

      // Validate HTTPS in production
      if (import.meta.env.PROD && urlObj.protocol !== 'https:') {
        return {
          isValid: false,
          reason: 'HTTPS required in production'
        };
      }

      return {
        isValid: true,
        sanitizedUrl: url
      };
    } catch (error) {
      return {
        isValid: false,
        reason: 'Invalid URL format'
      };
    }
  }

  getNonce(): string {
    // Generate a cryptographically secure random nonce
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  }
}

export const enhancedSecurityHeaders = EnhancedSecurityHeaders.getInstance();
