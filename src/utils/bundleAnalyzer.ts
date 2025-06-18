
// Bundle analysis utilities for production optimization
export class BundleAnalyzer {
  static analyzeChunks() {
    if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') {
      return;
    }

    // Analyze loaded scripts
    const scripts = Array.from(document.scripts);
    const chunks = scripts
      .filter(script => script.src.includes('/assets/'))
      .map(script => ({
        src: script.src,
        size: script.src.length, // Approximation
        type: script.type || 'text/javascript'
      }));

    console.group('📦 Bundle Analysis');
    console.table(chunks);
    console.log(`Total chunks loaded: ${chunks.length}`);
    console.groupEnd();

    return chunks;
  }

  static measureLoadTimes() {
    if ('performance' in window) {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      
      const slowResources = resources
        .filter(resource => resource.duration > 1000)
        .sort((a, b) => b.duration - a.duration)
        .slice(0, 10);

      if (slowResources.length > 0) {
        console.group('🐌 Slow Resources (>1s)');
        console.table(slowResources.map(r => ({
          name: r.name.split('/').pop(),
          duration: `${r.duration.toFixed(2)}ms`,
          type: r.initiatorType
        })));
        console.groupEnd();
      }

      return slowResources;
    }
  }

  static getMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        used: Math.round(memory.usedJSHeapSize / 1048576), // MB
        total: Math.round(memory.totalJSHeapSize / 1048576), // MB
        limit: Math.round(memory.jsHeapSizeLimit / 1048576) // MB
      };
    }
    return null;
  }
}
