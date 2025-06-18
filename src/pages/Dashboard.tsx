
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { QuickStartGuide } from '@/components/onboarding/QuickStartGuide';
import { QueryHistory } from '@/components/queries/QueryHistory';
import { FeedbackButton } from '@/components/feedback/FeedbackButton';
import { KeyboardShortcutsHelper } from '@/components/layout/KeyboardShortcutsHelper';
import { LoadingState, SkeletonCard } from '@/components/ui/enhanced-loading-states';
import { useSystemStatus } from '@/hooks/useSystemStatus';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { 
  Database, 
  Zap, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Activity
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { RealTimeMetrics } from '@/components/dashboard/RealTimeMetrics';
import { DatabaseStatus } from '@/components/dashboard/DatabaseStatus';
import { QueryAnalytics } from '@/components/dashboard/QueryAnalytics';
import { EnhancedErrorBoundary } from '@/components/ui/enhanced-error-boundary';
import { VisualQueryBuilder } from '@/components/query/VisualQueryBuilder';
import { PerformanceMonitor } from '@/components/performance/PerformanceMonitor';
import { UniversalSearch } from '@/components/search/UniversalSearch';
import { NotificationCenter, useNotifications } from '@/components/notifications/SmartNotifications';
import { TourMenu, useTour } from '@/components/onboarding/InteractiveTour';
import { EnhancedMetrics } from '@/components/dashboard/EnhancedMetrics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Quick Actions Component
function QuickActions() {
  const { addNotification } = useNotifications();
  const { startTour } = useTour();

  const actions = [
    {
      title: 'Connect Database',
      description: 'Enterprise database integration',
      icon: Database,
      onClick: () => addNotification({
        type: 'info',
        title: 'Database Connection',
        message: 'Opening enterprise database connection wizard...'
      })
    },
    {
      title: 'AI Query Optimization',
      description: '73% faster query performance',
      icon: Zap,
      onClick: () => addNotification({
        type: 'info',
        title: 'AI Optimization',
        message: 'Starting enterprise AI query analysis...'
      })
    },
    {
      title: 'Performance Report',
      description: 'Generate executive summary',
      icon: BarChart3,
      onClick: () => addNotification({
        type: 'success',
        title: 'Report Generated',
        message: 'Enterprise performance report ready for download.'
      })
    },
    {
      title: 'Interactive Tour',
      description: 'Learn enterprise features',
      icon: Activity,
      onClick: () => startTour('basic')
    }
  ];

  return (
    <div data-tour="quick-actions" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action, index) => {
        const Icon = action.icon;
        return (
          <Card key={index} className="cursor-pointer hover:shadow-md transition-all hover:scale-105">
            <CardContent className="p-4 text-center" onClick={action.onClick}>
              <Icon className="h-8 w-8 mx-auto mb-2 text-primary" />
              <h3 className="font-medium text-sm">{action.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export default function Dashboard() {
  const { user, isDemo } = useAuth();
  const { status, overallStatus } = useSystemStatus();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);

  // Initialize keyboard shortcuts
  useKeyboardShortcuts();

  useEffect(() => {
    // Simulate loading dashboard data
    const loadDashboardData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock dashboard data with enterprise focus
      setDashboardData({
        totalDatabases: isDemo ? 12 : 0,
        totalQueries: isDemo ? 1247 : 0,
        avgPerformance: isDemo ? 73 : 0,
        optimizedQueries: isDemo ? 415 : 0,
        activeTeamMembers: isDemo ? 24 : 1,
        costSavings: isDemo ? 62450 : 0
      });
      setIsLoading(false);
    };

    loadDashboardData();
  }, [isDemo]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-48"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-32"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        
        <LoadingState message="Loading your enterprise dashboard..." variant="database" />
      </div>
    );
  }

  return (
    <EnhancedErrorBoundary>
      <div className="space-y-6">
        {/* Header with Search and Notifications */}
        <div className="flex items-center justify-between">
          <div data-tour="dashboard">
            <h1 className="text-3xl font-bold tracking-tight">Enterprise Dashboard</h1>
            <p className="text-muted-foreground">
              AI-powered database optimization center - reducing query times by 73%
            </p>
          </div>
          <div className="flex items-center gap-3">
            <UniversalSearch />
            <NotificationCenter />
          </div>
        </div>

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
