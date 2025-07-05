
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Zap, 
  Brain, 
  Shield, 
  BarChart, 
  Users, 
  Rocket, 
  Database, 
  Search, 
  GitBranch, 
  Clock,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { SocialShare } from '@/components/marketing/SocialShare';
import { NewsletterSignup } from '@/components/marketing/NewsletterSignup';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    description: 'Advanced machine learning algorithms analyze your queries and suggest optimal improvements automatically.',
    benefits: ['Real-time query analysis', 'Performance predictions', 'Automated recommendations'],
    category: 'AI & ML'
  },
  {
    icon: Zap,
    title: 'Lightning Fast Optimization',
    description: 'Get instant query optimizations that can reduce response times by up to 10x without changing your application code.',
    benefits: ['10x faster queries', 'Zero code changes', 'Instant results'],
    category: 'Performance'
  },
  {
    icon: Database,
    title: 'Multi-Database Support',
    description: 'Works seamlessly with PostgreSQL, MySQL, SQL Server, and other popular database systems.',
    benefits: ['PostgreSQL support', 'MySQL compatibility', 'SQL Server integration'],
    category: 'Compatibility'
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-grade security with encryption, audit logs, and compliance with industry standards.',
    benefits: ['End-to-end encryption', 'Audit logging', 'SOC 2 compliance'],
    category: 'Security'
  },
  {
    icon: BarChart,
    title: 'Performance Monitoring',
    description: 'Real-time monitoring and alerting to catch performance issues before they impact users.',
    benefits: ['Real-time alerts', 'Performance dashboards', 'Historical analysis'],
    category: 'Monitoring'
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Share optimizations, collaborate on queries, and maintain team knowledge bases effortlessly.',
    benefits: ['Team workspaces', 'Knowledge sharing', 'Collaborative optimization'],
    category: 'Collaboration'
  },
  {
    icon: GitBranch,
    title: 'Repository Integration',
    description: 'Scan entire codebases to identify optimization opportunities across all your applications.',
    benefits: ['Codebase scanning', 'Bulk optimization', 'CI/CD integration'],
    category: 'Integration'
  },
  {
    icon: Search,
    title: 'Smart Query Builder',
    description: 'Visual query builder with AI assistance to help create optimized queries from scratch.',
    benefits: ['Visual interface', 'AI assistance', 'Query templates'],
    category: 'Development'
  },
  {
    icon: Clock,
    title: 'Historical Analysis',
    description: 'Track query performance over time and identify trends and patterns in your database usage.',
    benefits: ['Performance trends', 'Usage patterns', 'Historical reports'],
    category: 'Analytics'
  }
];

export default function Features() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              <Rocket className="h-3 w-3 mr-1" />
              Advanced Features
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Everything You Need for 
              <span className="text-primary"> Database Excellence</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover the comprehensive suite of tools and features that make DBooster 
              the ultimate database optimization platform for modern development teams.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/pricing">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contact">Schedule Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="h-full hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <Badge variant="outline">{feature.category}</Badge>
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Share Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">Love What You See?</h2>
              <p className="text-muted-foreground">
                Share DBooster with your team and help them discover the power of AI-driven database optimization.
              </p>
            </div>
            <div className="flex justify-center">
              <SocialShare 
                title="DBooster Features - AI-Powered Database Optimization"
                description="Discover comprehensive database optimization features that reduce query times by 10x and cut costs by 60%."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
              <p className="text-muted-foreground">
                Get the latest feature updates and optimization tips delivered to your inbox.
              </p>
            </div>
            <NewsletterSignup />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Database Performance?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of developers who have already optimized their databases with DBooster.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/pricing">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <Link to="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
