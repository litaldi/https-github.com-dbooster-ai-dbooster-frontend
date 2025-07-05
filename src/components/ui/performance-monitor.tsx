
import React, { useState, useEffect } from 'react';
import { Activity, Zap, Clock, TrendingUp, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  description: string;
  target?: number;
}

interface WebVital {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  threshold: { good: number; poor: number };
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [webVitals, setWebVitals] = useState<WebVital[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    startPerformanceMonitoring();
    return () => setIsMonitoring(false);
  }, []);

  const startPerformanceMonitoring = () => {
    setIsMonitoring(true);
    
    // Monitor Web Vitals
    if ('web-vitals' in window || typeof window !== 'undefined') {
      measureWebVitals();
    }

    // Monitor custom metrics
    const interval = setInterval(() => {
      measureCustomMetrics();
    }, 5000);

    return () => clearInterval(interval);
  };

  const measureWebVitals = () => {
    // Simulate Web Vitals measurement
    // In a real app, you'd use the web-vitals library
    const vitals: WebVital[] = [
      {
        name: 'First Contentful Paint',
        value: Math.random() * 2000 + 500,
        rating: 'good',
        threshold: { good: 1800, poor: 3000 }
      },
      {
        name: 'Largest Contentful Paint',
        value: Math.random() * 3000 + 1000,
        rating: 'good',
        threshold: { good: 2500, poor: 4000 }
      },
      {
        name: 'Cumulative Layout Shift',
        value: Math.random() * 0.3,
        rating: 'good',
        threshold: { good: 0.1, poor: 0.25 }
      },
      {
        name: 'First Input Delay',
        value: Math.random() * 200 + 50,
        rating: 'good',
        threshold: { good: 100, poor: 300 }
      }
    ];

    // Rate the vitals
    vitals.forEach(vital => {
      if (vital.value <= vital.threshold.good) {
        vital.rating = 'good';
      } else if (vital.value <= vital.threshold.poor) {
        vital.rating = 'needs-improvement';
      } else {
        vital.rating = 'poor';
      }
    });

    setWebVitals(vitals);
  };

  const measureCustomMetrics = () => {
    // Memory usage
    const memory = (performance as any).memory;
    const memoryUsage = memory ? (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100 : 0;

    // Page load time
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const loadTime = navigation ? navigation.loadEventEnd - navigation.loadEventStart : 0;

    // Resource count
    const resourceCount = performance.getEntriesByType('resource').length;

    const newMetrics: PerformanceMetric[] = [
      {
        name: 'Memory Usage',
        value: memoryUsage,
        unit: '%',
        status: memoryUsage > 80 ? 'critical' : memoryUsage > 60 ? 'warning' : 'good',
        description: 'JavaScript heap memory usage',
        target: 70
      },
      {
        name: 'Page Load Time',
        value: loadTime,
        unit: 'ms',
        status: loadTime > 3000 ? 'critical' : loadTime > 1500 ? 'warning' : 'good',
        description: 'Time to fully load the page',
        target: 1500
      },
      {
        name: 'Resource Count',
        value: resourceCount,
        unit: 'files',
        status: resourceCount > 100 ? 'warning' : 'good',
        description: 'Number of loaded resources',
        target: 50
      }
    ];

    setMetrics(newMetrics);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'warning': case 'needs-improvement': return 'text-yellow-600 bg-yellow-100';
      case 'critical': case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <TrendingUp className="h-4 w-4" />;
      case 'warning': case 'needs-improvement': return <Clock className="h-4 w-4" />;
      case 'critical': case 'poor': return <AlertTriangle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Performance Monitor</h2>
          <p className="text-muted-foreground">
            Real-time application performance metrics
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className={cn(
            'flex items-center gap-2 px-3 py-1 rounded-full text-sm',
            isMonitoring ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
          )}>
            <div className={cn(
              'w-2 h-2 rounded-full',
              isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
            )} />
            {isMonitoring ? 'Monitoring' : 'Stopped'}
          </div>
        </div>
      </div>

      {/* Web Vitals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Core Web Vitals
          </CardTitle>
          <CardDescription>
            Google's metrics for measuring user experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {webVitals.map((vital) => (
              <div key={vital.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{vital.name}</span>
                  <Badge className={getStatusColor(vital.rating)}>
                    {vital.rating === 'needs-improvement' ? 'OK' : vital.rating}
                  </Badge>
                </div>
                <div className="text-2xl font-bold">
                  {vital.name.includes('Shift') 
                    ? vital.value.toFixed(3) 
                    : Math.round(vital.value)
                  }
                  <span className="text-sm text-muted-foreground ml-1">
                    {vital.name.includes('Shift') ? '' : 'ms'}
                  </span>
                </div>
                <Progress 
                  value={Math.min((vital.value / vital.threshold.poor) * 100, 100)} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Application Metrics
          </CardTitle>
          <CardDescription>
            Custom performance indicators for your application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.map((metric) => (
              <div key={metric.name} className="flex items-center justify-between p-4 rounded-lg border bg-muted/20">
                <div className="flex items-center gap-3">
                  <div className={cn('p-2 rounded-full', getStatusColor(metric.status))}>
                    {getStatusIcon(metric.status)}
                  </div>
                  <div>
                    <div className="font-medium">{metric.name}</div>
                    <div className="text-sm text-muted-foreground">{metric.description}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {typeof metric.value === 'number' ? Math.round(metric.value) : metric.value}
                    <span className="text-sm text-muted-foreground ml-1">{metric.unit}</span>
                  </div>
                  {metric.target && (
                    <div className="text-xs text-muted-foreground">
                      Target: {metric.target}{metric.unit}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
