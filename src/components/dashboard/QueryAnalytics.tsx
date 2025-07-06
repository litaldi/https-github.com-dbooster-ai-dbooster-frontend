
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, Clock, Zap, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MetricCard } from '@/components/ui/metric-card';

const performanceData = [
  { time: '00:00', avgTime: 145, queries: 234 },
  { time: '04:00', avgTime: 123, queries: 189 },
  { time: '08:00', avgTime: 167, queries: 567 },
  { time: '12:00', avgTime: 198, queries: 789 },
  { time: '16:00', avgTime: 156, queries: 634 },
  { time: '20:00', avgTime: 134, queries: 445 }
];

const slowQueries = [
  { id: 1, query: 'SELECT * FROM users WHERE...', time: 2340, impact: 'high' },
  { id: 2, query: 'UPDATE orders SET status...', time: 1890, impact: 'medium' },
  { id: 3, query: 'JOIN products p ON p.id...', time: 1456, impact: 'medium' },
  { id: 4, query: 'DELETE FROM logs WHERE...', time: 987, impact: 'low' }
];

function SlowQueryItem({ query }: { query: typeof slowQueries[0] }) {
  const impactColors = {
    high: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
    low: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
  };

  return (
    <div className="flex items-center justify-between py-2 border-b last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">
          {query.query}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{query.time}ms</span>
          <Badge 
            variant="secondary" 
            className={cn("text-xs", impactColors[query.impact])}
          >
            {query.impact} impact
          </Badge>
        </div>
      </div>
    </div>
  );
}

export function QueryAnalytics() {
  const metrics = [
    {
      title: "Avg Query Time",
      value: "156ms",
      change: "+12% from yesterday",
      trend: "down" as const,
      icon: Clock,
      color: "blue" as const,
      description: "Average response time"
    },
    {
      title: "Optimized Queries",
      value: "2,847",
      change: "+23% from last week",
      trend: "up" as const,
      icon: Zap,
      color: "green" as const,
      description: "Total optimizations"
    },
    {
      title: "Performance Score",
      value: "94.2",
      change: "+2.1 points",
      trend: "up" as const,
      icon: TrendingUp,
      color: "purple" as const,
      description: "Overall rating"
    },
    {
      title: "Slow Queries",
      value: "24",
      change: "-8% from yesterday",
      trend: "up" as const,
      icon: AlertTriangle,
      color: "orange" as const,
      description: "Needs attention"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Query Performance Analytics</h3>
        <p className="text-sm text-muted-foreground">
          Real-time insights into your database query performance
        </p>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Query Performance Over Time</CardTitle>
            <CardDescription>
              Average response time and query count by hour
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="time" 
                  className="text-xs fill-muted-foreground"
                />
                <YAxis className="text-xs fill-muted-foreground" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="avgTime" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  name="Avg Time (ms)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Slow Queries */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Slow Queries</CardTitle>
            <CardDescription>
              Queries that need optimization attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {slowQueries.map((query) => (
                <SlowQueryItem key={query.id} query={query} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
