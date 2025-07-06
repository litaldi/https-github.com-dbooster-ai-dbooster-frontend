
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/auth-context';
import { 
  Database, 
  Zap, 
  TrendingUp, 
  DollarSign, 
  Activity,
  Clock,
  Shield,
  CheckCircle
} from 'lucide-react';

export function RealTimeMetricsDashboard() {
  const { isDemo } = useAuth();

  const metrics = isDemo ? [
    {
      title: 'Queries Analyzed',
      value: '15,234',
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: Database,
      color: 'blue',
      subtitle: 'This month'
    },
    {
      title: 'Performance Boost',
      value: '73%',
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'green',
      subtitle: 'Average improvement'
    },
    {
      title: 'Cost Savings',
      value: '$28,400',
      change: '+15.3%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'emerald',
      subtitle: 'Infrastructure savings'
    },
    {
      title: 'Response Time',
      value: '124ms',
      change: '-67%',
      changeType: 'positive' as const,
      icon: Clock,
      color: 'purple',
      subtitle: 'Average query time'
    }
  ] : [
    {
      title: 'Queries Analyzed',
      value: '0',
      change: '0%',
      changeType: 'neutral' as const,
      icon: Database,
      color: 'blue',
      subtitle: 'Connect database to start'
    },
    {
      title: 'Performance Boost',
      value: '0%',
      change: '0%',
      changeType: 'neutral' as const,
      icon: TrendingUp,
      color: 'green',
      subtitle: 'Waiting for queries'
    },
    {
      title: 'Cost Savings',
      value: '$0',
      change: '0%',
      changeType: 'neutral' as const,
      icon: DollarSign,
      color: 'emerald',
      subtitle: 'Start optimizing to save'
    },
    {
      title: 'Response Time',
      value: '--',
      change: '0%',
      changeType: 'neutral' as const,
      icon: Clock,
      color: 'purple',
      subtitle: 'No data available'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: {
        bg: 'from-blue-50 to-blue-100',
        icon: 'bg-blue-100 text-blue-600',
        border: 'border-blue-200'
      },
      green: {
        bg: 'from-green-50 to-green-100',
        icon: 'bg-green-100 text-green-600',
        border: 'border-green-200'
      },
      emerald: {
        bg: 'from-emerald-50 to-emerald-100',
        icon: 'bg-emerald-100 text-emerald-600',
        border: 'border-emerald-200'
      },
      purple: {
        bg: 'from-purple-50 to-purple-100',
        icon: 'bg-purple-100 text-purple-600',
        border: 'border-purple-200'
      }
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const getChangeColor = (changeType: 'positive' | 'negative' | 'neutral') => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600 bg-green-50';
      case 'negative':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-muted-foreground bg-muted/50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const colors = getColorClasses(metric.color);
          
          return (
            <Card key={index} className={`relative overflow-hidden border-0 shadow-lg bg-gradient-to-br ${colors.bg} ${colors.border}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${colors.icon}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-foreground">
                    {metric.value}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      {metric.subtitle}
                    </p>
                    <Badge variant="secondary" className={`text-xs ${getChangeColor(metric.changeType)}`}>
                      {metric.change}
                    </Badge>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-16 h-16 opacity-10">
                  <div className={`w-full h-full bg-gradient-to-br from-current to-transparent rounded-full transform translate-x-4 -translate-y-4`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* System Status Bar */}
      <Card className="border-0 shadow-lg">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium">System Status</span>
              </div>
              <Badge variant="outline" className="text-green-700 bg-green-50 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                All Systems Operational
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Activity className="h-3 w-3" />
                <span>99.97% Uptime</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                <span>SOC2 Compliant</span>
              </div>
            </div>
          </div>
          
          {isDemo && (
            <div className="mt-4 pt-4 border-t border-border/50">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Optimization Progress</span>
                <span className="font-medium">78% Complete</span>
              </div>
              <Progress value={78} className="mt-2 h-2" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
