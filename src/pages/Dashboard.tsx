
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3, Database, GitBranch, TrendingUp, AlertTriangle, CheckCircle, Clock, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { demoData, isDemoMode } from '@/services/demo';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { isDemo } = useAuth();

  // Use demo data when in demo mode
  const repositories = isDemo ? demoData.repositories : [];
  const queries = isDemo ? demoData.queries : [];
  const improvements = isDemo ? demoData.improvements : [];
  const alerts = isDemo ? demoData.alerts : [];

  const stats = {
    totalRepositories: repositories.length,
    totalQueries: queries.length,
    optimizedQueries: queries.filter(q => q.status === 'optimized').length,
    totalTimeSaved: queries.reduce((sum, query) => sum + (query.time_saved_ms || 0), 0),
    criticalIssues: improvements.filter(i => i.severity === 'critical').length,
    securityAlerts: alerts.filter(a => a.type === 'security').length,
  };

  const formatTimeSaved = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    const seconds = ms / 1000;
    if (seconds < 60) return `${seconds.toFixed(1)}s`;
    const minutes = seconds / 60;
    return `${minutes.toFixed(1)}m`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'optimized':
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            <CheckCircle className="w-3 h-3 mr-1" />
            Optimized
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case 'review':
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Review
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Medium</Badge>;
      case 'low':
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge variant="outline">{severity}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            {isDemo 
              ? "Welcome to the DBooster demo! Explore AI-powered database optimization." 
              : "Monitor your database performance and optimization opportunities."}
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Repositories</CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRepositories}</div>
            <p className="text-xs text-muted-foreground">Connected repositories</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Queries Analyzed</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalQueries}</div>
            <p className="text-xs text-muted-foreground">
              {stats.optimizedQueries} optimized
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatTimeSaved(stats.totalTimeSaved)}</div>
            <p className="text-xs text-muted-foreground">Total optimization impact</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.criticalIssues}</div>
            <p className="text-xs text-muted-foreground">
              {stats.securityAlerts} security alerts
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Queries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Recent Query Analysis
            </CardTitle>
            <CardDescription>Latest database queries and their optimization status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {queries.slice(0, 5).map((query) => (
                <div key={query.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <code className="text-sm bg-muted px-2 py-1 rounded">{query.file_path}</code>
                      <span className="text-sm text-muted-foreground">:{query.line_number}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 truncate">
                      {query.query_content}
                    </p>
                    {query.time_saved_ms > 0 && (
                      <p className="text-sm text-green-600 font-medium mt-1">
                        Saved: {formatTimeSaved(query.time_saved_ms)}
                      </p>
                    )}
                  </div>
                  <div className="ml-4">
                    {getStatusBadge(query.status)}
                  </div>
                </div>
              ))}
              {queries.length === 0 && (
                <div className="text-center py-8">
                  <Database className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No queries analyzed yet</h3>
                  <p className="text-muted-foreground">
                    Connect a repository to start analyzing your database queries.
                  </p>
                </div>
              )}
              {queries.length > 0 && (
                <div className="pt-4">
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/queries">View All Queries</Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Security & Performance Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security & Performance Alerts
            </CardTitle>
            <CardDescription>Critical issues requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.slice(0, 5).map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg border">
                  <div className="mt-1">
                    {alert.type === 'security' && <Shield className="w-4 h-4 text-red-500" />}
                    {alert.type === 'performance' && <BarChart3 className="w-4 h-4 text-orange-500" />}
                    {alert.type === 'maintenance' && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">{alert.title}</h4>
                      {getSeverityBadge(alert.severity)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(alert.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
              {alerts.length === 0 && (
                <div className="text-center py-8">
                  <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No alerts</h3>
                  <p className="text-muted-foreground">
                    Your database is looking good! No critical issues detected.
                  </p>
                </div>
              )}
              {alerts.length > 0 && (
                <div className="pt-4">
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/reports">View All Alerts</Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            {isDemo 
              ? "Explore these demo features to see how DBooster can help optimize your database."
              : "Get started with database optimization"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Button variant="outline" asChild className="h-auto p-4">
              <Link to="/repositories" className="flex flex-col items-center gap-2">
                <GitBranch className="w-6 h-6" />
                <div className="text-center">
                  <div className="font-medium">Connect Repository</div>
                  <div className="text-sm text-muted-foreground">Start analyzing your code</div>
                </div>
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="h-auto p-4">
              <Link to="/queries" className="flex flex-col items-center gap-2">
                <Database className="w-6 h-6" />
                <div className="text-center">
                  <div className="font-medium">View Queries</div>
                  <div className="text-sm text-muted-foreground">Analyze database queries</div>
                </div>
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="h-auto p-4">
              <Link to="/sandbox" className="flex flex-col items-center gap-2">
                <BarChart3 className="w-6 h-6" />
                <div className="text-center">
                  <div className="font-medium">Test Optimizations</div>
                  <div className="text-sm text-muted-foreground">Safe testing environment</div>
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
