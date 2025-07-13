
import React from 'react';
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Zap, 
  Code, 
  Database, 
  ArrowRight,
  Sparkles,
  Target,
  BarChart3,
  Cpu,
  Play
} from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    title: "Intelligent Query Analysis",
    description: "AI-powered engine analyzes your SQL queries and identifies optimization opportunities instantly.",
    icon: <Brain className="h-8 w-8 text-purple-600" />
  },
  {
    title: "Real-time Optimization",
    description: "Get live suggestions and improvements as you write queries with instant performance predictions.",
    icon: <Zap className="h-8 w-8 text-yellow-600" />
  },
  {
    title: "Code Generation",
    description: "Generate optimized SQL from natural language descriptions or convert existing queries.",
    icon: <Code className="h-8 w-8 text-blue-600" />
  },
  {
    title: "Performance Insights",
    description: "Deep analytics on query performance with actionable recommendations for improvement.",
    icon: <BarChart3 className="h-8 w-8 text-green-600" />
  }
];

const capabilities = [
  "Natural language to SQL conversion",
  "Query optimization suggestions", 
  "Performance impact analysis",
  "Index recommendations",
  "Query plan visualization",
  "Batch query optimization"
];

export default function AIStudioPage() {
  return (
    <StandardPageLayout
      title="AI Studio - Intelligent Database Optimization"
      subtitle="Power of AI"
      description="Experience the future of database optimization with our AI Studio. Transform complex queries, get intelligent suggestions, and optimize performance with cutting-edge artificial intelligence."
    >
      <div className="space-y-20">
        {/* Hero Demo Section */}
        <section className="bg-gradient-to-r from-primary/5 to-purple-500/5 p-12 rounded-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4">See AI Studio in Action</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Watch how our AI transforms complex database queries into optimized, high-performance solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="px-8">
                <Play className="mr-2 h-5 w-5" />
                Try Interactive Demo
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8">
                <Link to="/login">Start Free Trial</Link>
              </Button>
            </div>
          </motion.div>
        </section>

        {/* Core Features */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">AI-Powered Features</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Leverage advanced machine learning to optimize your database performance like never before.
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
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Capabilities List */}
        <section className="bg-muted/30 p-12 rounded-2xl">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">What AI Studio Can Do</h2>
              <p className="text-xl text-muted-foreground">
                Comprehensive AI capabilities for every aspect of database optimization.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {capabilities.map((capability, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3 p-4 bg-background rounded-lg border"
                >
                  <Target className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="font-medium">{capability}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Performance Stats */}
        <section className="text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { metric: "85%", label: "Query Performance Boost", icon: <Cpu className="h-6 w-6" /> },
              { metric: "90%", label: "Optimization Accuracy", icon: <Target className="h-6 w-6" /> },
              { metric: "<2s", label: "Analysis Time", icon: <Zap className="h-6 w-6" /> }
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
                <div className="text-3xl font-bold text-primary mb-2">{stat.metric}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary to-blue-600 text-primary-foreground p-12 rounded-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Experience AI Studio?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of developers who are already using AI to optimize their database performance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="px-8">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Link to="/contact">Schedule Demo</Link>
              </Button>
            </div>
          </motion.div>
        </section>
      </div>
    </StandardPageLayout>
  );
}
