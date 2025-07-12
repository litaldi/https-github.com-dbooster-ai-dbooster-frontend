
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Database, 
  Zap, 
  TrendingUp, 
  CheckCircle, 
  Shield, 
  Brain, 
  DollarSign,
  Activity,
  ArrowUpRight
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MetricCard } from "@/components/ui/metric-card";

export default function DashboardPage() {
  const { user, isDemo } = useAuth();

  const data = {
    totalQueries: 15234,
    optimized: 12847,
    avgImprovement: 73,
    monthlySavings: 28400,
    activeConnections: 156,
    uptime: 99.97,
    securityScore: 100
  };

  const metricsData = [
    {
      title: "Total Queries",
      value: data.totalQueries.toLocaleString(),
      change: "+12.5% this month",
      trend: "up" as const,
      icon: Database,
      description: "Analyzed and optimized",
      color: "blue" as const,
      progress: 85
    },
    {
      title: "Optimized",
      value: data.optimized.toLocaleString(),
      change: "+8.2% improvement",
      trend: "up" as const,
      icon: Zap,
      description: "Performance enhanced",
      color: "green" as const,
      progress: 92
    },
    {
      title: "Avg Improvement",
      value: `${data.avgImprovement}%`,
      change: "+15% vs last month",
      trend: "up" as const,
      icon: TrendingUp,
      description: "Response time reduction",
      color: "purple" as const,
      progress: 73
    },
    {
      title: "Monthly Savings",
      value: `$${data.monthlySavings.toLocaleString()}`,
      change: "+23% cost reduction",
      trend: "up" as const,
      icon: DollarSign,
      description: "Infrastructure cost savings",
      color: "orange" as const,
      progress: 78
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">
                Dashboard Overview
              </h1>
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                Online
              </Badge>
            </div>
            <p className="text-lg text-muted-foreground">
              Welcome back, <span className="font-semibold text-foreground">
                {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Demo User'}
              </span>. 
              Monitor your database performance and optimization metrics.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Button variant="outline" size="lg" asChild>
              <Link to="/app/reports">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Reports
              </Link>
            </Button>
            <Button size="lg" className="bg-gradient-to-r from-primary to-blue-600" asChild>
              <Link to="/app/ai-studio">
                <Brain className="h-4 w-4 mr-2" />
                AI Studio
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Performance Metrics */}
      <section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {metricsData.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <MetricCard {...metric} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Essential tools for database optimization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              <Button variant="outline" className="justify-start h-auto p-4" asChild>
                <Link to="/app/queries">
                  <Database className="h-4 w-4 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Query Manager</div>
                    <div className="text-xs text-muted-foreground">Optimize SQL queries</div>
                  </div>
                </Link>
              </Button>
              <Button variant="outline" className="justify-start h-auto p-4" asChild>
                <Link to="/app/repositories">
                  <Shield className="h-4 w-4 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Repositories</div>
                    <div className="text-xs text-muted-foreground">Manage connections</div>
                  </div>
                </Link>
              </Button>
              <Button variant="outline" className="justify-start h-auto p-4" asChild>
                <Link to="/app/monitoring">
                  <TrendingUp className="h-4 w-4 mr-3" />
                  <div className="text-left">
                    <div className="font-medium">Monitoring</div>
                    <div className="text-xs text-muted-foreground">Real-time metrics</div>
                  </div>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* System Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-800">
              <Shield className="h-5 w-5 text-emerald-600" />
              System Status
            </CardTitle>
            <CardDescription className="text-emerald-700">
              All systems operational and secure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/60">
                <span className="text-sm font-medium text-emerald-700">Security Score</span>
                <Badge className="bg-emerald-600">
                  {data.securityScore}%
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/60">
                <span className="text-sm font-medium text-emerald-700">Uptime</span>
                <Badge className="bg-emerald-600">
                  {data.uptime}%
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/60">
                <span className="text-sm font-medium text-emerald-700">Connections</span>
                <Badge className="bg-emerald-600">
                  {data.activeConnections}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
