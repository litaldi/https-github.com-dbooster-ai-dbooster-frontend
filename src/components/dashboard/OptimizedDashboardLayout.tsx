
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  TrendingUp, 
  Shield, 
  Activity, 
  Eye, 
  Database, 
  Zap, 
  Settings,
  HelpCircle,
  Bell,
  Search,
  BarChart3,
  Users,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function OptimizedDashboardLayout() {
  const { user, isDemo, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const metrics = [
    {
      title: 'Queries Analyzed',
      value: isDemo ? '15,234' : '1,247',
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: Database,
      color: 'blue'
    },
    {
      title: 'Performance Boost',
      value: '73%',
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'green'
    },
    {
      title: 'Cost Savings',
      value: isDemo ? '$28,400' : '$2,100',
      change: '+15.3%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'purple'
    },
    {
      title: 'Active Connections',
      value: isDemo ? '156' : '23',
      change: '+2.1%',
      changeType: 'positive' as const,
      icon: Activity,
      color: 'orange'
    }
  ];

  const recentQueries = [
    {
      id: 1,
      query: 'SELECT * FROM users WHERE status = "active"',
      status: 'optimized',
      improvement: '45%',
      timestamp: '2 minutes ago'
    },
    {
      id: 2,
      query: 'SELECT COUNT(*) FROM orders WHERE date > NOW()',
      status: 'analyzing',
      improvement: null,
      timestamp: '5 minutes ago'
    },
    {
      id: 3,
      query: 'UPDATE inventory SET quantity = quantity - 1',
      status: 'optimized',
      improvement: '62%',
      timestamp: '8 minutes ago'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10">
      {/* Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-primary" />
                <span className="font-bold text-xl">DBooster</span>
                {isDemo && (
                  <Badge variant="secondary" className="animate-pulse">
                    <Eye className="h-3 w-3 mr-1" />
                    Demo Mode
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  {user?.email}
                </span>
                <Button variant="outline" size="sm" onClick={signOut}>
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">
                Welcome back{isDemo ? ' to the Demo' : ''}!
              </h1>
              <p className="text-muted-foreground text-lg mt-2">
                {isDemo 
                  ? 'Explore enterprise-grade features with interactive demos'
                  : 'Your database optimization workspace'
                }
              </p>
              <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span>94% performance score</span>
                </div>
                <div className="flex items-center gap-1">
                  <Database className="h-4 w-4 text-blue-600" />
                  <span>{isDemo ? '156' : '23'} active connections</span>
                </div>
                <div className="flex items-center gap-1">
                  <Shield className="h-4 w-4 text-purple-600" />
                  <span>All systems secure</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline">
                <Activity className="h-4 w-4 mr-2" />
                Refresh Data
              </Button>
              <Button asChild className="bg-gradient-to-r from-primary to-blue-600">
                <Link to="/app/ai-studio">
                  <Brain className="h-4 w-4 mr-2" />
                  AI Studio
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          {metric.title}
                        </p>
                        <p className="text-2xl font-bold mt-2">{metric.value}</p>
                        <p className="text-sm text-green-600 mt-1">
                          {metric.change} from last month
                        </p>
                      </div>
                      <div className={`p-3 rounded-full bg-${metric.color}-100 dark:bg-${metric.color}-900/20`}>
                        <Icon className={`h-6 w-6 text-${metric.color}-600`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-auto p-1">
            <TabsTrigger value="overview" className="flex flex-col gap-1 min-h-[60px]">
              <Activity className="h-4 w-4" />
              <span className="text-xs">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="queries" className="flex flex-col gap-1 min-h-[60px]">
              <Database className="h-4 w-4" />
              <span className="text-xs">Queries</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex flex-col gap-1 min-h-[60px]">
              <BarChart3 className="h-4 w-4" />
              <span className="text-xs">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex flex-col gap-1 min-h-[60px]">
              <Settings className="h-4 w-4" />
              <span className="text-xs">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Queries */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Recent Query Analysis
                  </CardTitle>
                  <CardDescription>
                    Latest database queries and their optimization status
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentQueries.map((query) => (
                    <div key={query.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-mono truncate">{query.query}</p>
                        <p className="text-xs text-muted-foreground mt-1">{query.timestamp}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        {query.status === 'optimized' ? (
                          <>
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              +{query.improvement}
                            </Badge>
                          </>
                        ) : (
                          <Badge variant="secondary">
                            <Clock className="h-3 w-3 mr-1" />
                            Analyzing
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Performance Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Performance Overview
                  </CardTitle>
                  <CardDescription>
                    System performance metrics and health status
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Query Response Time</span>
                        <span className="text-green-600">-73% avg</span>
                      </div>
                      <Progress value={73} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Database Load</span>
                        <span className="text-blue-600">42% utilization</span>
                      </div>
                      <Progress value={42} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Cache Hit Rate</span>
                        <span className="text-purple-600">96% efficiency</span>
                      </div>
                      <Progress value={96} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="queries" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Query Management</CardTitle>
                <CardDescription>
                  Manage and optimize your database queries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Query Analysis Engine</h3>
                  <p className="text-muted-foreground mb-4">
                    Upload SQL files or connect your repository to start analyzing queries
                  </p>
                  <Button>
                    <Database className="h-4 w-4 mr-2" />
                    Analyze Queries
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>
                  Detailed performance analytics and reporting
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Advanced Analytics</h3>
                  <p className="text-muted-foreground mb-4">
                    Comprehensive performance charts and optimization recommendations
                  </p>
                  <Button>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dashboard Settings</CardTitle>
                <CardDescription>
                  Configure your dashboard preferences and account settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Configuration Panel</h3>
                  <p className="text-muted-foreground mb-4">
                    Customize your dashboard experience and manage account preferences
                  </p>
                  <Button>
                    <Settings className="h-4 w-4 mr-2" />
                    Open Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
