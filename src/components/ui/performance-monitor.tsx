
import React, { useEffect, useState } from 'react';
import { useWebVitals } from '@/hooks/useWebVitals';
import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export function PerformanceMonitor() {
  const { metrics, score, recommendations } = usePerformanceMonitoring();
  const [isVisible, setIsVisible] = useState(process.env.NODE_ENV === 'development');

  useWebVitals({
    reportAllChanges: true,
    debug: process.env.NODE_ENV === 'development',
    onMetric: (metric) => {
      // Log performance metrics in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`Performance: ${metric.name} = ${metric.value.toFixed(2)}ms (${metric.rating})`);
      }
    }
  });

  if (!isVisible || process.env.NODE_ENV !== 'development') {
    return null;
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreVariant = (score: number) => {
    if (score >= 90) return 'default';
    if (score >= 70) return 'secondary';
    return 'destructive';
  };

  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-sm">
      <Card className="shadow-lg border bg-background/95 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center justify-between">
            Performance Monitor
            <Badge variant={getScoreVariant(score)} className="ml-2">
              {score}/100
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <Progress value={score} className="h-2" />
          
          <div className="space-y-2 text-xs">
            {Object.entries(metrics).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="font-medium uppercase">{key}:</span>
                <span className={getScoreColor(score)}>
                  {typeof value === 'number' ? `${value.toFixed(0)}ms` : value}
                </span>
              </div>
            ))}
          </div>

          {recommendations.length > 0 && (
            <div className="pt-2 border-t">
              <div className="text-xs font-medium mb-1">Recommendations:</div>
              <ul className="text-xs text-muted-foreground space-y-1">
                {recommendations.slice(0, 2).map((rec, index) => (
                  <li key={index} className="leading-tight">• {rec}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
