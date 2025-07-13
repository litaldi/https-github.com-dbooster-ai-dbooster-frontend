
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Database, Shield, Zap } from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/loading-states';

interface MetricsGridProps {
  metrics: any;
  isLoading: boolean;
}

export function MetricsGrid({ metrics, isLoading }: MetricsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6">
            <LoadingSpinner />
          </Card>
        ))}
      </div>
    );
  }

  const metricCards = [
    {
      title: 'Total Queries',
      value: metrics?.totalQueries?.toLocaleString() || '0',
      icon: Database,
      change: '+12%',
      color: 'text-blue-600'
    },
    {
      title: 'Optimized',
      value: metrics?.optimizedQueries?.toLocaleString() || '0',
      icon: TrendingUp,
      change: '+8%',
      color: 'text-green-600'
    },
    {
      title: 'Performance',
      value: `${metrics?.avgImprovement || 0}%`,
      icon: Zap,
      change: '+5%',
      color: 'text-orange-600'
    },
    {
      title: 'Security Score',
      value: `${metrics?.securityScore?.toFixed(1) || '0'}%`,
      icon: Shield,
      change: '+2%',
      color: 'text-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricCards.map((metric, index) => (
        <Card key={metric.title} className="shadow-lg hover:shadow-xl transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {metric.title}
            </CardTitle>
            <metric.icon className={`h-4 w-4 ${metric.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metric.value}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">{metric.change}</span> from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
