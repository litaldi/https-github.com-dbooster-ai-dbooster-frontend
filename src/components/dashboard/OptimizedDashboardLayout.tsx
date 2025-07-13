
import React, { memo, useState, useCallback } from 'react';
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
  Sparkles,
  Globe,
  Lock
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { Link, useNavigate } from 'react-router-dom';
import { OptimizedMetricCard } from './OptimizedMetricCard';
import { enhancedToast } from '@/components/ui/enhanced-toast';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
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
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const handleNavigation = useCallback((path: string) => {
    try {
      navigate(path);
    } catch (error) {
      console.error('Navigation error:', error);
      enhancedToast.error({
        title: 'Navigation Error',
        description: 'Unable to navigate to the requested page.'
      });
    }
  }, [navigate]);

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
      color: "from-blue-600 to-blue-700",
      glow: "glow-primary"
    },
    {
      title: "AI Studio",
      description: "Intelligent optimization",
      icon: Brain,
      href: "/app/ai-studio",
      color: "from-purple-600 to-purple-700",
      glow: "glow-purple"
    },
    {
      title: "Performance Monitor",
      description: "Real-time metrics",
      icon: Activity,
      href: "/app/monitoring",
      color: "from-emerald-600 to-emerald-700",
      glow: "glow-success"
    },
    {
      title: "Security Center",
      description: "Database security",
      icon: Shield,
      href: "/app/security",
      color: "from-orange-600 to-orange-700",
      glow: "glow-warning"
    }
  ];

  const handleQuickAction = useCallback((href: string) => {
    handleNavigation(href);
  }, [handleNavigation]);

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
    >
      <div className="container mx-auto px-6 py-10 max-w-7xl">
        {/* Enhanced Header */}
        <motion.div variants={itemVariants} className="mb-12">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <motion.h1 
                  className="text-display-2xl bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Dashboard Overview
                </motion.h1>
                <Badge className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white border-0 elevation-2 px-4 py-2 badge-modern glow-success">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Live
                </Badge>
              </div>
              <motion.p 
                className="text-body-lg text-slate-300 max-w-2xl leading-relaxed"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Welcome back, <span className="font-semibold text-white">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Demo User'}
                </span>. 
                Monitor your database performance and optimization metrics in real-time.
              </motion.p>
              <motion.div 
                className="flex items-center gap-6 text-sm text-slate-400"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse glow-success"></div>
                  <span>System Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-blue-400" />
                  <span>156 Active Connections</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-purple-400" />
                  <span>SOC2 Compliant</span>
                </div>
              </motion.div>
            </div>
            
            <motion.div 
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button 
                variant="outline" 
                size="lg" 
                className="btn-modern group interactive-scale bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 hover:border-slate-600" 
                onClick={() => handleNavigation('/app/reports')}
              >
                <BarChart3 className="h-4 w-4 mr-2 transition-transform group-hover:scale-110" />
                View Reports
                <ArrowUpRight className="h-3 w-3 ml-2 opacity-50 group-hover:opacity-100 transition-opacity" />
              </Button>
              <Button 
                size="lg" 
                className="btn-modern bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 elevation-2 interactive-scale glow-primary" 
                onClick={() => handleNavigation('/app/ai-studio')}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                AI Studio
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced Metrics Grid */}
        <motion.section variants={itemVariants} className="mb-16">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3 bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 elevation-2 p-2 rounded-2xl">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-xl font-medium text-slate-300 hover:text-white"
              >
                <Eye className="h-4 w-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger 
                value="performance"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-emerald-700 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-xl font-medium text-slate-300 hover:text-white"
              >
                <Activity className="h-4 w-4 mr-2" />
                Performance
              </TabsTrigger>
              <TabsTrigger 
                value="settings"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-600 data-[state=active]:to-slate-700 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-xl font-medium text-slate-300 hover:text-white"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-10">
              {/* Quick Actions Grid */}
              <Card className="card-modern elevation-3 bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
                <CardHeader className="pb-8">
                  <CardTitle className="flex items-center gap-4 text-display-md text-white">
                    <div className="p-3 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-xl elevation-1 backdrop-blur-sm">
                      <Activity className="h-6 w-6 text-primary" />
                    </div>
                    Quick Actions
                  </CardTitle>
                  <CardDescription className="text-body-base text-slate-400 mt-2">
                    Essential tools for database optimization and management
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {quickActions.map((action, index) => (
                      <motion.div
                        key={action.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <Button 
                          variant="outline" 
                          className={`w-full h-auto p-6 flex flex-col items-start gap-4 interactive-scale hover:elevation-3 transition-all duration-300 group card-modern bg-slate-800/30 border-slate-700/50 hover:bg-slate-700/50 hover:border-slate-600/50 ${action.glow}`}
                          onClick={() => handleQuickAction(action.href)}
                        >
                          <div className={`p-4 rounded-xl bg-gradient-to-br ${action.color} elevation-2 group-hover:elevation-3 transition-all duration-300 group-hover:scale-110`}>
                            <action.icon className="h-5 w-5 text-white" />
                          </div>
                          <div className="text-left space-y-2">
                            <div className="font-semibold text-sm text-white group-hover:text-white transition-colors">{action.title}</div>
                            <div className="text-xs text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">{action.description}</div>
                          </div>
                          <ArrowUpRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-all text-slate-400 group-hover:scale-110" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* System Status */}
              <Card className="border-0 bg-gradient-to-br from-emerald-900/30 via-emerald-800/20 to-emerald-900/30 elevation-3 backdrop-blur-xl border border-emerald-700/30 glow-success">
                <CardHeader className="pb-8">
                  <CardTitle className="flex items-center gap-4 text-emerald-100 text-display-md">
                    <div className="p-3 bg-gradient-to-br from-emerald-600/30 to-emerald-700/30 rounded-xl elevation-1 backdrop-blur-sm border border-emerald-600/20">
                      <Shield className="h-6 w-6 text-emerald-400" />
                    </div>
                    System Status
                  </CardTitle>
                  <CardDescription className="text-emerald-200 text-body-base mt-2">
                    All systems operational and secure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 sm:grid-cols-3">
                    {[
                      { label: "Security Score", value: `${data.securityScore}%`, color: "emerald" },
                      { label: "Uptime", value: `${data.uptime}%`, color: "emerald" },
                      { label: "Active Connections", value: data.activeConnections.toString(), color: "emerald" }
                    ].map((stat, index) => (
                      <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className="p-6 rounded-xl bg-slate-900/40 backdrop-blur-sm elevation-2 border border-emerald-700/20 hover:border-emerald-600/30 transition-all duration-300 hover:elevation-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-emerald-200">{stat.label}</span>
                          <Badge className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white border-0 elevation-1 badge-modern px-3 py-1.5">
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
              <Card className="card-modern elevation-3 bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-display-md text-white">Performance Analytics</CardTitle>
                  <CardDescription className="text-slate-400">Detailed insights into your database performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-16 text-slate-500">
                    <TrendingUp className="h-16 w-16 mx-auto mb-6 opacity-40" />
                    <p className="text-body-base">Performance analytics coming soon...</p>
                    <Button 
                      variant="outline" 
                      className="mt-4 bg-slate-800/50 border-slate-700 hover:bg-slate-700/50"
                      onClick={() => handleNavigation('/app/monitoring')}
                    >
                      Go to Monitoring
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card className="card-modern elevation-3 bg-slate-900/50 border-slate-700/50 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-display-md text-white">Dashboard Settings</CardTitle>
                  <CardDescription className="text-slate-400">Customize your dashboard experience</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-16 text-slate-500">
                    <Settings className="h-16 w-16 mx-auto mb-6 opacity-40" />
                    <p className="text-body-base">Settings panel coming soon...</p>
                    <Button 
                      variant="outline" 
                      className="mt-4 bg-slate-800/50 border-slate-700 hover:bg-slate-700/50"
                      onClick={() => handleNavigation('/app/settings')}
                    >
                      Go to Settings
                    </Button>
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
