
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface InteractiveMetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: LucideIcon;
  description: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
  progress: number;
  isLoading: boolean;
}

const colorVariants = {
  blue: 'border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50',
  green: 'border-green-200 bg-gradient-to-br from-green-50 to-green-100/50',
  purple: 'border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100/50',
  orange: 'border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100/50'
};

const iconColorVariants = {
  blue: 'text-blue-600',
  green: 'text-green-600',
  purple: 'text-purple-600',
  orange: 'text-orange-600'
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
  isLoading
}: InteractiveMetricCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  if (isLoading) {
    return (
      <Card className="h-32">
        <CardContent className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className={`${colorVariants[color]} border transition-all duration-200 cursor-pointer`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className={`h-4 w-4 ${iconColorVariants[color]}`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <div className="flex items-center">
              {trend === 'up' ? (
                <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
              )}
              <span className={trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                {change}
              </span>
            </div>
            <span>{description}</span>
          </div>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3"
            >
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                Progress: {progress}%
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
