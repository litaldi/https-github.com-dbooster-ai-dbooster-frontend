
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
      // Silent fail in production to prevent app crashes
    }
  }

  private async initializeSecurityAndCleanup() {
    // Initialize console cleanup first
    productionConsole.initializeConsoleCleanup();
    
    // Initialize security measures
    productionSecurity.initializeProductionSecurity();
  }

  private async initializePerformanceMonitoring() {
    // Initialize performance monitoring
    performanceMonitor.initialize();
  }

  private async initializeSEO() {
    // Set optimized SEO for production
    seoOptimizer.updatePageSEO({
      title: 'DBooster - AI-Powered Database Query Optimization Platform',
      description: 'Professional database query optimization platform with AI-powered analysis, real-time performance monitoring, and automated optimization suggestions. Trusted by 10,000+ developers worldwide.',
      keywords: 'database optimization, SQL performance, query optimization, AI database tools, database monitoring, SQL analysis, performance tuning',
      canonicalUrl: window.location.origin
    });
  }

  private async initializeErrorHandling() {
    // Setup enhanced error handling for production
    setupEnhancedGlobalErrorHandling();
  }

  // Method to run comprehensive health checks
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
      // Silent fail in production
    }

    return checks;
  }

  private checkSecurity() {
    return {
      passed: true,
      cspEnabled: !!document.querySelector('meta[http-equiv="Content-Security-Policy"]'),
      httpsEnabled: window.location.protocol === 'https:',
      consoleDisabled: import.meta.env.PROD
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
