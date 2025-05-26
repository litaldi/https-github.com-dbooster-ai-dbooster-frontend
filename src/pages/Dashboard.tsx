
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3, GitBranch, Search, TrendingUp, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  // Mock data for dashboard - in a real app, this would come from your API
  const stats = {
    totalRepositories: 5,
    totalQueries: 147,
    optimizationsApplied: 23,
    timeSaved: 2840, // in milliseconds
  };

  const recentQueries = [
    {
      id: '1',
      repository_id: 'repo-1',
      file_path: 'src/services/user.js',
      line_number: 45,
      query_content: "SELECT * FROM users WHERE created_at > '2023-01-01'",
      status: 'optimized',
      optimization_suggestion: 'Add index on created_at column',
      performance_impact: '85% faster',
      time_saved_ms: 1200,
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-15T11:00:00Z'
    },
    {
      id: '2',
      repository_id: 'repo-1',
      file_path: 'src/controllers/order.py',
      line_number: 78,
      query_content: "SELECT COUNT(*) FROM orders WHERE status = 'pending'",
      status: 'review',
      optimization_suggestion: 'Replace COUNT(*) with EXISTS for better performance',
      performance_impact: '60% faster',
      time_saved_ms: 800,
      created_at: '2024-01-15T09:15:00Z',
      updated_at: '2024-01-15T09:45:00Z'
    },
    {
      id: '3',
      repository_id: 'repo-2',
      file_path: 'src/models/product.rb',
      line_number: 23,
      query_content: "SELECT p.*, c.name FROM products p JOIN categories c ON p.category_id = c.id",
      status: 'pending',
      optimization_suggestion: null,
      performance_impact: null,
      time_saved_ms: null,
      created_at: '2024-01-15T08:00:00Z',
      updated_at: '2024-01-15T08:00:00Z'
    }
  ];

  const recentRepositories = [
    { id: '1', name: 'my-awesome-app', language: 'JavaScript', queries_count: 45, optimizations_count: 12 },
    { id: '2', name: 'backend-service', language: 'Python', queries_count: 78, optimizations_count: 8 },
    { id: '3', name: 'mobile-api', language: 'Ruby', queries_count: 24, optimizations_count: 3 }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'optimized':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'review':
        return <Clock className="w-4 h-4 text-orange-600" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-blue-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimized':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'review':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'pending':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const totalTimeSaved = recentQueries.reduce((total, query) => {
    return total + (query.time_saved_ms || 0);
  }, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to DBooster. Monitor your database optimization progress.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.totalRepositories}</p>
                <p className="text-sm text-muted-foreground">Repositories</p>
              </div>
              <GitBranch className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.totalQueries}</p>
                <p className="text-sm text-muted-foreground">Queries Analyzed</p>
              </div>
              <Search className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.optimizationsApplied}</p>
                <p className="text-sm text-muted-foreground">Optimizations Applied</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{totalTimeSaved}ms</p>
                <p className="text-sm text-muted-foreground">Time Saved</p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Queries */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Queries</CardTitle>
            <CardDescription>Latest queries analyzed for optimization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentQueries.map((query) => (
                <div key={query.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(query.status)}
                      <p className="text-sm font-medium truncate">{query.file_path}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      Line {query.line_number}
                    </p>
                    <code className="text-xs bg-muted p-1 rounded block truncate">
                      {query.query_content}
                    </code>
                    {query.optimization_suggestion && (
                      <p className="text-xs text-muted-foreground mt-1">
                        💡 {query.optimization_suggestion}
                      </p>
                    )}
                  </div>
                  <div className="ml-4 flex flex-col items-end gap-1">
                    <Badge className={getStatusColor(query.status)}>
                      {query.status}
                    </Badge>
                    {query.performance_impact && (
                      <span className="text-xs text-green-600 font-medium">
                        {query.performance_impact}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                View All Queries
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Repositories */}
        <Card>
          <CardHeader>
            <CardTitle>Connected Repositories</CardTitle>
            <CardDescription>Your active repositories and their optimization status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRepositories.map((repo) => (
                <div key={repo.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{repo.name}</p>
                    <p className="text-sm text-muted-foreground">{repo.language}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{repo.queries_count} queries</p>
                    <p className="text-xs text-muted-foreground">
                      {repo.optimizations_count} optimized
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                Connect Repository
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
