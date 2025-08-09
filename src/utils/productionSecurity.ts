
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
    // Only client-effective headers are set here (Referrer Policy via meta and CSP)
  }

  private addSecurityMetaTags() {
    // No-op: Non-CSP security headers (e.g., X-Frame-Options, HSTS) cannot be enforced via meta tags.
    // These must be delivered by the server; in a client-only app we avoid adding ineffective http-equiv tags.
  }
}

export const productionSecurity = ProductionSecurityManager.getInstance();
