
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  TrendingUp, 
  Shield, 
  Activity, 
  Eye, 
  Database, 
  Zap, 
  BarChart3,
  Users,
  Settings,
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardMetrics {
  totalQueries: number;
  optimizedQueries: number;
  avgImprovement: number;
  activeConnections: number;
  systemHealth: number;
  securityScore: number;
}

export function OptimizedDashboardLayout() {
  const { user, isDemo } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);

  // Mock metrics data
  const metrics: DashboardMetrics = {
    totalQueries: 12847,
    optimizedQueries: 9634,
    avgImprovement: 42.7,
    activeConnections: 156,
    systemHealth: 94.2,
    securityScore: 98.5
  };

  const handleRefreshData = async () => {
    setIsLoading(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  const MetricCard = ({ title, value, icon: Icon, color }: { 
    title: string; 
    value: string | number; 
    icon: React.ComponentType<any>; 
    color: string; 
  }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            {isDemo && (
              <Badge variant="secondary" className="animate-pulse">
                <Eye className="h-3 w-3 mr-1" />
                Demo Mode
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-lg">
            {isDemo 
              ? 'Explore enterprise-grade features with interactive demos'
              : 'Welcome back! Here\'s your database optimization overview.'
            }
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleRefreshData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button asChild className="bg-gradient-to-r from-primary to-blue-600">
            <Link to="/app/ai-studio">
              <Brain className="h-4 w-4 mr-2" />
              AI Studio
            </Link>
          </Button>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <MetricCard
          title="Total Queries"
          value={metrics.totalQueries.toLocaleString()}
          icon={Database}
          color="text-blue-600"
        />
        <MetricCard
          title="Optimized"
          value={`${Math.round((metrics.optimizedQueries / metrics.totalQueries) * 100)}%`}
          icon={TrendingUp}
          color="text-green-600"
        />
        <MetricCard
          title="Avg Improvement"
          value={`${metrics.avgImprovement}%`}
          icon={Zap}
          color="text-yellow-600"
        />
        <MetricCard
          title="Active Connections"
          value={metrics.activeConnections}
          icon={Activity}
          color="text-purple-600"
        />
        <MetricCard
          title="System Health"
          value={`${metrics.systemHealth}%`}
          icon={Shield}
          color="text-green-600"
        />
        <MetricCard
          title="Security Score"
          value={`${metrics.securityScore}%`}
          icon={Shield}
          color="text-blue-600"
        />
      </motion.div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 h-auto p-1">
          <TabsTrigger value="overview" className="flex flex-col gap-1 min-h-[44px]">
            <Activity className="h-4 w-4" />
            <span className="text-xs">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex flex-col gap-1 min-h-[44px]">
            <BarChart3 className="h-4 w-4" />
            <span className="text-xs">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="queries" className="flex flex-col gap-1 min-h-[44px]">
            <Database className="h-4 w-4" />
            <span className="text-xs">Queries</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex flex-col gap-1 min-h-[44px]">
            <Settings className="h-4 w-4" />
            <span className="text-xs">Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button asChild variant="outline" className="h-20 flex-col">
                  <Link to="/app/queries">
                    <Database className="h-6 w-6 mb-2" />
                    Manage Queries
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-20 flex-col">
                  <Link to="/app/analytics">
                    <BarChart3 className="h-6 w-6 mb-2" />
                    View Analytics
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-20 flex-col">
                  <Link to="/app/repositories">
                    <Users className="h-6 w-6 mb-2" />
                    Repositories
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center py-12"
          >
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Analytics Dashboard</h3>
            <p className="text-muted-foreground mb-4">
              Detailed performance analytics and insights
            </p>
            <Button asChild>
              <Link to="/app/analytics">View Full Analytics</Link>
            </Button>
          </motion.div>
        </TabsContent>

        <TabsContent value="queries" className="space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center py-12"
          >
            <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Query Management</h3>
            <p className="text-muted-foreground mb-4">
              Optimize and manage your database queries
            </p>
            <Button asChild>
              <Link to="/app/queries">Manage Queries</Link>
            </Button>
          </motion.div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center py-12"
          >
            <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Dashboard Settings</h3>
            <p className="text-muted-foreground mb-4">
              Customize your dashboard experience
            </p>
            <Button asChild>
              <Link to="/app/settings">Open Settings</Link>
            </Button>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
