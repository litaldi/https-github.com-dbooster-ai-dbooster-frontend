
import { productionLogger } from '@/utils/productionLogger';

class HTTPSEnforcement {
  private static instance: HTTPSEnforcement;

  static getInstance(): HTTPSEnforcement {
    if (!HTTPSEnforcement.instance) {
      HTTPSEnforcement.instance = new HTTPSEnforcement();
    }
    return HTTPSEnforcement.instance;
  }

  enforceHTTPS(): void {
    // Only enforce in production
    if (!import.meta.env.PROD) {
      return;
    }

    if (location.protocol !== 'https:') {
      productionLogger.warn('Redirecting to HTTPS', { 
        originalUrl: location.href,
        userAgent: navigator.userAgent 
      });
      
      // Force redirect to HTTPS
      location.replace(location.href.replace('http:', 'https:'));
      return;
    }

    // Add additional HTTPS security headers via meta tags
    this.addHTTPSSecurityHeaders();
    
    // Monitor for any HTTP requests that might slip through
    this.monitorHTTPRequests();
  }

  private addHTTPSSecurityHeaders(): void {
    const securityHeaders = [
      {
        name: 'Strict-Transport-Security',
        content: 'max-age=31536000; includeSubDomains; preload'
      },
      {
        name: 'X-Content-Type-Options',
        content: 'nosniff'
      },
      {
        name: 'X-Frame-Options',
        content: 'DENY'
      },
      {
        name: 'X-XSS-Protection',
        content: '1; mode=block'
      }
    ];

    securityHeaders.forEach(({ name, content }) => {
      if (!document.querySelector(`meta[http-equiv="${name}"]`)) {
        const meta = document.createElement('meta');
        meta.httpEquiv = name;
        meta.content = content;
        document.head.appendChild(meta);
      }
    });
  }

  private monitorHTTPRequests(): void {
    // Override fetch to monitor for HTTP requests
    const originalFetch = window.fetch;
    window.fetch = function(input: RequestInfo | URL, init?: RequestInit) {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
      
      if (url.startsWith('http://') && !url.includes('localhost')) {
        productionLogger.error('Blocked insecure HTTP request', { url });
        return Promise.reject(new Error('HTTP requests not allowed in production'));
      }
      
      return originalFetch.call(this, input, init);
    };

    // Monitor XMLHttpRequest as well
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method: string, url: string | URL, ...args: any[]) {
      const urlString = typeof url === 'string' ? url : url.href;
      
      if (urlString.startsWith('http://') && !urlString.includes('localhost')) {
        productionLogger.error('Blocked insecure XHR request', { url: urlString });
        throw new Error('HTTP requests not allowed in production');
      }
      
      return originalXHROpen.call(this, method, url, ...args);
    };
  }

  checkMixedContentRisks(): {
    hasRisks: boolean;
    risks: string[];
  } {
    const risks: string[] = [];

    // Check for HTTP resources in HTTPS page
    const httpResources = Array.from(document.querySelectorAll('*')).filter(element => {
      const src = element.getAttribute('src');
      const href = element.getAttribute('href');
      
      return (src && src.startsWith('http://')) || 
             (href && href.startsWith('http://'));
    });

    if (httpResources.length > 0) {
      risks.push(`${httpResources.length} HTTP resources detected in HTTPS page`);
    }

    // Check for forms posting to HTTP
    const httpForms = Array.from(document.forms).filter(form => 
      form.action.startsWith('http://')
    );

    if (httpForms.length > 0) {
      risks.push(`${httpForms.length} forms posting to HTTP endpoints`);
    }

    return {
      hasRisks: risks.length > 0,
      risks
    };
  }
}

export const httpsEnforcement = HTTPSEnforcement.getInstance();
