
import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Database, 
  Activity, 
  Zap, 
  CheckCircle,
  AlertTriangle,
  Info,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

interface AnimatedMetricCardProps {
  title: string;
  value: number;
  maxValue: number;
  unit: string;
  trend?: number;
  status: 'good' | 'warning' | 'critical';
  description: string;
  onHover?: (isHovered: boolean) => void;
}

export function AnimatedMetricCard({
  title,
  value,
  maxValue,
  unit,
  trend,
  status,
  description,
  onHover
}: AnimatedMetricCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [10, -10]));
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-10, 10]));

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    mouseX.set(event.clientX - rect.left - centerX);
    mouseY.set(event.clientY - rect.top - centerY);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    onHover?.(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
    onHover?.(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good': return <CheckCircle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const percentage = (value / maxValue) * 100;

  return (
    <motion.div
      style={{
        perspective: 1000,
        rotateX,
        rotateY,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Card className="h-full overflow-hidden relative">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {title}
            </CardTitle>
            <Badge variant="outline" className={getStatusColor(status)}>
              {getStatusIcon(status)}
              <span className="ml-1 capitalize">{status}</span>
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-baseline gap-2">
            <motion.span
              className="text-3xl font-bold"
              animate={isAnimating ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.5 }}
            >
              {value.toLocaleString()}
            </motion.span>
            <span className="text-sm text-muted-foreground">{unit}</span>
            {trend !== undefined && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex items-center text-xs font-medium ${
                  trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-600'
                }`}
              >
                <TrendingUp className={`h-3 w-3 mr-1 ${trend < 0 ? 'rotate-180' : ''}`} />
                {Math.abs(trend)}%
              </motion.div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{percentage.toFixed(1)}%</span>
            </div>
            <motion.div className="relative">
              <Progress value={percentage} className="h-2" />
              <motion.div
                className="absolute top-0 left-0 h-2 bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </motion.div>
          </div>

          <motion.div
            className="text-xs text-muted-foreground"
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: isHovered ? 1 : 0, 
              height: isHovered ? 'auto' : 0 
            }}
            transition={{ duration: 0.3 }}
          >
            {description}
          </motion.div>

          <motion.div
            className="flex gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-xs"
              onClick={() => setIsAnimating(!isAnimating)}
            >
              {isAnimating ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-xs"
            >
              <RotateCcw className="h-3 w-3" />
            </Button>
          </motion.div>
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
  progress, 
  message = "Loading...", 
  children 
}: LoadingStateProps) {
  return (
    <div className="relative">
      {children}
      
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <div className="text-center space-y-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Activity className="h-8 w-8 text-primary mx-auto" />
            </motion.div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium">{message}</p>
              {progress !== undefined && (
                <div className="w-48 space-y-1">
                  <Progress value={progress} className="h-2" />
                  <p className="text-xs text-muted-foreground">{progress}% complete</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

interface FeedbackAnimationProps {
  type: 'success' | 'error' | 'info';
  message: string;
  isVisible: boolean;
  onDismiss?: () => void;
}

export function FeedbackAnimation({ 
  type, 
  message, 
  isVisible, 
  onDismiss 
}: FeedbackAnimationProps) {
  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-600" />,
    error: <AlertTriangle className="h-5 w-5 text-red-600" />,
    info: <Info className="h-5 w-5 text-blue-600" />
  };

  const colors = {
    success: 'bg-green-100 border-green-200 text-green-800',
    error: 'bg-red-100 border-red-200 text-red-800',
    info: 'bg-blue-100 border-blue-200 text-blue-800'
  };

  useEffect(() => {
    if (isVisible && onDismiss) {
      const timer = setTimeout(onDismiss, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        y: isVisible ? 0 : -50,
        scale: isVisible ? 1 : 0.9
      }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 p-4 rounded-lg border ${colors[type]} shadow-lg`}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: isVisible ? 1 : 0 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 500 }}
      >
        {icons[type]}
      </motion.div>
      
      <span className="text-sm font-medium">{message}</span>
      
      {onDismiss && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onDismiss}
          className="h-6 w-6 p-0 hover:bg-transparent"
        >
          <CheckCircle className="h-4 w-4" />
        </Button>
      )}
    </motion.div>
  );
}

// Sample metrics data
export const sampleMetrics = [
  {
    title: "Query Performance",
    value: 94,
    maxValue: 100,
    unit: "/100",
    trend: 12,
    status: 'good' as const,
    description: "Queries are performing well with recent optimizations showing significant improvement."
  },
  {
    title: "Active Connections",
    value: 156,
    maxValue: 500,
    unit: "",
    trend: -3,
    status: 'good' as const,
    description: "Connection pool is healthy with room for growth during peak hours."
  },
  {
    title: "Memory Usage",
    value: 67,
    maxValue: 100,
    unit: "%",
    trend: 8,
    status: 'warning' as const,
    description: "Memory usage is approaching warning levels. Consider optimization or scaling."
  },
  {
    title: "Response Time",
    value: 187,
    maxValue: 1000,
    unit: "ms",
    trend: -15,
    status: 'good' as const,
    description: "Response times have improved significantly after recent database tuning."
  }
];
