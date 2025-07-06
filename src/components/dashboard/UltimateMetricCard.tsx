
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface UltimateMetricCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  color: string;
  subtitle: string;
  trend?: number[];
  interactive?: boolean;
}

export function UltimateMetricCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  color,
  subtitle,
  trend = [],
  interactive = true
}: UltimateMetricCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: {
        bg: 'from-blue-50 via-blue-100 to-blue-200',
        icon: 'from-blue-500 to-blue-600',
        border: 'border-blue-300',
        glow: 'shadow-blue-200',
        particle: 'bg-blue-400'
      },
      green: {
        bg: 'from-green-50 via-green-100 to-green-200',
        icon: 'from-green-500 to-green-600',
        border: 'border-green-300',
        glow: 'shadow-green-200',
        particle: 'bg-green-400'
      },
      emerald: {
        bg: 'from-emerald-50 via-emerald-100 to-emerald-200',
        icon: 'from-emerald-500 to-emerald-600',
        border: 'border-emerald-300',
        glow: 'shadow-emerald-200',
        particle: 'bg-emerald-400'
      },
      purple: {
        bg: 'from-purple-50 via-purple-100 to-purple-200',
        icon: 'from-purple-500 to-purple-600',
        border: 'border-purple-300',
        glow: 'shadow-purple-200',
        particle: 'bg-purple-400'
      }
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const colors = getColorClasses(color);

  const getChangeColor = (type: string) => {
    switch (type) {
      case 'positive':
        return 'text-green-700 bg-gradient-to-r from-green-100 to-green-200 border-green-300';
      case 'negative':
        return 'text-red-700 bg-gradient-to-r from-red-100 to-red-200 border-red-300';
      default:
        return 'text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: interactive ? 1.05 : 1, rotateY: interactive ? 5 : 0 }}
      whileTap={{ scale: interactive ? 0.98 : 1 }}
      transition={{ 
        duration: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 25
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="transform-gpu perspective-1000"
    >
      <Card className={`
        relative overflow-hidden border-2 transition-all duration-500
        bg-gradient-to-br ${colors.bg} ${colors.border}
        ${isHovered && interactive ? `shadow-2xl ${colors.glow}/50` : 'shadow-lg'}
        ${isAnimating ? 'animate-pulse' : ''}
        backdrop-blur-sm bg-opacity-90
      `}>
        {/* Animated Background Particles */}
        <AnimatePresence>
          {isHovered && interactive && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                  animate={{ 
                    opacity: [0, 1, 0], 
                    scale: [0, 1, 0],
                    x: Math.random() * 200 - 100,
                    y: Math.random() * 200 - 100
                  }}
                  exit={{ opacity: 0, scale: 0 }}
                  transition={{ 
                    duration: 2,
                    delay: i * 0.1,
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                  className={`absolute w-2 h-2 rounded-full ${colors.particle} opacity-60`}
                  style={{
                    left: `${20 + (i * 15)}%`,
                    top: `${20 + (i * 10)}%`
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        {/* Glassmorphism Overlay */}
        <div className="absolute inset-0 backdrop-blur-[2px] bg-white/10" />

        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3 z-10">
          <CardTitle className="text-sm font-semibold text-gray-700 tracking-wide">
            {title}
          </CardTitle>
          <motion.div 
            className={`p-3 rounded-2xl bg-gradient-to-br ${colors.icon} shadow-lg`}
            animate={{ 
              rotate: isHovered ? 360 : 0,
              scale: isAnimating ? [1, 1.1, 1] : 1
            }}
            transition={{ 
              rotate: { duration: 0.6, ease: "easeInOut" },
              scale: { duration: 0.5, ease: "easeInOut" }
            }}
          >
            <Icon className="h-6 w-6 text-white drop-shadow-sm" />
          </motion.div>
        </CardHeader>

        <CardContent className="relative z-10">
          <div className="space-y-4">
            <motion.div 
              className="text-4xl font-bold text-gray-800 tracking-tight"
              animate={{ 
                scale: isAnimating ? [1, 1.05, 1] : 1,
                color: isAnimating ? ['#374151', '#059669', '#374151'] : '#374151'
              }}
              transition={{ duration: 0.5 }}
            >
              {value}
            </motion.div>
            
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 font-medium">
                {subtitle}
              </p>
              <motion.div
                animate={{ scale: isHovered ? 1.1 : 1 }}
                transition={{ duration: 0.2 }}
              >
                <Badge 
                  variant="secondary" 
                  className={`text-xs font-semibold border ${getChangeColor(changeType)} shadow-sm`}
                >
                  {change}
                </Badge>
              </motion.div>
            </div>

            {/* Mini Trend Visualization */}
            {trend.length > 0 && (
              <motion.div 
                className="flex items-end space-x-1 h-8 mt-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0.7 }}
                transition={{ duration: 0.3 }}
              >
                {trend.slice(-12).map((point, index) => (
                  <motion.div
                    key={index}
                    className={`w-2 bg-gradient-to-t ${colors.icon} rounded-t-sm`}
                    style={{ height: `${Math.max(10, (point / Math.max(...trend)) * 100)}%` }}
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(10, (point / Math.max(...trend)) * 100)}%` }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  />
                ))}
              </motion.div>
            )}
          </div>

          {/* Dynamic Gradient Overlay */}
          <motion.div 
            className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colors.icon} opacity-5 rounded-full`}
            animate={{ 
              scale: isHovered ? 1.2 : 1,
              rotate: isAnimating ? 180 : 0 
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{ transform: 'translate(50%, -50%)' }}
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}
