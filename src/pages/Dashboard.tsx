
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, Database, Zap, TrendingUp, Clock, CheckCircle, Activity, Shield, Brain, ArrowRight, Users, DollarSign } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user, isDemo } = useAuth();

  // Clean demo data with realistic values
  const data = {
    totalQueries: isDemo ? 15234 : 0,
    optimized: isDemo ? 11876 : 0,
    avgImprovement: isDemo ? 67 : 0,
    monthlySavings: isDemo ? 2840 : 0,
    activeConnections: isDemo ? 12 : 0,
    uptime: isDemo ? 99.97 : 0
  };

  const quickActions = [
    {
      title: "Query Analyzer",
      description: "Analyze and optimize database queries",
      icon: Database,
      href: "/app/query-analyzer",
      variant: "primary" as const
    },
    {
      title: "Performance Monitor",
      description: "Real-time performance monitoring",
      icon: Activity,
      href: "/app/monitoring",
      variant: "secondary" as const
    },
    {
      title: "AI Studio",
      description: "AI-powered optimization recommendations",
      icon: Brain,
      href: "/app/ai-studio",
      variant: "primary" as const
    },
    {
      title: "Security Dashboard",
      description: "Comprehensive security analysis",
      icon: Shield,
      href: "/app/security",
      variant: "secondary" as const
    }
  ];

  const recentOptimizations = isDemo ? [
    { 
      query: "SELECT users.* FROM users WHERE created_at > ?", 
      improvement: "45%", 
      time: "2 hours ago"
    },
    { 
      query: "UPDATE orders SET status = ? WHERE id IN (?)", 
      improvement: "62%", 
      time: "4 hours ago"
    },
    { 
      query: "SELECT COUNT(*) FROM analytics WHERE date >= ?", 
      improvement: "73%", 
      time: "1 day ago"
    }
  ] : [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}. 
                Monitor your database performance and optimization insights.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" asChild>
                <Link to="/app/reports">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Reports
                </Link>
              </Button>
              <Button asChild>
                <Link to="/app/ai-studio">
                  <Brain className="h-4 w-4 mr-2" />
                  AI Studio
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Metrics Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Queries</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.totalQueries.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Analyzed this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Optimized</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.optimized.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Performance improvements</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Improvement</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.avgImprovement}%</div>
              <p className="text-xs text-muted-foreground">Response time reduction</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Savings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${data.monthlySavings}</div>
              <p className="text-xs text-muted-foreground">Infrastructure cost reduction</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      Recent Optimizations
                    </CardTitle>
                    <CardDescription>Latest database performance improvements</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/app/reports">
                      View All
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {recentOptimizations.length > 0 ? (
                  <div className="space-y-4">
                    {recentOptimizations.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center space-x-4 flex-1 min-w-0">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate font-mono">{item.query}</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                              <Clock className="h-3 w-3" />
                              {item.time}
                            </p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="ml-4 flex-shrink-0">
                          +{item.improvement}
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No optimizations yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Connect your database to start analyzing queries and performance
                    </p>
                    <Button asChild>
                      <Link to="/app/query-analyzer">
                        <Database className="h-4 w-4 mr-2" />
                        Start Analysis
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Get started with database optimization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <motion.div
                      key={action.title}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <Button 
                        variant="ghost" 
                        className="w-full h-auto p-4 justify-start text-left"
                        asChild
                      >
                        <Link to={action.href} className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-sm">{action.title}</div>
                            <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
                              {action.description}
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        </Link>
                      </Button>
                    </motion.div>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* System Status */}
        {isDemo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-600" />
                  System Status
                </CardTitle>
                <CardDescription>Real-time system health and performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <span className="text-sm font-medium">Active Connections</span>
                    <Badge variant="secondary">{data.activeConnections}</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <span className="text-sm font-medium">System Uptime</span>
                    <Badge variant="secondary">{data.uptime}%</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <span className="text-sm font-medium">Status</span>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                      All Systems Operational
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
