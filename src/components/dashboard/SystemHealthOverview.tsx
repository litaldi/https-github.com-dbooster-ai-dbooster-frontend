
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertTriangle, Clock, Database, Server, Shield } from 'lucide-react';

interface SystemHealthOverviewProps {
  metrics?: {
    uptime: number;
    securityScore: number;
    responseTime: number;
    criticalIssues: number;
    activeConnections: number;
  };
}

export function SystemHealthOverview({ metrics }: SystemHealthOverviewProps) {
  const healthMetrics = [
    {
      name: 'Database Performance',
      status: 'excellent',
      value: 94,
      icon: Database,
      description: 'Query response times are optimal'
    },
    {
      name: 'Server Health',
      status: 'good',
      value: 87,
      icon: Server,
      description: 'All services running smoothly'
    },
    {
      name: 'Security Status',
      status: 'excellent',
      value: metrics?.securityScore || 98,
      icon: Shield,
      description: 'No security threats detected'
    },
    {
      name: 'System Uptime',
      status: 'excellent',
      value: Math.floor((metrics?.uptime || 99.95) * 100) / 100,
      icon: CheckCircle,
      description: `${metrics?.uptime?.toFixed(2) || '99.95'}% uptime this month`
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-500';
      case 'good': return 'bg-blue-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const overallHealth = Math.round(
    healthMetrics.reduce((sum, metric) => sum + metric.value, 0) / healthMetrics.length
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Overall Health Status */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Overall Health
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">{overallHealth}%</div>
            <Badge className="bg-green-100 text-green-800">Excellent</Badge>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Performance Score</span>
              <span className="font-medium">{overallHealth}/100</span>
            </div>
            <Progress value={overallHealth} className="h-2" />
          </div>
          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Details */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>System Health Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {healthMetrics.map((metric) => (
              <div key={metric.name} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <metric.icon className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{metric.name}</div>
                    <div className="text-sm text-muted-foreground">{metric.description}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-bold">{metric.value}%</div>
                    <Badge variant="outline" className={getStatusColor(metric.status)}>
                      {metric.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
