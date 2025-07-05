
import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  TrendingUp, 
  Shield,
  Activity,
  Rocket,
  Eye,
  Database,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { RealTimeQueryOptimizer } from '@/components/ai/RealTimeQueryOptimizer';
import { EnhancedConnectionWizard } from '@/components/database/EnhancedConnectionWizard';
import { FadeIn } from '@/components/ui/animations';
import { EnhancedQuickActions } from '@/components/dashboard/EnhancedQuickActions';
import { RealTimeMetricsDashboard } from '@/components/dashboard/RealTimeMetricsDashboard';
import { DashboardOverviewTab } from '@/components/dashboard/DashboardOverviewTab';
import { PageTitle, SectionTitle } from '@/components/ui/typography';
import { StandardizedButton } from '@/components/ui/standardized-button';
import { ResponsiveGrid, StandardCard } from '@/components/ui/responsive-grid';
import { StreamlinedOnboarding } from '@/components/onboarding/StreamlinedOnboarding';

export default function EnhancedDashboard() {
  const { user, isDemo } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showOnboarding, setShowOnboarding] = useState(!user || isDemo);

  // Show onboarding for new users or demo users
  if (showOnboarding && !user?.email?.includes('@')) {
    return (
      <div className="container mx-auto px-4 py-8">
        <StreamlinedOnboarding />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header with better copy */}
      <FadeIn>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <PageTitle>
                Welcome to DBooster
              </PageTitle>
              {isDemo && (
                <Badge variant="secondary" className="animate-pulse">
                  <Eye className="h-3 w-3 mr-1" />
                  Demo Mode
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-lg">
              {isDemo 
                ? 'Explore enterprise-grade database optimization with sample data'
                : 'Your AI-powered database optimization command center'
              }
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span>73% avg query improvement</span>
              </div>
              <div className="flex items-center gap-1">
                <Database className="h-4 w-4 text-blue-600" />
                <span>60% cost reduction</span>
              </div>
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4 text-purple-600" />
                <span>Enterprise secure</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <Badge variant="secondary" className="animate-pulse">
              <Activity className="h-3 w-3 mr-1" />
              Real-time monitoring active
            </Badge>
            <StandardizedButton asChild size="lg" className="bg-gradient-to-r from-primary to-blue-600">
              <Link to="/ai-studio">
                <Rocket className="h-4 w-4 mr-2" />
                Launch AI Studio
              </Link>
            </StandardizedButton>
          </div>
        </div>
      </FadeIn>

      {/* Real-time Metrics with enhanced messaging */}
      <FadeIn delay={0.1}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <SectionTitle>Performance Overview</SectionTitle>
            <Badge variant="outline" className="text-xs">
              Updated every 30 seconds
            </Badge>
          </div>
          <RealTimeMetricsDashboard />
        </div>
      </FadeIn>

      {/* Quick Actions with improved copy */}
      <FadeIn delay={0.2}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <SectionTitle>Quick Actions</SectionTitle>
            <p className="text-sm text-muted-foreground">
              {isDemo ? 'Try these features with sample data' : 'Optimize your database in minutes'}
            </p>
          </div>
          <EnhancedQuickActions />
        </div>
      </FadeIn>

      {/* Enhanced Tabs with better navigation */}
      <FadeIn delay={0.3}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto p-1">
            <TabsTrigger value="overview" className="min-h-[44px] flex flex-col gap-1">
              <span>Overview</span>
              <span className="text-xs opacity-70">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="optimizer" className="min-h-[44px] flex flex-col gap-1">
              <span>AI Optimizer</span>
              <span className="text-xs opacity-70">Query tuning</span>
            </TabsTrigger>
            <TabsTrigger value="connections" className="min-h-[44px] flex flex-col gap-1">
              <span>Connections</span>
              <span className="text-xs opacity-70">Database setup</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="min-h-[44px] flex flex-col gap-1">
              <span>Analytics</span>
              <span className="text-xs opacity-70">Insights</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="min-h-[44px] flex flex-col gap-1">
              <span>Security</span>
              <span className="text-xs opacity-70">Monitoring</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <DashboardOverviewTab setActiveTab={setActiveTab} />
          </TabsContent>

          <TabsContent value="optimizer" className="space-y-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">AI Query Optimizer</h3>
              <p className="text-muted-foreground">
                {isDemo 
                  ? 'Experience how our AI optimizes queries with sample data - see 73% improvement potential'
                  : 'Paste your SQL queries below to get instant AI-powered optimization recommendations'
                }
              </p>
            </div>
            <RealTimeQueryOptimizer />
          </TabsContent>

          <TabsContent value="connections" className="space-y-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Database Connections</h3>
              <p className="text-muted-foreground">
                {isDemo 
                  ? 'Explore how to connect your production databases securely'
                  : 'Connect your databases to start optimizing. All connections are encrypted and SOC2 compliant'
                }
              </p>
            </div>
            <EnhancedConnectionWizard />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <StandardCard>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Performance Analytics
                </CardTitle>
                <CardDescription>
                  Deep insights into your database performance trends and optimization opportunities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Advanced Analytics Dashboard</h3>
                  <p className="text-muted-foreground mb-4">
                    {isDemo 
                      ? 'In the full version, you\'ll see detailed performance trends, optimization impact metrics, and predictive insights'
                      : 'Comprehensive performance analytics with predictive insights coming soon to your workspace'
                    }
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <StandardizedButton variant="outline">
                      <Activity className="h-4 w-4 mr-2" />
                      View Performance Trends
                    </StandardizedButton>
                    <StandardizedButton variant="outline">
                      <Brain className="h-4 w-4 mr-2" />
                      Generate Insights Report
                    </StandardizedButton>
                  </div>
                </div>
              </CardContent>
            </StandardCard>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <StandardCard>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Enterprise Security Dashboard
                </CardTitle>
                <CardDescription>
                  SOC2 compliant security monitoring with real-time threat detection and audit logging
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveGrid cols={{ default: 3 }} gap="md" className="mb-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">0</div>
                    <div className="text-sm text-green-700">Active Security Threats</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">15</div>
                    <div className="text-sm text-blue-700">Threats Blocked Today</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">99.9%</div>
                    <div className="text-sm text-purple-700">Security Score</div>
                  </div>
                </ResponsiveGrid>
                
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    Your database connections are secured with enterprise-grade encryption and monitoring
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Badge variant="outline">SOC2 Type II</Badge>
                    <Badge variant="outline">End-to-End Encryption</Badge>
                    <Badge variant="outline">Audit Logging</Badge>
                    <Badge variant="outline">24/7 Monitoring</Badge>
                  </div>
                </div>
              </CardContent>
            </StandardCard>
          </TabsContent>
        </Tabs>
      </FadeIn>
    </div>
  );
}
