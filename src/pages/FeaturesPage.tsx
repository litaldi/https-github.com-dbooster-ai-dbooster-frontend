
import React from 'react';
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Zap, 
  Shield, 
  BarChart3, 
  Database, 
  Clock, 
  Users, 
  Settings,
  Search,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: <Brain className="h-8 w-8 text-blue-600" />,
    title: "AI-Powered Query Optimization",
    description: "Advanced machine learning algorithms analyze your queries and provide intelligent optimization recommendations that reduce execution time by up to 73%.",
    badge: "AI-Powered",
    benefits: [
      "Automatic slow query detection",
      "Smart index recommendations", 
      "Query rewriting suggestions",
      "Performance impact predictions"
    ]
  },
  {
    icon: <Shield className="h-8 w-8 text-green-600" />,
    title: "Enterprise Security & Compliance",
    description: "SOC2 Type II certified platform with bank-grade encryption, comprehensive audit logging, and enterprise-ready security controls.",
    badge: "SOC2 Certified",
    benefits: [
      "End-to-end encryption",
      "Role-based access control",
      "Comprehensive audit trails",
      "GDPR & CCPA compliant"
    ]
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-purple-600" />,
    title: "Real-Time Performance Analytics",
    description: "Comprehensive monitoring dashboards with predictive analytics, anomaly detection, and automated alerting to prevent issues before they impact users.",
    badge: "Real-Time",
    benefits: [
      "Live performance monitoring",
      "Predictive anomaly detection",
      "Custom alert configurations",
      "Historical trend analysis"
    ]
  },
  {
    icon: <Database className="h-8 w-8 text-orange-600" />,
    title: "Universal Database Support",
    description: "Native support for PostgreSQL, MySQL, MongoDB, Oracle, SQL Server, and more. One platform for your entire database infrastructure.",
    badge: "Multi-DB",
    benefits: [
      "15+ database engines supported",
      "Cloud & on-premise compatibility",
      "Unified management interface",
      "Cross-database optimization"
    ]
  },
  {
    icon: <Search className="h-8 w-8 text-indigo-600" />,
    title: "Intelligent Query Builder",
    description: "Natural language query interface that converts plain English into optimized SQL, making database optimization accessible to everyone.",
    badge: "Natural Language",
    benefits: [
      "Plain English to SQL conversion",
      "Query validation and testing",
      "Performance estimation",
      "Collaborative query development"
    ]
  },
  {
    icon: <TrendingUp className="h-8 w-8 text-emerald-600" />,
    title: "Cost Optimization Engine",
    description: "Automatically identify and eliminate wasteful queries, optimize resource usage, and reduce infrastructure costs by up to 60%.",
    badge: "Cost Savings",
    benefits: [
      "Resource usage optimization",
      "Cost impact analysis",
      "Scaling recommendations",
      "ROI tracking and reporting"
    ]
  }
];

const integrations = [
  "PostgreSQL", "MySQL", "MongoDB", "Oracle", "SQL Server", "Redis",
  "AWS RDS", "Google Cloud SQL", "Azure Database", "Snowflake",
  "BigQuery", "Redshift", "DynamoDB", "Cassandra", "MariaDB"
];

export default function FeaturesPage() {
  return (
    <StandardPageLayout
      title="Powerful Features for Modern Databases"
      subtitle="Everything you need to optimize, monitor, and scale your database infrastructure"
      description="Comprehensive AI-powered tools and features designed to transform your database performance and reduce operational costs."
    >
      <div className="space-y-20">
        {/* Hero Stats */}
        <section className="text-center">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-primary mb-2">73%</div>
              <div className="text-muted-foreground">Query Speed Improvement</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-primary mb-2">60%</div>
              <div className="text-muted-foreground">Cost Reduction</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-primary mb-2">50K+</div>
              <div className="text-muted-foreground">Developers Trust Us</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-muted-foreground">Uptime SLA</div>
            </motion.div>
          </div>
        </section>

        {/* Main Features */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Core Features</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive tools designed to optimize every aspect of your database performance
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow border-2 hover:border-primary/20">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-gradient-to-br from-muted to-muted/50 rounded-xl">
                        {feature.icon}
                      </div>
                      <Badge variant="secondary">{feature.badge}</Badge>
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {feature.description}
                    </p>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Database Integrations */}
        <section className="bg-muted/30 p-12 rounded-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Universal Database Support</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Works seamlessly with all major database systems and cloud providers
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            {integrations.map((integration, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <Badge variant="outline" className="px-4 py-2 text-sm">
                  {integration}
                </Badge>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gradient-to-r from-primary/5 to-blue-500/5 p-12 rounded-2xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Database Performance?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of developers who've improved their database performance with DBooster's AI-powered optimization.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="px-8">
              <Link to="/demo">
                Try Interactive Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8">
              <Link to="/pricing">View Pricing Plans</Link>
            </Button>
          </div>
        </section>
      </div>
    </StandardPageLayout>
  );
}
