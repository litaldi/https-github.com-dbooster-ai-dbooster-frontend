
import { useEffect, useCallback } from 'react';

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

  const measureCoreWebVitals = useCallback(() => {
    if (!enableWebVitals || typeof window === 'undefined') return;

    // Measure First Contentful Paint (FCP)
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
          console.log('FCP:', Math.round(entry.startTime), 'ms');
        }
      }
    });

    try {
      observer.observe({ entryTypes: ['paint'] });
    } catch (error) {
      console.warn('Performance observer not supported:', error);
    }

    // Measure Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', Math.round(lastEntry.startTime), 'ms');
    });

    try {
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (error) {
      console.warn('LCP observer not supported:', error);
    }

    return () => {
      observer.disconnect();
      lcpObserver.disconnect();
    };
  }, [enableWebVitals]);

  const preloadCriticalResources = useCallback(() => {
    if (!preloadResources || typeof window === 'undefined') return;

    // Preload critical fonts
    const fontPreloads = [
      '/fonts/inter-var.woff2',
      '/fonts/inter-var.woff'
    ];

    fontPreloads.forEach(font => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = font;
      link.as = 'font';
      link.type = font.endsWith('.woff2') ? 'font/woff2' : 'font/woff';
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });

    // Preload critical images
    const imagePreloads = ['/hero-bg.webp', '/logo.svg'];
    imagePreloads.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = src;
      link.as = 'image';
      document.head.appendChild(link);
    });
  }, [preloadResources]);

  const measureCustomTimings = useCallback(() => {
    if (!measureTimings || typeof window === 'undefined') return;

    // Mark app initialization
    performance.mark('app-init-start');
    
    return () => {
      performance.mark('app-init-end');
      performance.measure('app-initialization', 'app-init-start', 'app-init-end');
      
      const measure = performance.getEntriesByName('app-initialization')[0];
      if (measure) {
        console.log('App initialization time:', Math.round(measure.duration), 'ms');
      }
    };
  }, [measureTimings]);

  useEffect(() => {
    const cleanupFunctions: (() => void)[] = [];

    // Initialize performance optimizations
    preloadCriticalResources();
    
    const webVitalsCleanup = measureCoreWebVitals();
    if (webVitalsCleanup) cleanupFunctions.push(webVitalsCleanup);
    
    const timingsCleanup = measureCustomTimings();
    if (timingsCleanup) cleanupFunctions.push(timingsCleanup);

    // Optimize images with intersection observer
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
              }
            }
          });
        },
        { rootMargin: '50px' }
      );

      // Observe all images with data-src
      document.querySelectorAll('img[data-src]').forEach((img) => {
        imageObserver.observe(img);
      });

      cleanupFunctions.push(() => imageObserver.disconnect());
    }

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup());
    };
  }, [preloadCriticalResources, measureCoreWebVitals, measureCustomTimings]);
}
