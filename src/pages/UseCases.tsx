
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  ShoppingCart, 
  Building, 
  Heart, 
  GamepadIcon, 
  Briefcase,
  ArrowRight,
  Clock,
  DollarSign,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function UseCases() {
  const useCases = [
    {
      icon: ShoppingCart,
      title: 'E-commerce',
      description: 'Optimize product queries, inventory management, and checkout processes',
      metrics: ['40% faster page loads', '25% increase in conversions', '60% fewer timeouts'],
      industry: 'Retail'
    },
    {
      icon: Building,
      title: 'Enterprise SaaS',
      description: 'Scale multi-tenant applications with optimized database performance',
      metrics: ['50% cost reduction', '3x faster queries', '99.9% uptime'],
      industry: 'Technology'
    },
    {
      icon: Heart,
      title: 'Healthcare',
      description: 'Ensure fast, reliable access to critical patient data and records',
      metrics: ['80% faster lookups', 'Zero data loss', 'HIPAA compliant'],
      industry: 'Healthcare'
    },
    {
      icon: GamepadIcon,
      title: 'Gaming',
      description: 'Handle real-time player data, leaderboards, and game state efficiently',
      metrics: ['Sub-100ms queries', '10M+ concurrent users', '99.99% availability'],
      industry: 'Gaming'
    },
    {
      icon: Briefcase,
      title: 'Financial Services',
      description: 'Process transactions and financial data with optimal performance',
      metrics: ['Microsecond latency', 'Zero downtime', 'SOX compliant'],
      industry: 'Finance'
    },
    {
      icon: TrendingUp,
      title: 'Analytics',
      description: 'Speed up complex data analysis and reporting workflows',
      metrics: ['10x faster reports', '90% less resource usage', 'Real-time insights'],
      industry: 'Data'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Briefcase className="h-4 w-4" />
            Use Cases
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Real-World Success
            <span className="block bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Across Industries
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See how organizations across different industries use DBooster to optimize 
            their database performance and achieve measurable business results.
          </p>
        </div>

        {/* Use Cases Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {useCases.map((useCase, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <useCase.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-sm text-muted-foreground">{useCase.industry}</div>
                </div>
                <CardTitle className="text-xl">{useCase.title}</CardTitle>
              </CardHeader>
              
              <CardContent>
                <p className="text-muted-foreground mb-6">{useCase.description}</p>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Key Results:</h4>
                  {useCase.metrics.map((metric, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{metric}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardContent className="p-8">
              <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Faster Time to Market</h3>
              <p className="text-muted-foreground">
                Reduce development time and launch features faster with optimized queries
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-8">
              <DollarSign className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Lower Infrastructure Costs</h3>
              <p className="text-muted-foreground">
                Optimize resource usage and reduce cloud infrastructure expenses
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-8">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Better User Experience</h3>
              <p className="text-muted-foreground">
                Improve application performance and user satisfaction
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-3xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-4">Ready to Optimize Your Use Case?</h2>
              <p className="text-muted-foreground mb-8">
                Join thousands of organizations that trust DBooster to optimize their 
                database performance and achieve their business goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/login">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/contact">
                    Talk to Sales
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
