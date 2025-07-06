
import React from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Database, 
  TrendingUp, 
  Clock, 
  Zap, 
  CheckCircle, 
  Activity,
  BarChart3,
  Settings,
  Eye,
  Brain,
  Shield,
  Users,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const { user, isDemo } = useAuth();

  // Demo data with realistic metrics
  const demoData = {
    totalQueries: 15234,
    optimizedQueries: 11876,
    avgImprovement: 73,
    responseTimeReduction: 2.4,
    costSavings: 28400,
    activeConnections: 12,
    threatsStopped: 156,
    uptime: 99.94
  };

  const realData = {
    totalQueries: 0,
    optimizedQueries: 0,
    avgImprovement: 0,
    responseTimeReduction: 0,
    costSavings: 0,
    activeConnections: 0,
    threatsStopped: 0,
    uptime: 0
  };

  const data = isDemo ? demoData : realData;

  const recentOptimizations = isDemo ? [
    { query: "SELECT * FROM users WHERE created_at > ?", improvement: "67%", time: "2 mins ago", status: "success" },
    { query: "UPDATE orders SET status = ? WHERE id IN (?)", improvement: "45%", time: "15 mins ago", status: "success" },
    { query: "SELECT COUNT(*) FROM products p JOIN categories c", improvement: "82%", time: "1 hour ago", status: "success" },
    { query: "DELETE FROM logs WHERE created_at < ?", improvement: "34%", time: "2 hours ago", status: "success" }
  ] : [];

  return (
    <div className="space-y-8 p-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            {isDemo && (
              <Badge variant="secondary" className="animate-pulse">
                <Eye className="h-3 w-3 mr-1" />
                Demo Mode
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-lg">
            {isDemo 
              ? `Welcome to DBooster! You're viewing sample data from a production environment.`
              : `Welcome back, ${user?.user_metadata?.full_name || user?.email || 'User'}! Here's your database performance overview.`
            }
          </p>
          {isDemo && (
            <p className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-lg inline-block">
              💡 This demo shows real optimization results from our enterprise customers
            </p>
          )}
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Button asChild size="lg" className="bg-gradient-to-r from-primary to-blue-600">
            <Link to="/app/ai-studio">
              <Brain className="h-4 w-4 mr-2" />
              AI Query Optimizer
            </Link>
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Queries</CardTitle>
            <Database className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{data.totalQueries.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground mt-1">Analyzed this month</p>
            {isDemo && (
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full -mr-12 -mt-12" />
            )}
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Optimized</CardTitle>
            <Zap className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{data.optimizedQueries.toLocaleString()}</div>
            <div className="flex items-center gap-2 mt-1">
              <Progress value={isDemo ? 78 : 0} className="flex-1 h-2" />
              <span className="text-sm text-muted-foreground">{isDemo ? '78%' : '0%'}</span>
            </div>
            {isDemo && (
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-500/10 to-transparent rounded-full -mr-12 -mt-12" />
            )}
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Improvement</CardTitle>
            <TrendingUp className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{data.avgImprovement}%</div>
            <p className="text-sm text-muted-foreground mt-1">Query response time</p>
            {isDemo && (
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full -mr-12 -mt-12" />
            )}
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cost Savings</CardTitle>
            <DollarSign className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">${data.costSavings.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground mt-1">This month</p>
            {isDemo && (
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full -mr-12 -mt-12" />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1">
          <TabsTrigger value="overview" className="min-h-[44px] flex flex-col gap-1">
            <Activity className="h-4 w-4" />
            <span className="text-xs">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="optimizations" className="min-h-[44px] flex flex-col gap-1">
            <Zap className="h-4 w-4" />
            <span className="text-xs">Recent</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="min-h-[44px] flex flex-col gap-1">
            <BarChart3 className="h-4 w-4" />
            <span className="text-xs">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="min-h-[44px] flex flex-col gap-1">
            <Shield className="h-4 w-4" />
            <span className="text-xs">Security</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Performance Overview */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Performance Overview
                </CardTitle>
                <CardDescription>
                  {isDemo ? 'Real-time performance metrics from your optimized queries' : 'Connect your database to see performance insights'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isDemo ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{data.responseTimeReduction}s</div>
                        <div className="text-sm text-green-700">Avg Time Saved</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{data.uptime}%</div>
                        <div className="text-sm text-blue-700">System Uptime</div>
                      </div>
                    </div>
                    <div className="h-32 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg flex items-center justify-center">
                      <p className="text-muted-foreground">📊 Performance charts would appear here</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Connect Your Database</h3>
                    <p className="text-muted-foreground mb-4">
                      Start optimizing by connecting your first database
                    </p>
                    <Button asChild>
                      <Link to="/app/settings">
                        <Settings className="h-4 w-4 mr-2" />
                        Connect Database
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-purple-600" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  {isDemo ? 'Try these features with sample data' : 'Common optimization tasks'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link to="/app/ai-studio">
                    <Brain className="mr-2 h-4 w-4" />
                    AI Query Optimizer
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link to="/app/analytics">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Performance Analytics
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link to="/app/monitoring">
                    <Activity className="mr-2 h-4 w-4" />
                    Real-time Monitor
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link to="/app/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Database Settings
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="optimizations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Recent Optimizations
              </CardTitle>
              <CardDescription>
                {isDemo ? 'Latest AI-powered query improvements' : 'No optimizations yet - connect a database to get started'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentOptimizations.length > 0 ? (
                <div className="space-y-4">
                  {recentOptimizations.map((opt, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{opt.query}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {opt.time}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-green-700 bg-green-100">
                        +{opt.improvement}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Optimizations Yet</h3>
                  <p className="text-muted-foreground">
                    Connect your database and run queries to see optimizations here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Query Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">📈 Performance charts coming soon</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Cost Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground">💰 Cost analysis charts coming soon</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Security Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">99.9%</div>
                <p className="text-xs text-muted-foreground">All systems secure</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Threats Blocked</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.threatsStopped}</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Active Connections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.activeConnections}</div>
                <p className="text-xs text-muted-foreground">Secured databases</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
