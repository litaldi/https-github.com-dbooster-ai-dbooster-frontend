
import { SecurityHeaders } from '@/middleware/securityHeaders';

export class ProductionSecurityManager {
  private static instance: ProductionSecurityManager;

  static getInstance(): ProductionSecurityManager {
    if (!ProductionSecurityManager.instance) {
      ProductionSecurityManager.instance = new ProductionSecurityManager();
    }
    return ProductionSecurityManager.instance;
  }

  initializeProductionSecurity() {
    if (import.meta.env.PROD) {
      this.setupProductionCSP();
      this.cleanupDevelopmentTools();
      this.setupSecurityHeaders();
    }
  }

  private setupProductionCSP() {
    // Remove existing CSP meta tag
    const existingCSP = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    if (existingCSP) {
      existingCSP.remove();
    }

    // Add production-ready CSP
    const cspMeta = document.createElement('meta');
    cspMeta.httpEquiv = 'Content-Security-Policy';
    cspMeta.content = this.getProductionCSP();
    document.head.appendChild(cspMeta);
  }

  private getProductionCSP(): string {
    return [
      "default-src 'self'",
      "script-src 'self'", // Removed unsafe-eval for production
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
      "upgrade-insecure-requests",
      "block-all-mixed-content"
    ].join('; ');
  }

  private cleanupDevelopmentTools() {
    // Remove React DevTools
    if (typeof window !== 'undefined') {
      delete (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;
      delete (window as any).__REDUX_DEVTOOLS_EXTENSION__;
      delete (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__;
      
      // Disable React DevTools
      (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
        isDisabled: true,
        supportsFiber: true,
        inject: () => {},
        onCommitFiberRoot: () => {},
        onCommitFiberUnmount: () => {}
      };
    }
  }

  private setupSecurityHeaders() {
    SecurityHeaders.applyToDocument();
    
    // Add additional security meta tags
    this.addSecurityMetaTags();
  }

  private addSecurityMetaTags() {
    const securityTags = [
      { name: 'X-Content-Type-Options', content: 'nosniff' },
      { name: 'X-Frame-Options', content: 'DENY' },
      { name: 'X-XSS-Protection', content: '1; mode=block' },
      { name: 'Referrer-Policy', content: 'strict-origin-when-cross-origin' },
      { name: 'Permissions-Policy', content: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=(), serial=()' },
      { name: 'Strict-Transport-Security', content: 'max-age=31536000; includeSubDomains; preload' },
      { name: 'X-Permitted-Cross-Domain-Policies', content: 'none' },
      { name: 'Cross-Origin-Embedder-Policy', content: 'require-corp' },
      { name: 'Cross-Origin-Opener-Policy', content: 'same-origin' },
      { name: 'Cross-Origin-Resource-Policy', content: 'same-origin' }
    ];

    securityTags.forEach(({ name, content }) => {
      if (!document.querySelector(`meta[http-equiv="${name}"]`)) {
        const meta = document.createElement('meta');
        meta.httpEquiv = name;
        meta.content = content;
        document.head.appendChild(meta);
      }
    });
  }
}

export const productionSecurity = ProductionSecurityManager.getInstance();
