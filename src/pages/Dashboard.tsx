
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QuickStartGuide } from '@/components/onboarding/QuickStartGuide';
import { QueryHistory } from '@/components/queries/QueryHistory';
import { FeedbackButton } from '@/components/feedback/FeedbackButton';
import { useSystemStatus } from '@/hooks/useSystemStatus';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useDashboardData } from '@/hooks/useDashboardData';
import { 
  Database, 
  Zap, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Activity,
  Brain
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { RealTimeMetrics } from '@/components/dashboard/RealTimeMetrics';
import { DatabaseStatus } from '@/components/dashboard/DatabaseStatus';
import { QueryAnalytics } from '@/components/dashboard/QueryAnalytics';
import { EnhancedErrorBoundary } from '@/components/ui/enhanced-error-boundary';
import { VisualQueryBuilder } from '@/components/query/VisualQueryBuilder';
import { PerformanceMonitor } from '@/components/performance/PerformanceMonitor';
import { NotificationCenter, useNotifications } from '@/components/notifications/SmartNotifications';
import { TourMenu, useTour } from '@/components/onboarding/InteractiveTour';
import { EnhancedMetrics } from '@/components/dashboard/EnhancedMetrics';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { DashboardLoading } from '@/components/dashboard/DashboardLoading';

export default function Dashboard() {
  const { status, overallStatus } = useSystemStatus();
  const { isLoading, dashboardData } = useDashboardData();

  // Initialize keyboard shortcuts
  useKeyboardShortcuts();

  if (isLoading) {
    return <DashboardLoading />;
  }

  return (
    <EnhancedErrorBoundary>
      <div className="space-y-6">
        <DashboardHeader />

        {/* Enhanced Performance Metrics */}
        <EnhancedMetrics />

        {/* Quick Actions */}
        <QuickActions />
        
        {/* Enhanced Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="query-builder">AI Query Builder</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="help">Help & Tours</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <RealTimeMetrics />
            
            <div className="grid gap-6 lg:grid-cols-1">
              <DatabaseStatus />
              <QueryAnalytics />
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <PerformanceMonitor />
          </TabsContent>

          <TabsContent value="query-builder" className="space-y-6">
            <VisualQueryBuilder />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <QueryAnalytics />
              <DatabaseStatus />
            </div>
          </TabsContent>

          <TabsContent value="help" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Interactive Enterprise Tours</CardTitle>
                  <CardDescription>
                    Learn enterprise features with guided interactive tours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TourMenu />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Enterprise Quick Start</CardTitle>
                  <CardDescription>
                    Setup guide for enterprise database optimization
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <QuickStartGuide />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </EnhancedErrorBoundary>
  );
}
