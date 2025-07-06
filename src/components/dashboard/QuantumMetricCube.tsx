
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface QuantumMetricCubeProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  color: string;
  trend?: number[];
}

export function QuantumMetricCube({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  color,
  trend = []
}: QuantumMetricCubeProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: {
        bg: 'from-blue-500/20 to-blue-600/20',
        border: 'border-blue-500/30',
        icon: 'from-blue-500 to-blue-600',
        accent: '#3b82f6'
      },
      green: {
        bg: 'from-green-500/20 to-green-600/20',
        border: 'border-green-500/30',
        icon: 'from-green-500 to-green-600',
        accent: '#10b981'
      },
      purple: {
        bg: 'from-purple-500/20 to-purple-600/20',
        border: 'border-purple-500/30',
        icon: 'from-purple-500 to-purple-600',
        accent: '#8b5cf6'
      },
      emerald: {
        bg: 'from-emerald-500/20 to-emerald-600/20',
        border: 'border-emerald-500/30',
        icon: 'from-emerald-500 to-emerald-600',
        accent: '#059669'
      }
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const colors = getColorClasses(color);

  return (
    <motion.div
      className="relative h-80 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900/90 via-purple-900/50 to-slate-900/90 border backdrop-blur-sm"
      style={{ borderColor: colors.accent + '30' }}
      whileHover={{ scale: 1.02, rotateY: 2 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full opacity-60"
            style={{ 
              backgroundColor: colors.accent,
              left: `${10 + (i * 8)}%`,
              top: `${20 + (i * 6)}%`
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3 + (i * 0.2),
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      {/* Holographic Grid Lines */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(90deg, ${colors.accent}40 1px, transparent 1px),
            linear-gradient(${colors.accent}40 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      />

      {/* Content */}
      <div className="relative z-10 p-6 h-full flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <motion.div
            className={`p-3 rounded-xl bg-gradient-to-r ${colors.icon} shadow-lg`}
            animate={{
              boxShadow: isHovered 
                ? `0 0 30px ${colors.accent}40`
                : `0 0 10px ${colors.accent}20`
            }}
          >
            <Icon className="h-6 w-6 text-white" />
          </motion.div>
          
          <motion.div
            className={`px-3 py-1 rounded-full text-xs font-medium border ${
              changeType === 'positive' 
                ? 'bg-green-500/20 text-green-300 border-green-500/30' 
                : changeType === 'negative'
                ? 'bg-red-500/20 text-red-300 border-red-500/30'
                : 'bg-gray-500/20 text-gray-300 border-gray-500/30'
            }`}
            animate={{ scale: isHovered ? 1.1 : 1 }}
          >
            {change}
          </motion.div>
        </div>

        <div className="space-y-2">
          <h3 className="text-white/80 text-sm font-medium tracking-wide">
            {title}
          </h3>
          <motion.div
            className="text-3xl font-bold text-white"
            animate={{ 
              textShadow: isHovered 
                ? `0 0 20px ${colors.accent}`
                : '0 0 5px rgba(255,255,255,0.3)'
            }}
          >
            {value}
          </motion.div>
        </div>

        {/* Trend Visualization */}
        {trend.length > 0 && (
          <div className="mt-4">
            <div className="flex items-end space-x-1 h-12">
              {trend.slice(-8).map((point, index) => (
                <motion.div
                  key={index}
                  className="w-3 rounded-t-sm"
                  style={{ 
                    background: `linear-gradient(to top, ${colors.accent}60, ${colors.accent}90)`,
                    height: `${Math.max(20, (point / Math.max(...trend)) * 100)}%`
                  }}
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(20, (point / Math.max(...trend)) * 100)}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
