
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Zap, DollarSign, Clock, Users } from 'lucide-react';

interface CounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  trend?: string;
}

function AnimatedCounter({ 
  value, 
  suffix = '', 
  prefix = '',
  duration = 2000,
  label,
  icon: Icon,
  color,
  trend
}: CounterProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      setCurrent(prev => {
        const next = prev + increment;
        return next >= value ? value : next;
      });
    }, 16);

    return () => clearInterval(timer);
  }, [value, duration]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Icon className={`h-6 w-6 ${color}`} />
            {trend && (
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                <TrendingUp className="h-3 w-3 mr-1" />
                {trend}
              </Badge>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="text-3xl font-bold tracking-tight">
              {prefix}{Math.floor(current).toLocaleString()}{suffix}
            </div>
            <div className="text-sm text-muted-foreground font-medium">
              {label}
            </div>
          </div>

          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function EnhancedPerformanceCounters() {
  const metrics = [
    {
      value: 73,
      suffix: '%',
      label: 'Faster Query Performance',
      icon: Zap,
      color: 'text-blue-600',
      trend: '+28% this month'
    },
    {
      value: 60,
      suffix: '%',
      label: 'Database Cost Reduction',
      icon: DollarSign,
      color: 'text-green-600',
      trend: '$50K saved'
    },
    {
      value: 99.97,
      suffix: '%',
      label: 'System Uptime',
      icon: Clock,
      color: 'text-purple-600',
      trend: '45min prevented'
    },
    {
      value: 10000,
      suffix: '+',
      label: 'Queries Optimized',
      icon: Users,
      color: 'text-orange-600',
      trend: '80% automated'
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-8"
      >
        <h3 className="text-2xl font-bold mb-2">
          Trusted by Enterprise Teams Worldwide
        </h3>
        <p className="text-muted-foreground">
          Real metrics from production environments
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
          >
            <AnimatedCounter {...metric} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
