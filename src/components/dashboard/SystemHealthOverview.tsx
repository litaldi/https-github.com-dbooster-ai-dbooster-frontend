
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface SystemHealthOverviewProps {
  metrics: any;
}

export function SystemHealthOverview({ metrics }: SystemHealthOverviewProps) {
  const healthItems = [
    {
      name: 'Database Performance',
      status: 'healthy',
      value: metrics?.uptime || 99.5,
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      name: 'Security Status',
      status: 'healthy',
      value: metrics?.securityScore || 98,
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      name: 'Active Connections',
      status: 'warning',
      value: 85,
      icon: AlertTriangle,
      color: 'text-yellow-600'
    },
    {
      name: 'Response Time',
      status: 'healthy',
      value: 95,
      icon: CheckCircle,
      color: 'text-green-600'
    }
  ];

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          System Health Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {healthItems.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <item.icon className={`h-4 w-4 ${item.color}`} />
              <span className="font-medium">{item.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <Progress value={item.value} className="w-20" />
              <span className="text-sm text-muted-foreground">
                {item.value}%
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
