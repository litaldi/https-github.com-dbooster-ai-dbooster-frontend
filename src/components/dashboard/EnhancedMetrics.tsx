
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Database, 
  Zap, 
  DollarSign, 
  Clock,
  Users,
  Target,
  Activity,
  BarChart3
} from 'lucide-react';
import { FadeIn, ScaleIn } from '@/components/ui/enhanced-animations';
import { useAuth } from '@/contexts/auth-context';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  subtitle?: string;
}

function MetricCard({ title, value, change, trend, icon: Icon, color, subtitle }: MetricCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;
  const trendColor = trend === 'up' ? 'text-green-600' : 'text-red-600';
  
  return (
    <ScaleIn>
      <Card className="hover:shadow-lg transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <Icon className={`h-4 w-4 ${color}`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-1">{value}</div>
          {subtitle && (
            <div className="text-xs text-muted-foreground mb-2">{subtitle}</div>
          )}
          <div className={`flex items-center text-xs ${trendColor}`}>
            <TrendIcon className="h-3 w-3 mr-1" />
            {change}
          </div>
        </CardContent>
      </Card>
    </ScaleIn>
  );
}

export function EnhancedMetrics() {
  const { isDemo } = useAuth();

  const metrics = [
    {
      title: 'Query Response Time',
      value: isDemo ? '127ms' : '0ms',
      change: isDemo ? '73% faster' : 'Connect database',
      trend: 'up' as const,
      icon: Zap,
      color: 'text-blue-600',
      subtitle: 'Average optimization impact'
    },
    {
      title: 'Cost Savings',
      value: isDemo ? '$12,450' : '$0',
      change: isDemo ? '60% reduction' : 'Start optimizing',
      trend: 'up' as const,
      icon: DollarSign,
      color: 'text-green-600',
      subtitle: 'Monthly database costs saved'
    },
    {
      title: 'Queries Optimized',
      value: isDemo ? '1,247' : '0',
      change: isDemo ? '80% automated' : 'Ready to start',
      trend: 'up' as const,
      icon: Database,
      color: 'text-purple-600',
      subtitle: 'Performance tuning tasks completed'
    },
    {
      title: 'Uptime Improvement',
      value: isDemo ? '99.97%' : '0%',
      change: isDemo ? '45min saved' : 'Begin monitoring',
      trend: 'up' as const,
      icon: Activity,
      color: 'text-orange-600',
      subtitle: 'Prevented downtime this month'
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
