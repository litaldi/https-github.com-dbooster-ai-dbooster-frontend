
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Activity, 
  BarChart3, 
  Bell, 
  Brain, 
  Eye, 
  Search, 
  Settings, 
  TrendingUp,
  Database,
  Zap,
  Shield
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { MetricsGrid } from './MetricsGrid';
import { RealTimeChart } from './RealTimeChart';
import { SystemHealthOverview } from './SystemHealthOverview';
import { QuickActions } from './QuickActions';
import { DashboardSearch } from './DashboardSearch';
import { NotificationCenter } from './NotificationCenter';
import { QuickSetupWizard } from './QuickSetupWizard';
import { AnalyticsTabContent, SecurityTabContent, SettingsTabContent } from './DashboardTabContent';

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
  const [activeTab, setActiveTab] = useState('overview');
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock metrics data
  const metrics: DashboardMetrics = {
    totalQueries: 12847,
    optimizedQueries: 9634,
    avgImprovement: 42.7,
    monthlySavings: 3240,
    activeConnections: 156,
    uptime: 99.94,
    securityScore: 94.2,
    responseTime: 127,
    criticalIssues: 0,
    pendingOptimizations: 23
  };

  const handleRefreshData = async () => {
    setIsLoading(true);
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
  };

  return (
    <div className="space-y-8 min-h-screen">
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">Real-Time Dashboard</h1>
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
              : 'AI-powered database optimization insights and real-time monitoring'
            }
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span>{metrics.avgImprovement}% avg improvement</span>
            </div>
            <div className="flex items-center gap-1">
              <Database className="h-4 w-4 text-blue-600" />
              <span>{metrics.activeConnections} active connections</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="h-4 w-4 text-purple-600" />
              <span>{metrics.securityScore}% security score</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowSearch(true)}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowNotifications(true)}>
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button variant="outline" size="sm" onClick={handleRefreshData}>
              <Activity className="h-4 w-4 mr-2" />
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
          <Button size="lg" className="bg-gradient-to-r from-primary to-blue-600">
            <Brain className="h-4 w-4 mr-2" />
            AI Studio
          </Button>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <MetricsGrid metrics={metrics} isLoading={isLoading} />

      {/* System Health Overview */}
      <SystemHealthOverview metrics={metrics} />

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
          <TabsTrigger value="security" className="flex flex-col gap-1 min-h-[44px]">
            <Shield className="h-4 w-4" />
            <span className="text-xs">Security</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex flex-col gap-1 min-h-[44px]">
            <Settings className="h-4 w-4" />
            <span className="text-xs">Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Real-Time Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RealTimeChart />
              </CardContent>
            </Card>
          </div>
          
          <QuickActions onShowWizard={() => setShowWizard(true)} />
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsTabContent />
        </TabsContent>

        <TabsContent value="security">
          <SecurityTabContent />
        </TabsContent>

        <TabsContent value="settings">
          <SettingsTabContent />
        </TabsContent>
      </Tabs>

      {/* Modals */}
      {showSearch && <DashboardSearch onClose={() => setShowSearch(false)} />}
      {showNotifications && <NotificationCenter onClose={() => setShowNotifications(false)} />}
      {showWizard && <QuickSetupWizard onClose={() => setShowWizard(false)} />}
    </div>
  );
}
