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
  Activity, 
  Shield, 
  Brain, 
  DollarSign,
  Bell,
  Eye,
  Star
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MetricCard } from "@/components/ui/metric-card";
import { UnifiedQuickActions } from "@/components/dashboard/UnifiedQuickActions";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { PerformanceTrends } from "@/components/dashboard/PerformanceTrends";
import { productionLogger } from "@/utils/productionLogger";

// System alerts component
function SystemAlerts() {
  const alerts = [
    { id: 1, type: 'warning', message: 'High CPU usage detected on server-2', severity: 'medium' },
    { id: 2, type: 'info', message: '3 queries optimized automatically', severity: 'low' },
    { id: 3, type: 'success', message: 'Backup completed successfully', severity: 'low' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          System Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert) => (
          <div key={alert.id} className="flex items-center gap-3 p-3 rounded-lg border border-border/50">
            <div className={`w-2 h-2 rounded-full ${
              alert.severity === 'medium' ? 'bg-orange-500' : 
              alert.severity === 'low' ? 'bg-blue-500' : 'bg-green-500'
            }`} />
            <span className="text-sm flex-1">{alert.message}</span>
            <Button variant="ghost" size="sm">
              <Eye className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { user, isDemo } = useAuth();

  // Sample data for metrics
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

  // Log dashboard access for analytics
  React.useEffect(() => {
    productionLogger.info('Dashboard accessed', { 
      userId: user?.id,
      isDemo,
      timestamp: new Date().toISOString()
    }, 'Dashboard');
  }, [user?.id, isDemo]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="container mx-auto px-6 py-8 space-y-8 max-w-7xl">
        {/* Clean Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Dashboard
                </h1>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Online
                </Badge>
              </div>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
                Welcome back, <span className="font-semibold text-foreground">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                </span>. 
                Your database optimization center with AI-powered insights and performance monitoring.
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span>94% performance score</span>
                </div>
                <div className="flex items-center gap-1">
                  <Database className="h-4 w-4 text-blue-600" />
                  <span>156 active connections</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="h-4 w-4 text-purple-600" />
                  <span>All systems secure</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <Button variant="outline" size="lg" className="hover:bg-accent/50" asChild>
                <Link to="/app/reports">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Reports
                </Link>
              </Button>
              <Button size="lg" className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg" asChild>
                <Link to="/app/ai-studio">
                  <Brain className="h-4 w-4 mr-2" />
                  AI Studio
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Metrics Overview */}
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
              <MetricCard key={metric.title} {...metric} />
            ))}
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Activity and Trends */}
          <div className="lg:col-span-2 space-y-6">
            <ActivityFeed />
            <PerformanceTrends />
          </div>

          {/* Right Column - Quick Actions and Alerts */}
          <div className="space-y-6">
            <Card className="border-2 border-border/50 shadow-xl bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Essential tools for database optimization</CardDescription>
              </CardHeader>
              <CardContent>
                <UnifiedQuickActions variant="list" />
              </CardContent>
            </Card>

            <SystemAlerts />
          </div>
        </div>

        {/* System Health Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-800">
                <Shield className="h-5 w-5 text-emerald-600" />
                System Health & Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/50">
                  <span className="text-sm font-medium text-emerald-700">Security Score</span>
                  <Badge className="bg-emerald-600 hover:bg-emerald-600">
                    {data.securityScore}%
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/50">
                  <span className="text-sm font-medium text-emerald-700">System Uptime</span>
                  <Badge className="bg-emerald-600 hover:bg-emerald-600">
                    {data.uptime}%
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-white/50">
                  <span className="text-sm font-medium text-emerald-700">Active Connections</span>
                  <Badge className="bg-emerald-600 hover:bg-emerald-600">
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
