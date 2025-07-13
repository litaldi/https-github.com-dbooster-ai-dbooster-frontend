
import React from 'react';
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Activity, 
  Brain, 
  Play, 
  ArrowRight,
  CheckCircle2,
  Database,
  BarChart3,
  Shield,
  Users,
  Clock,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

const productFeatures = [
  {
    title: "Features & Capabilities",
    description: "Comprehensive AI-powered database optimization tools and analytics for maximum performance.",
    icon: <Zap className="h-8 w-8 text-blue-600" />,
    href: "/features",
    highlights: [
      "AI-powered query optimization",
      "Real-time performance monitoring", 
      "Automated index recommendations",
      "Query execution plan analysis"
    ]
  },
  {
    title: "How It Works",
    description: "Simple 4-step process to connect, analyze, optimize, and monitor your database performance.",
    icon: <Activity className="h-8 w-8 text-green-600" />,
    href: "/how-it-works",
    highlights: [
      "Connect your database in seconds",
      "AI analyzes query patterns",
      "Get optimization recommendations",
      "Monitor improvements in real-time"
    ]
  },
  {
    title: "AI Studio",
    description: "Interactive AI-powered workspace for advanced query optimization and database tuning.",
    icon: <Brain className="h-8 w-8 text-purple-600" />,
    href: "/ai-studio",
    highlights: [
      "Advanced AI model training",
      "Custom optimization rules",
      "Interactive query playground",
      "Machine learning insights"
    ],
    badge: "New"
  },
  {
    title: "Demo Mode",
    description: "Try DBooster with sample data and see the optimization power in action without setup.",
    icon: <Play className="h-8 w-8 text-orange-600" />,
    href: "/demo",
    highlights: [
      "No signup required",
      "Sample database included",
      "Full feature access",
      "Instant optimization results"
    ]
  }
];

const keyMetrics = [
  {
    metric: "75%",
    label: "Performance Boost",
    description: "Average query performance improvement",
    icon: <TrendingUp className="h-6 w-6 text-green-500" />
  },
  {
    metric: "50,000+",
    label: "Developers",
    description: "Trust DBooster for optimization",
    icon: <Users className="h-6 w-6 text-blue-500" />
  },
  {
    metric: "2.5M+",
    label: "Queries Optimized",
    description: "Successfully improved queries",
    icon: <Database className="h-6 w-6 text-purple-500" />
  },
  {
    metric: "<5min",
    label: "Setup Time",
    description: "From connection to first insights",
    icon: <Clock className="h-6 w-6 text-orange-500" />
  }
];

const technicalCapabilities = [
  "Support for PostgreSQL, MySQL, MongoDB, SQL Server, Oracle",
  "Advanced query execution plan analysis",
  "Real-time performance monitoring and alerting", 
  "Automated index and schema optimization suggestions",
  "Integration with popular development tools",
  "Enterprise-grade security and compliance (SOC2 Type II)",
  "Custom AI model training for specific use cases",
  "REST API and webhook integrations"
];

export default function ProductPage() {
  return (
    <StandardPageLayout
      title="AI-Powered Database Optimization"
      subtitle="The Complete Platform"
      description="Discover how DBooster's comprehensive suite of tools can transform your database performance with intelligent automation and real-time insights."
    >
      <div className="space-y-20">
        {/* Key Metrics */}
        <section className="text-center">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {keyMetrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-muted to-muted/50 rounded-xl flex items-center justify-center">
                  {metric.icon}
                </div>
                <div className="text-3xl font-bold text-primary mb-2">{metric.metric}</div>
                <div className="text-lg font-semibold mb-1">{metric.label}</div>
                <div className="text-sm text-muted-foreground">{metric.description}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Product Features */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Product Suite</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to optimize, monitor, and maintain peak database performance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {productFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 group">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-muted to-muted/50 rounded-xl group-hover:scale-105 transition-transform">
                          {feature.icon}
                        </div>
                        <div>
                          <CardTitle className="text-xl">{feature.title}</CardTitle>
                          {feature.badge && (
                            <Badge variant="secondary" className="mt-2">
                              {feature.badge}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {feature.highlights.map((highlight, highlightIndex) => (
                        <li key={highlightIndex} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                    <Button asChild className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Link to={feature.href}>
                        Explore Feature
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Technical Capabilities */}
        <section className="bg-muted/30 p-12 rounded-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Technical Capabilities</h2>
            <p className="text-xl text-muted-foreground">
              Built for developers, trusted by enterprises
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {technicalCapabilities.map((capability, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-3"
              >
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm">{capability}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary/5 to-blue-500/5 p-12 rounded-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Optimize?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Start optimizing your database performance today with our AI-powered platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="px-8">
                <Link to="/demo">
                  Try Demo Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8">
                <Link to="/features">View All Features</Link>
              </Button>
            </div>
          </motion.div>
        </section>
      </div>
    </StandardPageLayout>
  );
}
