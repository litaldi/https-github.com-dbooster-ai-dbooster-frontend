
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Zap, Shield, Clock, Users, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MetricCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  description: string;
  color: string;
  delay: number;
}

function AnimatedMetricCard({ icon, value, label, description, color, delay }: MetricCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Card className="h-full border-2 hover:shadow-lg transition-all duration-300 hover:scale-105">
        <CardContent className="p-6 text-center">
          <div className={`inline-flex p-3 rounded-full mb-4 ${color}`}>
            {icon}
          </div>
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: isVisible ? 1 : 0.8 }}
            transition={{ duration: 0.4, delay: delay + 0.2 }}
            className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent"
          >
            {value}
          </motion.div>
          <h3 className="font-semibold text-lg mb-2">{label}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function EnhancedMetricsShowcase() {
  const metrics = [
    {
      icon: <TrendingUp className="h-6 w-6 text-white" />,
      value: "73%",
      label: "Query Performance Boost",
      description: "Average improvement in query response times across all database types",
      color: "bg-green-500",
      delay: 0.2
    },
    {
      icon: <Zap className="h-6 w-6 text-white" />,
      value: "60%",
      label: "Cost Reduction",
      description: "Infrastructure savings through intelligent query optimization",
      color: "bg-blue-500",
      delay: 0.4
    },
    {
      icon: <Clock className="h-6 w-6 text-white" />,
      value: "5min",
      label: "Setup Time",
      description: "From connection to first optimization recommendations",
      color: "bg-purple-500",
      delay: 0.6
    },
    {
      icon: <Users className="h-6 w-6 text-white" />,
      value: "50K+",
      label: "Developers",
      description: "Trust DBooster for their database optimization needs",
      color: "bg-orange-500",
      delay: 0.8
    },
    {
      icon: <Shield className="h-6 w-6 text-white" />,
      value: "SOC2",
      label: "Enterprise Security",
      description: "Type II compliance with bank-grade encryption",
      color: "bg-indigo-500",
      delay: 1.0
    },
    {
      icon: <Award className="h-6 w-6 text-white" />,
      value: "99.9%",
      label: "Uptime SLA",
      description: "Enterprise-grade reliability with 24/7 monitoring",
      color: "bg-red-500",
      delay: 1.2
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 px-4 py-2 bg-primary/10 text-primary">
            <Award className="h-3 w-3 mr-2" />
            Industry-Leading Performance
          </Badge>
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Trusted by Industry Leaders
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real results from real customers who've transformed their database performance with DBooster
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map((metric, index) => (
            <AnimatedMetricCard key={index} {...metric} />
          ))}
        </div>
      </div>
    </section>
  );
}
