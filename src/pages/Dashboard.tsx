
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, Database, Zap, TrendingUp, Clock, CheckCircle, Activity, Shield, Brain, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user, isDemo } = useAuth();

  const mockData = {
    totalQueries: isDemo ? 15234 : 8542,
    optimized: isDemo ? 11876 : 6231,
    avgImprovement: isDemo ? 67 : 54,
    monthlySavings: isDemo ? 2840 : 1920
  };

  const quickActions = [
    {
      title: "Run Query Analysis",
      description: "Analyze your database queries for optimization opportunities",
      icon: Database,
      href: "/app/query-analyzer",
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Performance Monitor",
      description: "Real-time monitoring of database performance metrics",
      icon: Activity,
      href: "/app/monitoring",
      color: "from-green-500 to-green-600"
    },
    {
      title: "AI Optimization",
      description: "Let AI automatically optimize your database performance",
      icon: Brain,
      href: "/app/ai-studio",
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Security Scan",
      description: "Comprehensive security analysis and recommendations",
      icon: Shield,
      href: "/app/security",
      color: "from-red-500 to-red-600"
    }
  ];

  const recentOptimizations = [
    { query: "SELECT users.* FROM users WHERE created_at > ?", improvement: "45%", time: "2 hours ago", status: "completed" },
    { query: "UPDATE orders SET status = ? WHERE id IN (?)", improvement: "62%", time: "4 hours ago", status: "completed" },
    { query: "JOIN products ON orders.product_id = products.id", improvement: "38%", time: "6 hours ago", status: "completed" },
    { query: "SELECT COUNT(*) FROM analytics WHERE date >= ?", improvement: "73%", time: "1 day ago", status: "completed" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                  Dashboard
                </h1>
                {isDemo && (
                  <Badge variant="secondary" className="animate-pulse">
                    Demo Mode
                  </Badge>
                )}
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}. 
                Your database performance center is ready.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                View Reports
              </Button>
              <Button asChild className="bg-gradient-to-r from-primary to-blue-600">
                <Link to="/app/ai-studio" className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  AI Studio
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Queries</CardTitle>
              <Database className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {mockData.totalQueries.toLocaleString()}
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Analyzed this month
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Optimized</CardTitle>
              <Zap className="h-5 w-5 text-green-600 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900 dark:text-green-100">
                {mockData.optimized.toLocaleString()}
              </div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                Performance improvements applied
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Avg Improvement</CardTitle>
              <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                {mockData.avgImprovement}%
              </div>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                Query response time reduction
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Monthly Savings</CardTitle>
              <BarChart3 className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                ${mockData.monthlySavings}
              </div>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                Infrastructure cost reduction
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Recent Optimizations */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="border-0 shadow-xl">
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
                    <Link to="/app/reports" className="flex items-center gap-1">
                      View All
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentOptimizations.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.query}</p>
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
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-0 shadow-xl">
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
                        className="w-full h-auto p-4 justify-start hover:bg-muted/80"
                        asChild
                      >
                        <Link to={action.href} className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${action.color} shadow-sm`}>
                            <Icon className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1 text-left">
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
      </div>
    </div>
  );
}
