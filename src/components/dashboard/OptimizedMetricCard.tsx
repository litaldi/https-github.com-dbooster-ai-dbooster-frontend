
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
    bg: 'from-blue-50/60 via-blue-50/30 to-blue-100/40',
    iconBg: 'bg-gradient-to-br from-blue-100/80 to-blue-200/60',
    iconColor: 'text-blue-700',
    border: 'border-blue-200/40',
    accent: 'text-blue-700',
    progressBg: 'bg-blue-500'
  },
  green: {
    bg: 'from-emerald-50/60 via-emerald-50/30 to-emerald-100/40',
    iconBg: 'bg-gradient-to-br from-emerald-100/80 to-emerald-200/60',
    iconColor: 'text-emerald-700',
    border: 'border-emerald-200/40',
    accent: 'text-emerald-700',
    progressBg: 'bg-emerald-500'
  },
  purple: {
    bg: 'from-purple-50/60 via-purple-50/30 to-purple-100/40',
    iconBg: 'bg-gradient-to-br from-purple-100/80 to-purple-200/60',
    iconColor: 'text-purple-700',
    border: 'border-purple-200/40',
    accent: 'text-purple-700',
    progressBg: 'bg-purple-500'
  },
  orange: {
    bg: 'from-orange-50/60 via-orange-50/30 to-orange-100/40',
    iconBg: 'bg-gradient-to-br from-orange-100/80 to-orange-200/60',
    iconColor: 'text-orange-700',
    border: 'border-orange-200/40',
    accent: 'text-orange-700',
    progressBg: 'bg-orange-500'
  }
};

const trendConfig = {
  up: { 
    color: 'text-emerald-700 bg-gradient-to-r from-emerald-50/80 to-emerald-100/60 border-emerald-200/40', 
    symbol: '↗',
    bgGradient: 'from-emerald-50/30 to-emerald-100/30'
  },
  down: { 
    color: 'text-red-700 bg-gradient-to-r from-red-50/80 to-red-100/60 border-red-200/40', 
    symbol: '↘',
    bgGradient: 'from-red-50/30 to-red-100/30'
  },
  neutral: { 
    color: 'text-slate-600 bg-gradient-to-r from-slate-50/80 to-slate-100/60 border-slate-200/40', 
    symbol: '→',
    bgGradient: 'from-slate-50/30 to-slate-100/30'
  }
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
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-slate-50/80 to-slate-100/60 animate-pulse elevation-1">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-slate-200/60 rounded-md w-20"></div>
            <div className="h-12 w-12 bg-slate-200/60 rounded-xl"></div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-8 bg-slate-200/60 rounded-md w-16"></div>
          <div className="h-3 bg-slate-200/60 rounded w-24"></div>
          {progress !== undefined && (
            <div className="space-y-2">
              <div className="h-3 bg-slate-200/60 rounded w-16"></div>
              <div className="h-2 bg-slate-200/60 rounded-full"></div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.3 }}
      className="will-change-transform"
    >
      <Card className={`
        relative overflow-hidden border-0 backdrop-blur-sm
        bg-gradient-to-br ${colors.bg} ${colors.border}
        elevation-1 hover:elevation-2 transition-all duration-300
        focus-ring-modern group card-modern
        ${priority === 'primary' ? 'ring-1 ring-primary/15 elevation-2' : ''}
      `}>
        {/* Subtle animated background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <CardHeader className="flex flex-row items-center justify-between pb-4 space-y-0 relative z-10">
          <h3 className="text-body-sm font-medium text-slate-700 truncate pr-3 leading-snug">
            {title}
          </h3>
          <motion.div 
            className={`
              p-3 rounded-xl shrink-0 elevation-0
              ${colors.iconBg} ${colors.iconColor}
              transition-all duration-250
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </motion.div>
        </CardHeader>
        
        <CardContent className="space-y-4 relative z-10">
          <div className="flex items-baseline justify-between">
            <motion.span 
              className={`text-display-lg font-bold ${colors.accent} leading-none`}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 }}
              aria-label={`${title}: ${value}`}
            >
              {value}
            </motion.span>
            <Badge 
              variant="outline" 
              className={`
                text-caption px-3 py-1.5 font-medium border elevation-0
                ${trendStyle.color} touch-target badge-modern
                transition-all duration-200 hover:scale-105
              `}
              aria-label={`Change: ${change}, trend ${trend}`}
            >
              <span aria-hidden="true" className="mr-1 text-sm font-medium">{trendStyle.symbol}</span>
              <span>{change}</span>
            </Badge>
          </div>
          
          <p className="text-body-sm text-slate-600 leading-relaxed font-normal">
            {description}
          </p>
          
          {progress !== undefined && (
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex justify-between items-center text-caption text-slate-500">
                <span className="font-medium">Progress</span>
                <span className="font-semibold">{progress}%</span>
              </div>
              <div className="relative">
                <Progress 
                  value={progress} 
                  className="h-2 bg-slate-200/60 progress-modern"
                  aria-label={`${title} progress: ${progress}%`}
                />
                <div 
                  className={`absolute top-0 left-0 h-2 rounded-full ${colors.progressBg} transition-all duration-500`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </motion.div>
          )}
        </CardContent>

        {/* Hover gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </Card>
    </motion.div>
  );
});

OptimizedMetricCard.displayName = 'OptimizedMetricCard';
