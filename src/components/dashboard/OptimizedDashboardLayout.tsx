
import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OptimizedMetricCard } from './OptimizedMetricCard';
import { 
  Database, 
  Zap, 
  TrendingUp, 
  DollarSign,
  Activity,
  CheckCircle,
  Shield,
  Bell,
  RefreshCw,
  BarChart3,
  Brain
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardData {
  totalQueries: number;
  optimized: number;
  avgImprovement: number;
  monthlySavings: number;
  uptime: number;
  securityScore: number;
}

export function OptimizedDashboardLayout() {
  const { user, isDemo } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Memoized data to prevent unnecessary re-renders
  const dashboardData: DashboardData = useMemo(() => ({
    totalQueries: 15234,
    optimized: 12847,
    avgImprovement: 73,
    monthlySavings: 28400,
    uptime: 99.97,
    securityScore: 100
  }), []);

  const metricsData = useMemo(() => [
    {
      title: "Total Queries",
      value: dashboardData.totalQueries.toLocaleString(),
      change: "+12.5%",
      trend: "up" as const,
      icon: Database,
      description: "Queries analyzed this month",
      color: "blue" as const,
      progress: 85,
      priority: "primary" as const
    },
    {
      title: "Performance Gain",
      value: `${dashboardData.avgImprovement}%`,
      change: "+8.2%",
      trend: "up" as const,  
      icon: Zap,
      description: "Average response time improvement",
      color: "green" as const,
      progress: 73
    },
    {
      title: "Cost Savings",
      value: `$${dashboardData.monthlySavings.toLocaleString()}`,
      change: "+23%",
      trend: "up" as const,
      icon: DollarSign,
      description: "Monthly infrastructure savings",
      color: "purple" as const,
      progress: 78
    },
    {
      title: "System Uptime",
      value: `${dashboardData.uptime}%`,
      change: "stable",
      trend: "neutral" as const,
      icon: Activity,
      description: "Service availability",
      color: "orange" as const,
      progress: 99
    }
  ], [dashboardData]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  }, []);

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Demo User';

  return (
    <div className="min-h-screen bg-background">
      <div className="space-system-xl max-w-7xl mx-auto">
        {/* Optimized Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-system-md"
        >
          <div className="flex flex-col lg:flex-row lg:items-start justify-between space-system-lg">
            <div className="space-system-sm">
              <div className="flex items-center space-system-sm">
                <h1 className="text-display-md">Dashboard</h1>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-200">
                  <CheckCircle className="h-3 w-3 mr-1" aria-hidden="true" />
                  Online
                </Badge>
              </div>
              
              <p className="text-body-lg text-muted-foreground max-w-2xl">
                Welcome back, <span className="font-semibold text-foreground">{userName}</span>. 
                Monitor your database performance with AI-powered insights.
              </p>
              
              <div className="flex flex-wrap items-center space-system-md text-body-sm">
                <StatusIndicator icon={TrendingUp} label="94% performance" color="green" />
                <StatusIndicator icon={Database} label="156 connections" color="blue" />
                <StatusIndicator icon={Shield} label="All secure" color="purple" />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-system-sm">
              <Button 
                variant="outline" 
                size="lg" 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="enhanced-focus touch-target"
                aria-label="Refresh dashboard data"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-blue-600 enhanced-focus touch-target" 
                asChild
              >
                <Link to="/app/ai-studio">
                  <Brain className="h-4 w-4 mr-2" />
                  AI Studio
                </Link>
              </Button>
            </div>
          </div>
        </motion.header>

        {/* Metrics Grid */}
        <section aria-labelledby="metrics-heading" className="space-system-md">
          <h2 id="metrics-heading" className="sr-only">Performance Metrics</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {metricsData.map((metric, index) => (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <OptimizedMetricCard {...metric} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Enhanced Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-system-lg">
          <TabsList className="grid w-full grid-cols-3 h-auto p-1">
            <TabsTrigger 
              value="overview" 
              className="flex flex-col space-system-xs py-3 enhanced-focus touch-target"
            >
              <Activity className="h-4 w-4" aria-hidden="true" />
              <span className="text-caption">Overview</span>
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="flex flex-col space-system-xs py-3 enhanced-focus touch-target"
            >
              <BarChart3 className="h-4 w-4" aria-hidden="true" />
              <span className="text-caption">Analytics</span>
            </TabsTrigger>
            <TabsTrigger 
              value="system" 
              className="flex flex-col space-system-xs py-3 enhanced-focus touch-target"
            >
              <Shield className="h-4 w-4" aria-hidden="true" />
              <span className="text-caption">System</span>
            </TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            <TabsContent value="overview" key="overview">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-system-lg"
              >
                <OverviewContent />
              </motion.div>
            </TabsContent>

            <TabsContent value="analytics" key="analytics">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center py-12"
              >
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-display-sm mb-2">Advanced Analytics</h3>
                <p className="text-body-base text-muted-foreground">
                  Detailed performance insights and optimization recommendations
                </p>
              </motion.div>
            </TabsContent>

            <TabsContent value="system" key="system">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <SystemHealthCard uptime={dashboardData.uptime} securityScore={dashboardData.securityScore} />
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </div>
    </div>
  );
}

// Helper Components
function StatusIndicator({ icon: Icon, label, color }: { 
  icon: React.ComponentType<{ className?: string }>, 
  label: string, 
  color: string 
}) {
  const colorMap = {
    green: 'bg-green-50 border-green-200 text-green-800',
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    purple: 'bg-purple-50 border-purple-200 text-purple-800'
  };

  return (
    <div className={`flex items-center space-system-xs px-3 py-1.5 rounded-full border ${colorMap[color as keyof typeof colorMap]}`}>
      <Icon className="h-4 w-4" aria-hidden="true" />
      <span className="font-medium">{label}</span>
    </div>
  );
}

function OverviewContent() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center space-system-xs">
            <Activity className="h-5 w-5 text-primary" />
            <span>Recent Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-system-sm">
          <ActivityItem 
            type="success" 
            message="3 queries optimized automatically" 
            time="2 minutes ago"
          />
          <ActivityItem 
            type="info" 
            message="Database backup completed" 
            time="15 minutes ago"
          />
          <ActivityItem 
            type="success" 
            message="Performance threshold maintained" 
            time="1 hour ago"
          />
        </CardContent>
      </Card>

      <QuickActionsCard />
    </div>
  );
}

function ActivityItem({ type, message, time }: { type: string, message: string, time: string }) {
  const colorMap = {
    success: 'bg-green-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500'
  };

  return (
    <div className="flex items-start space-system-sm p-3 rounded-lg bg-muted/30">
      <div className={`w-2 h-2 rounded-full mt-2 ${colorMap[type as keyof typeof colorMap]}`} />
      <div className="flex-1 min-w-0">
        <p className="text-body-sm text-foreground">{message}</p>
        <p className="text-caption text-muted-foreground">{time}</p>
      </div>
    </div>
  );
}

function QuickActionsCard() {
  const actions = [
    { label: 'Query Manager', href: '/app/queries', icon: Database },
    { label: 'Monitoring', href: '/app/monitoring', icon: Activity },
    { label: 'Reports', href: '/app/reports', icon: BarChart3 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-system-xs">
          <Zap className="h-5 w-5 text-primary" />
          <span>Quick Actions</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-system-sm">
        {actions.map((action) => (
          <Button
            key={action.label}
            variant="ghost"
            className="w-full justify-start enhanced-focus touch-target"
            asChild
          >
            <Link to={action.href}>
              <action.icon className="h-4 w-4 mr-3" />
              {action.label}
            </Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}

function SystemHealthCard({ uptime, securityScore }: { uptime: number, securityScore: number }) {
  return (
    <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100/50">
      <CardHeader>
        <CardTitle className="flex items-center space-system-xs text-emerald-800">
          <Shield className="h-5 w-5 text-emerald-600" />
          <span>System Health</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-system-lg">
        <div className="grid gap-4 md:grid-cols-2">
          <HealthMetric label="Security Score" value={`${securityScore}%`} />
          <HealthMetric label="System Uptime" value={`${uptime}%`} />
        </div>
        <div className="flex items-center space-system-xs text-emerald-700 pt-4 border-t border-emerald-200">
          <CheckCircle className="h-4 w-4" />
          <span className="text-body-sm font-medium">All systems operational</span>
        </div>
      </CardContent>
    </Card>
  );
}

function HealthMetric({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg bg-white/60">
      <span className="text-body-sm font-medium text-emerald-700">{label}</span>
      <Badge className="bg-emerald-600">{value}</Badge>
    </div>
  );
}
