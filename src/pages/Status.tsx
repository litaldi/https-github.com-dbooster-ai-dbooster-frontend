
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Activity, 
  Server, 
  Database, 
  Globe,
  Clock
} from 'lucide-react';
import { FadeIn, ScaleIn } from '@/components/ui/animations';

const systemStatus = {
  overall: 'operational',
  services: [
    {
      name: 'API Gateway',
      status: 'operational',
      uptime: 99.98,
      responseTime: '245ms',
      icon: Server
    },
    {
      name: 'Database Optimization Engine',
      status: 'operational',
      uptime: 99.95,
      responseTime: '180ms',
      icon: Database
    },
    {
      name: 'AI Query Analyzer',
      status: 'operational',
      uptime: 99.92,
      responseTime: '320ms',
      icon: Activity
    },
    {
      name: 'Web Application',
      status: 'operational',
      uptime: 99.97,
      responseTime: '150ms',
      icon: Globe
    }
  ],
  incidents: [
    {
      title: 'Database Connection Pool Optimization',
      status: 'resolved',
      date: '2024-01-10',
      duration: '15 minutes',
      description: 'Temporary slowdown in query processing resolved by optimizing connection pool settings.'
    },
    {
      title: 'Scheduled Maintenance - AI Model Update',
      status: 'completed',
      date: '2024-01-05',
      duration: '30 minutes',
      description: 'Successfully deployed improved AI optimization algorithms with 15% better performance.'
    }
  ]
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'operational': return 'text-green-600';
    case 'degraded': return 'text-yellow-600';
    case 'outage': return 'text-red-600';
    default: return 'text-gray-600';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'operational': return CheckCircle;
    case 'degraded': return AlertTriangle;
    case 'outage': return XCircle;
    default: return CheckCircle;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'operational': return { variant: 'default' as const, text: 'Operational' };
    case 'degraded': return { variant: 'secondary' as const, text: 'Degraded' };
    case 'outage': return { variant: 'destructive' as const, text: 'Outage' };
    default: return { variant: 'outline' as const, text: 'Unknown' };
  }
};

export default function Status() {
  const OverallStatusIcon = getStatusIcon(systemStatus.overall);
  const overallBadge = getStatusBadge(systemStatus.overall);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4 py-12">
        <FadeIn>
          <div className="text-center mb-12">
            <ScaleIn>
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Activity className="w-8 h-8 text-primary" />
              </div>
            </ScaleIn>
            <h1 className="text-4xl font-bold mb-4">System Status</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real-time status and performance metrics for all DBooster services.
            </p>
          </div>
        </FadeIn>

        <div className="max-w-4xl mx-auto space-y-8">
          <FadeIn delay={0.2}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-3">
                      <OverallStatusIcon className={`w-6 h-6 ${getStatusColor(systemStatus.overall)}`} />
                      Overall System Status
                    </CardTitle>
                    <CardDescription>
                      All systems are currently operational
                    </CardDescription>
                  </div>
                  <Badge {...overallBadge}>
                    {overallBadge.text}
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          </FadeIn>

          <FadeIn delay={0.3}>
            <Card>
              <CardHeader>
                <CardTitle>Service Status</CardTitle>
                <CardDescription>
                  Current status and performance metrics for all services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {systemStatus.services.map((service, index) => {
                  const Icon = service.icon;
                  const StatusIcon = getStatusIcon(service.status);
                  const badge = getStatusBadge(service.status);
                  
                  return (
                    <div key={service.name} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Icon className="w-8 h-8 text-muted-foreground" />
                        <div>
                          <h3 className="font-semibold">{service.name}</h3>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span>Uptime: {service.uptime}%</span>
                            <span>Response: {service.responseTime}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <Progress value={service.uptime} className="w-24 h-2 mb-1" />
                          <span className="text-xs text-muted-foreground">{service.uptime}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusIcon className={`w-5 h-5 ${getStatusColor(service.status)}`} />
                          <Badge {...badge} className="text-xs">
                            {badge.text}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </FadeIn>

          <FadeIn delay={0.4}>
            <Card>
              <CardHeader>
                <CardTitle>Recent Incidents</CardTitle>
                <CardDescription>
                  Latest incidents and maintenance activities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {systemStatus.incidents.map((incident, index) => (
                  <div key={index} className="flex items-start gap-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{incident.title}</h3>
                        <Badge variant="outline" className="text-xs">
                          {incident.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {incident.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Duration: {incident.duration}
                        </span>
                        <span>Date: {incident.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
