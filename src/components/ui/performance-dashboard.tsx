
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useWebVitals } from '@/hooks/useWebVitals';
import { BundleAnalyzer } from '@/utils/bundleAnalyzer';
import { ResourcePreloader } from '@/utils/resourcePreloader';
import { Zap, Activity, HardDrive, Globe, RefreshCw } from 'lucide-react';

interface PerformanceMetrics {
  lcp: number;
  inp: number;
  cls: number;
  fcp: number;
  ttfb: number;
}

export function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<Partial<PerformanceMetrics>>({});
  const [memoryUsage, setMemoryUsage] = useState<any>(null);
  const [slowResources, setSlowResources] = useState<any[]>([]);
  const [preloadedResources, setPreloadedResources] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useWebVitals({
    onMetric: (metric) => {
      setMetrics(prev => ({
        ...prev,
        [metric.name.toLowerCase()]: metric.value
      }));
    },
    debug: true
  });

  useEffect(() => {
    // Only show in development or for performance debugging
    const shouldShow = process.env.NODE_ENV === 'development' || 
                      localStorage.getItem('show-performance-dashboard') === 'true';
    setIsVisible(shouldShow);

    if (!shouldShow) return;

    // Initial performance analysis
    const analyzePerformance = () => {
      const memory = BundleAnalyzer.getMemoryUsage();
      setMemoryUsage(memory);

      const slowRes = BundleAnalyzer.measureLoadTimes();
      setSlowResources(slowRes || []);

      const preloaded = ResourcePreloader.getPreloadedResources();
      setPreloadedResources(preloaded);
    };

    analyzePerformance();
  }, []);

  if (!isVisible) return null;

  const getScoreColor = (value: number, thresholds: [number, number]) => {
    if (value <= thresholds[0]) return 'text-green-600';
    if (value <= thresholds[1]) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (value: number, thresholds: [number, number]) => {
    if (value <= thresholds[0]) return { label: 'Good', variant: 'default' as const };
    if (value <= thresholds[1]) return { label: 'OK', variant: 'secondary' as const };
    return { label: 'Poor', variant: 'destructive' as const };
  };

  const runFullAnalysis = () => {
    BundleAnalyzer.analyzeChunks();
    BundleAnalyzer.measureLoadTimes();
    window.location.reload();
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-md">
      <Card className="border-2 border-blue-200 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Performance Dashboard
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsVisible(false)}
              className="h-6 w-6 p-0"
            >
              ×
            </Button>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-3 text-xs">
          {/* Core Web Vitals */}
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Core Web Vitals
            </h4>
            
            {metrics.lcp && (
              <div className="flex justify-between items-center">
                <span>LCP</span>
                <div className="flex items-center gap-1">
                  <span className={getScoreColor(metrics.lcp, [2500, 4000])}>
                    {metrics.lcp.toFixed(0)}ms
                  </span>
                  <Badge variant={getScoreBadge(metrics.lcp, [2500, 4000]).variant} className="text-xs">
                    {getScoreBadge(metrics.lcp, [2500, 4000]).label}
                  </Badge>
                </div>
              </div>
            )}
            
            {metrics.inp && (
              <div className="flex justify-between items-center">
                <span>INP</span>
                <div className="flex items-center gap-1">
                  <span className={getScoreColor(metrics.inp, [200, 500])}>
                    {metrics.inp.toFixed(0)}ms
                  </span>
                  <Badge variant={getScoreBadge(metrics.inp, [200, 500]).variant} className="text-xs">
                    {getScoreBadge(metrics.inp, [200, 500]).label}
                  </Badge>
                </div>
              </div>
            )}
            
            {metrics.cls && (
              <div className="flex justify-between items-center">
                <span>CLS</span>
                <div className="flex items-center gap-1">
                  <span className={getScoreColor(metrics.cls * 1000, [100, 250])}>
                    {metrics.cls.toFixed(3)}
                  </span>
                  <Badge variant={getScoreBadge(metrics.cls * 1000, [100, 250]).variant} className="text-xs">
                    {getScoreBadge(metrics.cls * 1000, [100, 250]).label}
                  </Badge>
                </div>
              </div>
            )}
          </div>

          {/* Memory Usage */}
          {memoryUsage && (
            <div className="space-y-2">
              <h4 className="font-medium flex items-center gap-1">
                <HardDrive className="h-3 w-3" />
                Memory Usage
              </h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>Used</span>
                  <span>{memoryUsage.used}MB / {memoryUsage.total}MB</span>
                </div>
                <Progress value={(memoryUsage.used / memoryUsage.total) * 100} className="h-1" />
              </div>
            </div>
          )}

          {/* Resource Status */}
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-1">
              <Globe className="h-3 w-3" />
              Resources
            </h4>
            <div className="flex justify-between">
              <span>Preloaded</span>
              <Badge variant="outline">{preloadedResources.length}</Badge>
            </div>
            <div className="flex justify-between">
              <span>Slow Resources</span>
              <Badge variant={slowResources.length > 0 ? "destructive" : "default"}>
                {slowResources.length}
              </Badge>
            </div>
          </div>

          <Button 
            onClick={runFullAnalysis}
            variant="outline" 
            size="sm" 
            className="w-full gap-1"
          >
            <RefreshCw className="h-3 w-3" />
            Run Analysis
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Developer utility
if (typeof window !== 'undefined') {
  (window as any).showPerformanceDashboard = () => {
    localStorage.setItem('show-performance-dashboard', 'true');
    window.location.reload();
  };
}
