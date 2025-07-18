import React from 'react';
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Play, 
  Database, 
  Zap, 
  BarChart3, 
  ArrowRight,
  CheckCircle2,
  Monitor,
  Code,
  Timer,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { DemoDashboardSection } from '@/components/demo/DemoDashboardSection';

const demoFeatures = [
  {
    title: "Live Query Optimization",
    description: "Watch real-time optimization of complex SQL queries with before/after performance comparisons.",
    icon: <Zap className="h-8 w-8 text-yellow-600" />
  },
  {
    title: "Interactive Dashboard",
    description: "Explore our full analytics dashboard with sample data from real-world scenarios.",
    icon: <BarChart3 className="h-8 w-8 text-blue-600" />
  },
  {
    title: "AI Studio Experience",
    description: "Test our AI-powered query builder and optimization suggestions with guided examples.",
    icon: <Sparkles className="h-8 w-8 text-purple-600" />
  },
  {
    title: "Performance Monitoring",
    description: "See how our monitoring tools track and alert on database performance in real-time.",
    icon: <Monitor className="h-8 w-8 text-green-600" />
  }
];

const demoScenarios = [
  {
    title: "E-commerce Optimization",
    description: "Optimize product catalog queries handling millions of SKUs",
    metrics: ["75% faster searches", "60% cost reduction", "10x better scalability"]
  },
  {
    title: "Analytics Workload",
    description: "Transform complex reporting queries for real-time insights", 
    metrics: ["90% query time reduction", "Real-time dashboards", "Automated optimization"]
  },
  {
    title: "Multi-tenant SaaS",
    description: "Optimize queries across thousands of customer databases",
    metrics: ["99.9% uptime", "Linear scaling", "50% infrastructure savings"]
  }
];

export default function DemoPage() {
  return (
    <StandardPageLayout
      title="Interactive Demo - See DBooster in Action"
      subtitle="Try Before You Buy"
      description="Experience DBooster's powerful database optimization capabilities with our interactive demo. No signup required - start optimizing queries in minutes."
    >
      <div className="space-y-20">
        {/* Hero CTA */}
        <section className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-primary/5 to-blue-500/5 p-12 rounded-2xl"
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center">
              <Play className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Start Your Demo Now</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Get hands-on experience with DBooster's optimization engine. No installation, no signup - just pure database optimization power.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8">
                <Play className="mr-2 h-5 w-5" />
                Launch Interactive Demo
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8">
                <Link to="/pricing">View Pricing</Link>
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Interactive Demo Dashboard */}
        <DemoDashboardSection />

        {/* Demo Features */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">What You'll Experience</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our interactive demo showcases all the key features that make DBooster the leading database optimization platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {demoFeatures.map((feature, index) => (
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
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Demo Scenarios */}
        <section className="bg-muted/30 p-12 rounded-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Real-World Demo Scenarios</h2>
            <p className="text-xl text-muted-foreground">
              Explore how DBooster optimizes databases across different industries and use cases.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {demoScenarios.map((scenario, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">{scenario.title}</CardTitle>
                    <p className="text-muted-foreground text-sm">{scenario.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {scenario.metrics.map((metric, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm">{metric}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Quick Stats */}
        <section className="text-center">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { metric: "5min", label: "Demo Duration", icon: <Timer className="h-6 w-6" /> },
              { metric: "No Signup", label: "Required", icon: <CheckCircle2 className="h-6 w-6" /> },
              { metric: "Real Data", label: "Examples", icon: <Database className="h-6 w-6" /> },
              { metric: "Full Features", label: "Access", icon: <Code className="h-6 w-6" /> }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-xl flex items-center justify-center">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-primary mb-2">{stat.metric}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-gradient-to-r from-primary to-blue-600 text-primary-foreground p-12 rounded-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Optimize Your Database?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              After experiencing our demo, start your free trial or speak with our team about your specific optimization needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="px-8">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Link to="/contact">Talk to Sales</Link>
              </Button>
            </div>
          </motion.div>
        </section>
      </div>
    </StandardPageLayout>
  );
}
