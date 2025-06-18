
import { useEffect, useCallback } from 'react';

interface WebVitalsMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

interface UseWebVitalsOptions {
  reportAllChanges?: boolean;
  onMetric?: (metric: WebVitalsMetric) => void;
  debug?: boolean;
}

export function useWebVitals(options: UseWebVitalsOptions = {}) {
  const { reportAllChanges = false, onMetric, debug = process.env.NODE_ENV === 'development' } = options;

  const reportMetric = useCallback((metric: WebVitalsMetric) => {
    if (debug) {
      console.log(`📊 Web Vital: ${metric.name}`, {
        value: `${metric.value.toFixed(2)}ms`,
        rating: metric.rating,
        delta: metric.delta
      });
    }

    if (onMetric) {
      onMetric(metric);
    }

    // Send to analytics in production
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'web_vitals', {
        event_category: 'Web Vitals',
        event_label: metric.name,
        value: Math.round(metric.value),
        custom_map: {
          metric_rating: metric.rating
        }
      });
    }
  }, [onMetric, debug]);

  useEffect(() => {
    // Dynamic import to avoid bundle bloat
    import('web-vitals').then(({ onLCP, onINP, onCLS, onFCP, onTTFB }) => {
      onLCP(reportMetric, { reportAllChanges });
      onINP(reportMetric, { reportAllChanges });
      onCLS(reportMetric, { reportAllChanges });
      onFCP(reportMetric, { reportAllChanges });
      onTTFB(reportMetric, { reportAllChanges });
    }).catch(() => {
      // Gracefully handle if web-vitals is not available
      if (debug) {
        console.warn('Web Vitals library not available');
      }
    });
  }, [reportMetric, reportAllChanges]);

  // Additional performance metrics
  useEffect(() => {
    const measureNavigation = () => {
      if ('performance' in window && 'getEntriesByType' in performance) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        if (navigation) {
          const metrics = {
            'DOM Content Loaded': navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            'Load Complete': navigation.loadEventEnd - navigation.loadEventStart,
            'Time to Interactive': navigation.domInteractive - navigation.fetchStart,
            'DNS Lookup': navigation.domainLookupEnd - navigation.domainLookupStart,
            'TCP Connection': navigation.connectEnd - navigation.connectStart,
            'Server Response': navigation.responseEnd - navigation.requestStart
          };

          if (debug) {
            console.group('🔍 Navigation Timing');
            Object.entries(metrics).forEach(([name, value]) => {
              console.log(`${name}: ${value.toFixed(2)}ms`);
            });
            console.groupEnd();
          }
        }
      }
    };

    // Measure after page load
    if (document.readyState === 'complete') {
      measureNavigation();
    } else {
      window.addEventListener('load', measureNavigation);
    }

    return () => {
      window.removeEventListener('load', measureNavigation);
    };
  }, [debug]);
}
