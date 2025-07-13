
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Activity,
  Database,
  Globe,
  Shield,
  Zap
} from 'lucide-react';

const systemStatus = [
  {
    name: "API Services",
    status: "operational",
    uptime: "99.99%",
    icon: <Zap className="h-5 w-5" />
  },
  {
    name: "Database Optimization Engine", 
    status: "operational",
    uptime: "99.97%",
    icon: <Database className="h-5 w-5" />
  },
  {
    name: "Web Dashboard",
    status: "operational", 
    uptime: "99.98%",
    icon: <Globe className="h-5 w-5" />
  },
  {
    name: "Authentication Services",
    status: "operational",
    uptime: "99.99%",
    icon: <Shield className="h-5 w-5" />
  }
];

const incidents = [
  {
    date: "Dec 15, 2024",
    title: "Brief API Slowdown",
    status: "resolved",
    duration: "12 minutes",
    description: "Temporary performance degradation resolved by scaling infrastructure."
  },
  {
    date: "Dec 8, 2024",
    title: "Scheduled Maintenance",
    status: "completed",
    duration: "2 hours",
    description: "Planned database optimization engine updates completed successfully."
  },
  {
    date: "Nov 28, 2024",
    title: "Dashboard Load Issues",
    status: "resolved", 
    duration: "45 minutes",
    description: "High traffic caused dashboard loading delays, resolved with CDN optimization."
  }
];

const metrics = [
  { label: "Overall Uptime", value: "99.98%", period: "Last 30 days" },
  { label: "Average Response Time", value: "145ms", period: "API endpoints" },
  { label: "Active Monitoring", value: "24/7", period: "All systems" },
  { label: "Incident Response", value: "<5min", period: "Detection to action" }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'operational': return 'text-green-600';
    case 'degraded': return 'text-yellow-600';  
    case 'outage': return 'text-red-600';
    case 'resolved': return 'text-green-600';
    case 'completed': return 'text-blue-600';
    default: return 'text-gray-600';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'operational':
    case 'resolved':
    case 'completed':
      return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    case 'degraded':
      return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    case 'outage':
      return <AlertCircle className="h-4 w-4 text-red-600" />;
    default:
      return <Clock className="h-4 w-4 text-gray-600" />;
  }
};

export default function StatusPage() {
  return (
    <StandardPageLayout
      title="System Status"
      subtitle="Real-time Service Monitoring"
      description="Monitor the operational status of all DBooster services and infrastructure in real-time."
    >
      <div className="space-y-16">
        {/* Overall Status */}
        <section className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-6 py-3 mb-4">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-800">All Systems Operational</span>
            </div>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleString()} UTC
            </p>
          </motion.div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-2xl font-bold text-primary">
                      {metric.value}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center pt-0">
                    <p className="font-medium text-sm">{metric.label}</p>
                    <p className="text-xs text-muted-foreground">{metric.period}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Service Status */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Service Status</h2>
            <p className="text-muted-foreground">
              Current operational status of all DBooster services
            </p>
          </div>

          <div className="space-y-4">
            {systemStatus.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="flex items-center justify-between p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                        {service.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold">{service.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          {getStatusIcon(service.status)}
                          <span className={`text-sm font-medium capitalize ${getStatusColor(service.status)}`}>
                            {service.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">{service.uptime}</div>
                      <div className="text-sm text-muted-foreground">30-day uptime</div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Recent Incidents */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Recent Incidents</h2>
            <p className="text-muted-foreground">
              Past incidents and their resolutions
            </p>
          </div>

          <div className="space-y-4">
            {incidents.map((incident, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(incident.status)}
                        <div>
                          <CardTitle className="text-lg">{incident.title}</CardTitle>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span>{incident.date}</span>
                            <span>Duration: {incident.duration}</span>
                          </div>
                        </div>
                      </div>
                      <Badge 
                        variant={incident.status === 'resolved' || incident.status === 'completed' ? 'secondary' : 'destructive'}
                        className="capitalize"
                      >
                        {incident.status}
                      </Badge>
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

        {/* Subscribe to Updates */}
        <section className="bg-muted/30 p-8 rounded-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Activity className="h-12 w-12 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-4">Stay Informed</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Subscribe to status updates and be the first to know about any service interruptions or maintenance windows.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                Subscribe
              </button>
            </div>
          </motion.div>
        </section>
      </div>
    </StandardPageLayout>
  );
}
