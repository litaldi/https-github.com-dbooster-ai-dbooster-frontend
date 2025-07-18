
import React from 'react';
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Clock,
  Activity,
  Database,
  Cloud,
  Shield,
  Zap,
  Calendar
} from 'lucide-react';

const systemStatus = [
  {
    name: "API Services",
    status: "operational",
    uptime: "99.98%",
    icon: <Zap className="h-6 w-6" />,
    description: "Core API endpoints and optimization services"
  },
  {
    name: "Database Connections",
    status: "operational", 
    uptime: "99.95%",
    icon: <Database className="h-6 w-6" />,
    description: "Database connectivity and query analysis"
  },
  {
    name: "Cloud Infrastructure",
    status: "operational",
    uptime: "99.99%",
    icon: <Cloud className="h-6 w-6" />,
    description: "AWS, GCP, and Azure cloud services"
  },
  {
    name: "Security Services",
    status: "operational",
    uptime: "100%",
    icon: <Shield className="h-6 w-6" />,
    description: "Authentication and security monitoring"
  },
  {
    name: "Monitoring & Alerts",
    status: "operational",
    uptime: "99.97%",
    icon: <Activity className="h-6 w-6" />,
    description: "Performance monitoring and alert systems"
  }
];

const incidents = [
  {
    date: "January 15, 2025",
    title: "Brief API Latency Increase",
    status: "resolved",
    duration: "23 minutes",
    description: "Temporary increase in API response times due to high traffic volume. Resolved by scaling infrastructure.",
    impact: "Low"
  },
  {
    date: "January 8, 2025",
    title: "Scheduled Maintenance",
    status: "completed",
    duration: "2 hours",
    description: "Planned infrastructure upgrades and security patches. All services remained available with brief interruptions.",
    impact: "Minimal"
  },
  {
    date: "December 28, 2024",
    title: "Database Connection Issues",
    status: "resolved",
    duration: "45 minutes",
    description: "Some users experienced connection timeouts to PostgreSQL databases. Fixed connection pooling configuration.",
    impact: "Medium"
  }
];

const upcomingMaintenance = [
  {
    date: "January 20, 2025",
    time: "02:00 - 04:00 UTC",
    title: "Infrastructure Security Updates",
    description: "Applying security patches to core infrastructure. Brief service interruptions expected.",
    impact: "Low"
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'operational':
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case 'degraded':
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case 'outage':
      return <XCircle className="h-5 w-5 text-red-500" />;
    default:
      return <Clock className="h-5 w-5 text-gray-500" />;
  }
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'operational':
      return <Badge className="bg-green-100 text-green-800 border-green-200">Operational</Badge>;
    case 'degraded':
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Degraded</Badge>;
    case 'outage':
      return <Badge className="bg-red-100 text-red-800 border-red-200">Outage</Badge>;
    case 'resolved':
      return <Badge className="bg-green-100 text-green-800 border-green-200">Resolved</Badge>;
    case 'completed':
      return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Completed</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function StatusPage() {
  const allOperational = systemStatus.every(service => service.status === 'operational');

  return (
    <StandardPageLayout
      title="System Status"
      subtitle="Real-Time Service Health"
      description="Monitor the current status of DBooster's services and infrastructure in real-time."
    >
      <div className="space-y-16">
        {/* Overall Status */}
        <section className={`p-8 rounded-2xl text-center ${
          allOperational 
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200' 
            : 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200'
        }`}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-sm">
              {allOperational ? (
                <CheckCircle2 className="h-10 w-10 text-green-500" />
              ) : (
                <AlertTriangle className="h-10 w-10 text-yellow-500" />
              )}
            </div>
            <h2 className="text-3xl font-bold mb-2">
              {allOperational ? 'All Systems Operational' : 'Some Systems Degraded'}
            </h2>
            <p className="text-lg text-muted-foreground">
              {allOperational 
                ? 'All DBooster services are running normally' 
                : 'Some services are experiencing issues. Check individual components below.'}
            </p>
          </motion.div>
        </section>

        {/* System Components */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">System Components</h2>
            <p className="text-xl text-muted-foreground">
              Current status of all DBooster services and infrastructure
            </p>
          </div>
          
          <div className="space-y-4">
            {systemStatus.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center">
                          {service.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{service.name}</h3>
                          <p className="text-muted-foreground text-sm">{service.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-sm text-muted-foreground">Uptime</div>
                          <div className="font-medium">{service.uptime}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(service.status)}
                          {getStatusBadge(service.status)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Recent Incidents */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Recent Incidents</h2>
            <p className="text-xl text-muted-foreground">
              History of recent service incidents and their resolution
            </p>
          </div>
          
          <div className="space-y-6">
            {incidents.map((incident, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg mb-2">{incident.title}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {incident.date}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Duration: {incident.duration}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={incident.impact === 'Low' ? 'outline' : incident.impact === 'Medium' ? 'secondary' : 'destructive'}>
                          {incident.impact} Impact
                        </Badge>
                        {getStatusBadge(incident.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{incident.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Upcoming Maintenance */}
        <section className="bg-muted/30 p-12 rounded-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Scheduled Maintenance</h2>
            <p className="text-xl text-muted-foreground">
              Planned maintenance windows and system updates
            </p>
          </div>
          
          {upcomingMaintenance.length > 0 ? (
            <div className="space-y-4">
              {upcomingMaintenance.map((maintenance, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Card>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg mb-2">{maintenance.title}</CardTitle>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {maintenance.date}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {maintenance.time}
                            </div>
                          </div>
                        </div>
                        <Badge variant="outline">
                          {maintenance.impact} Impact
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{maintenance.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center">
              <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-green-500" />
              <h3 className="text-xl font-semibold mb-2">No Scheduled Maintenance</h3>
              <p className="text-muted-foreground">
                There are currently no planned maintenance windows scheduled.
              </p>
            </div>
          )}
        </section>
      </div>
    </StandardPageLayout>
  );
}
