
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Zap, Clock, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import { performanceTracker } from '@/utils/performanceTracker';
import { bundleOptimizer } from '@/utils/bundleOptimizer';

interface PerformanceMetrics {
  fcp?: number;
  lcp?: number;
  cls?: number;
  fid?: number;
  ttfb?: number;
  tti?: number;
}

interface PerformanceData {
  score: number;
  metrics: PerformanceMetrics;
  recommendations: string[];
}

interface BundleData {
  totalSize: number;
  recommendations: string[];
  potentialSavings: number;
}

export function PerformanceDashboard() {
  const [performanceData, setPerformanceData] = useState<PerformanceData>({
    score: 0,
    metrics: {},
    recommendations: []
  });
  const [bundleData, setBundleData] = useState<BundleData>({
    totalSize: 0,
    recommendations: [],
    potentialSavings: 0
  });

  useEffect(() => {
    // Initialize performance tracking
    performanceTracker.initialize();

    // Get performance data
    const updateData = () => {
      const report = performanceTracker.generateReport();
      setPerformanceData(report);
    };

    // Get bundle analysis
    const analyzeBundles = async () => {
      const analysis = await bundleOptimizer.analyzeBundleSize();
      const optimization = bundleOptimizer.generateOptimizationReport();
      setBundleData({
        totalSize: analysis.totalSize,
        recommendations: optimization.recommendations,
        potentialSavings: optimization.potentialSavings
      });
    };

    updateData();
    analyzeBundles();

    const interval = setInterval(updateData, 5000);
    return () => {
      clearInterval(interval);
      performanceTracker.cleanup();
    };
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (score >= 70) return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    return <AlertCircle className="h-5 w-5 text-red-600" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Performance Dashboard</h2>
          <p className="text-muted-foreground">
            Real-time performance monitoring and optimization insights
          </p>
        </div>
        <Badge variant="outline" className="animate-pulse">
          <Activity className="h-3 w-3 mr-1" />
          Live Monitoring
        </Badge>
      </div>

      {/* Performance Score Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance Score</CardTitle>
            {getScoreIcon(performanceData.score)}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(performanceData.score)}`}>
              {performanceData.score}/100
            </div>
            <Progress value={performanceData.score} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bundle Size</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(bundleData.totalSize / 1024)} KB
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(bundleData.potentialSavings / 1024)} KB savings available
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">FCP</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {performanceData.metrics.fcp ? Math.round(performanceData.metrics.fcp) : '--'}ms
            </div>
            <p className="text-xs text-muted-foreground">First Contentful Paint</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">LCP</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {performanceData.metrics.lcp ? Math.round(performanceData.metrics.lcp) : '--'}ms
            </div>
            <p className="text-xs text-muted-foreground">Largest Contentful Paint</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="metrics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="metrics">Web Vitals</TabsTrigger>
          <TabsTrigger value="bundle">Bundle Analysis</TabsTrigger>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Core Web Vitals</CardTitle>
              <CardDescription>
                Real-time performance metrics that impact user experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(Object.entries(performanceData.metrics) as Array<[keyof PerformanceMetrics, number | undefined]>).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm font-medium uppercase">{key}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{typeof value === 'number' ? Math.round(value) : '--'}ms</span>
                    <Badge variant={typeof value === 'number' && value < 2000 ? 'default' : 'destructive'}>
                      {typeof value === 'number' && value < 2000 ? 'Good' : 'Needs Work'}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bundle" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bundle Optimization</CardTitle>
              <CardDescription>
                Analysis of bundle size and optimization opportunities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Total Bundle Size</span>
                  <Badge variant="outline">{Math.round(bundleData.totalSize / 1024)} KB</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Potential Savings</span>
                  <Badge variant="secondary">{Math.round(bundleData.potentialSavings / 1024)} KB</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Optimization Recommendations</CardTitle>
              <CardDescription>
                Actionable steps to improve performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...performanceData.recommendations, ...bundleData.recommendations].map((rec, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <span className="text-sm">{rec}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
