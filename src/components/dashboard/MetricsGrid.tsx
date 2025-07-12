
import React from 'react';
import { motion } from 'framer-motion';
import { Database, Zap, TrendingUp, DollarSign } from 'lucide-react';
import { InteractiveMetricCard } from './InteractiveMetricCard';

interface DashboardMetrics {
  totalQueries: number;
  optimizedQueries: number;
  avgImprovement: number;
  monthlySavings: number;
  activeConnections: number;
  uptime: number;
  securityScore: number;
  responseTime: number;
  criticalIssues: number;
  pendingOptimizations: number;
}

interface MetricsGridProps {
  metrics?: DashboardMetrics;
  isLoading: boolean;
}

export function MetricsGrid({ metrics, isLoading }: MetricsGridProps) {
  const metricsCards = [
    {
      title: "Total Queries",
      value: metrics?.totalQueries?.toLocaleString() || "0",
      change: "+12.5%",
      trend: "up" as const,
      icon: Database,
      description: "Analyzed this month",
      color: "blue" as const,
      progress: 85
    },
    {
      title: "Optimized Queries",
      value: metrics?.optimizedQueries?.toLocaleString() || "0",
      change: "+8.2%",
      trend: "up" as const,
      icon: Zap,
      description: "Performance enhanced",
      color: "green" as const,
      progress: 92
    },
    {
      title: "Avg Improvement",
      value: `${metrics?.avgImprovement || 0}%`,
      change: "+15%",
      trend: "up" as const,
      icon: TrendingUp,
      description: "Response time reduction",
      color: "purple" as const,
      progress: metrics?.avgImprovement || 0
    },
    {
      title: "Monthly Savings",
      value: `$${metrics?.monthlySavings?.toLocaleString() || "0"}`,
      change: "+23%",
      trend: "up" as const,
      icon: DollarSign,
      description: "Infrastructure costs",
      color: "orange" as const,
      progress: 78
    }
  ];

  return (
    <section>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metricsCards.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <InteractiveMetricCard {...metric} isLoading={isLoading} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
