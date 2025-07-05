
import React, { useState, useEffect } from 'react';
import { Activity, Zap, Clock, TrendingUp, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { EnhancedButton } from './enhanced-button';
import { usePerformanceMonitoring } from '@/hooks/usePerformanceMonitoring';
import { cn } from '@/lib/utils';

export function PerformanceWidget() {
  const { metrics, score, isLoading, recommendations } = usePerformanceMonitoring();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development or when explicitly enabled
    const shouldShow = process.env.NODE_ENV === 'development' || 
                      localStorage.getItem('show-performance-widget') === 'true';
    setIsVisible(shouldShow);
  }, []);

  if (!isVisible) return null;

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <TrendingUp className="h-4 w-4" />;
    if (score >= 70) return <Clock className="h-4 w-4" />;
    return <AlertTriangle className="h-4 w-4" />;
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm">
      <Card className="border-2 border-blue-200 shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Performance
            </CardTitle>
            <EnhancedButton 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsVisible(false)}
              className="h-6 w-6 p-0"
            >
              ×
            </EnhancedButton>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3 text-xs">
          {/* Performance Score */}
          <div className="flex items-center justify-between">
            <span className="font-medium">Overall Score</span>
            <div className="flex items-center gap-2">
              <Badge className={cn('text-xs', getScoreColor(score))}>
                {getScoreIcon(score)}
                {score}/100
              </Badge>
            </div>
          </div>

          {/* Core Web Vitals */}
          {metrics.lcp && (
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span>LCP</span>
                <span className={metrics.lcp > 2500 ? 'text-red-600' : 'text-green-600'}>
                  {metrics.lcp.toFixed(0)}ms
                </span>
              </div>
              <Progress 
                value={Math.min((metrics.lcp / 4000) * 100, 100)} 
                className="h-1"
              />
            </div>
          )}

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="space-y-1">
              <span className="font-medium text-xs">Recommendations:</span>
              <ul className="text-xs text-muted-foreground space-y-1">
                {recommendations.slice(0, 2).map((rec, index) => (
                  <li key={index} className="flex items-start gap-1">
                    <span className="text-yellow-500 flex-shrink-0">•</span>
                    <span className="line-clamp-2">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span>Analyzing performance...</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Developer utility
if (typeof window !== 'undefined') {
  (window as any).showPerformanceWidget = () => {
    localStorage.setItem('show-performance-widget', 'true');
    window.location.reload();
  };
}
