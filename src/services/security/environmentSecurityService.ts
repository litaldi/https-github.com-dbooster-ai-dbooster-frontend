
import { productionLogger } from '@/utils/productionLogger';

export class EnvironmentSecurityService {
  private static instance: EnvironmentSecurityService;

  static getInstance(): EnvironmentSecurityService {
    if (!EnvironmentSecurityService.instance) {
      EnvironmentSecurityService.instance = new EnvironmentSecurityService();
    }
    return EnvironmentSecurityService.instance;
  }

  initializeSecurityHeaders(): void {
    try {
      // Set up environment-specific security headers
      this.setSecurityMetaTags();
      this.enforceHTTPS();
      
      productionLogger.secureInfo('Environment security headers initialized', {}, 'EnvironmentSecurityService');
    } catch (error) {
      productionLogger.error('Failed to initialize environment security', error, 'EnvironmentSecurityService');
    }
  }

  private setSecurityMetaTags(): void {
    const securityHeaders = [
      { name: 'X-Content-Type-Options', content: 'nosniff' },
      { name: 'X-Frame-Options', content: 'DENY' },
      { name: 'X-XSS-Protection', content: '1; mode=block' },
      { name: 'Referrer-Policy', content: 'strict-origin-when-cross-origin' }
    ];

    securityHeaders.forEach(({ name, content }) => {
      let metaTag = document.querySelector(`meta[http-equiv="${name}"]`) as HTMLMetaElement;
      if (!metaTag) {
        metaTag = document.createElement('meta');
        metaTag.httpEquiv = name;
        document.head.appendChild(metaTag);
      }
      metaTag.content = content;
    });
  }

  private enforceHTTPS(): void {
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
      productionLogger.warn('Site not served over HTTPS in production', {
        protocol: location.protocol,
        hostname: location.hostname
      }, 'EnvironmentSecurityService');
    }
  }

  validateEnvironment(): { isSecure: boolean; issues: string[] } {
    const issues: string[] = [];

    // Check HTTPS
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
      issues.push('Site not served over HTTPS');
    }

    // Check for development tools in production
    if (process.env.NODE_ENV === 'production' && (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      issues.push('Development tools detected in production');
    }

    // Check for secure headers
    if (!document.querySelector('meta[http-equiv="X-Content-Type-Options"]')) {
      issues.push('Missing X-Content-Type-Options header');
    }

    return {
      isSecure: issues.length === 0,
      issues
    };
  }
}

export const environmentSecurityService = EnvironmentSecurityService.getInstance();
