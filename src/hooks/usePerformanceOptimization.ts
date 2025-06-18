
import { useEffect } from 'react';
import { PerformanceOptimizer } from '@/utils/performanceOptimizer';
import { ResourcePreloader } from '@/utils/resourcePreloader';

interface PerformanceOptimizationOptions {
  preloadResources?: boolean;
  measureTimings?: boolean;
  enableWebVitals?: boolean;
}

export function usePerformanceOptimization(options: PerformanceOptimizationOptions = {}) {
  const {
    preloadResources = true,
    measureTimings = true,
    enableWebVitals = true
  } = options;

  useEffect(() => {
    if (preloadResources) {
      ResourcePreloader.preloadCriticalAssets();
    }

    if (measureTimings) {
      PerformanceOptimizer.startPerformanceMonitoring();
    }

    if (enableWebVitals) {
      PerformanceOptimizer.runLighthouseAudit();
    }

    return () => {
      if (measureTimings) {
        PerformanceOptimizer.stopPerformanceMonitoring();
      }
    };
  }, [preloadResources, measureTimings, enableWebVitals]);

  return {
    optimizeImages: PerformanceOptimizer.optimizeImages,
    measureResourceTiming: PerformanceOptimizer.measureResourceTiming
  };
}
