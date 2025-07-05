
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building, Users, Shield, Zap, ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Enterprise() {
  const features = [
    'Unlimited database connections',
    'Advanced security controls',
    'Priority support',
    'Custom integrations',
    'Dedicated account manager',
    'SLA guarantees'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Building className="h-4 w-4" />
            Enterprise Solutions
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Scale Your Database
            <span className="block bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Performance Enterprise-Wide
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Empower your organization with enterprise-grade database optimization tools, 
            advanced security, and dedicated support for mission-critical applications.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <Shield className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Enterprise Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Advanced security controls, SSO integration, and compliance features 
                to meet your organization's requirements.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Team Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Centralized user management, role-based access controls, and 
                team collaboration tools for large organizations.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Zap className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Performance at Scale</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Handle thousands of databases and millions of queries with 
                our enterprise-grade infrastructure and optimization engine.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Features List */}
        <Card className="mb-16">
          <CardHeader>
            <CardTitle className="text-2xl">What's Included</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Scale?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Contact our enterprise team to discuss your specific requirements 
            and get a custom solution tailored for your organization.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link to="/contact">
                Contact Sales
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/pricing">
                View All Plans
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
