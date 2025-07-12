
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
    <div className="space-y-8 animate-fade-in-up">
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <h1 className="heading-2">
                Dashboard Overview
              </h1>
              <Badge className="badge-success-enhanced">
                <CheckCircle className="h-3 w-3 mr-1" />
                Online
              </Badge>
            </div>
            <p className="body-large">
              Welcome back, <span className="font-semibold text-foreground">
                {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Demo User'}
              </span>. 
              Monitor your database performance and optimization metrics.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Button variant="outline" size="lg" asChild className="btn-secondary-enhanced">
              <Link to="/app/reports">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Reports
              </Link>
            </Button>
            <Button size="lg" className="btn-cta-enhanced" asChild>
              <Link to="/app/ai-studio">
                <Brain className="h-4 w-4 mr-2" />
                AI Studio
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Performance Metrics */}
      <section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {metricsData.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="interactive-card"
            >
              <MetricCard {...metric} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Enhanced Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="card-enhanced">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 heading-4">
              <Activity className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
            <CardDescription className="body-base">
              Essential tools for database optimization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Button variant="outline" className="justify-start h-auto p-6 card-interactive-enhanced" asChild>
                <Link to="/app/queries">
                  <Database className="h-5 w-5 mr-4 text-blue-500" />
                  <div className="text-left">
                    <div className="font-medium heading-4">Query Manager</div>
                    <div className="text-sm text-muted-foreground body-small">Optimize SQL queries</div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 ml-auto text-muted-foreground" />
                </Link>
              </Button>
              <Button variant="outline" className="justify-start h-auto p-6 card-interactive-enhanced" asChild>
                <Link to="/app/repositories">
                  <Shield className="h-5 w-5 mr-4 text-green-500" />
                  <div className="text-left">
                    <div className="font-medium heading-4">Repositories</div>
                    <div className="text-sm text-muted-foreground body-small">Manage connections</div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 ml-auto text-muted-foreground" />
                </Link>
              </Button>
              <Button variant="outline" className="justify-start h-auto p-6 card-interactive-enhanced" asChild>
                <Link to="/app/monitoring">
                  <TrendingUp className="h-5 w-5 mr-4 text-purple-500" />
                  <div className="text-left">
                    <div className="font-medium heading-4">Monitoring</div>
                    <div className="text-sm text-muted-foreground body-small">Real-time metrics</div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 ml-auto text-muted-foreground" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Enhanced System Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border-success/20 card-glass" style={{
          background: 'linear-gradient(135deg, hsl(var(--success) / 0.05) 0%, hsl(var(--success) / 0.1) 100%)'
        }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 heading-4 text-success">
              <Shield className="h-5 w-5 text-success" />
              System Status
            </CardTitle>
            <CardDescription className="text-success/80 body-base">
              All systems operational and secure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="flex items-center justify-between p-4 rounded-xl card-glass">
                <span className="text-sm font-medium text-success">Security Score</span>
                <Badge className="badge-success-enhanced">
                  {data.securityScore}%
                </Badge>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl card-glass">
                <span className="text-sm font-medium text-success">Uptime</span>
                <Badge className="badge-success-enhanced">
                  {data.uptime}%
                </Badge>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl card-glass">
                <span className="text-sm font-medium text-success">Connections</span>
                <Badge className="badge-success-enhanced">
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
