
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Upload, 
  Scan, 
  Brain, 
  TrendingUp, 
  ArrowRight,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: <Upload className="h-8 w-8" />,
    title: 'Connect Your Database',
    description: 'Securely connect your database or upload your codebase. We support all major databases and frameworks.',
    details: ['One-click integrations', 'Secure encrypted connections', 'No data stored permanently']
  },
  {
    number: '02',
    icon: <Scan className="h-8 w-8" />,
    title: 'AI Analysis',
    description: 'Our advanced AI scans your queries, identifies bottlenecks, and analyzes performance patterns.',
    details: ['Deep code analysis', 'Performance pattern recognition', 'Bottleneck identification']
  },
  {
    number: '03',
    icon: <Brain className="h-8 w-8" />,
    title: 'Smart Optimization',
    description: 'Get AI-powered recommendations for query optimization, indexing strategies, and performance improvements.',
    details: ['Automated query rewrites', 'Index recommendations', 'Caching strategies']
  },
  {
    number: '04',
    icon: <TrendingUp className="h-8 w-8" />,
    title: 'Monitor & Improve',
    description: 'Track performance improvements in real-time and get ongoing optimization suggestions.',
    details: ['Real-time monitoring', 'Performance dashboards', 'Continuous optimization']
  }
];

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4">
            <Zap className="h-3 w-3 mr-1" />
            How It Works
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Simple. Powerful. Effective.
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Get started with DBooster in minutes and see immediate performance improvements 
            in your database operations.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-12 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className={`flex flex-col lg:flex-row items-center gap-8 ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className="flex-1">
                <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-blue-600 text-white font-bold text-lg">
                        {step.number}
                      </div>
                      <div className="p-3 bg-primary/10 rounded-lg text-primary">
                        {step.icon}
                      </div>
                    </div>
                    <CardTitle className="text-2xl mb-3">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-lg mb-6">
                      {step.description}
                    </p>
                    <ul className="space-y-3">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                          <span className="text-sm">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block">
                  <ArrowRight className="h-8 w-8 text-muted-foreground" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          <Card className="text-center shadow-lg">
            <CardContent className="pt-8">
              <Clock className="h-12 w-12 mx-auto mb-4 text-primary" />
              <div className="text-3xl font-bold mb-2">5 min</div>
              <p className="text-muted-foreground">Setup Time</p>
            </CardContent>
          </Card>
          
          <Card className="text-center shadow-lg">
            <CardContent className="pt-8">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 text-green-600" />
              <div className="text-3xl font-bold mb-2">10x</div>
              <p className="text-muted-foreground">Performance Boost</p>
            </CardContent>
          </Card>
          
          <Card className="text-center shadow-lg">
            <CardContent className="pt-8">
              <Brain className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <div className="text-3xl font-bold mb-2">AI-Powered</div>
              <p className="text-muted-foreground">Smart Analysis</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="text-center bg-gradient-to-r from-primary/10 to-blue-600/10 rounded-2xl p-12"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Optimize Your Database?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of developers who have improved their database performance with DBooster.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link to="/demo">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8">
              <Link to="/contact">Contact Sales</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
