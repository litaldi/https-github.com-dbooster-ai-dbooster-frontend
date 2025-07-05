
import { useEffect, useState } from 'react';
import { performanceTracker } from '@/utils/performanceTracker';

interface PerformanceMetrics {
  fcp?: number;
  lcp?: number;
  cls?: number;
  fid?: number;
  ttfb?: number;
  tti?: number;
}

interface PerformanceState {
  metrics: PerformanceMetrics;
  score: number;
  isLoading: boolean;
  recommendations: string[];
}

export function usePerformanceMonitoring() {
  const [state, setState] = useState<PerformanceState>({
    metrics: {},
    score: 0,
    isLoading: true,
    recommendations: []
  });

  useEffect(() => {
    // Initialize performance tracking
    performanceTracker.initialize();

    const updateMetrics = () => {
      const report = performanceTracker.generateReport();
      setState({
        metrics: report.metrics,
        score: report.score,
        isLoading: false,
        recommendations: report.recommendations
      });
    };

    // Initial update
    updateMetrics();

    // Update every 2 seconds
    const interval = setInterval(updateMetrics, 2000);

    return () => {
      clearInterval(interval);
      performanceTracker.cleanup();
    };
  }, []);

  const trackCustomMetric = (name: string, value: number) => {
    if (import.meta.env.DEV) {
      console.log(`📈 Custom metric - ${name}: ${value}`);
    }
    
    // Send to analytics if available
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'custom_metric', {
        event_category: 'Performance',
        event_label: name,
        value: Math.round(value)
      });
    }
  };

  return {
    ...state,
    trackCustomMetric
  };
}
