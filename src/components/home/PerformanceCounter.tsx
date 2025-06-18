
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, Database, Zap } from 'lucide-react';

interface MetricProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  suffix: string;
  color: string;
  animationDelay: number;
}

function AnimatedMetric({ icon: Icon, label, value, suffix, color, animationDelay }: MetricProps) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const duration = 2000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;
      
      const counter = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayValue(value);
          clearInterval(counter);
        } else {
          setDisplayValue(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(counter);
    }, animationDelay);

    return () => clearTimeout(timer);
  }, [value, animationDelay]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: animationDelay / 1000 }}
      className="flex items-center gap-3 bg-card/50 backdrop-blur-sm border border-border/30 rounded-lg p-4 hover:bg-card/70 transition-colors duration-300"
    >
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div>
        <div className="text-2xl font-bold text-foreground">
          {displayValue.toLocaleString()}{suffix}
        </div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </div>
    </motion.div>
  );
}

export function PerformanceCounter() {
  const metrics = [
    {
      icon: Database,
      label: "Queries Optimized",
      value: 50847,
      suffix: "+",
      color: "bg-blue-500",
      animationDelay: 200
    },
    {
      icon: TrendingUp,
      label: "Avg Performance Gain",
      value: 73,
      suffix: "%",
      color: "bg-green-500",
      animationDelay: 400
    },
    {
      icon: Clock,
      label: "Time Saved (Hours)",
      value: 12459,
      suffix: "",
      color: "bg-purple-500",
      animationDelay: 600
    },
    {
      icon: Zap,
      label: "Active Users Today",
      value: 1247,
      suffix: "",
      color: "bg-orange-500",
      animationDelay: 800
    }
  ];

  return (
    <div className="w-full">
      {/* Desktop layout */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <AnimatedMetric key={index} {...metric} />
        ))}
      </div>

      {/* Mobile layout */}
      <div className="md:hidden grid grid-cols-1 gap-3">
        {metrics.slice(0, 2).map((metric, index) => (
          <AnimatedMetric key={index} {...metric} />
        ))}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center"
        >
          <div className="text-sm text-muted-foreground">
            +{metrics.slice(2).reduce((acc, m) => acc + m.value, 0).toLocaleString()} more achievements
          </div>
        </motion.div>
      </div>

      {/* Live indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="flex items-center justify-center gap-2 mt-6"
      >
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <motion.div
            className="w-2 h-2 bg-green-500 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.7, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          Live metrics updating every minute
        </div>
      </motion.div>
    </div>
  );
}
