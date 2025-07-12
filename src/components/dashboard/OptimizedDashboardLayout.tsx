
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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
  Eye,
  Settings,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { Link } from 'react-router-dom';
import { OptimizedMetricCard } from './OptimizedMetricCard';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4 }
  }
};

export const OptimizedDashboardLayout = memo(() => {
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
      progress: 85,
      priority: "primary" as const
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

  const quickActions = [
    {
      title: "Query Manager",
      description: "Optimize SQL queries",
      icon: Database,
      href: "/app/queries",
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "AI Studio",
      description: "Intelligent optimization",
      icon: Brain,
      href: "/app/ai-studio",
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Performance Monitor",
      description: "Real-time metrics",
      icon: Activity,
      href: "/app/monitoring",
      color: "from-emerald-500 to-emerald-600"
    },
    {
      title: "Security Center",
      description: "Database security",
      icon: Shield,
      href: "/app/security",
      color: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/50"
    >
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Enhanced Header */}
        <motion.div variants={itemVariants} className="mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <motion.h1 
                  className="text-display-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, ease: "easeOut" }}
                >
                  Dashboard Overview
                </motion.h1>
                <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0 shadow-sm px-3 py-1">
                  <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                  Live
                </Badge>
              </div>
              <motion.p 
                className="text-body-lg text-slate-600 max-w-2xl leading-relaxed"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, ease: "easeOut" }}
              >
                Welcome back, <span className="font-semibold text-slate-900">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Demo User'}
                </span>. 
                Monitor your database performance and optimization metrics in real-time.
              </motion.p>
            </div>
            
            <motion.div 
              className="flex flex-col sm:flex-row items-start sm:items-center gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, ease: "easeOut" }}
            >
              <Button variant="outline" size="lg" className="btn-modern group" asChild>
                <Link to="/app/reports">
                  <BarChart3 className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
                  View Reports
                  <ArrowUpRight className="h-3 w-3 ml-1 opacity-50 group-hover:opacity-100 transition-opacity" />
                </Link>
              </Button>
              <Button size="lg" className="btn-modern bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg" asChild>
                <Link to="/app/ai-studio">
                  <Brain className="h-4 w-4 mr-2" />
                  AI Studio
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced Metrics Grid */}
        <motion.section variants={itemVariants} className="mb-12">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {metricsData.map((metric, index) => (
              <motion.div
                key={metric.title}
                variants={itemVariants}
                transition={{ delay: index * 0.1 }}
              >
                <OptimizedMetricCard {...metric} />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Enhanced Tabs Section */}
        <motion.div variants={itemVariants}>
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3 bg-white/80 backdrop-blur-sm border shadow-sm p-1">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-blue-600 data-[state=active]:text-white transition-all duration-200"
              >
                <Eye className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="performance"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white transition-all duration-200"
              >
                <Activity className="h-4 w-4 mr-2" />
                Performance
              </TabsTrigger>
              <TabsTrigger 
                value="settings"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-500 data-[state=active]:to-slate-600 data-[state=active]:text-white transition-all duration-200"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              {/* Quick Actions Grid */}
              <Card className="card-modern shadow-lg">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-display-md">
                    <div className="p-2 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-xl">
                      <Activity className="h-5 w-5 text-primary" />
                    </div>
                    Quick Actions
                  </CardTitle>
                  <CardDescription className="text-body-base text-slate-600">
                    Essential tools for database optimization and management
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {quickActions.map((action, index) => (
                      <motion.div
                        key={action.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1, ease: "easeOut" }}
                      >
                        <Button 
                          variant="outline" 
                          className="w-full h-auto p-6 flex flex-col items-start gap-3 interactive-scale hover:shadow-md transition-all duration-200 group" 
                          asChild
                        >
                          <Link to={action.href}>
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${action.color} shadow-sm group-hover:shadow-md transition-shadow`}>
                              <action.icon className="h-5 w-5 text-white" />
                            </div>
                            <div className="text-left space-y-1">
                              <div className="font-semibold text-sm text-slate-900">{action.title}</div>
                              <div className="text-xs text-slate-600 leading-relaxed">{action.description}</div>
                            </div>
                            <ArrowUpRight className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-slate-400" />
                          </Link>
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* System Status */}
              <Card className="border-0 bg-gradient-to-br from-emerald-50 via-emerald-50/50 to-emerald-100/80 shadow-lg">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-emerald-900 text-display-md">
                    <div className="p-2 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl shadow-sm">
                      <Shield className="h-5 w-5 text-emerald-700" />
                    </div>
                    System Status
                  </CardTitle>
                  <CardDescription className="text-emerald-800/80 text-body-base">
                    All systems operational and secure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {[
                      { label: "Security Score", value: `${data.securityScore}%`, color: "emerald" },
                      { label: "Uptime", value: `${data.uptime}%`, color: "emerald" },
                      { label: "Active Connections", value: data.activeConnections, color: "emerald" }
                    ].map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7 + index * 0.1, ease: "easeOut" }}
                        className="p-4 rounded-xl bg-white/60 backdrop-blur-sm shadow-sm border border-emerald-200/50"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-emerald-800">{stat.label}</span>
                          <Badge className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white border-0 shadow-sm">
                            {stat.value}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance">
              <Card className="card-modern shadow-lg">
                <CardHeader>
                  <CardTitle className="text-display-md">Performance Analytics</CardTitle>
                  <CardDescription>Detailed insights into your database performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-slate-500">
                    <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-body-base">Performance analytics coming soon...</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card className="card-modern shadow-lg">
                <CardHeader>
                  <CardTitle className="text-display-md">Dashboard Settings</CardTitle>
                  <CardDescription>Customize your dashboard experience</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-slate-500">
                    <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-body-base">Settings panel coming soon...</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </motion.div>
  );
});

OptimizedDashboardLayout.displayName = 'OptimizedDashboardLayout';
