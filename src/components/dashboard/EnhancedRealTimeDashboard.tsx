
import React, { useState, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, BarChart3, Shield, Settings, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { RealTimeChart } from './RealTimeChart';
import { DashboardSearch } from './DashboardSearch';
import { NotificationCenter } from './NotificationCenter';
import { QuickSetupWizard } from './QuickSetupWizard';
import { DashboardHeader } from './DashboardHeader';
import { MetricsGrid } from './MetricsGrid';
import { SystemHealthOverview } from './SystemHealthOverview';
import { QuickActions } from './QuickActions';
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Enhanced Header */}
        <DashboardHeader
          user={user}
          isDemo={isDemo}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          onShowSearch={() => setShowSearch(true)}
          onShowNotifications={() => setShowNotifications(true)}
        />

        {/* Real-Time Metrics Grid */}
        <MetricsGrid metrics={metrics} isLoading={isLoading} />

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
            <SystemHealthOverview metrics={metrics} />

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
