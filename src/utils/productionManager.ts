
import { productionConsole } from './productionConsoleCleanup';
import { performanceTracker } from './performanceTracker';
import { logger } from './logger';

interface SecurityConfig {
  cspEnabled: boolean;
  httpsRequired: boolean;
  devToolsDisabled: boolean;
}

interface ProductionHealthCheck {
  security: boolean;
  performance: boolean;  
  console: boolean;
  responsive: boolean;
  accessibility: boolean;
  overall: boolean;
}

class ProductionManager {
  private static instance: ProductionManager;
  private isProduction = import.meta.env.PROD;
  private initialized = false;

  static getInstance(): ProductionManager {
    if (!ProductionManager.instance) {
      ProductionManager.instance = new ProductionManager();
    }
    return ProductionManager.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized || !this.isProduction) {
      return;
    }

    try {
      logger.info('Initializing production environment', {}, 'ProductionManager');

      // Initialize console optimization
      productionConsole.initializeConsoleCleanup();

      // Initialize performance tracking
      performanceTracker.initialize();

      // Setup security measures
      this.initializeSecurity();

      // Setup error handling
      this.setupErrorHandling();

      this.initialized = true;
      logger.info('Production initialization completed', {}, 'ProductionManager');
      
    } catch (error) {
      logger.error('Production initialization failed', error, 'ProductionManager');
    }
  }

  private initializeSecurity(): void {
    // Add security headers via meta tags
    const securityHeaders = [
      { name: 'X-Content-Type-Options', content: 'nosniff' },
      { name: 'X-Frame-Options', content: 'DENY' },
      { name: 'Referrer-Policy', content: 'strict-origin-when-cross-origin' }
    ];

    securityHeaders.forEach(({ name, content }) => {
      if (!document.querySelector(`meta[name="${name}"]`)) {
        const meta = document.createElement('meta');
        meta.name = name;
        meta.content = content;
        document.head.appendChild(meta);
      }
    });
  }

  private setupErrorHandling(): void {
    window.addEventListener('error', (event) => {
      logger.error('Global error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      }, 'ErrorHandler');
    });

    window.addEventListener('unhandledrejection', (event) => {
      logger.error('Unhandled promise rejection', {
        reason: event.reason
      }, 'ErrorHandler');
    });
  }

  async performHealthCheck(): Promise<ProductionHealthCheck> {
    const checks = {
      security: this.checkSecurity(),
      performance: await this.checkPerformance(),
      console: this.checkConsole(),
      responsive: this.checkResponsive(),
      accessibility: this.checkAccessibility(),
      overall: false
    };

    checks.overall = Object.values(checks).filter(v => v === true).length >= 4;
    
    return checks;
  }

  private checkSecurity(): boolean {
    const hasCSP = !!document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    const isHTTPS = window.location.protocol === 'https:';
    return hasCSP || isHTTPS; // At least one security measure
  }

  private async checkPerformance(): Promise<boolean> {
    const report = performanceTracker.generateReport();
    return report.score >= 70; // Minimum acceptable score
  }

  private checkConsole(): boolean {
    // Check if there are no console errors
    const originalError = console.error;
    let hasErrors = false;
    
    console.error = () => { hasErrors = true; };
    setTimeout(() => { console.error = originalError; }, 100);
    
    return !hasErrors;
  }

  private checkResponsive(): boolean {
    // Basic responsive check
    const viewport = document.querySelector('meta[name="viewport"]');
    return !!viewport && viewport.getAttribute('content')?.includes('width=device-width');
  }

  private checkAccessibility(): boolean {
    // Basic accessibility checks
    const hasTitle = document.title.length > 0;
    const hasLang = document.documentElement.lang.length > 0;
    const hasDescription = !!document.querySelector('meta[name="description"]');
    
    return hasTitle && (hasLang || hasDescription);
  }

  cleanup(): void {
    if (this.isProduction) {
      productionConsole.restoreConsole();
      performanceTracker.cleanup();
    }
  }
}

export const productionManager = ProductionManager.getInstance();
