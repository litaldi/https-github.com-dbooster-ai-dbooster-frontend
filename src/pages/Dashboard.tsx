
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, Database, Zap, TrendingUp, Clock, CheckCircle, Activity, Shield, Brain, ArrowRight, Users, DollarSign } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Separate metrics component for better organization
function MetricsCard({ title, value, change, icon: Icon, description }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
          {change && (
            <div className="flex items-center mt-2">
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
              <span className="text-xs text-green-600 font-medium">{change}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Quick actions component
function QuickActionsGrid({ actions }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {actions.map((action, index) => {
        const Icon = action.icon;
        return (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Button 
              variant="outline" 
              className="w-full h-auto p-6 justify-start text-left hover:shadow-md transition-all duration-200"
              asChild
            >
              <Link to={action.href} className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-base mb-1">{action.title}</div>
                  <div className="text-sm text-muted-foreground leading-relaxed">
                    {action.description}
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
              </Link>
            </Button>
          </motion.div>
        );
      })}
    </div>
  );
}

// Getting started component for new users
function GettingStarted() {
  return (
    <div className="text-center py-12">
      <Database className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
      <h3 className="text-xl font-semibold mb-3">Welcome to Your Dashboard</h3>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        Connect your database to start analyzing queries and see performance improvements.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild>
          <Link to="/app/query-analyzer">
            <Database className="h-4 w-4 mr-2" />
            Connect Database
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to="/app/ai-studio">
            <Brain className="h-4 w-4 mr-2" />
            Try AI Studio
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();

  // Clean data without demo values
  const data = {
    totalQueries: 0,
    optimized: 0,
    avgImprovement: 0,
    monthlySavings: 0,
    activeConnections: 0,
    uptime: 0
  };

  const quickActions = [
    {
      title: "Query Analyzer",
      description: "Analyze and optimize database queries for better performance",
      icon: Database,
      href: "/app/query-analyzer"
    },
    {
      title: "Performance Monitor",
      description: "Real-time performance monitoring and insights",
      icon: Activity,
      href: "/app/monitoring"
    },
    {
      title: "AI Studio",
      description: "AI-powered optimization recommendations and automation",
      icon: Brain,
      href: "/app/ai-studio"
    },
    {
      title: "Security Dashboard",
      description: "Comprehensive security analysis and threat monitoring",
      icon: Shield,
      href: "/app/security"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-8 max-w-7xl">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground text-lg">
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
        <section aria-labelledby="metrics-heading">
          <h2 id="metrics-heading" className="sr-only">Performance Metrics</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <MetricsCard
              title="Total Queries"
              value={data.totalQueries.toLocaleString()}
              change=""
              icon={Database}
              description="Analyzed this month"
            />
            <MetricsCard
              title="Optimized"
              value={data.optimized.toLocaleString()}
              change=""
              icon={Zap}
              description="Performance improvements"
            />
            <MetricsCard
              title="Avg Improvement"
              value={`${data.avgImprovement}%`}
              change=""
              icon={TrendingUp}
              description="Response time reduction"
            />
            <MetricsCard
              title="Monthly Savings"
              value={`$${data.monthlySavings.toLocaleString()}`}
              change=""
              icon={DollarSign}
              description="Infrastructure savings"
            />
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Getting Started */}
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
                      <Database className="h-5 w-5 text-primary" />
                      Get Started
                    </CardTitle>
                    <CardDescription>Connect your database to begin optimization</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <GettingStarted />
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
                <CardDescription>Essential tools for database optimization</CardDescription>
              </CardHeader>
              <CardContent>
                <QuickActionsGrid actions={quickActions} />
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* System Status */}
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
              <CardDescription>System health and performance monitoring</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                  <span className="text-sm font-medium">Active Connections</span>
                  <Badge variant="secondary">{data.activeConnections}</Badge>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                  <span className="text-sm font-medium">System Uptime</span>
                  <Badge variant="secondary">{data.uptime}%</Badge>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border bg-card">
                  <span className="text-sm font-medium">Status</span>
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    Ready to Connect
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
