
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange';
  progress?: number;
  status?: string;
  className?: string;
}

const colorClasses = {
  blue: 'from-blue-50 to-blue-100 border-blue-200',
  green: 'from-emerald-50 to-emerald-100 border-emerald-200', 
  purple: 'from-purple-50 to-purple-100 border-purple-200',
  orange: 'from-orange-50 to-orange-100 border-orange-200'
};

export function MetricCard({ 
  title, 
  value, 
  change, 
  trend = 'neutral', 
  icon: Icon, 
  description, 
  color = 'blue',
  progress,
  status,
  className 
}: MetricCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;
  const trendColor = trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-muted-foreground';
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <Card className={cn(
        'relative overflow-hidden transition-all duration-300 hover:shadow-xl',
        color && `bg-gradient-to-br ${colorClasses[color]} border-2`
      )}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-semibold text-gray-700 tracking-wide">
            {title}
          </CardTitle>
          <div className="p-2.5 rounded-xl bg-white/50 backdrop-blur-sm">
            <Icon className="h-5 w-5 text-gray-700" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="text-3xl font-bold text-gray-800">{value}</div>
            {description && (
              <p className="text-sm text-gray-600 font-medium">{description}</p>
            )}
            {change && (
              <div className="flex items-center justify-between">
                <div className={cn('flex items-center space-x-1', trendColor)}>
                  {trend !== 'neutral' && <TrendIcon className="h-3 w-3" />}
                  <span className="text-sm font-semibold">{change}</span>
                </div>
                {progress !== undefined && <Progress value={progress} className="h-1.5 w-16" />}
              </div>
            )}
            {status && (
              <Badge variant="secondary" className="text-xs">
                {status}
              </Badge>
            )}
          </div>
          <div className="absolute -top-6 -right-6 w-20 h-20 bg-white/20 rounded-full blur-xl" />
        </CardContent>
      </Card>
    </motion.div>
  );
}
