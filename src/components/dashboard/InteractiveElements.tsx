
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Database, 
  Zap, 
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<any>;
  onClick?: () => void;
}

export function AnimatedMetricCard({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon,
  onClick 
}: MetricCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getChangeColor = (type: 'positive' | 'negative' | 'neutral') => {
    switch (type) {
      case 'positive':
        return 'text-green-600 bg-green-50';
      case 'negative':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-muted-foreground bg-muted/50';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card 
        className={`cursor-pointer transition-shadow duration-200 ${
          isHovered ? 'shadow-lg' : 'shadow-sm'
        }`}
        onClick={onClick}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <motion.div
            animate={{ rotate: isHovered ? 10 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Icon className="h-4 w-4 text-muted-foreground" />
          </motion.div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold mb-2">{value}</div>
          <div className="flex items-center text-sm">
            <Badge className={`text-xs ${getChangeColor(changeType)}`}>
              {changeType === 'positive' ? (
                <TrendingUp className="h-3 w-3 mr-1" />
              ) : changeType === 'negative' ? (
                <TrendingDown className="h-3 w-3 mr-1" />
              ) : null}
              {change}
            </Badge>
            <span className="text-muted-foreground ml-2">vs last month</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface LoadingStateProps {
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
}: LoadingStateProps) {
  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="mx-auto w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
            />
            <div>
              <div className="font-medium">{message}</div>
              {progress > 0 && (
                <div className="mt-2 space-y-2">
                  <Progress value={progress} className="h-2" />
                  <div className="text-sm text-muted-foreground">{progress}% complete</div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface FeedbackAnimationProps {
  type: 'success' | 'error' | 'info';
  message: string;
  isVisible: boolean;
  onDismiss: () => void;
}

export function FeedbackAnimation({ 
  type, 
  message, 
  isVisible, 
  onDismiss 
}: FeedbackAnimationProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onDismiss, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onDismiss]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getColorClasses = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-4 right-4 z-50"
        >
          <div className={`flex items-center space-x-2 px-4 py-3 rounded-lg border shadow-lg ${getColorClasses()}`}>
            {getIcon()}
            <span className="font-medium">{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Sample metrics data for demonstration
export const sampleMetrics: MetricCardProps[] = [
  {
    title: 'Total Queries',
    value: '12,847',
    change: '+12.3%',
    changeType: 'positive',
    icon: Database
  },
  {
    title: 'Optimized',
    value: '75%',
    change: '+8.1%',
    changeType: 'positive',
    icon: Zap
  },
  {
    title: 'Performance',
    value: '94.2%',
    change: '+2.1%',
    changeType: 'positive',
    icon: TrendingUp
  },
  {
    title: 'Response Time',
    value: '127ms',
    change: '-12.8%',
    changeType: 'positive',
    icon: Zap
  }
];
