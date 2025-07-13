
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  Activity, 
  Database,
  Clock,
  Zap,
  ChevronRight
} from 'lucide-react';

export default function AnalyticsPage() {
  const analyticsData = {
    queryPerformance: {
      averageTime: '127ms',
      improvement: '+15.3%',
      totalQueries: 12847
    },
    optimizations: {
      completed: 9634,
      pending: 23,
      savings: '42.7%'
    },
    systemMetrics: {
      uptime: '99.94%',
      connections: 156,
      throughput: '2.3k/sec'
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive insights into your database performance and optimization metrics.
          </p>
        </div>
        <Button>
          <BarChart3 className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Query Performance</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.queryPerformance.averageTime}</div>
            <div className="flex items-center text-sm text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              {analyticsData.queryPerformance.improvement}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {analyticsData.queryPerformance.totalQueries.toLocaleString()} queries
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Optimizations</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.optimizations.completed.toLocaleString()}</div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-600">Completed</span>
              <Badge variant="outline">{analyticsData.optimizations.pending} pending</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {analyticsData.optimizations.savings} performance improvement
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.systemMetrics.uptime}</div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{analyticsData.systemMetrics.connections} connections</span>
              <span className="text-muted-foreground">{analyticsData.systemMetrics.throughput}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              System uptime and throughput
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList>
          <TabsTrigger value="performance">Performance Trends</TabsTrigger>
          <TabsTrigger value="optimization">Optimization History</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Query Performance Trends</CardTitle>
              <CardDescription>
                Historical analysis of query execution times and optimization impact
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Performance charts will be displayed here</p>
                  <p className="text-sm text-muted-foreground mt-2">Interactive charts coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Optimizations</CardTitle>
              <CardDescription>
                Timeline of database optimizations and their impact
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: 'Index optimization for user queries', impact: '25% faster', time: '2 hours ago' },
                  { title: 'Query plan improvement', impact: '18% reduction', time: '1 day ago' },
                  { title: 'Connection pool tuning', impact: '30% better throughput', time: '3 days ago' },
                ].map((optimization, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent">
                    <div>
                      <h4 className="font-medium">{optimization.title}</h4>
                      <p className="text-sm text-muted-foreground">{optimization.time}</p>
                    </div>
                    <Badge variant="outline" className="text-green-600">
                      {optimization.impact}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Insights</CardTitle>
              <CardDescription>
                Machine learning recommendations for database optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { 
                    title: 'Index Recommendation', 
                    description: 'Add composite index on user_id, created_at columns',
                    priority: 'High',
                    impact: 'Expected 35% performance improvement'
                  },
                  {
                    title: 'Query Optimization',
                    description: 'Refactor N+1 queries in user dashboard',
                    priority: 'Medium', 
                    impact: 'Reduce database load by 20%'
                  },
                  {
                    title: 'Connection Tuning',
                    description: 'Adjust connection pool size based on usage patterns',
                    priority: 'Low',
                    impact: 'Improve resource utilization'
                  }
                ].map((insight, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:bg-accent">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{insight.title}</h4>
                          <Badge variant={insight.priority === 'High' ? 'destructive' : insight.priority === 'Medium' ? 'default' : 'secondary'}>
                            {insight.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{insight.description}</p>
                        <p className="text-xs text-green-600">{insight.impact}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
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
