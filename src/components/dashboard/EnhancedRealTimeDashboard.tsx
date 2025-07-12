
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Database, 
  Zap, 
  TrendingUp, 
  DollarSign,
  Activity,
  Shield,
  Clock,
  Users,
  Server,
  Brain,
  BarChart3,
  Settings,
  RefreshCw,
  Eye,
  Bell,
  Search,
  Filter,
  Download,
  ChevronRight,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { Link } from 'react-router-dom';
import { InteractiveMetricCard } from './InteractiveMetricCard';
import { RealTimeChart } from './RealTimeChart';
import { DashboardSearch } from './DashboardSearch';
import { NotificationCenter } from './NotificationCenter';
import { QuickSetupWizard } from './QuickSetupWizard';

interface DashboardMetrics {
  totalQueries: number;
  optimizedQueries: number;
  avgImprovement: number;
  monthlySavings: number;
  activeConnections: number;
  uptime: number;
  securityScore: number;
  responseTime: number;
  criticalIssues: number;
  pendingOptimizations: number;
}

export function EnhancedRealTimeDashboard() {
  const { user, isDemo } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');
  const [refreshing, setRefreshing] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showWizard, setShowWizard] = useState(false);

  // Simulated real-time data fetching
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: async (): Promise<DashboardMetrics> => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return {
        totalQueries: Math.floor(Math.random() * 1000) + 15000,
        optimizedQueries: Math.floor(Math.random() * 800) + 12000,
        avgImprovement: Math.floor(Math.random() * 20) + 65,
        monthlySavings: Math.floor(Math.random() * 5000) + 25000,
        activeConnections: Math.floor(Math.random() * 50) + 120,
        uptime: 99.95 + Math.random() * 0.04,
        securityScore: 98 + Math.random() * 2,
        responseTime: Math.floor(Math.random() * 50) + 120,
        criticalIssues: Math.floor(Math.random() * 3),
        pendingOptimizations: Math.floor(Math.random() * 15) + 5
      };
    },
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 25000
  });

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['dashboard-metrics'] });
    setTimeout(() => setRefreshing(false), 1000);
  }, [queryClient]);

  const metricsCards = [
    {
      title: "Total Queries",
      value: metrics?.totalQueries?.toLocaleString() || "0",
      change: "+12.5%",
      trend: "up" as const,
      icon: Database,
      description: "Analyzed this month",
      color: "blue" as const,
      progress: 85
    },
    {
      title: "Optimized Queries",
      value: metrics?.optimizedQueries?.toLocaleString() || "0",
      change: "+8.2%",
      trend: "up" as const,
      icon: Zap,
      description: "Performance enhanced",
      color: "green" as const,
      progress: 92
    },
    {
      title: "Avg Improvement",
      value: `${metrics?.avgImprovement || 0}%`,
      change: "+15%",
      trend: "up" as const,
      icon: TrendingUp,
      description: "Response time reduction",
      color: "purple" as const,
      progress: metrics?.avgImprovement || 0
    },
    {
      title: "Monthly Savings",
      value: `$${metrics?.monthlySavings?.toLocaleString() || "0"}`,
      change: "+23%",
      trend: "up" as const,
      icon: DollarSign,
      description: "Infrastructure costs",
      color: "orange" as const,
      progress: 78
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-6"
        >
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-primary/20 to-blue-500/20 rounded-xl border border-primary/20">
                <Activity className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  Performance Dashboard
                </h1>
                <div className="flex items-center gap-3 mt-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    All Systems Operational
                  </Badge>
                  {isDemo && (
                    <Badge variant="secondary">
                      <Eye className="h-3 w-3 mr-1" />
                      Demo Mode
                    </Badge>
                  )}
                  <Badge variant="outline" className="animate-pulse">
                    <Activity className="h-3 w-3 mr-1" />
                    Live Updates
                  </Badge>
                </div>
              </div>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Welcome back, <span className="font-semibold text-foreground">
                {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Demo User'}
              </span>. 
              Monitor your database performance with real-time insights and AI-powered optimization recommendations.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSearch(true)}
                className="hover:bg-muted/50"
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowNotifications(true)}
                className="hover:bg-muted/50 relative"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                  2
                </span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                className="hover:bg-muted/50"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="lg" className="hover:bg-muted/50" asChild>
                <Link to="/app/reports">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Reports
                </Link>
              </Button>
              <Button size="lg" className="bg-gradient-to-r from-primary to-blue-600 shadow-lg" asChild>
                <Link to="/app/ai-studio">
                  <Brain className="h-4 w-4 mr-2" />
                  AI Studio
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Real-Time Metrics Grid */}
        <section>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {metricsCards.map((metric, index) => (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <InteractiveMetricCard {...metric} isLoading={isLoading} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Enhanced Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto p-2 bg-muted/30 backdrop-blur-sm">
            <TabsTrigger value="overview" className="flex flex-col gap-1 py-3">
              <Activity className="h-4 w-4" />
              <span className="text-xs">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex flex-col gap-1 py-3">
              <BarChart3 className="h-4 w-4" />
              <span className="text-xs">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex flex-col gap-1 py-3">
              <Shield className="h-4 w-4" />
              <span className="text-xs">Security</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex flex-col gap-1 py-3">
              <Settings className="h-4 w-4" />
              <span className="text-xs">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* System Health Overview */}
            <div className="grid gap-6 md:grid-cols-3">
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
                      <div className="text-3xl font-bold text-green-900">
                        {metrics?.securityScore?.toFixed(1) || 0}%
                      </div>
                      <p className="text-sm text-green-700">Security Score</p>
                    </div>
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-blue-800 flex items-center gap-2">
                    <Server className="h-5 w-5" />
                    System Health
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-blue-700">Uptime</span>
                      <span className="font-semibold text-blue-900">
                        {metrics?.uptime?.toFixed(2) || 0}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-blue-700">Response Time</span>
                      <span className="font-semibold text-blue-900">
                        {metrics?.responseTime || 0}ms
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-blue-700">Connections</span>
                      <span className="font-semibold text-blue-900">
                        {metrics?.activeConnections || 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-orange-800 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    Action Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-orange-700">Critical Issues</span>
                      <Badge variant={metrics?.criticalIssues === 0 ? "secondary" : "destructive"}>
                        {metrics?.criticalIssues || 0}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-orange-700">Pending Tasks</span>
                      <Badge variant="secondary">
                        {metrics?.pendingOptimizations || 0}
                      </Badge>
                    </div>
                    <Button size="sm" className="w-full mt-3">
                      <ChevronRight className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Real-Time Performance Chart */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Performance Trends
                </CardTitle>
                <CardDescription>
                  Real-time query performance and optimization metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RealTimeChart />
              </CardContent>
            </Card>

            {/* Quick Actions & Setup */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>
                    Essential tools for database optimization
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    <Button variant="outline" className="justify-start h-auto p-4" asChild>
                      <Link to="/app/queries">
                        <Database className="h-5 w-5 mr-3" />
                        <div className="text-left">
                          <div className="font-medium">Query Manager</div>
                          <div className="text-xs text-muted-foreground">Optimize SQL queries</div>
                        </div>
                      </Link>
                    </Button>
                    <Button variant="outline" className="justify-start h-auto p-4" asChild>
                      <Link to="/app/monitoring">
                        <Activity className="h-5 w-5 mr-3" />
                        <div className="text-left">
                          <div className="font-medium">Real-time Monitor</div>
                          <div className="text-xs text-muted-foreground">Live performance metrics</div>
                        </div>
                      </Link>
                    </Button>
                    <Button variant="outline" className="justify-start h-auto p-4" asChild>
                      <Link to="/app/repositories">
                        <Server className="h-5 w-5 mr-3" />
                        <div className="text-left">
                          <div className="font-medium">Repositories</div>
                          <div className="text-xs text-muted-foreground">Manage connections</div>
                        </div>
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-primary" />
                    Getting Started
                  </CardTitle>
                  <CardDescription>
                    Set up your optimization environment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Database Connected</span>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">First Query Analyzed</span>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">AI Studio Configured</span>
                      <div className="h-4 w-4 border-2 border-muted rounded-full" />
                    </div>
                    <Button 
                      className="w-full mt-4" 
                      onClick={() => setShowWizard(true)}
                    >
                      Complete Setup
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Analytics</CardTitle>
                <CardDescription>Detailed performance insights and trends</CardDescription>
              </CardHeader>
              <CardContent className="text-center py-12">
                <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Analytics Dashboard</h3>
                <p className="text-muted-foreground mb-4">
                  Advanced charts and performance analytics coming soon
                </p>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Dashboard</CardTitle>
                <CardDescription>Monitor security status and compliance</CardDescription>
              </CardHeader>
              <CardContent className="text-center py-12">
                <Shield className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">All Systems Secure</h3>
                <p className="text-muted-foreground mb-4">
                  SOC2 compliant with enterprise-grade security monitoring
                </p>
                <div className="flex justify-center gap-2">
                  <Badge variant="outline">SOC2 Certified</Badge>
                  <Badge variant="outline">99.9% Uptime</Badge>
                  <Badge variant="outline">Zero Threats</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Dashboard Settings</CardTitle>
                <CardDescription>Configure your dashboard preferences</CardDescription>
              </CardHeader>
              <CardContent className="text-center py-12">
                <Settings className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Customization Options</h3>
                <p className="text-muted-foreground mb-4">
                  Personalize your dashboard layout and preferences
                </p>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modal Components */}
        <AnimatePresence>
          {showSearch && (
            <DashboardSearch onClose={() => setShowSearch(false)} />
          )}
          {showNotifications && (
            <NotificationCenter onClose={() => setShowNotifications(false)} />
          )}
          {showWizard && (
            <QuickSetupWizard onClose={() => setShowWizard(false)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
