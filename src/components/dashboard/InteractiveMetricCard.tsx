
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface InteractiveMetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
  description: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
  progress?: number;
  isLoading?: boolean;
}

const colorConfig = {
  blue: {
    bg: 'from-blue-50 to-blue-100',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    border: 'border-blue-200',
    accent: 'text-blue-600'
  },
  green: {
    bg: 'from-emerald-50 to-emerald-100',
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    border: 'border-emerald-200',
    accent: 'text-emerald-600'
  },
  purple: {
    bg: 'from-purple-50 to-purple-100',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    border: 'border-purple-200',
    accent: 'text-purple-600'
  },
  orange: {
    bg: 'from-orange-50 to-orange-100',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    border: 'border-orange-200',
    accent: 'text-orange-600'
  }
};

export function InteractiveMetricCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  description,
  color,
  progress,
  isLoading = false
}: InteractiveMetricCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const colors = colorConfig[color];
  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;

  if (isLoading) {
    return (
      <Card className="relative overflow-hidden border-0 shadow-lg animate-pulse">
        <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-50`} />
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-muted-foreground/20 rounded w-20" />
            <div className={`p-3 rounded-xl ${colors.iconBg} opacity-50`}>
              <div className="h-5 w-5 bg-muted-foreground/20 rounded" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="h-8 bg-muted-foreground/20 rounded w-16" />
          <div className="h-3 bg-muted-foreground/20 rounded w-24" />
          {progress !== undefined && (
            <div className="space-y-2">
              <div className="h-3 bg-muted-foreground/20 rounded w-16" />
              <div className="h-2 bg-muted-foreground/20 rounded-full" />
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      whileHover={{ 
        scale: 1.02, 
        y: -4,
        transition: { duration: 0.2 }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className={`
        relative overflow-hidden border-0 shadow-lg cursor-pointer transition-all duration-300
        ${colors.border} bg-gradient-to-br ${colors.bg}
        ${isHovered ? 'shadow-xl' : ''}
      `}>
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0"
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        
        <CardHeader className="pb-3 relative z-10">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">
              {title}
            </h3>
            <motion.div 
              className={`p-3 rounded-xl ${colors.iconBg} ${colors.iconColor}`}
              animate={{ 
                scale: isHovered ? 1.1 : 1,
                rotate: isHovered ? 5 : 0
              }}
              transition={{ duration: 0.2 }}
            >
              <Icon className="h-5 w-5" />
            </motion.div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4 relative z-10">
          <div className="flex items-baseline justify-between">
            <motion.span 
              className="text-3xl font-bold text-foreground"
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.2 }}
            >
              {value}
            </motion.span>
            <Badge 
              variant="secondary" 
              className={`text-xs ${trend === 'up' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}
            >
              <TrendIcon className="h-3 w-3 mr-1" />
              {change}
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
          
          {progress !== undefined && (
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </motion.div>
          )}
        </CardContent>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
          <div className={`w-full h-full ${colors.iconBg} rounded-full transform translate-x-6 -translate-y-6`} />
        </div>
      </Card>
    </motion.div>
  );
}
