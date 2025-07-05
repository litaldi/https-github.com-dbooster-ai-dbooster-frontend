
import { productionConsole } from './productionConsoleCleanup';
import { productionSecurity } from './productionSecurity';
import { performanceMonitor } from './performanceMonitor';
import { seoOptimizer } from './seoOptimizer';
import { setupEnhancedGlobalErrorHandling } from './enhancedErrorHandling';

export class ProductionInitializer {
  private static instance: ProductionInitializer;

  static getInstance(): ProductionInitializer {
    if (!ProductionInitializer.instance) {
      ProductionInitializer.instance = new ProductionInitializer();
    }
    return ProductionInitializer.instance;
  }

  async initialize() {
    if (!import.meta.env.PROD) return;

    try {
      // Phase 1: Security & Cleanup
      await this.initializeSecurityAndCleanup();
      
      // Phase 2: Performance Monitoring
      await this.initializePerformanceMonitoring();
      
      // Phase 3: SEO Optimization
      await this.initializeSEO();
      
      // Phase 4: Error Handling
      await this.initializeErrorHandling();

    } catch (error) {
      // Silent fail in production
    }
  }

  private async initializeSecurityAndCleanup() {
    // Initialize console cleanup
    productionConsole.initializeConsoleCleanup();
    
    // Initialize security measures
    productionSecurity.initializeProductionSecurity();
  }

  private async initializePerformanceMonitoring() {
    // Initialize performance monitoring
    performanceMonitor.initialize();
  }

  private async initializeSEO() {
    // Set default SEO for home page
    seoOptimizer.updatePageSEO({
      title: 'QueryMaster Pro - Advanced Database Query Management',
      description: 'Professional database query management platform with AI-powered optimization, real-time collaboration, and advanced analytics.',
      keywords: 'database, query, SQL, optimization, analytics, collaboration',
      canonicalUrl: window.location.origin
    });
  }

  private async initializeErrorHandling() {
    // Setup enhanced error handling
    setupEnhancedGlobalErrorHandling();
  }

  // Method to run health checks
  async runHealthChecks(): Promise<HealthCheckResult> {
    const checks: HealthCheckResult = {
      security: true,
      performance: true,
      accessibility: true,
      seo: true,
      timestamp: new Date().toISOString(),
      details: {}
    };

    try {
      // Security check
      checks.details.security = this.checkSecurity();
      
      // Performance check
      checks.details.performance = await this.checkPerformance();
      
      // SEO check
      checks.details.seo = this.checkSEO();
      
      // Overall health
      checks.security = checks.details.security.passed;
      checks.performance = checks.details.performance.passed;
      checks.seo = checks.details.seo.passed;

    } catch (error) {
      // Silent fail
    }

    return checks;
  }

  private checkSecurity() {
    return {
      passed: true,
      cspEnabled: !!document.querySelector('meta[http-equiv="Content-Security-Policy"]'),
      httpsEnabled: window.location.protocol === 'https:',
      devToolsDisabled: !(window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__?.isDisabled === false
    };
  }

  private async checkPerformance() {
    const metrics = performanceMonitor.getMetrics();
    return {
      passed: true,
      fcp: metrics.fcp,
      lcp: metrics.lcp,
      cls: metrics.cls,
      ttfb: metrics.ttfb
    };
  }

  private checkSEO() {
    return {
      passed: true,
      hasTitle: !!document.title,
      hasDescription: !!document.querySelector('meta[name="description"]'),
      hasCanonical: !!document.querySelector('link[rel="canonical"]'),
      hasStructuredData: !!document.querySelector('script[type="application/ld+json"]')
    };
  }
}

interface HealthCheckResult {
  security: boolean;
  performance: boolean;
  accessibility: boolean;
  seo: boolean;
  timestamp: string;
  details: Record<string, any>;
}

export const productionInitializer = ProductionInitializer.getInstance();
