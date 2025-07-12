
import React, { memo } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface OptimizedMetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  description: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
  progress?: number;
  isLoading?: boolean;
  priority?: 'primary' | 'secondary';
}

const colorConfig = {
  blue: {
    bg: 'from-blue-50 to-blue-100/80',
    icon: 'bg-blue-100 text-blue-600',
    border: 'border-blue-200/50',
    accent: 'text-blue-600'
  },
  green: {
    bg: 'from-green-50 to-green-100/80',
    icon: 'bg-green-100 text-green-600',
    border: 'border-green-200/50',
    accent: 'text-green-600'
  },
  purple: {
    bg: 'from-purple-50 to-purple-100/80',
    icon: 'bg-purple-100 text-purple-600',
    border: 'border-purple-200/50',
    accent: 'text-purple-600'
  },
  orange: {
    bg: 'from-orange-50 to-orange-100/80',
    icon: 'bg-orange-100 text-orange-600',
    border: 'border-orange-200/50',
    accent: 'text-orange-600'
  }
};

const trendConfig = {
  up: { color: 'text-green-600 bg-green-50 border-green-200', symbol: '↗' },
  down: { color: 'text-red-600 bg-red-50 border-red-200', symbol: '↘' },
  neutral: { color: 'text-muted-foreground bg-muted/50 border-border', symbol: '→' }
};

export const OptimizedMetricCard = memo(({
  title,
  value,
  change,
  trend,
  icon: Icon,
  description,
  color,
  progress,
  isLoading = false,
  priority = 'secondary'
}: OptimizedMetricCardProps) => {
  const colors = colorConfig[color];
  const trendStyle = trendConfig[trend];

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader className="space-system-sm">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-muted rounded w-20"></div>
            <div className="h-8 w-8 bg-muted rounded-lg"></div>
          </div>
        </CardHeader>
        <CardContent className="space-system-sm">
          <div className="h-8 bg-muted rounded w-16 mb-2"></div>
          <div className="h-3 bg-muted rounded w-24"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="will-change-transform"
    >
      <Card className={`
        relative overflow-hidden border-0 shadow-soft
        bg-gradient-to-br ${colors.bg} ${colors.border}
        hover:shadow-medium transition-shadow duration-200
        enhanced-focus
        ${priority === 'primary' ? 'ring-1 ring-primary/20' : ''}
      `}>
        <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
          <h3 className="text-body-sm font-medium text-muted-foreground truncate pr-2">
            {title}
          </h3>
          <div className={`p-2 rounded-lg shrink-0 ${colors.icon}`}>
            <Icon className="h-4 w-4" aria-hidden="true" />
          </div>
        </CardHeader>
        
        <CardContent className="space-system-sm">
          <div className="flex items-baseline justify-between mb-2">
            <span className={`text-display-sm ${colors.accent}`} aria-label={`${title}: ${value}`}>
              {value}
            </span>
            <Badge 
              variant="outline" 
              className={`text-caption px-2 py-1 ${trendStyle.color} touch-target`}
              aria-label={`Change: ${change}, trend ${trend}`}
            >
              <span aria-hidden="true">{trendStyle.symbol}</span>
              <span className="ml-1">{change}</span>
            </Badge>
          </div>
          
          <p className="text-body-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
          
          {progress !== undefined && (
            <div className="mt-3">
              <div className="flex justify-between text-caption text-muted-foreground mb-1">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress 
                value={progress} 
                className="h-2"
                aria-label={`${title} progress: ${progress}%`}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
});

OptimizedMetricCard.displayName = 'OptimizedMetricCard';
