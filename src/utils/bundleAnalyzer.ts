
interface BundleStats {
  chunks: ChunkInfo[];
  assets: AssetInfo[];
  totalSize: number;
  gzipSize?: number;
}

interface ChunkInfo {
  name: string;
  size: number;
  modules: string[];
  isInitial: boolean;
}

interface AssetInfo {
  name: string;
  size: number;
  type: 'js' | 'css' | 'image' | 'font' | 'other';
  compressed?: number;
}

interface LoadTimeMetric {
  resource: string;
  duration: number;
  size?: number;
  type: string;
}

export class BundleAnalyzer {
  private static loadTimeMetrics: LoadTimeMetric[] = [];

  static analyzeChunks(): ChunkInfo[] {
    if (typeof window === 'undefined' || !('performance' in window)) {
      return [];
    }

    const chunks: ChunkInfo[] = [];
    const scriptElements = document.querySelectorAll('script[src]');

    scriptElements.forEach((script, index) => {
      const src = (script as HTMLScriptElement).src;
      const name = src.split('/').pop() || `chunk-${index}`;
      
      // Estimate size based on load time (rough approximation)
      const resource = performance.getEntriesByName(src)[0] as PerformanceResourceTiming;
      const estimatedSize = resource ? Math.round(resource.transferSize || 0) : 0;

      chunks.push({
        name,
        size: estimatedSize,
        modules: [], // Would need build-time analysis for accurate module info
        isInitial: script.hasAttribute('defer') || script.hasAttribute('async')
      });
    });

    return chunks;
  }

  static measureLoadTimes(): LoadTimeMetric[] {
    if (typeof window === 'undefined' || !('performance' in window)) {
      return [];
    }

    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    this.loadTimeMetrics = [];

    resources.forEach(resource => {
      if (resource.duration > 100) { // Only track slow resources
        const metric: LoadTimeMetric = {
          resource: resource.name.split('/').pop() || resource.name,
          duration: Math.round(resource.duration),
          size: resource.transferSize,
          type: this.getResourceType(resource.name)
        };
        this.loadTimeMetrics.push(metric);
      }
    });

    return this.loadTimeMetrics.sort((a, b) => b.duration - a.duration);
  }

  private static getResourceType(url: string): string {
    const extension = url.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'js':
      case 'mjs':
        return 'javascript';
      case 'css':
        return 'stylesheet';
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'webp':
      case 'avif':
      case 'svg':
        return 'image';
      case 'woff':
      case 'woff2':
      case 'ttf':
      case 'otf':
        return 'font';
      default:
        return 'other';
    }
  }

  static getMemoryUsage(): { used: number; total: number; percentage: number } | null {
    if (typeof window === 'undefined' || !('performance' in window)) {
      return null;
    }

    const memory = (performance as any).memory;
    if (!memory) return null;

    const used = Math.round(memory.usedJSHeapSize / 1048576); // Convert to MB
    const total = Math.round(memory.jsHeapSizeLimit / 1048576);
    const percentage = Math.round((used / total) * 100);

    return { used, total, percentage };
  }

  static generateOptimizationReport(): {
    recommendations: string[];
    slowResources: LoadTimeMetric[];
    memoryUsage: ReturnType<typeof BundleAnalyzer.getMemoryUsage>;
    totalResources: number;
  } {
    const slowResources = this.measureLoadTimes();
    const memoryUsage = this.getMemoryUsage();
    const recommendations: string[] = [];

    // Analyze slow resources
    if (slowResources.length > 0) {
      recommendations.push(`${slowResources.length} slow resources detected (>100ms load time)`);
      
      const slowImages = slowResources.filter(r => r.type === 'image');
      if (slowImages.length > 0) {
        recommendations.push('Consider optimizing images with WebP/AVIF formats');
      }

      const slowScripts = slowResources.filter(r => r.type === 'javascript');
      if (slowScripts.length > 0) {
        recommendations.push('Consider code splitting for large JavaScript bundles');
      }
    }

    // Analyze memory usage
    if (memoryUsage && memoryUsage.percentage > 80) {
      recommendations.push('High memory usage detected - consider reducing bundle size');
    }

    // General recommendations
    const totalResources = performance.getEntriesByType('resource').length;
    if (totalResources > 50) {
      recommendations.push('Consider reducing the number of HTTP requests');
    }

    return {
      recommendations,
      slowResources: slowResources.slice(0, 10), // Top 10 slowest
      memoryUsage,
      totalResources
    };
  }

  // Development helper for bundle analysis
  static logBundleAnalysis(): void {
    if (import.meta.env.DEV) {
      const report = this.generateOptimizationReport();
      
      console.group('📦 Bundle Analysis Report');
      console.log('Memory Usage:', report.memoryUsage);
      console.log('Total Resources:', report.totalResources);
      console.log('Slow Resources:', report.slowResources);
      console.log('Recommendations:', report.recommendations);
      console.groupEnd();
    }
  }
}

// Auto-run analysis in development
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  window.addEventListener('load', () => {
    setTimeout(() => {
      BundleAnalyzer.logBundleAnalysis();
    }, 2000);
  });
}
