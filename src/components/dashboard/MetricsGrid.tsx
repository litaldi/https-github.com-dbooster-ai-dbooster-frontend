
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Database, Clock, Shield, Zap, Activity, DollarSign } from 'lucide-react';

interface MetricsGridProps {
  metrics?: {
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
  };
  isLoading?: boolean;
}

export function MetricsGrid({ metrics, isLoading }: MetricsGridProps) {
  const metricCards = [
    {
      title: 'Total Queries',
      value: metrics?.totalQueries?.toLocaleString() || '0',
      icon: Database,
      trend: '+12%',
      trendUp: true,
      description: 'Queries processed this month'
    },
    {
      title: 'Optimized Queries',
      value: metrics?.optimizedQueries?.toLocaleString() || '0',
      icon: Zap,
      trend: '+8%',
      trendUp: true,
      description: 'Successfully optimized'
    },
    {
      title: 'Avg Improvement',
      value: `${metrics?.avgImprovement || 0}%`,
      icon: TrendingUp,
      trend: '+3%',
      trendUp: true,
      description: 'Performance boost'
    },
    {
      title: 'Monthly Savings',
      value: `$${(metrics?.monthlySavings || 0).toLocaleString()}`,
      icon: DollarSign,
      trend: '+15%',
      trendUp: true,
      description: 'Cost reduction'
    },
    {
      title: 'Active Connections',
      value: metrics?.activeConnections?.toString() || '0',
      icon: Activity,
      trend: 'Stable',
      trendUp: null,
      description: 'Current connections'
    },
    {
      title: 'System Uptime',
      value: `${metrics?.uptime?.toFixed(2) || 99.95}%`,
      icon: Shield,
      trend: 'Excellent',
      trendUp: true,
      description: 'Last 30 days'
    },
    {
      title: 'Response Time',
      value: `${metrics?.responseTime || 120}ms`,
      icon: Clock,
      trend: '-5ms',
      trendUp: true,
      description: 'Average response'
    },
    {
      title: 'Critical Issues',
      value: metrics?.criticalIssues?.toString() || '0',
      icon: TrendingDown,
      trend: metrics?.criticalIssues === 0 ? 'None' : 'Review needed',
      trendUp: metrics?.criticalIssues === 0,
      description: 'Requires attention'
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-muted rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricCards.map((metric, index) => (
        <motion.div
          key={metric.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.title}
              </CardTitle>
              <metric.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-muted-foreground">
                  {metric.description}
                </p>
                {metric.trend && (
                  <Badge 
                    variant={metric.trendUp === true ? 'default' : metric.trendUp === false ? 'destructive' : 'secondary'}
                    className="text-xs"
                  >
                    {metric.trendUp === true && <TrendingUp className="h-3 w-3 mr-1" />}
                    {metric.trendUp === false && <TrendingDown className="h-3 w-3 mr-1" />}
                    {metric.trend}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
