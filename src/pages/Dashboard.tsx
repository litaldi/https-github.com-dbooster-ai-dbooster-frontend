
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { QuickStartGuide } from '@/components/onboarding/QuickStartGuide';
import { QuickActions } from '@/components/dashboard/QuickActions';
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
      
      // Mock dashboard data
      setDashboardData({
        totalDatabases: isDemo ? 3 : 0,
        totalQueries: isDemo ? 42 : 0,
        avgPerformance: isDemo ? 85 : 0,
        optimizedQueries: isDemo ? 18 : 0,
        activeTeamMembers: isDemo ? 5 : 1
      });
      setIsLoading(false);
    };

    loadDashboardData();
  }, [isDemo]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'degraded':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'offline':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'offline':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-24"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        
        <LoadingState message="Loading your dashboard..." variant="database" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back{user?.user_metadata?.name ? `, ${user.user_metadata.name}` : ''}! 👋
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your database optimization today.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* System Status */}
          <Badge className={getStatusColor(overallStatus)} variant="outline">
            {getStatusIcon(overallStatus)}
            System {overallStatus}
          </Badge>
          
          {isDemo && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Demo Mode
            </Badge>
          )}
          
          <KeyboardShortcutsHelper />
        </div>
      </div>

      {/* Quick Start Guide (for new users) */}
      {(!isDemo && dashboardData?.totalDatabases === 0) && <QuickStartGuide />}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Connected Databases</CardTitle>
            <Database className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.totalDatabases || 0}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData?.totalDatabases > 0 ? '+2 from last month' : 'Connect your first database'}
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Queries</CardTitle>
            <Zap className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.totalQueries || 0}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData?.totalQueries > 0 ? '+12% from last week' : 'No queries analyzed yet'}
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.avgPerformance || 0}%</div>
            <Progress value={dashboardData?.avgPerformance || 0} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              Performance score
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Members</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.activeTeamMembers || 1}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData?.activeTeamMembers > 1 ? 'Active collaborators' : 'Just you for now'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
        
        {/* Query History */}
        <div className="lg:col-span-1">
          <QueryHistory />
        </div>
      </div>

      {/* Performance Insights */}
      {isDemo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-green-600" />
              Performance Insights
            </CardTitle>
            <CardDescription>
              AI-powered recommendations to improve your database performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4 py-2">
                <h4 className="font-medium text-sm">Query Optimization Opportunity</h4>
                <p className="text-sm text-muted-foreground">
                  We found 3 queries that could benefit from indexing. Potential 40% performance improvement.
                </p>
                <Button variant="link" size="sm" className="p-0 h-auto text-blue-600">
                  View recommendations →
                </Button>
              </div>
              
              <div className="border-l-4 border-green-500 pl-4 py-2">
                <h4 className="font-medium text-sm">Schema Analysis Complete</h4>
                <p className="text-sm text-muted-foreground">
                  Your database schema looks healthy. No critical issues detected.
                </p>
                <Button variant="link" size="sm" className="p-0 h-auto text-green-600">
                  View full report →
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Floating Feedback Button */}
      <FeedbackButton />
    </div>
  );
}
