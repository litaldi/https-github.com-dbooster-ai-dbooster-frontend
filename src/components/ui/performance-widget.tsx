
import React, { useState } from 'react';
import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { EnhancedButton } from './enhanced-button';
import { Activity, X, Zap, Clock, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PerformanceWidget() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { metrics, score, isLoading, recommendations } = usePerformanceMonitoring();

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatMetric = (value: number | undefined, unit = 'ms') => {
    if (value === undefined) return 'N/A';
    return `${Math.round(value)}${unit}`;
  };

  return (
    <div className="fixed bottom-4 left-4 z-40">
      {!isExpanded ? (
        <EnhancedButton
          onClick={() => setIsExpanded(true)}
          className="h-12 w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90"
          size="icon"
          aria-label="Show performance metrics"
        >
          <Activity className="h-5 w-5" />
        </EnhancedButton>
      ) : (
        <Card className="w-80 shadow-xl border-2 bg-background/95 backdrop-blur">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Performance
                <Badge 
                  variant={score >= 90 ? 'default' : score >= 70 ? 'secondary' : 'destructive'}
                  className="ml-2"
                >
                  {isLoading ? '...' : score}
                </Badge>
              </CardTitle>
              <EnhancedButton
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="h-6 w-6 p-0"
                aria-label="Hide performance metrics"
              >
                <X className="h-4 w-4" />
              </EnhancedButton>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Core Web Vitals */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Core Web Vitals</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3 text-blue-500" />
                  <span>FCP: {formatMetric(metrics.fcp)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Zap className="h-3 w-3 text-green-500" />
                  <span>LCP: {formatMetric(metrics.lcp)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-orange-500" />
                  <span>CLS: {formatMetric(metrics.cls, '')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Activity className="h-3 w-3 text-purple-500" />
                  <span>TTFB: {formatMetric(metrics.ttfb)}</span>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground">Recommendations</h4>
                <div className="space-y-1">
                  {recommendations.slice(0, 3).map((rec, index) => (
                    <div key={index} className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                      {rec}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-xs text-muted-foreground text-center pt-2 border-t">
              Development Mode Only
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
