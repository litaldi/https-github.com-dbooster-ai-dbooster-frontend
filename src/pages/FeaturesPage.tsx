
import React from 'react';
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Brain, 
  Activity, 
  Shield, 
  BarChart3, 
  Clock, 
  Database, 
  CheckCircle2, 
  ArrowRight,
  Target,
  Cpu,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    title: "AI-Powered Query Optimization",
    description: "Advanced machine learning algorithms analyze your queries and suggest optimizations in real-time.",
    icon: <Brain className="h-8 w-8 text-purple-600" />,
    benefits: [
      "75% average performance improvement",
      "Automatic query rewriting suggestions", 
      "Pattern recognition across databases",
      "Context-aware optimizations"
    ]
  },
  {
    title: "Real-Time Performance Monitoring",
    description: "Monitor database performance with live insights and instant alerts when issues arise.",
    icon: <Activity className="h-8 w-8 text-green-600" />,
    benefits: [
      "Live performance dashboards",
      "Instant bottleneck detection",
      "Custom alert thresholds",
      "Historical trend analysis"
    ]
  },
  {
    title: "Automated Index Recommendations",
    description: "Get intelligent index suggestions based on your actual query patterns and data usage.",
    icon: <Target className="h-8 w-8 text-blue-600" />,
    benefits: [
      "Smart index analysis",
      "Usage-based recommendations",
      "Impact assessment tools",
      "One-click implementation"
    ]
  },
  {
    title: "Enterprise Security & Compliance",
    description: "Bank-grade security with SOC2 Type II compliance and advanced access controls.",
    icon: <Shield className="h-8 w-8 text-red-600" />,
    benefits: [
      "SOC2 Type II certified",
      "End-to-end encryption",
      "Role-based access control",
      "Audit trail logging"
    ]
  },
  {
    title: "Advanced Analytics Dashboard",
    description: "Comprehensive analytics with customizable reports and performance insights.",
    icon: <BarChart3 className="h-8 w-8 text-orange-600" />,
    benefits: [
      "Custom performance reports",
      "Cost optimization insights",
      "Query performance trends",
      "Resource utilization metrics"
    ]
  },
  {
    title: "Multi-Database Support",
    description: "Works with PostgreSQL, MySQL, MongoDB, SQL Server, Oracle, and more database systems.",
    icon: <Database className="h-8 w-8 text-cyan-600" />,
    benefits: [
      "PostgreSQL, MySQL, MongoDB",
      "SQL Server, Oracle support",
      "NoSQL database optimization",
      "Cloud database integration"
    ]
  }
];

const performanceMetrics = [
  { metric: "75%", label: "Performance Boost", icon: <TrendingUp className="h-6 w-6" /> },
  { metric: "60%", label: "Cost Reduction", icon: <Cpu className="h-6 w-6" /> },
  { metric: "<5min", label: "Setup Time", icon: <Clock className="h-6 w-6" /> },
  { metric: "99.9%", label: "Uptime SLA", icon: <Zap className="h-6 w-6" /> }
];

export default function FeaturesPage() {
  return (
    <StandardPageLayout
      title="Powerful Features for Database Optimization"
      subtitle="Everything You Need"
      description="Discover how DBooster's comprehensive feature set transforms database performance with AI-powered optimization, real-time monitoring, and enterprise-grade security."
    >
      <div className="space-y-20">
        {/* Performance Metrics */}
        <section className="text-center">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {performanceMetrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-xl flex items-center justify-center">
                  {metric.icon}
                </div>
                <div className="text-3xl font-bold text-primary mb-2">{metric.metric}</div>
                <div className="text-sm text-muted-foreground">{metric.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Main Features */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Core Features</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Comprehensive tools designed to optimize every aspect of your database performance.
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
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 bg-gradient-to-br from-muted to-muted/50 rounded-xl">
                        {feature.icon}
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
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

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary/5 to-blue-500/5 p-12 rounded-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Experience These Features?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Start optimizing your database performance today with our comprehensive feature set.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="px-8">
                <Link to="/demo">
                  Try Features Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8">
                <Link to="/how-it-works">How It Works</Link>
              </Button>
            </div>
          </motion.div>
        </section>
      </div>
    </StandardPageLayout>
  );
}
