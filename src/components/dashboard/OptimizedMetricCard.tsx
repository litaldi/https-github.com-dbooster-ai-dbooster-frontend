
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
    bg: 'from-blue-900/40 via-blue-800/30 to-blue-900/40',
    iconBg: 'bg-gradient-to-br from-blue-600 to-blue-700',
    iconColor: 'text-white',
    border: 'border-blue-700/40',
    accent: 'text-blue-300',
    progressBg: 'bg-blue-500',
    glow: 'glow-primary'
  },
  green: {
    bg: 'from-emerald-900/40 via-emerald-800/30 to-emerald-900/40',
    iconBg: 'bg-gradient-to-br from-emerald-600 to-emerald-700',
    iconColor: 'text-white',
    border: 'border-emerald-700/40',
    accent: 'text-emerald-300',
    progressBg: 'bg-emerald-500',
    glow: 'glow-success'
  },
  purple: {
    bg: 'from-purple-900/40 via-purple-800/30 to-purple-900/40',
    iconBg: 'bg-gradient-to-br from-purple-600 to-purple-700',
    iconColor: 'text-white',
    border: 'border-purple-700/40',
    accent: 'text-purple-300',
    progressBg: 'bg-purple-500',
    glow: 'glow-purple'
  },
  orange: {
    bg: 'from-orange-900/40 via-orange-800/30 to-orange-900/40',
    iconBg: 'bg-gradient-to-br from-orange-600 to-orange-700',
    iconColor: 'text-white',
    border: 'border-orange-700/40',
    accent: 'text-orange-300',
    progressBg: 'bg-orange-500',
    glow: 'glow-warning'
  }
};

const trendConfig = {
  up: { 
    color: 'text-emerald-300 bg-gradient-to-r from-emerald-900/60 to-emerald-800/60 border-emerald-600/40', 
    symbol: '↗',
    bgGradient: 'from-emerald-900/30 to-emerald-800/30'
  },
  down: { 
    color: 'text-red-300 bg-gradient-to-r from-red-900/60 to-red-800/60 border-red-600/40', 
    symbol: '↘',
    bgGradient: 'from-red-900/30 to-red-800/30'
  },
  neutral: { 
    color: 'text-slate-400 bg-gradient-to-r from-slate-800/60 to-slate-700/60 border-slate-600/40', 
    symbol: '→',
    bgGradient: 'from-slate-800/30 to-slate-700/30'
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
      <Card className="relative overflow-hidden border-0 bg-slate-800/50 backdrop-blur-xl animate-pulse elevation-2 border border-slate-700/50">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-slate-700/60 rounded-md w-20"></div>
            <div className="h-12 w-12 bg-slate-700/60 rounded-xl"></div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="h-8 bg-slate-700/60 rounded-md w-16"></div>
          <div className="h-3 bg-slate-700/60 rounded w-24"></div>
          {progress !== undefined && (
            <div className="space-y-2">
              <div className="h-3 bg-slate-700/60 rounded w-16"></div>
              <div className="h-2 bg-slate-700/60 rounded-full"></div>
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
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="will-change-transform"
    >
      <Card className={`
        relative overflow-hidden border-0 backdrop-blur-xl
        bg-gradient-to-br ${colors.bg} ${colors.border}
        elevation-2 hover:elevation-4 transition-all duration-300
        focus-ring-modern group card-modern ${colors.glow}
        ${priority === 'primary' ? 'ring-1 ring-primary/25 elevation-3' : ''}
        border
      `}>
        {/* Animated background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <CardHeader className="flex flex-row items-center justify-between pb-4 space-y-0 relative z-10">
          <h3 className="text-body-sm font-medium text-slate-300 truncate pr-3 leading-snug group-hover:text-slate-200 transition-colors">
            {title}
          </h3>
          <motion.div 
            className={`
              p-3 rounded-xl shrink-0 elevation-2
              ${colors.iconBg} ${colors.iconColor}
              transition-all duration-300 group-hover:elevation-3
            `}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon className="h-5 w-5" aria-hidden="true" />
          </motion.div>
        </CardHeader>
        
        <CardContent className="space-y-4 relative z-10">
          <div className="flex items-baseline justify-between">
            <motion.span 
              className={`text-display-lg font-bold text-white leading-none drop-shadow-sm`}
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
                text-caption px-3 py-1.5 font-medium border elevation-1
                ${trendStyle.color} touch-target badge-modern backdrop-blur-sm
                transition-all duration-300 hover:scale-105 hover:elevation-2
              `}
              aria-label={`Change: ${change}, trend ${trend}`}
            >
              <span aria-hidden="true" className="mr-1 text-sm font-medium">{trendStyle.symbol}</span>
              <span>{change}</span>
            </Badge>
          </div>
          
          <p className="text-body-sm text-slate-400 leading-relaxed font-normal group-hover:text-slate-300 transition-colors">
            {description}
          </p>
          
          {progress !== undefined && (
            <motion.div 
              className="space-y-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex justify-between items-center text-caption text-slate-400 group-hover:text-slate-300 transition-colors">
                <span className="font-medium">Progress</span>
                <span className="font-semibold">{progress}%</span>
              </div>
              <div className="relative">
                <Progress 
                  value={progress} 
                  className="h-2 bg-slate-800/60 progress-modern backdrop-blur-sm"
                  aria-label={`${title} progress: ${progress}%`}
                />
                <motion.div 
                  className={`absolute top-0 left-0 h-2 rounded-full ${colors.progressBg} transition-all duration-500 shadow-lg`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                />
              </div>
            </motion.div>
          )}
        </CardContent>

        {/* Hover glow overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/3 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        
        {/* Corner accent */}
        <div className={`absolute top-0 right-0 w-20 h-20 opacity-10 group-hover:opacity-20 transition-opacity duration-300`}>
          <div className={`w-full h-full bg-gradient-to-br ${colors.iconBg} rounded-full transform translate-x-6 -translate-y-6`} />
        </div>
      </Card>
    </motion.div>
  );
});

OptimizedMetricCard.displayName = 'OptimizedMetricCard';
