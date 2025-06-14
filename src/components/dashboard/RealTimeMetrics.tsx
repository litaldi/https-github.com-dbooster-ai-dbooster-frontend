
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useSystemStatus } from '@/hooks/useSystemStatus';
import { Activity, Database, TrendingUp, Zap, Clock, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
  trend?: number;
}

function MetricCard({ title, value, description, change, changeType = 'neutral', icon: Icon, trend }: MetricCardProps) {
  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {change && (
          <div className={cn(
            "text-xs mt-1 flex items-center gap-1",
            changeType === 'positive' && "text-green-600",
            changeType === 'negative' && "text-red-600",
            changeType === 'neutral' && "text-muted-foreground"
          )}>
            <TrendingUp className="h-3 w-3" />
            {change}
          </div>
        )}
        {trend !== undefined && (
          <Progress value={trend} className="mt-2 h-1" />
        )}
      </CardContent>
    </Card>
  );
}

export function RealTimeMetrics() {
  const { status, overallStatus } = useSystemStatus();

  const metrics = [
    {
      title: "Active Queries",
      value: "2,847",
      description: "Currently running",
      change: "+12% from last hour",
      changeType: "positive" as const,
      icon: Activity,
      trend: 78
    },
    {
      title: "Database Load",
      value: "67%",
      description: "Average across all DBs",
      change: "-5% from yesterday",
      changeType: "positive" as const,
      icon: Database,
      trend: 67
    },
    {
      title: "Performance Score",
      value: "94.2",
      description: "Optimization rating",
      change: "+2.1 points",
      changeType: "positive" as const,
      icon: Zap,
      trend: 94
    },
    {
      title: "Response Time",
      value: "142ms",
      description: "Average query time",
      change: "-18ms improvement",
      changeType: "positive" as const,
      icon: Clock,
      trend: 85
    },
    {
      title: "Active Users",
      value: "1,249",
      description: "Online now",
      change: "+3% from last week",
      changeType: "positive" as const,
      icon: Users,
      trend: 72
    },
    {
      title: "System Health",
      value: overallStatus === 'online' ? '100%' : overallStatus === 'degraded' ? '85%' : '45%',
      description: `All systems ${overallStatus}`,
      change: status.lastChecked.toLocaleTimeString(),
      changeType: (overallStatus === 'online' ? 'positive' : overallStatus === 'degraded' ? 'neutral' : 'negative') as const,
      icon: Activity,
      trend: overallStatus === 'online' ? 100 : overallStatus === 'degraded' ? 85 : 45
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
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>
    </div>
  );
}
