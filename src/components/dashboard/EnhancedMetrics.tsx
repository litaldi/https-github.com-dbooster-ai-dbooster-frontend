
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Database, 
  Zap, 
  DollarSign, 
  Activity,
  Target,
  BarChart3
} from 'lucide-react';
import { FadeIn, ScaleIn } from '@/components/ui/animations';
import { useAuth } from '@/contexts/auth-context';
import { MetricCard } from '@/components/ui/metric-card';

export function EnhancedMetrics() {
  const { isDemo } = useAuth();

  const metrics = [
    {
      title: 'Query Response Time',
      value: isDemo ? '127ms' : '0ms',
      change: isDemo ? '73% faster' : 'Connect database',
      trend: 'up' as const,
      icon: Zap,
      color: 'blue' as const,
      description: 'Average optimization impact'
    },
    {
      title: 'Cost Savings',
      value: isDemo ? '$12,450' : '$0',
      change: isDemo ? '60% reduction' : 'Start optimizing',
      trend: 'up' as const,
      icon: DollarSign,
      color: 'green' as const,
      description: 'Monthly database costs saved'
    },
    {
      title: 'Queries Optimized',
      value: isDemo ? '1,247' : '0',
      change: isDemo ? '80% automated' : 'Ready to start',
      trend: 'up' as const,
      icon: Database,
      color: 'purple' as const,
      description: 'Performance tuning tasks completed'
    },
    {
      title: 'Uptime Improvement',
      value: isDemo ? '99.97%' : '0%',
      change: isDemo ? '45min saved' : 'Begin monitoring',
      trend: 'up' as const,
      icon: Activity,
      color: 'orange' as const,
      description: 'Prevented downtime this month'
    }
  ];

  return (
    <div className="space-y-6">
      <FadeIn>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Performance Metrics</h3>
            <p className="text-sm text-muted-foreground">
              Enterprise-grade database optimization insights
            </p>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            <Target className="h-3 w-3 mr-1" />
            Real-time Analytics
          </Badge>
        </div>
      </FadeIn>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, index) => (
          <FadeIn key={metric.title} delay={index * 0.1}>
            <MetricCard {...metric} />
          </FadeIn>
        ))}
      </div>

      {/* Performance Benchmark */}
      <FadeIn delay={0.5}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Optimization Impact Benchmark
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Query Response Time</span>
                <span className="font-medium">73% improvement</span>
              </div>
              <Progress value={73} className="h-2" />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Database Cost Reduction</span>
                <span className="font-medium">60% savings</span>
              </div>
              <Progress value={60} className="h-2" />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Performance Tasks Automated</span>
                <span className="font-medium">80% efficiency</span>
              </div>
              <Progress value={80} className="h-2" />
            </div>
            
            <div className="pt-3 border-t">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Compared to industry average</span>
                <Badge variant="outline" className="text-xs">
                  Enterprise benchmark
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}
