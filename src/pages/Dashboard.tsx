
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-context';
import { AlertCircle, CheckCircle, Clock, Database, GitBranch, Plus, TrendingUp, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { repositoryService } from '@/services/repository';
import { queryService } from '@/services/query';

export default function Dashboard() {
  const { user, githubAccessToken } = useAuth();

  // Fetch repositories and queries data
  const { data: repositories = [] } = useQuery({
    queryKey: ['repositories'],
    queryFn: repositoryService.getRepositories,
    enabled: !!user
  });

  const { data: queries = [] } = useQuery({
    queryKey: ['queries'],
    queryFn: () => queryService.getQueries(),
    enabled: !!user
  });

  // Extract name from user metadata or email
  const userName = user?.user_metadata?.full_name || 
                   user?.user_metadata?.name || 
                   user?.email?.split('@')[0] || 
                   'User';

  const isGitHubConnected = !!githubAccessToken;
  const githubUsername = user?.user_metadata?.user_name || user?.user_metadata?.preferred_username;

  // Calculate stats from real data
  const totalQueries = queries.length;
  const pendingApprovals = queries.filter(q => q.status === 'optimized').length;
  const errorAlerts = repositories.filter(r => r.scan_status === 'error').length;
  const totalTimeSaved = queries.reduce((sum, q) => sum + (q.time_saved_ms || 0), 0);
  const timeSavedHours = (totalTimeSaved / (1000 * 60 * 60)).toFixed(1);

  const stats = [
    {
      title: 'Total Queries',
      value: isGitHubConnected ? totalQueries.toString() : '0',
      change: isGitHubConnected ? '+12%' : 'N/A',
      icon: Database,
      color: 'text-blue-600',
    },
    {
      title: 'Pending Approvals',
      value: isGitHubConnected ? pendingApprovals.toString() : '0',
      change: isGitHubConnected ? '+5%' : 'N/A',
      icon: Clock,
      color: 'text-yellow-600',
    },
    {
      title: 'Error Alerts',
      value: isGitHubConnected ? errorAlerts.toString() : '0',
      change: isGitHubConnected ? '-50%' : 'N/A',
      icon: AlertCircle,
      color: 'text-red-600',
    },
    {
      title: 'Time Saved',
      value: isGitHubConnected ? `${timeSavedHours}h` : '0h',
      change: isGitHubConnected ? '+23%' : 'N/A',
      icon: TrendingUp,
      color: 'text-green-600',
    },
  ];

  // Get recent improvements from queries
  const recentImprovements = queries
    .filter(q => q.optimization_suggestion)
    .slice(0, 3)
    .map(q => ({
      id: q.id,
      query: q.query_content.substring(0, 50) + '...',
      file: q.file_path,
      improvement: q.optimization_suggestion || 'No suggestion',
      timeSaved: q.time_saved_ms ? `${(q.time_saved_ms / 1000).toFixed(1)}s` : '0s',
      status: q.status === 'approved' ? 'approved' : 'pending',
    }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {userName}!</h1>
          <p className="text-muted-foreground">
            {isGitHubConnected 
              ? "Here's what's happening with your database optimizations today."
              : "Connect your GitHub repositories to start optimizing your database queries."
            }
          </p>
        </div>
        <Button asChild>
          <Link to="/repositories">
            <Plus className="w-4 h-4 mr-2" />
            {isGitHubConnected ? 'Add Repository' : 'Connect GitHub'}
          </Link>
        </Button>
      </div>

      {/* GitHub Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Github className="w-5 h-5" />
            GitHub Integration
          </CardTitle>
          <CardDescription>
            Your GitHub connection status and repository access
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                isGitHubConnected 
                  ? 'bg-green-100 dark:bg-green-900' 
                  : 'bg-gray-100 dark:bg-gray-800'
              }`}>
                {isGitHubConnected ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <Github className="w-5 h-5 text-gray-600" />
                )}
              </div>
              <div>
                <p className="font-medium">
                  {isGitHubConnected 
                    ? `Connected as ${githubUsername || 'GitHub User'}`
                    : 'GitHub Not Connected'
                  }
                </p>
                <p className="text-sm text-muted-foreground">
                  {isGitHubConnected 
                    ? `${repositories.length} repositories connected`
                    : 'Connect your GitHub account to start analyzing your code'
                  }
                </p>
              </div>
            </div>
            <Badge variant={isGitHubConnected ? 'default' : 'secondary'}>
              {isGitHubConnected ? 'Connected' : 'Disconnected'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={stat.change !== 'N/A' ? "text-green-600" : "text-gray-500"}>
                  {stat.change}
                </span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Improvements */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Improvements</CardTitle>
            <CardDescription>
              {isGitHubConnected 
                ? 'Latest query optimizations and their performance impact'
                : 'Query optimizations will appear here once you connect GitHub'
              }
            </CardDescription>
          </div>
          {isGitHubConnected && recentImprovements.length > 0 && (
            <Button variant="outline" asChild>
              <Link to="/queries">View All</Link>
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {isGitHubConnected && recentImprovements.length > 0 ? (
            <div className="space-y-4">
              {recentImprovements.map((improvement) => (
                <div key={improvement.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{improvement.query}</p>
                    <p className="text-sm text-muted-foreground">{improvement.file}</p>
                    <p className="text-sm text-blue-600">{improvement.improvement}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">+{improvement.timeSaved}</p>
                      <p className="text-xs text-muted-foreground">saved</p>
                    </div>
                    <Badge 
                      variant={improvement.status === 'approved' ? 'default' : 'secondary'}
                    >
                      {improvement.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Github className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {isGitHubConnected ? 'No Optimizations Yet' : 'No GitHub Connection'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {isGitHubConnected 
                  ? 'Scan your repositories to start finding optimization opportunities.'
                  : 'Connect your GitHub account to start analyzing database queries in your repositories.'
                }
              </p>
              <Button asChild>
                <Link to="/repositories">
                  <Github className="w-4 h-4 mr-2" />
                  {isGitHubConnected ? 'Scan Repositories' : 'Connect GitHub'}
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
