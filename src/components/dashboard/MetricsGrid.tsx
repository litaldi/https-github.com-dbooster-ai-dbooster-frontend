
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Database, 
  Zap, 
  DollarSign, 
  Clock,
  Shield,
  Activity
} from 'lucide-react';

interface DashboardMetrics {
  totalQueries: number;
  optimizedQueries: number;
  avgImprovement: number;
  monthlySavings: number;
  activeConnections: number;
  uptime: number;
  securityScore: number;
  responseTime: number;
  criticalIssues: number;
  pendingOptimizations: number;
}

interface MetricsGridProps {
  metrics: DashboardMetrics;
  isLoading?: boolean;
}

export function MetricsGrid({ metrics, isLoading }: MetricsGridProps) {
  const metricCards = [
    {
      title: 'Total Queries',
      value: metrics.totalQueries.toLocaleString(),
      icon: Database,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: '+12.3%',
      changeType: 'positive' as const
    },
    {
      title: 'Optimized',
      value: `${Math.round((metrics.optimizedQueries / metrics.totalQueries) * 100)}%`,
      icon: Zap,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: '+8.1%',
      changeType: 'positive' as const
    },
    {
      title: 'Avg Improvement',
      value: `${metrics.avgImprovement}%`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: '+15.2%',
      changeType: 'positive' as const
    },
    {
      title: 'Monthly Savings',
      value: `$${(metrics.monthlySavings / 1000).toFixed(1)}k`,
      icon: DollarSign,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      change: '+23.5%',
      changeType: 'positive' as const
    },
    {
      title: 'Response Time',
      value: `${metrics.responseTime}ms`,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: '-12.8%',
      changeType: 'positive' as const
    },
    {
      title: 'Security Score',
      value: `${metrics.securityScore}%`,
      icon: Shield,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      change: '+2.1%',
      changeType: 'positive' as const
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-muted rounded w-1/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {metricCards.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                  <Icon className={`h-4 w-4 ${metric.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold mb-2">{metric.value}</div>
                <div className="flex items-center text-sm">
                  <Badge 
                    variant={metric.changeType === 'positive' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {metric.changeType === 'positive' ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {metric.change}
                  </Badge>
                  <span className="text-muted-foreground ml-2">vs last month</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
