
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSystemStatus } from '@/hooks/useSystemStatus';
import { Activity, Database, TrendingUp, Zap, Clock, Users } from 'lucide-react';
import { MetricCard } from '@/components/ui/metric-card';

export function RealTimeMetrics() {
  const { status, overallStatus } = useSystemStatus();

  const getChangeType = (status: string): 'up' | 'down' | 'neutral' => {
    if (status === 'online') return 'up';
    if (status === 'degraded') return 'neutral';
    return 'down';
  };

  const getSystemColor = (status: string): 'blue' | 'green' | 'purple' | 'orange' => {
    if (status === 'online') return 'green';
    if (status === 'degraded') return 'orange';
    return 'blue';
  };

  const metrics = [
    {
      title: "Active Queries",
      value: "2,847",
      change: "+12% from last hour",
      trend: "up" as const,
      icon: Activity,
      color: "blue" as const,
      description: "Currently running",
      progress: 78
    },
    {
      title: "Database Load",
      value: "67%",
      change: "-5% from yesterday",
      trend: "up" as const,
      icon: Database,
      color: "green" as const,
      description: "Average across all DBs",
      progress: 67
    },
    {
      title: "Performance Score",
      value: "94.2",
      change: "+2.1 points",
      trend: "up" as const,
      icon: Zap,
      color: "purple" as const,
      description: "Optimization rating",
      progress: 94
    },
    {
      title: "Response Time",
      value: "142ms",
      change: "-18ms improvement",
      trend: "up" as const,
      icon: Clock,
      color: "orange" as const,
      description: "Average query time",
      progress: 85
    },
    {
      title: "Active Users",
      value: "1,249",
      change: "+3% from last week",
      trend: "up" as const,
      icon: Users,
      color: "blue" as const,
      description: "Online now",
      progress: 72
    },
    {
      title: "System Health",
      value: overallStatus === 'online' ? '100%' : overallStatus === 'degraded' ? '85%' : '45%',
      change: status.lastChecked.toLocaleTimeString(),
      trend: getChangeType(overallStatus),
      icon: Activity,
      color: getSystemColor(overallStatus),
      description: `All systems ${overallStatus}`,
      progress: overallStatus === 'online' ? 100 : overallStatus === 'degraded' ? 85 : 45
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Real-Time Metrics</h2>
          <p className="text-muted-foreground">
            Monitor your database performance and system health
          </p>
        </div>
        <Badge 
          variant={overallStatus === 'online' ? 'default' : overallStatus === 'degraded' ? 'secondary' : 'destructive'}
        >
          {overallStatus.charAt(0).toUpperCase() + overallStatus.slice(1)}
        </Badge>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>
    </div>
  );
}
