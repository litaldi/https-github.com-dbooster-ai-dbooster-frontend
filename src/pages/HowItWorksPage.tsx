
import React from 'react';
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  Database, 
  Brain, 
  Zap, 
  BarChart3, 
  CheckCircle2, 
  ArrowRight,
  Upload,
  Search,
  Settings,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

const steps = [
  {
    number: "01",
    icon: <Upload className="h-8 w-8 text-blue-600" />,
    title: "Connect Your Database",
    description: "Securely connect your PostgreSQL, MySQL, MongoDB, or any other database in under 5 minutes.",
    features: [
      "One-click cloud database connections",
      "Secure encrypted connections",
      "Support for 15+ database types",
      "On-premise and cloud compatibility"
    ]
  },
  {
    number: "02",
    icon: <Brain className="h-8 w-8 text-purple-600" />,
    title: "AI Analysis & Discovery",
    description: "Our AI engine analyzes your queries, indexes, and database structure to identify optimization opportunities.",
    features: [
      "Automatic query pattern detection",
      "Performance bottleneck identification",
      "Index usage analysis",
      "Resource utilization monitoring"
    ]
  },
  {
    number: "03",
    icon: <Settings className="h-8 w-8 text-green-600" />,
    title: "Get Smart Recommendations",
    description: "Receive actionable, AI-powered optimization suggestions tailored to your specific database workload.",
    features: [
      "Query rewriting suggestions",
      "Index creation recommendations",
      "Schema optimization advice",
      "Performance impact predictions"
    ]
  },
  {
    number: "04",
    icon: <TrendingUp className="h-8 w-8 text-orange-600" />,
    title: "Monitor & Improve",
    description: "Track performance improvements and continue optimizing with real-time monitoring and alerts.",
    features: [
      "Real-time performance dashboards",
      "Automated alert system",
      "Historical performance tracking",
      "ROI and cost savings reports"
    ]
  }
];

const benefits = [
  {
    icon: <Zap className="h-6 w-6 text-yellow-600" />,
    title: "73% Faster Queries",
    description: "Average query performance improvement across all customers"
  },
  {
    icon: <Database className="h-6 w-6 text-blue-600" />,
    title: "60% Cost Reduction",
    description: "Reduce infrastructure costs through intelligent optimization"
  },
  {
    icon: <BarChart3 className="h-6 w-6 text-green-600" />,
    title: "5-Minute Setup",
    description: "Get started immediately with our streamlined onboarding"
  }
];

export default function HowItWorksPage() {
  return (
    <StandardPageLayout
      title="How DBooster Works"
      subtitle="Simple, Powerful, Effective"
      description="Transform your database performance in four simple steps with our AI-powered optimization platform."
    >
      <div className="space-y-20">
        {/* Main Steps */}
        <section>
          <div className="space-y-16">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`flex flex-col lg:flex-row items-center gap-12 ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                <div className="flex-1">
                  <Card className="h-full border-2 hover:border-primary/20 transition-all">
                    <CardHeader>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="text-4xl font-bold text-primary/20">
                          {step.number}
                        </div>
                        <div className="p-3 bg-gradient-to-br from-muted to-muted/50 rounded-xl">
                          {step.icon}
                        </div>
                      </div>
                      <CardTitle className="text-2xl">{step.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                        {step.description}
                      </p>
                      <ul className="space-y-3">
                        {step.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="flex-1 text-center lg:text-left">
                  <div className="relative">
                    <div className="aspect-video bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-2xl border-2 border-dashed border-primary/20 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl mb-4">{step.icon}</div>
                        <Badge variant="outline" className="text-sm">
                          Step {step.number}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Benefits Overview */}
        <section className="bg-muted/30 p-12 rounded-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why It Works So Well</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our AI-powered approach delivers consistent results across all database types and sizes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-background rounded-xl border shadow-sm">
                    {benefit.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Security & Compliance */}
        <section className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-8">Enterprise-Grade Security</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-2">SOC2</div>
                <div className="text-sm text-muted-foreground">Type II Certified</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-2">GDPR</div>
                <div className="text-sm text-muted-foreground">Compliant</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-2">256-bit</div>
                <div className="text-sm text-muted-foreground">Encryption</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-2">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime SLA</div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-gradient-to-r from-primary/5 to-blue-500/5 p-12 rounded-2xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
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
