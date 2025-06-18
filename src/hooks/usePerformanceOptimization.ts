
import { useEffect, useCallback } from 'react';
import { preloadCriticalResources, measurePerformance } from '@/utils/performance';

interface UsePerformanceOptimizationOptions {
  preloadResources?: boolean;
  measureTimings?: boolean;
  enableWebVitals?: boolean;
}

export function usePerformanceOptimization(options: UsePerformanceOptimizationOptions = {}) {
  const {
    preloadResources = true,
    measureTimings = true,
    enableWebVitals = true
  } = options;

  // Preload critical resources
  useEffect(() => {
    if (preloadResources) {
      preloadCriticalResources();
    }
  }, [preloadResources]);

  // Setup Web Vitals monitoring
  useEffect(() => {
    if (!enableWebVitals || typeof window === 'undefined') return;

    // Dynamically import web-vitals to avoid bundle bloat
    const loadWebVitals = async () => {
      try {
        const { onLCP, onFID, onCLS, onFCP, onTTFB } = await import('web-vitals');
        
        onLCP((metric) => {
          if (measureTimings) {
            console.log('LCP:', metric);
          }
          // Send to analytics in production
          if (typeof window.gtag === 'function') {
            window.gtag('event', 'web_vitals', {
              event_category: 'Web Vitals',
              event_label: 'LCP',
              value: Math.round(metric.value),
              non_interaction: true,
            });
          }
        });

        onFID((metric) => {
          if (measureTimings) {
            console.log('FID:', metric);
          }
          if (typeof window.gtag === 'function') {
            window.gtag('event', 'web_vitals', {
              event_category: 'Web Vitals',
              event_label: 'FID',
              value: Math.round(metric.value),
              non_interaction: true,
            });
          }
        });

        onCLS((metric) => {
          if (measureTimings) {
            console.log('CLS:', metric);
          }
          if (typeof window.gtag === 'function') {
            window.gtag('event', 'web_vitals', {
              event_category: 'Web Vitals',
              event_label: 'CLS',
              value: Math.round(metric.value * 1000),
              non_interaction: true,
            });
          }
        });

        onFCP((metric) => {
          if (measureTimings) {
            console.log('FCP:', metric);
          }
        });

        onTTFB((metric) => {
          if (measureTimings) {
            console.log('TTFB:', metric);
          }
        });
      } catch (error) {
        console.warn('Web Vitals library not available:', error);
      }
    };

    loadWebVitals();
  }, [enableWebVitals, measureTimings]);

  // Performance measurement utility
  const measureAsync = useCallback((name: string) => {
    return measurePerformance(name);
  }, []);

  // Resource preloader utility
  const preloadResource = useCallback((url: string, type: 'script' | 'style' | 'font' | 'image') => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = url;
    link.as = type;
    if (type === 'font') {
      link.crossOrigin = 'anonymous';
    }
    document.head.appendChild(link);
  }, []);

  return {
    measureAsync,
    preloadResource
  };
}
