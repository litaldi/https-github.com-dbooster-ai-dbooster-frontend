
import { useEffect } from 'react';

export function usePerformanceOptimization() {
  useEffect(() => {
    // Performance monitoring
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'navigation') {
          console.log('Navigation timing:', entry);
        }
      });
    });

    if ('observe' in observer) {
      observer.observe({ entryTypes: ['navigation', 'measure'] });
    }

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, []);
}
