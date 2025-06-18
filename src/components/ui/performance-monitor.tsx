
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Zap, Clock } from 'lucide-react';

interface Performance Metrics {
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input delay
  cls: number; // Cumulative Layout Shift
  fcp: number; // First Contentful Paint
  ttfb: number; // Time to First Byte
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development or for admins
    const showMonitor = process.env.NODE_ENV === 'development' || 
                       localStorage.getItem('show-performance-monitor') === 'true';
    setIsVisible(showMonitor);

    if (!showMonitor) return;

    // Collect Web Vitals
    const collectMetrics = () => {
      if ('performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        
        setMetrics({
          lcp: 0, // Will be updated by observer
          fid: 0, // Will be updated by observer
          cls: 0, // Will be updated by observer
          fcp: navigation.responseStart - navigation.fetchStart,
          ttfb: navigation.responseStart - navigation.requestStart,
        });
      }
    };

    // Use Web Vitals library if available
    if (typeof window !== 'undefined') {
      import('web-vitals').then(({ onLCP, onFID, onCLS, onFCP }) => {
        onLCP((metric) => {
          setMetrics(prev => prev ? { ...prev, lcp: metric.value } : null);
        });
        
        onFID((metric) => {
          setMetrics(prev => prev ? { ...prev, fid: metric.value } : null);
        });
        
        onCLS((metric) => {
          setMetrics(prev => prev ? { ...prev, cls: metric.value } : null);
        });
        
        onFCP((metric) => {
          setMetrics(prev => prev ? { ...prev, fcp: metric.value } : null);
        });
      }).catch(() => {
        // Fallback to basic performance API
        collectMetrics();
      });
    }
  }, []);

  if (!isVisible || !metrics) return null;

  const getScoreColor = (value: number, thresholds: [number, number]) => {
    if (value <= thresholds[0]) return 'text-green-600';
    if (value <= thresholds[1]) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (value: number, thresholds: [number, number]) => {
    if (value <= thresholds[0]) return 'Good';
    if (value <= thresholds[1]) return 'Needs Improvement';
    return 'Poor';
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="border-2 border-primary/20 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span>LCP (Largest Contentful Paint)</span>
            <div className="flex items-center gap-1">
              <span className={getScoreColor(metrics.lcp, [2500, 4000])}>
                {metrics.lcp.toFixed(0)}ms
              </span>
              <Badge variant="outline" className="text-xs">
                {getScoreBadge(metrics.lcp, [2500, 4000])}
              </Badge>
            </div>
          </div>
          
          <div className="flex justify-between items-center text-xs">
            <span>FID (First Input Delay)</span>
            <div className="flex items-center gap-1">
              <span className={getScoreColor(metrics.fid, [100, 300])}>
                {metrics.fid.toFixed(0)}ms
              </span>
              <Badge variant="outline" className="text-xs">
                {getScoreBadge(metrics.fid, [100, 300])}
              </Badge>
            </div>
          </div>
          
          <div className="flex justify-between items-center text-xs">
            <span>CLS (Cumulative Layout Shift)</span>
            <div className="flex items-center gap-1">
              <span className={getScoreColor(metrics.cls * 1000, [100, 250])}>
                {metrics.cls.toFixed(3)}
              </span>
              <Badge variant="outline" className="text-xs">
                {getScoreBadge(metrics.cls * 1000, [100, 250])}
              </Badge>
            </div>
          </div>
          
          <div className="flex justify-between items-center text-xs">
            <span>TTFB (Time to First Byte)</span>
            <div className="flex items-center gap-1">
              <span className={getScoreColor(metrics.ttfb, [800, 1800])}>
                {metrics.ttfb.toFixed(0)}ms
              </span>
              <Badge variant="outline" className="text-xs">
                {getScoreBadge(metrics.ttfb, [800, 1800])}
              </Badge>
            </div>
          </div>
          
          <button 
            onClick={() => setIsVisible(false)}
            className="text-xs text-muted-foreground hover:text-foreground w-full text-center pt-2"
          >
            Hide Monitor
          </button>
        </CardContent>
      </Card>
    </div>
  );
}

// Developer utility to show performance monitor
if (typeof window !== 'undefined') {
  (window as any).showPerformanceMonitor = () => {
    localStorage.setItem('show-performance-monitor', 'true');
    window.location.reload();
  };
  
  (window as any).hidePerformanceMonitor = () => {
    localStorage.removeItem('show-performance-monitor');
    window.location.reload();
  };
}
