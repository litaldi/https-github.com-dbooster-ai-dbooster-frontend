
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  BarChart3, 
  Database, 
  Zap, 
  TrendingUp, 
  CheckCircle, 
  Shield, 
  Brain, 
  DollarSign,
  Bell,
  Eye,
  Star,
  Activity,
  ArrowUpRight
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MetricCard } from "@/components/ui/metric-card";
import { UnifiedQuickActions } from "@/components/dashboard/UnifiedQuickActions";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { PerformanceTrends } from "@/components/dashboard/PerformanceTrends";
import { productionLogger } from "@/utils/productionLogger";

function SystemAlerts() {
  const alerts = [
    { id: 1, type: 'success', message: '3 queries optimized automatically', severity: 'low' },
    { id: 2, type: 'info', message: 'Backup completed successfully', severity: 'low' }
  ];

  return (
    <Card className="border border-border/40 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Bell className="h-4 w-4 text-primary" />
          Recent Activity
        </CardTitle>
        <CardDescription className="text-sm">Latest system notifications</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert) => (
          <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/20">
            <div className={`w-2 h-2 rounded-full mt-2 ${
              alert.severity === 'low' ? 'bg-green-500' : 'bg-blue-500'
            }`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground leading-relaxed">{alert.message}</p>
              <p className="text-xs text-muted-foreground mt-1">2 minutes ago</p>
            </div>
          </div>
        ))}
        <Button variant="ghost" size="sm" className="w-full mt-2 text-xs h-8">
          View all notifications
          <ArrowUpRight className="h-3 w-3 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
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

  React.useEffect(() => {
    productionLogger.info('Dashboard accessed', { 
      userId: user?.id,
      isDemo,
      timestamp: new Date().toISOString()
    }, 'Dashboard');
  }, [user?.id, isDemo]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="space-y-8 max-w-7xl mx-auto">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Dashboard
                </h1>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-200 shadow-sm">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Online
                </Badge>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                Welcome back, <span className="font-semibold text-foreground">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Demo User'}
                </span>. 
                Your database optimization center with AI-powered insights and performance monitoring.
              </p>
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="font-medium text-green-800">94% performance score</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full">
                  <Database className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-800">156 active connections</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-full">
                  <Shield className="h-4 w-4 text-purple-600" />
                  <span className="font-medium text-purple-800">All systems secure</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Button variant="outline" size="lg" className="hover:bg-accent/50 border-border/40 shadow-sm" asChild>
                <Link to="/app/reports">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Reports
                </Link>
              </Button>
              <Button size="lg" className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg hover:shadow-xl transition-all" asChild>
                <Link to="/app/ai-studio">
                  <Brain className="h-4 w-4 mr-2" />
                  AI Studio
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Performance Metrics */}
        <section aria-labelledby="metrics-heading">
          <motion.h2 
            id="metrics-heading" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-semibold mb-6 flex items-center gap-2"
          >
            <TrendingUp className="h-6 w-6 text-primary" />
            Performance Overview
          </motion.h2>
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

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Activity and Trends */}
          <motion.div 
            className="lg:col-span-2 space-y-8"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ActivityFeed />
            <PerformanceTrends />
          </motion.div>

          {/* Right Column - Quick Actions and Alerts */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="border border-border/40 shadow-lg bg-gradient-to-br from-card to-card/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Star className="h-4 w-4 text-primary" />
                  Quick Actions
                </CardTitle>
                <CardDescription className="text-sm">Essential tools for database optimization</CardDescription>
              </CardHeader>
              <CardContent>
                <UnifiedQuickActions variant="list" />
              </CardContent>
            </Card>

            <SystemAlerts />
          </motion.div>
        </div>

        {/* System Health Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100/50 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-emerald-800">
                <Shield className="h-5 w-5 text-emerald-600" />
                System Health & Status
              </CardTitle>
              <CardDescription className="text-emerald-700">
                Real-time monitoring and security compliance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3 mb-6">
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/60 border border-emerald-200/50">
                  <span className="text-sm font-medium text-emerald-700">Security Score</span>
                  <Badge className="bg-emerald-600 hover:bg-emerald-600 shadow-sm">
                    {data.securityScore}%
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/60 border border-emerald-200/50">
                  <span className="text-sm font-medium text-emerald-700">System Uptime</span>
                  <Badge className="bg-emerald-600 hover:bg-emerald-600 shadow-sm">
                    {data.uptime}%
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/60 border border-emerald-200/50">
                  <span className="text-sm font-medium text-emerald-700">Active Connections</span>
                  <Badge className="bg-emerald-600 hover:bg-emerald-600 shadow-sm">
                    {data.activeConnections}
                  </Badge>
                </div>
              </div>
              <Separator className="bg-emerald-200 my-4" />
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">All systems operational • SOC2 Compliant • 24/7 Monitoring</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
