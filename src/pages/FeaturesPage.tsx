
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  Database, 
  Brain, 
  Shield, 
  BarChart3, 
  Clock, 
  Users, 
  Globe,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const features = [
  {
    icon: <Brain className="h-6 w-6" />,
    title: 'AI-Powered Optimization',
    description: 'Advanced machine learning algorithms analyze your queries and suggest optimizations automatically.',
    benefits: ['90% faster query execution', 'Automated index recommendations', 'Smart caching strategies']
  },
  {
    icon: <Database className="h-6 w-6" />,
    title: 'Multi-Database Support',
    description: 'Works seamlessly with PostgreSQL, MySQL, MongoDB, and other popular databases.',
    benefits: ['Universal compatibility', 'Zero configuration required', 'Cloud & on-premise support']
  },
  {
    icon: <BarChart3 className="h-6 w-6" />,
    title: 'Real-Time Analytics',
    description: 'Monitor performance metrics and get insights into your database operations.',
    benefits: ['Live performance dashboards', 'Historical trend analysis', 'Custom alerting']
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: 'Enterprise Security',
    description: 'SOC2 compliant with end-to-end encryption and role-based access control.',
    benefits: ['SOC2 Type II certified', 'Advanced threat detection', 'Audit logging']
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: 'Automated Monitoring',
    description: '24/7 monitoring with intelligent alerts and performance recommendations.',
    benefits: ['Proactive issue detection', 'Smart alerting system', 'Performance baselines']
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: 'Team Collaboration',
    description: 'Share insights, collaborate on optimizations, and manage team access.',
    benefits: ['Team workspaces', 'Shared dashboards', 'Role-based permissions']
  }
];

export default function FeaturesPage() {
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
            Powerful Features
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Everything You Need
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            DBooster provides comprehensive database optimization tools that scale from 
            individual developers to enterprise teams.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center bg-gradient-to-r from-primary/10 to-blue-600/10 rounded-2xl p-12"
        >
          <Globe className="h-12 w-12 mx-auto mb-6 text-primary" />
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of developers who trust DBooster to optimize their database performance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link to="/demo">
                Try Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8">
              <Link to="/pricing">View Pricing</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
