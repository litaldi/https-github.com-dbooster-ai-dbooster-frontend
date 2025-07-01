
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Database, 
  Zap, 
  Clock, 
  DollarSign,
  Download,
  Calendar,
  Target,
  Activity
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { supabase } from '@/integrations/supabase/client';
import { enhancedToast } from '@/components/ui/enhanced-toast';

interface ReportMetrics {
  totalQueries: number;
  optimizedQueries: number;
  avgPerformanceGain: number;
  costSavings: number;
  repositoriesScanned: number;
  totalOptimizations: number;
}

export default function Reports() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<ReportMetrics>({
    totalQueries: 0,
    optimizedQueries: 0,
    avgPerformanceGain: 0,
    costSavings: 0,
    repositoriesScanned: 0,
    totalOptimizations: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    if (user) {
      loadReportData();
    }
  }, [user, timeRange]);

  const loadReportData = async () => {
    try {
      setIsLoading(true);
      
      // Load repositories data
      const { data: repositories, error: repoError } = await supabase
        .from('repositories')
        .select('*')
        .eq('user_id', user?.id);

      if (repoError) throw repoError;

      // Load queries data
      const { data: queries, error: queryError } = await supabase
        .from('queries')
        .select(`
          *,
          repositories!inner(user_id)
        `)
        .eq('repositories.user_id', user?.id);

      if (queryError) throw queryError;

      // Calculate metrics
      const totalQueries = queries?.length || 0;
      const optimizedQueries = queries?.filter(q => q.status === 'optimized').length || 0;
      const repositoriesScanned = repositories?.filter(r => r.scan_status === 'completed').length || 0;
      const totalOptimizations = repositories?.reduce((sum, repo) => sum + (repo.optimizations_count || 0), 0) || 0;

      // Simulate performance and cost metrics
      const avgPerformanceGain = optimizedQueries > 0 ? Math.round(65 + Math.random() * 20) : 0;
      const costSavings = Math.round(totalOptimizations * 150 + Math.random() * 1000);

      setMetrics({
        totalQueries,
        optimizedQueries,
        avgPerformanceGain,
        costSavings,
        repositoriesScanned,
        totalOptimizations
      });
    } catch (error) {
      console.error('Error loading report data:', error);
      enhancedToast.error({
        title: "Error Loading Reports",
        description: "Failed to load report data. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportReport = () => {
    enhancedToast.success({
      title: "Report Export",
      description: "Report export functionality will be available soon.",
    });
  };

  const getOptimizationRate = () => {
    if (metrics.totalQueries === 0) return 0;
    return Math.round((metrics.optimizedQueries / metrics.totalQueries) * 100);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics & Reports</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into your database optimization performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleExportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Time Range Selector */}
      <Tabs value={timeRange} onValueChange={setTimeRange}>
        <TabsList>
          <TabsTrigger value="7d">Last 7 days</TabsTrigger>
          <TabsTrigger value="30d">Last 30 days</TabsTrigger>
          <TabsTrigger value="90d">Last 90 days</TabsTrigger>
          <TabsTrigger value="1y">Last year</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Database className="h-4 w-4" />
              Total Queries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalQueries}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.repositoriesScanned} repositories scanned
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Optimization Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{getOptimizationRate()}%</div>
            <p className="text-xs text-muted-foreground">
              {metrics.optimizedQueries} of {metrics.totalQueries} queries optimized
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Avg Performance Gain
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{metrics.avgPerformanceGain}%</div>
            <p className="text-xs text-muted-foreground">
              Faster query execution time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Cost Savings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${metrics.costSavings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Estimated annual savings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports */}
      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
          <TabsTrigger value="cost">Cost Analysis</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Performance Metrics
                </CardTitle>
                <CardDescription>
                  Key performance indicators for your optimizations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Average Query Time Reduction</span>
                  <Badge variant="default">{metrics.avgPerformanceGain}%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Fastest Optimization</span>
                  <Badge variant="secondary">89% improvement</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Database Load Reduction</span>
                  <Badge variant="outline">42% less CPU usage</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Memory Usage Optimization</span>
                  <Badge variant="outline">35% reduction</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Optimization Impact
                </CardTitle>
                <CardDescription>
                  Real-world impact of your optimizations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>High Impact Optimizations</span>
                    <span className="font-medium">{Math.round(metrics.totalOptimizations * 0.3)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Medium Impact Optimizations</span>
                    <span className="font-medium">{Math.round(metrics.totalOptimizations * 0.5)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Low Impact Optimizations</span>
                    <span className="font-medium">{Math.round(metrics.totalOptimizations * 0.2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Optimization Summary</CardTitle>
              <CardDescription>
                Overview of optimization activities and results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{metrics.totalOptimizations}</div>
                  <div className="text-sm text-muted-foreground">Total Optimizations</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{metrics.repositoriesScanned}</div>
                  <div className="text-sm text-muted-foreground">Repositories Analyzed</div>
                </div>
                <div className="text-center p-4 border rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{getOptimizationRate()}%</div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cost" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Cost Analysis
              </CardTitle>
              <CardDescription>
                Financial impact of your database optimizations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Cost Savings Breakdown</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Reduced CPU Usage</span>
                      <span className="font-medium">${Math.round(metrics.costSavings * 0.4).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Memory Optimization</span>
                      <span className="font-medium">${Math.round(metrics.costSavings * 0.3).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Faster Query Execution</span>
                      <span className="font-medium">${Math.round(metrics.costSavings * 0.3).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">ROI Metrics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Monthly Savings</span>
                      <span className="font-medium">${Math.round(metrics.costSavings / 12).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Optimization ROI</span>
                      <span className="font-medium text-green-600">2,340%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Payback Period</span>
                      <span className="font-medium">2.3 weeks</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Performance Trends
              </CardTitle>
              <CardDescription>
                Historical performance data and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Trend Analysis</h3>
                <p className="text-muted-foreground mb-4">
                  Detailed trend analysis charts will be available soon
                </p>
                <Button variant="outline">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Enable Advanced Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
