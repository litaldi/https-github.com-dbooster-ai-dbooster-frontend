
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
  ArrowUpRight,
  Clock,
  AlertCircle,
  Users,
  Server
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  const { user, isDemo } = useAuth();

  const data = {
    totalQueries: 15234,
    optimized: 12847,
    avgImprovement: 73,
    monthlySavings: 28400,
    activeConnections: 156,
    uptime: 99.97,
    securityScore: 100,
    criticalIssues: 2,
    pendingOptimizations: 8,
    responseTime: 145
  };

  const metricsData = [
    {
      title: "Total Queries",
      value: data.totalQueries.toLocaleString(),
      change: "+12.5%",
      trend: "up" as const,
      icon: Database,
      description: "Analyzed this month",
      color: "blue" as const,
      progress: 85
    },
    {
      title: "Optimized Queries",
      value: data.optimized.toLocaleString(),
      change: "+8.2%",
      trend: "up" as const,
      icon: Zap,
      description: "Performance enhanced",
      color: "green" as const,
      progress: 92
    },
    {
      title: "Avg Improvement",
      value: `${data.avgImprovement}%`,
      change: "+15%",
      trend: "up" as const,
      icon: TrendingUp,
      description: "Response time reduction",
      color: "purple" as const,
      progress: 73
    },
    {
      title: "Monthly Savings",
      value: `$${data.monthlySavings.toLocaleString()}`,
      change: "+23%",
      trend: "up" as const,
      icon: DollarSign,
      description: "Infrastructure costs",
      color: "orange" as const,
      progress: 78
    }
  ];

  const quickActionsData = [
    {
      title: "Query Manager",
      description: "Optimize and analyze SQL queries",
      icon: Database,
      href: "/app/queries",
      color: "blue"
    },
    {
      title: "AI Studio",
      description: "AI-powered optimization tools",
      icon: Brain,
      href: "/app/ai-studio",
      color: "purple",
      badge: "AI"
    },
    {
      title: "Repositories",
      description: "Manage database connections",
      icon: Server,
      href: "/app/repositories",
      color: "green"
    },
    {
      title: "Real-time Monitor",
      description: "Live performance metrics",
      icon: Activity,
      href: "/app/monitoring",
      color: "red"
    }
  ];

  const alertsData = [
    {
      type: "warning",
      title: "High CPU Usage",
      description: "Database server CPU at 89%",
      time: "2 minutes ago"
    },
    {
      type: "info",
      title: "Optimization Complete",
      description: "Query batch #247 optimized successfully",
      time: "15 minutes ago"
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
              <div className="p-2 bg-gradient-to-br from-primary to-blue-600 rounded-xl shadow-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  Performance Dashboard
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    All Systems Operational
                  </Badge>
                  {isDemo && (
                    <Badge variant="outline" className="border-blue-200 text-blue-700">
                      Demo Mode
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              Welcome back, <span className="font-semibold text-foreground">
                {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Demo User'}
              </span>. 
              Your database optimization center is running smoothly with advanced AI-powered insights.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Button variant="outline" size="lg" className="shadow-sm hover:shadow-md transition-shadow" asChild>
              <Link to="/app/reports">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Reports
              </Link>
            </Button>
            <Button size="lg" className="bg-gradient-to-r from-primary to-blue-600 shadow-lg hover:shadow-xl transition-all duration-200" asChild>
              <Link to="/app/ai-studio">
                <Brain className="h-4 w-4 mr-2" />
                AI Studio
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Key Metrics Grid */}
      <section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {metricsData.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 border-0 bg-gradient-to-br from-card via-card to-muted/20">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg bg-${metric.color}-100`}>
                      <metric.icon className={`h-5 w-5 text-${metric.color}-600`} />
                    </div>
                    <Badge variant="secondary" className="text-xs font-medium">
                      {metric.change}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="text-2xl font-bold text-foreground">
                      {metric.value}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {metric.description}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span>{metric.progress}%</span>
                    </div>
                    <Progress value={metric.progress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Status Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid gap-6 md:grid-cols-3"
      >
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-green-800 flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-900">{data.securityScore}%</div>
                <p className="text-sm text-green-700">Security Score</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-blue-800 flex items-center gap-2">
              <Activity className="h-5 w-5" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-blue-700">Uptime</span>
                <span className="font-semibold text-blue-900">{data.uptime}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-blue-700">Response Time</span>
                <span className="font-semibold text-blue-900">{data.responseTime}ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-blue-700">Connections</span>
                <span className="font-semibold text-blue-900">{data.activeConnections}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-orange-800 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Pending Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-orange-700">Critical Issues</span>
                <Badge variant="destructive" className="text-xs">{data.criticalIssues}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-orange-700">Optimizations</span>
                <Badge variant="secondary" className="text-xs">{data.pendingOptimizations}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-muted/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Access your most-used tools and features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {quickActionsData.map((action) => (
                <Button
                  key={action.title}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-start space-y-2 hover:shadow-md transition-all duration-200 group"
                  asChild
                >
                  <Link to={action.href}>
                    <div className="flex items-center justify-between w-full">
                      <action.icon className={`h-5 w-5 text-${action.color}-600 group-hover:scale-110 transition-transform`} />
                      {action.badge && (
                        <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                          {action.badge}
                        </Badge>
                      )}
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                    <div className="text-left w-full">
                      <div className="font-medium text-sm">{action.title}</div>
                      <div className="text-xs text-muted-foreground">{action.description}</div>
                    </div>
                  </Link>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Recent Activity
            </CardTitle>
            <CardDescription>
              Latest system alerts and notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alertsData.map((alert, index) => (
                <div key={index} className="flex items-start gap-3 p-3 rounded-lg border bg-muted/20">
                  <div className={`p-1 rounded-full ${
                    alert.type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
                  }`}>
                    {alert.type === 'warning' ? (
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="font-medium text-sm">{alert.title}</div>
                    <div className="text-xs text-muted-foreground">{alert.description}</div>
                    <div className="text-xs text-muted-foreground">{alert.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
