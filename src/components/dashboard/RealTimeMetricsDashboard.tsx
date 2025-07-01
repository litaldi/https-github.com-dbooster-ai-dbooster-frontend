
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Zap, 
  TrendingUp, 
  DollarSign,
  CheckCircle,
  Users,
  Shield,
  Target
} from 'lucide-react';
import { StaggerContainer, StaggerItem } from '@/components/ui/animations';

export function RealTimeMetricsDashboard() {
  const [metrics, setMetrics] = useState({
    totalQueries: 1247,
    optimizedQueries: 892,
    averageImprovement: 73,
    costSavings: 45280,
    uptime: 99.97,
    activeConnections: 24,
    threatsBlocked: 15,
    performanceScore: 94
  });

  const [liveUpdates, setLiveUpdates] = useState(true);

  useEffect(() => {
    if (!liveUpdates) return;

    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        totalQueries: prev.totalQueries + Math.floor(Math.random() * 3),
        optimizedQueries: prev.optimizedQueries + Math.floor(Math.random() * 2),
        activeConnections: Math.max(1, prev.activeConnections + (Math.random() > 0.5 ? 1 : -1)),
        costSavings: prev.costSavings + Math.floor(Math.random() * 100)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, [liveUpdates]);

  const metricCards = [
    {
      title: 'Total Queries',
      value: metrics.totalQueries.toLocaleString(),
      change: '+12%',
      icon: Activity,
      color: 'blue'
    },
    {
      title: 'Optimized Queries',
      value: metrics.optimizedQueries.toLocaleString(),
      change: '+18%',
      icon: Zap,
      color: 'green'
    },
    {
      title: 'Avg Performance Gain',
      value: `${metrics.averageImprovement}%`,
      change: '+5%',
      icon: TrendingUp,
      color: 'purple'
    },
    {
      title: 'Cost Savings',
      value: `$${metrics.costSavings.toLocaleString()}`,
      change: '+23%',
      icon: DollarSign,
      color: 'orange'
    },
    {
      title: 'System Uptime',
      value: `${metrics.uptime}%`,
      change: 'Stable',
      icon: CheckCircle,
      color: 'green'
    },
    {
      title: 'Active Connections',
      value: metrics.activeConnections.toString(),
      change: 'Live',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Threats Blocked',
      value: metrics.threatsBlocked.toString(),
      change: 'Today',
      icon: Shield,
      color: 'red'
    },
    {
      title: 'Performance Score',
      value: `${metrics.performanceScore}/100`,
      change: 'Excellent',
      icon: Target,
      color: 'green'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'border-blue-200 bg-blue-50 text-blue-700',
      green: 'border-green-200 bg-green-50 text-green-700',
      purple: 'border-purple-200 bg-purple-50 text-purple-700',
      orange: 'border-orange-200 bg-orange-50 text-orange-700',
      red: 'border-red-200 bg-red-50 text-red-700'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Real-Time Metrics</h2>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${liveUpdates ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
          <span className="text-sm text-muted-foreground">
            {liveUpdates ? 'Live Updates' : 'Paused'}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLiveUpdates(!liveUpdates)}
          >
            {liveUpdates ? 'Pause' : 'Resume'}
          </Button>
        </div>
      </div>

      <StaggerContainer>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metricCards.map((metric, index) => {
            const Icon = metric.icon;
            
            return (
              <StaggerItem key={index} delay={index * 0.05}>
                <Card className={`${getColorClasses(metric.color)} border-2`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-2xl font-bold">{metric.value}</div>
                        <div className="text-sm font-medium">{metric.title}</div>
                        <div className="text-xs opacity-75">{metric.change}</div>
                      </div>
                      <Icon className="h-8 w-8 opacity-80" />
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            );
          })}
        </div>
      </StaggerContainer>
    </div>
  );
}
