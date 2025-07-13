
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  Database, 
  Activity, 
  Shield,
  CheckCircle,
  X,
  Info,
  AlertTriangle
} from 'lucide-react';

interface MetricData {
  title: string;
  value: string | number;
  change: number;
  icon: React.ComponentType<any>;
  color: 'green' | 'red' | 'blue' | 'purple';
}

export const sampleMetrics: MetricData[] = [
  {
    title: 'Query Performance',
    value: '127ms',
    change: -12.5,
    icon: TrendingUp,
    color: 'green',
  },
  {
    title: 'Active Connections',
    value: 156,
    change: 8.2,
    icon: Database,
    color: 'blue',
  },
  {
    title: 'System Load',
    value: '23.5%',
    change: -5.3,
    icon: Activity,
    color: 'purple',
  },
  {
    title: 'Security Score',
    value: '94.2%',
    change: 2.1,
    icon: Shield,
    color: 'green',
  },
];

interface AnimatedMetricCardProps extends MetricData {}

export function AnimatedMetricCard({ title, value, change, icon: Icon, color }: AnimatedMetricCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const colorClasses = {
    green: 'text-green-600 bg-green-50 border-green-200',
    red: 'text-red-600 bg-red-50 border-red-200',
    blue: 'text-blue-600 bg-blue-50 border-blue-200',
    purple: 'text-purple-600 bg-purple-50 border-purple-200',
  };

  const isPositive = change > 0;
  const ChangeIcon = isPositive ? TrendingUp : TrendingDown;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className={`cursor-pointer transition-all duration-200 ${colorClasses[color]}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          <div className="flex items-center space-x-2 text-xs">
            <div className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              <ChangeIcon className="h-3 w-3 mr-1" />
              <span>{Math.abs(change)}%</span>
            </div>
            <span className="text-muted-foreground">from last period</span>
          </div>
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 pt-2 border-t"
              >
                <p className="text-xs text-muted-foreground">
                  Click for detailed analytics
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface EnhancedLoadingStateProps {
  isLoading: boolean;
  progress?: number;
  message?: string;
  children: React.ReactNode;
}

export function EnhancedLoadingState({ 
  isLoading, 
  progress = 0, 
  message = 'Loading...', 
  children 
}: EnhancedLoadingStateProps) {
  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4 p-8 text-center"
    >
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
      <div className="space-y-2">
        <p className="text-lg font-medium">{message}</p>
        {progress > 0 && (
          <div className="max-w-sm mx-auto">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-1">{progress}% complete</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface FeedbackAnimationProps {
  type: 'success' | 'error' | 'info';
  message: string;
  isVisible: boolean;
  onDismiss: () => void;
}

export function FeedbackAnimation({ type, message, isVisible, onDismiss }: FeedbackAnimationProps) {
  const icons = {
    success: CheckCircle,
    error: AlertTriangle,
    info: Info,
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const Icon = icons[type];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <div className={`flex items-center gap-3 p-4 rounded-lg border ${colors[type]} shadow-lg`}>
            <Icon className="h-5 w-5" />
            <span className="font-medium">{message}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="ml-2 h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
