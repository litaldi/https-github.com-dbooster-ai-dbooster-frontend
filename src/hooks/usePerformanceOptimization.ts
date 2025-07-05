
import { useEffect, useCallback } from 'react';

/**
 * Custom hook for performance optimization
 */
export function usePerformanceOptimization() {
  const measurePerformance = useCallback((name: string, fn: () => void) => {
    const start = performance.now();
    fn();
    const end = performance.now();
    
    if (process.env.NODE_ENV !== 'production') {
      console.info(`Performance: ${name} took ${(end - start).toFixed(2)}ms`);
    }
  }, []);

  const preloadResource = useCallback((href: string, as: string) => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    document.head.appendChild(link);
  }, []);

  const lazyLoadImage = useCallback((src: string, placeholder?: string) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(src);
      img.onerror = () => resolve(placeholder || src);
      img.src = src;
    });
  }, []);

  // Performance monitoring
  useEffect(() => {
    if ('performance' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (process.env.NODE_ENV !== 'production') {
            console.info(`Performance entry: ${entry.name} - ${entry.duration.toFixed(2)}ms`);
          }
        });
      });
      
      observer.observe({ entryTypes: ['navigation', 'resource'] });
      
      return () => observer.disconnect();
    }
  }, []);

  return {
    measurePerformance,
    preloadResource,
    lazyLoadImage
  };
}
