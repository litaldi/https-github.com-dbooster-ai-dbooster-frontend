
import { useState, useEffect } from 'react';
import { performanceTracker } from '@/utils/performanceTracker';

interface PerformanceMetrics {
  fcp?: number;
  lcp?: number;
  cls?: number;
  fid?: number;
  ttfb?: number;
  tti?: number;
}

interface UsePerformanceMonitoringReturn {
  metrics: PerformanceMetrics;
  score: number;
  isLoading: boolean;
  recommendations: string[];
}

export function usePerformanceMonitoring(): UsePerformanceMonitoringReturn {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  useEffect(() => {
    performanceTracker.initialize();

    const updateMetrics = () => {
      const report = performanceTracker.generateReport();
      setMetrics(report.metrics);
      setScore(report.score);
      setRecommendations(report.recommendations);
      setIsLoading(false);
    };

    // Initial update
    setTimeout(updateMetrics, 1000);

    // Periodic updates
    const interval = setInterval(updateMetrics, 5000);

    return () => {
      clearInterval(interval);
      performanceTracker.cleanup();
    };
  }, []);

  return {
    metrics,
    score,
    isLoading,
    recommendations
  };
}
