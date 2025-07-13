
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  AlertTriangle, 
  Activity, 
  Server, 
  Database, 
  Shield,
  Wifi,
  HardDrive
} from 'lucide-react';

interface SystemHealthProps {
  metrics: {
    uptime: number;
    activeConnections: number;
    securityScore: number;
    criticalIssues: number;
  };
}

export function SystemHealthOverview({ metrics }: SystemHealthProps) {
  const healthItems = [
    {
      name: 'Database',
      status: 'operational',
      icon: Database,
      details: `${metrics.activeConnections} active connections`
    },
    {
      name: 'API Server',
      status: 'operational',
      icon: Server,
      details: `${metrics.uptime}% uptime`
    },
    {
      name: 'Security',
      status: metrics.securityScore > 90 ? 'operational' : 'warning',
      icon: Shield,
      details: `${metrics.securityScore}% secure`
    },
    {
      name: 'Network',
      status: 'operational',
      icon: Wifi,
      details: 'All regions active'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const overallHealth = healthItems.every(item => item.status === 'operational') ? 
    'All Systems Operational' : 'Some Issues Detected';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            System Health
          </CardTitle>
          <Badge 
            variant={overallHealth === 'All Systems Operational' ? 'default' : 'destructive'}
            className="text-xs"
          >
            {overallHealth}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {healthItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.name}
                className={`p-4 rounded-lg border ${getStatusColor(item.status)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span className="font-medium text-sm">{item.name}</span>
                  </div>
                  {getStatusIcon(item.status)}
                </div>
                <p className="text-xs opacity-75">{item.details}</p>
              </div>
            );
          })}
        </div>

        {metrics.criticalIssues > 0 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">
                {metrics.criticalIssues} Critical Issue{metrics.criticalIssues > 1 ? 's' : ''} Detected
              </span>
            </div>
          </div>
        )}

        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Performance</span>
            <span>{metrics.uptime}%</span>
          </div>
          <Progress value={metrics.uptime} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
