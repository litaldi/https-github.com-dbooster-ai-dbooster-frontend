
import React from 'react';
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Database, 
  Zap, 
  Shield, 
  BarChart3, 
  Clock, 
  Users,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Brain,
  Target
} from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: <Brain className="h-8 w-8 text-blue-600" />,
    title: "AI-Powered Optimization",
    description: "Advanced machine learning algorithms analyze your queries and suggest optimal improvements automatically."
  },
  {
    icon: <Zap className="h-8 w-8 text-yellow-600" />,
    title: "Real-time Performance Monitoring",
    description: "Monitor query performance in real-time with detailed metrics and actionable insights."
  },
  {
    icon: <Shield className="h-8 w-8 text-green-600" />,
    title: "Enterprise Security",
    description: "SOC2 Type II compliant with advanced security controls and data protection."
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-purple-600" />,
    title: "Advanced Analytics",
    description: "Comprehensive dashboards and reports to track database performance over time."
  }
];

const benefits = [
  "75% average performance improvement",
  "Reduce query execution time by up to 90%",
  "Automatic index recommendations",
  "Query optimization suggestions",
  "Performance regression detection",
  "Multi-database support"
];

export default function ProductPage() {
  return (
    <StandardPageLayout
      title="DBooster - AI Database Optimization Platform"
      subtitle="Intelligent Performance Optimization"
      description="Transform your database performance with AI-powered optimization. Automatically detect bottlenecks, optimize queries, and improve response times across all your databases."
    >
      <div className="space-y-20">
        {/* Hero Stats */}
        <section className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          >
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">75%</div>
              <p className="text-muted-foreground">Average Performance Boost</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
              <p className="text-muted-foreground">Developers Using DBooster</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <p className="text-muted-foreground">Database Types Supported</p>
            </div>
          </motion.div>
        </section>

        {/* Core Features */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to optimize, monitor, and scale your database performance
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-muted to-muted/50 rounded-xl flex items-center justify-center">
                        {feature.icon}
                      </div>
                      <div>
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Benefits List */}
        <section className="bg-muted/30 p-12 rounded-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose DBooster?</h2>
            <p className="text-xl text-muted-foreground">
              Proven results that speak for themselves
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center gap-3"
              >
                <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                <span className="text-lg">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How It Works Preview */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Simple 3-Step Process</h2>
            <p className="text-xl text-muted-foreground">
              Get started with database optimization in minutes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Connect Database</h3>
              <p className="text-muted-foreground">Securely connect your database with read-only access</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">AI Analysis</h3>
              <p className="text-muted-foreground">Our AI analyzes your queries and identifies optimization opportunities</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Implement & Monitor</h3>
              <p className="text-muted-foreground">Apply optimizations and monitor performance improvements</p>
            </div>
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
            <Sparkles className="h-16 w-16 mx-auto mb-6 text-primary" />
            <h2 className="text-3xl font-bold mb-4">Ready to Optimize Your Database?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of developers who have improved their database performance with DBooster's AI-powered optimization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="px-8">
                <Link to="/demo">
                  Try Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8">
                <Link to="/pricing">View Pricing</Link>
              </Button>
            </div>
          </motion.div>
        </section>
      </div>
    </StandardPageLayout>
  );
}
