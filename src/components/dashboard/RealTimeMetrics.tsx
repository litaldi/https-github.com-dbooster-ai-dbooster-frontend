
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, TrendingUp, TrendingDown, Minus, Zap } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MetricData {
  timestamp: string;
  queryTime: number;
  throughput: number;
  errorRate: number;
}

export function RealTimeMetrics() {
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [healthScore, setHealthScore] = useState(85);

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      const now = new Date();
      const newMetric: MetricData = {
        timestamp: now.toLocaleTimeString(),
        queryTime: Math.random() * 100 + 20,
        throughput: Math.random() * 1000 + 500,
        errorRate: Math.random() * 5,
      };

      setMetrics(prev => [...prev.slice(-19), newMetric]);
      setHealthScore(Math.max(70, Math.min(100, 85 + (Math.random() - 0.5) * 20)));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const latestMetric = metrics[metrics.length - 1];
  const previousMetric = metrics[metrics.length - 2];

  const getTrend = (current: number, previous: number) => {
    if (!previous) return 'stable';
    if (current > previous * 1.05) return 'up';
    if (current < previous * 0.95) return 'down';
    return 'stable';
  };

  const TrendIcon = ({ trend }: { trend: string }) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 75) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Activity className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Real-Time Performance</h2>
        <Badge variant="outline" className="ml-auto animate-pulse">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          Live
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Score</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(healthScore)}</div>
            <Badge className={getHealthScoreColor(healthScore)}>
              {healthScore >= 90 ? 'Excellent' : healthScore >= 75 ? 'Good' : 'Needs Attention'}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Query Time</CardTitle>
            <TrendIcon trend={latestMetric && previousMetric ? getTrend(latestMetric.queryTime, previousMetric.queryTime) : 'stable'} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestMetric ? `${latestMetric.queryTime.toFixed(1)}ms` : '—'}
            </div>
            <p className="text-xs text-muted-foreground">
              Last updated: {latestMetric?.timestamp || 'Loading...'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Throughput</CardTitle>
            <TrendIcon trend={latestMetric && previousMetric ? getTrend(latestMetric.throughput, previousMetric.throughput) : 'stable'} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestMetric ? `${Math.round(latestMetric.throughput)}` : '—'}
            </div>
            <p className="text-xs text-muted-foreground">queries/sec</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <TrendIcon trend={latestMetric && previousMetric ? getTrend(previousMetric.errorRate, latestMetric.errorRate) : 'stable'} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestMetric ? `${latestMetric.errorRate.toFixed(2)}%` : '—'}
            </div>
            <p className="text-xs text-muted-foreground">last 5 minutes</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Query Performance Trends</CardTitle>
          <CardDescription>Real-time query execution times over the last few minutes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="queryTime" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ fill: '#8884d8', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
