
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  AlertCircle, 
  XCircle, 
  Clock, 
  TrendingUp,
  Database,
  Globe,
  Shield,
  Zap
} from 'lucide-react';

export default function Status() {
  const services = [
    {
      name: 'API Services',
      status: 'operational',
      uptime: '99.99%',
      responseTime: '45ms',
      icon: Globe
    },
    {
      name: 'Database Optimization',
      status: 'operational',
      uptime: '99.98%',
      responseTime: '120ms',
      icon: Database
    },
    {
      name: 'AI Query Analysis',
      status: 'operational',
      uptime: '99.97%',
      responseTime: '200ms',
      icon: Zap
    },
    {
      name: 'Security Services',
      status: 'operational',
      uptime: '100%',
      responseTime: '30ms',
      icon: Shield
    },
    {
      name: 'Dashboard & UI',
      status: 'operational',
      uptime: '99.99%',
      responseTime: '85ms',
      icon: TrendingUp
    }
  ];

  const incidents = [
    {
      date: '2024-01-15',
      title: 'Brief API Latency Increase',
      status: 'resolved',
      duration: '15 minutes',
      description: 'Temporary increase in API response times due to database maintenance.'
    },
    {
      date: '2024-01-10',
      title: 'Scheduled Maintenance',
      status: 'completed',
      duration: '2 hours',
      description: 'Planned infrastructure upgrade to improve performance and reliability.'
    },
    {
      date: '2024-01-05',
      title: 'Dashboard Display Issues',
      status: 'resolved',
      duration: '45 minutes',
      description: 'Some users experienced slow loading times on the main dashboard.'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'degraded':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'outage':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'operational':
        return <Badge className="bg-green-500">Operational</Badge>;
      case 'degraded':
        return <Badge className="bg-yellow-500">Degraded</Badge>;
      case 'outage':
        return <Badge className="bg-red-500">Outage</Badge>;
      case 'resolved':
        return <Badge variant="outline">Resolved</Badge>;
      case 'completed':
        return <Badge variant="secondary">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            System Status
          </h1>
          <p className="text-xl text-muted-foreground">
            Real-time status of DBooster services and infrastructure
          </p>
        </div>

        {/* Overall Status */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <CardTitle className="text-2xl">All Systems Operational</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              All services are running normally. Last updated: {new Date().toLocaleString()}
            </p>
          </CardContent>
        </Card>

        {/* Services Status */}
        <div className="grid gap-4 mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Service Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {services.map((service, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <service.icon className="h-6 w-6 text-muted-foreground" />
                    <div>
                      <h3 className="font-medium">{service.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Uptime: {service.uptime}</span>
                        <span>Response: {service.responseTime}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(service.status)}
                    {getStatusBadge(service.status)}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Incidents */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Recent Incidents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {incidents.map((incident, index) => (
              <div key={index} className="border-l-4 border-l-muted pl-4 py-2">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-medium">{incident.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {incident.date} • Duration: {incident.duration}
                    </p>
                  </div>
                  {getStatusBadge(incident.status)}
                </div>
                <p className="text-sm text-muted-foreground">{incident.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">99.99%</h3>
              <p className="text-muted-foreground">Average Uptime</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Zap className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">84ms</h3>
              <p className="text-muted-foreground">Average Response Time</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">0</h3>
              <p className="text-muted-foreground">Active Incidents</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
