
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Plug, 
  Check, 
  ArrowRight, 
  GitBranch, 
  Cloud, 
  Monitor,
  Bell,
  Code,
  Database
} from 'lucide-react';

export default function Integrations() {
  const integrations = [
    {
      name: 'GitHub',
      logo: '🐙',
      category: 'Version Control',
      description: 'Connect repositories and automatically scan code for database queries',
      status: 'Available',
      features: ['Automatic scanning', 'PR integration', 'Commit hooks', 'Branch protection']
    },
    {
      name: 'GitLab',
      logo: '🦊',
      category: 'Version Control',
      description: 'Integrate with GitLab repositories and CI/CD pipelines',
      status: 'Available',
      features: ['Pipeline integration', 'Merge request reviews', 'Auto-scanning', 'Quality gates']
    },
    {
      name: 'AWS',
      logo: '☁️',
      category: 'Cloud Platform',
      description: 'Connect to AWS RDS, Aurora, and other database services',
      status: 'Available',
      features: ['RDS monitoring', 'CloudWatch metrics', 'Auto-scaling', 'Cost optimization']
    },
    {
      name: 'Google Cloud',
      logo: '🌐',
      category: 'Cloud Platform',
      description: 'Integrate with Google Cloud SQL and BigQuery',
      status: 'Available',
      features: ['Cloud SQL optimization', 'BigQuery analysis', 'Stackdriver logs', 'IAM integration']
    },
    {
      name: 'Azure',
      logo: '🔷',
      category: 'Cloud Platform',
      description: 'Connect to Azure SQL Database and Cosmos DB',
      status: 'Beta',
      features: ['SQL Database tuning', 'Cosmos DB optimization', 'Monitor integration', 'Key Vault']
    },
    {
      name: 'Slack',
      logo: '💬',
      category: 'Communication',
      description: 'Get notifications and reports directly in Slack channels',
      status: 'Available',
      features: ['Alert notifications', 'Daily reports', 'Query approvals', 'Team updates']
    },
    {
      name: 'Datadog',
      logo: '🐕',
      category: 'Monitoring',
      description: 'Send performance metrics and alerts to Datadog',
      status: 'Available',
      features: ['Custom metrics', 'Dashboard integration', 'Alert forwarding', 'Log correlation']
    },
    {
      name: 'New Relic',
      logo: '📊',
      category: 'Monitoring',
      description: 'Monitor database performance alongside application metrics',
      status: 'Coming Soon',
      features: ['APM integration', 'Query tracing', 'Performance alerts', 'Custom dashboards']
    },
    {
      name: 'Jira',
      logo: '🎫',
      category: 'Project Management',
      description: 'Create tickets for optimization recommendations',
      status: 'Available',
      features: ['Auto-ticket creation', 'Progress tracking', 'Sprint integration', 'Custom workflows']
    }
  ];

  const categories = [...new Set(integrations.map(int => int.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Plug className="h-4 w-4" />
            Integrations
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Connect With Your
            <span className="block bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Existing Workflow
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            DBooster seamlessly integrates with your favorite tools and platforms, 
            making database optimization a natural part of your development workflow.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <Badge key={category} variant="outline" className="px-4 py-2">
              {category}
            </Badge>
          ))}
        </div>

        {/* Integrations Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {integrations.map((integration, index) => (
            <Card key={index} className="relative group hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{integration.logo}</div>
                    <div>
                      <CardTitle className="text-lg">{integration.name}</CardTitle>
                      <Badge 
                        variant={integration.status === 'Available' ? 'default' : 
                                integration.status === 'Beta' ? 'secondary' : 'outline'}
                        className="mt-1"
                      >
                        {integration.status}
                      </Badge>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {integration.category}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-muted-foreground mb-4">{integration.description}</p>
                
                <div className="space-y-2">
                  {integration.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Check className="h-3 w-3 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Setup Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardContent className="p-8">
              <GitBranch className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">One-Click Setup</h3>
              <p className="text-muted-foreground">
                Most integrations can be configured in just a few clicks
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-8">
              <Code className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">API First</h3>
              <p className="text-muted-foreground">
                Build custom integrations using our comprehensive REST API
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-8">
              <Database className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Secure</h3>
              <p className="text-muted-foreground">
                All integrations use secure authentication and encryption
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="max-w-3xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold mb-4">Ready to Connect?</h2>
              <p className="text-muted-foreground mb-8">
                Start integrating DBooster with your existing tools and streamline 
                your database optimization workflow today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/login">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/learn">
                    View Documentation
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
