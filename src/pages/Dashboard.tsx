
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-context';
import { AlertCircle, CheckCircle, Clock, Database, GitBranch, Plus, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Total Queries',
      value: '2,847',
      change: '+12%',
      icon: Database,
      color: 'text-blue-600',
    },
    {
      title: 'Pending Approvals',
      value: '24',
      change: '+5%',
      icon: Clock,
      color: 'text-yellow-600',
    },
    {
      title: 'Error Alerts',
      value: '3',
      change: '-50%',
      icon: AlertCircle,
      color: 'text-red-600',
    },
    {
      title: 'Time Saved',
      value: '47.2h',
      change: '+23%',
      icon: TrendingUp,
      color: 'text-green-600',
    },
  ];

  const recentImprovements = [
    {
      id: 1,
      query: 'SELECT * FROM users WHERE status = active',
      file: 'user-service.ts',
      improvement: 'Added index on status column',
      timeSaved: '2.3s',
      status: 'approved',
    },
    {
      id: 2,
      query: 'JOIN query on orders table',
      file: 'order-controller.js',
      improvement: 'Optimized JOIN order',
      timeSaved: '1.8s',
      status: 'pending',
    },
    {
      id: 3,
      query: 'COUNT query with GROUP BY',
      file: 'analytics.py',
      improvement: 'Added covering index',
      timeSaved: '4.1s',
      status: 'approved',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}!</h1>
          <p className="text-muted-foreground">
            Here's what's happening with your database optimizations today.
          </p>
        </div>
        <Button asChild>
          <Link to="/repositories">
            <Plus className="w-4 h-4 mr-2" />
            Add Repository
          </Link>
        </Button>
      </div>

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
                <span className="text-green-600">{stat.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Repository Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="w-5 h-5" />
            Repository Status
          </CardTitle>
          <CardDescription>
            Current status of your connected repositories
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">my-awesome-app</p>
                <p className="text-sm text-muted-foreground">Connected • Last scan: 2 hours ago</p>
              </div>
            </div>
            <Badge variant="secondary">Active</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Recent Improvements */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Improvements</CardTitle>
            <CardDescription>
              Latest query optimizations and their performance impact
            </CardDescription>
          </div>
          <Button variant="outline" asChild>
            <Link to="/queries">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  );
}
