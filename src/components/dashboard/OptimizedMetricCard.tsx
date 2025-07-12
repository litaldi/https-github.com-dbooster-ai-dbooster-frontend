
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
    bg: 'from-blue-50/80 via-blue-50/40 to-blue-100/60',
    iconBg: 'bg-gradient-to-br from-blue-100 to-blue-200',
    iconColor: 'text-blue-700',
    border: 'border-blue-200/60',
    accent: 'text-blue-700',
    progressBg: 'bg-blue-500'
  },
  green: {
    bg: 'from-emerald-50/80 via-emerald-50/40 to-emerald-100/60',
    iconBg: 'bg-gradient-to-br from-emerald-100 to-emerald-200',
    iconColor: 'text-emerald-700',
    border: 'border-emerald-200/60',
    accent: 'text-emerald-700',
    progressBg: 'bg-emerald-500'
  },
  purple: {
    bg: 'from-purple-50/80 via-purple-50/40 to-purple-100/60',
    iconBg: 'bg-gradient-to-br from-purple-100 to-purple-200',
    iconColor: 'text-purple-700',
    border: 'border-purple-200/60',
    accent: 'text-purple-700',
    progressBg: 'bg-purple-500'
  },
  orange: {
    bg: 'from-orange-50/80 via-orange-50/40 to-orange-100/60',
    iconBg: 'bg-gradient-to-br from-orange-100 to-orange-200',
    iconColor: 'text-orange-700',
    border: 'border-orange-200/60',
    accent: 'text-orange-700',
    progressBg: 'bg-orange-500'
  }
};

const trendConfig = {
  up: { 
    color: 'text-emerald-700 bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200/60', 
    symbol: '↗',
    bgGradient: 'from-emerald-50/50 to-emerald-100/50'
  },
  down: { 
    color: 'text-red-700 bg-gradient-to-r from-red-50 to-red-100 border-red-200/60', 
    symbol: '↘',
    bgGradient: 'from-red-50/50 to-red-100/50'
  },
  neutral: { 
    color: 'text-slate-600 bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200/60', 
    symbol: '→',
    bgGradient: 'from-slate-50/50 to-slate-100/50'
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
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-slate-50 to-slate-100 animate-pulse">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-slate-200 rounded-md w-20"></div>
            <div className="h-10 w-10 bg-slate-200 rounded-xl"></div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="h-8 bg-slate-200 rounded-md w-16"></div>
          <div className="h-3 bg-slate-200 rounded w-24"></div>
          {progress !== undefined && (
            <div className="space-y-2">
              <div className="h-3 bg-slate-200 rounded w-16"></div>
              <div className="h-2 bg-slate-200 rounded-full"></div>
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
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="will-change-transform"
    >
      <Card className={`
        relative overflow-hidden border-0 backdrop-blur-sm
        bg-gradient-to-br ${colors.bg} ${colors.border}
        shadow-sm hover:shadow-lg transition-all duration-300 ease-out
        focus-ring-modern group
        ${priority === 'primary' ? 'ring-1 ring-primary/20 shadow-md' : ''}
      `}>
        {/* Subtle animated background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0 relative z-10">
          <h3 className="text-body-sm font-medium text-slate-600 truncate pr-2 leading-tight">
            {title}
          </h3>
          <motion.div 
            className={`
              p-2.5 rounded-xl shrink-0 shadow-sm
              ${colors.iconBg} ${colors.iconColor}
              transition-all duration-200
            `}
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
          </motion.div>
        </CardHeader>
        
        <CardContent className="space-y-3 relative z-10">
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
                text-caption px-2.5 py-1.5 font-medium border shadow-sm
                ${trendStyle.color} touch-target
                transition-all duration-200 hover:scale-105
              `}
              aria-label={`Change: ${change}, trend ${trend}`}
            >
              <span aria-hidden="true" className="mr-1 text-sm">{trendStyle.symbol}</span>
              <span>{change}</span>
            </Badge>
          </div>
          
          <p className="text-body-sm text-slate-600 leading-relaxed font-medium">
            {description}
          </p>
          
          {progress !== undefined && (
            <motion.div 
              className="space-y-2"
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
                  className="h-2.5 bg-slate-200/80 progress-modern"
                  aria-label={`${title} progress: ${progress}%`}
                />
                <div 
                  className={`absolute top-0 left-0 h-2.5 rounded-full ${colors.progressBg} transition-all duration-500 ease-out`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </motion.div>
          )}
        </CardContent>

        {/* Hover gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </Card>
    </motion.div>
  );
});

OptimizedMetricCard.displayName = 'OptimizedMetricCard';
