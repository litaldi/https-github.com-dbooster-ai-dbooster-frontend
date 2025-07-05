
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Zap, DollarSign, Clock } from 'lucide-react';

interface CounterProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
  delay: number;
}

function AnimatedCounter({ icon, value, label, color, delay }: CounterProps) {
  const [count, setCount] = useState(0);
  const finalValue = parseInt(value.replace(/[^\d]/g, '')) || 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      const increment = finalValue / 50;
      const counter = setInterval(() => {
        setCount(prev => {
          const next = prev + increment;
          if (next >= finalValue) {
            clearInterval(counter);
            return finalValue;
          }
          return next;
        });
      }, 20);

      return () => clearInterval(counter);
    }, delay);

    return () => clearTimeout(timer);
  }, [finalValue, delay]);

  const displayValue = value.includes('%') 
    ? `${Math.round(count)}%` 
    : value.includes('$')
    ? `$${Math.round(count).toLocaleString()}`
    : Math.round(count).toLocaleString();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: delay / 1000 }}
      className="text-center p-4 sm:p-6 bg-background/50 backdrop-blur-sm rounded-xl border shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className={`inline-flex p-3 rounded-full mb-3 ${color}`}>
        {icon}
      </div>
      <div className="text-2xl sm:text-3xl font-bold mb-1">
        {displayValue}
      </div>
      <div className="text-sm text-muted-foreground">
        {label}
      </div>
    </motion.div>
  );
}

export function EnhancedPerformanceCounters() {
  const counters = [
    {
      icon: <Zap className="h-5 w-5 text-white" />,
      value: "73%",
      label: "Faster Queries",
      color: "bg-blue-500",
      delay: 500
    },
    {
      icon: <TrendingUp className="h-5 w-5 text-white" />,
      value: "60%",
      label: "Cost Reduction",
      color: "bg-green-500",
      delay: 700
    },
    {
      icon: <Clock className="h-5 w-5 text-white" />,
      value: "5",
      label: "Minutes Setup",
      color: "bg-purple-500",
      delay: 900
    },
    {
      icon: <DollarSign className="h-5 w-5 text-white" />,
      value: "$50000",
      label: "Annual Savings",
      color: "bg-orange-500",
      delay: 1100
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 max-w-4xl mx-auto">
      {counters.map((counter, index) => (
        <AnimatedCounter key={index} {...counter} />
      ))}
    </div>
  );
}
