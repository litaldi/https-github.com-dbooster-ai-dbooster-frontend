
import React from 'react';
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  Database, 
  Brain, 
  Target, 
  Activity, 
  ArrowRight, 
  CheckCircle2,
  Play,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

const steps = [
  {
    step: 1,
    title: "Connect Your Database",
    description: "Securely connect your database with read-only access. No data leaves your infrastructure.",
    icon: <Database className="h-12 w-12 text-blue-600" />,
    details: [
      "Read-only connection for maximum security",
      "Support for all major database systems",
      "5-minute setup with guided wizard",
      "Zero downtime integration"
    ],
    time: "2-5 minutes"
  },
  {
    step: 2,
    title: "AI Analysis & Discovery",
    description: "Our AI analyzes your query patterns, schema, and performance metrics to identify optimization opportunities.",
    icon: <Brain className="h-12 w-12 text-purple-600" />,
    details: [
      "Deep query pattern analysis",
      "Schema structure evaluation",
      "Performance bottleneck detection",
      "Historical trend analysis"
    ],
    time: "5-15 minutes"
  },
  {
    step: 3,
    title: "Get Optimization Recommendations",
    description: "Receive prioritized, actionable recommendations with impact estimates and implementation guidance.",
    icon: <Target className="h-12 w-12 text-green-600" />,
    details: [
      "Prioritized by performance impact",
      "Detailed implementation steps",
      "Risk assessment for each change",
      "Before/after performance estimates"
    ],
    time: "Instant results"
  },
  {
    step: 4,
    title: "Monitor & Optimize Continuously",
    description: "Track improvements with real-time monitoring and receive ongoing optimization suggestions.",
    icon: <Activity className="h-12 w-12 text-orange-600" />,
    details: [
      "Real-time performance dashboards",
      "Continuous optimization suggestions",
      "Automated alert notifications",
      "Historical performance tracking"
    ],
    time: "Ongoing"
  }
];

const benefits = [
  "No database downtime during setup",
  "Zero code changes required to start",
  "Immediate visibility into performance issues",
  "Gradual implementation of recommendations"
];

export default function HowItWorksPage() {
  return (
    <StandardPageLayout
      title="How DBooster Works"
      subtitle="Simple 4-Step Process"
      description="Get from database connection to optimized performance in minutes with our AI-powered platform."
    >
      <div className="space-y-20">
        {/* Process Steps */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">From Connection to Optimization</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our streamlined process gets you from setup to results in under 30 minutes, with ongoing optimization that never stops.
            </p>
          </div>
          
          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <Card className="overflow-hidden border-2 hover:border-primary/20 transition-all duration-300">
                  <CardHeader className="bg-gradient-to-r from-muted/30 to-muted/10">
                    <div className="flex items-start gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-2xl flex items-center justify-center border-2 border-primary/20">
                          {step.icon}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <span className="text-sm font-bold text-primary bg-primary/10 rounded-full px-3 py-1">
                            Step {step.step}
                          </span>
                          <span className="text-sm text-muted-foreground">{step.time}</span>
                        </div>
                        <CardTitle className="text-2xl mb-2">{step.title}</CardTitle>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {step.details.map((detail, detailIndex) => (
                        <div key={detailIndex} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Arrow to next step */}
                {index < steps.length - 1 && (
                  <div className="flex justify-center my-8">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <ArrowRight className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-muted/30 p-12 rounded-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Our Process Works</h2>
            <p className="text-xl text-muted-foreground">
              Designed for minimal disruption and maximum results
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-3"
              >
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-sm">{benefit}</span>
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
            <Zap className="h-16 w-16 mx-auto mb-6 text-primary" />
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Experience the power of AI-driven database optimization. Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="px-8">
                <Link to="/demo">
                  <Play className="mr-2 h-5 w-5" />
                  Try Demo Now
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
