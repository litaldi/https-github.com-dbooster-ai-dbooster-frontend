
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { useNavigate } from 'react-router-dom';
import { 
  Database, 
  Zap, 
  Shield, 
  TrendingUp, 
  Users, 
  Code, 
  ArrowRight, 
  Star,
  Brain,
  BarChart3,
  Clock,
  GitBranch,
  Search,
  Target
} from 'lucide-react';
import { FadeIn, ScaleIn, StaggerContainer, StaggerItem, HoverScale } from '@/components/ui/enhanced-animations';
import { Section, Container, Heading, Text } from '@/components/ui/visual-hierarchy';

export default function Features() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "AI Prompt Analyzer",
      description: "Advanced AI analysis of your database queries to identify performance bottlenecks and optimization opportunities.",
      category: "Core AI",
      highlight: true,
      benefits: ["10x faster queries", "Automated optimization", "Real-time analysis"]
    },
    {
      icon: Zap,
      title: "Smart Query Suggestions",
      description: "Get intelligent recommendations to improve query performance with detailed execution plans.",
      category: "Optimization",
      highlight: true,
      benefits: ["Instant suggestions", "Performance metrics", "Best practices"]
    },
    {
      icon: Clock,
      title: "Query History Tracking",
      description: "Track and analyze your query performance trends over time with comprehensive analytics.",
      category: "Analytics",
      highlight: false,
      benefits: ["Historical data", "Performance trends", "Usage analytics"]
    },
    {
      icon: Target,
      title: "Smart Collections",
      description: "Organize and categorize your queries into intelligent collections for better management.",
      category: "Organization",
      highlight: false,
      benefits: ["Auto-categorization", "Smart tagging", "Quick access"]
    },
    {
      icon: BarChart3,
      title: "Insights Dashboard",
      description: "Comprehensive dashboard with real-time metrics and performance insights.",
      category: "Analytics",
      highlight: true,
      benefits: ["Real-time metrics", "Custom reports", "Data visualization"]
    },
    {
      icon: Search,
      title: "Query Search & Discovery",
      description: "Powerful search capabilities to find and discover relevant queries and patterns.",
      category: "Discovery",
      highlight: false,
      benefits: ["Full-text search", "Pattern matching", "Smart filters"]
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "SOC2 compliant with enterprise-grade security features and team collaboration tools.",
      category: "Security",
      highlight: false,
      benefits: ["SOC2 compliance", "Encryption", "Audit logs"]
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share optimizations, review queries, and collaborate with your team on database improvements.",
      category: "Collaboration",
      highlight: false,
      benefits: ["Team workspaces", "Code reviews", "Shared collections"]
    },
    {
      icon: GitBranch,
      title: "GitHub Integration",
      description: "Seamlessly connect your repositories and automatically scan for SQL queries that need optimization.",
      category: "Integration",
      highlight: false,
      benefits: ["Auto-scanning", "PR integration", "CI/CD support"]
    }
  ];

  const categories = ["Core AI", "Optimization", "Analytics", "Organization", "Security", "Collaboration", "Integration", "Discovery"];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Section spacing="lg" className="text-center bg-gradient-to-b from-background to-muted/30">
        <Container>
          <FadeIn delay={0.2}>
            <Badge variant="secondary" className="mb-6">
              <Star className="h-3 w-3 mr-1" />
              All Features
            </Badge>
          </FadeIn>
          
          <FadeIn delay={0.4}>
            <Heading level={1} size="2xl" className="mb-6">
              Everything You Need for Database Optimization
            </Heading>
          </FadeIn>
          
          <FadeIn delay={0.6}>
            <Text size="lg" variant="muted" className="mb-8 max-w-3xl mx-auto">
              Comprehensive AI-powered tools and insights to help you optimize your database performance, 
              reduce costs, and improve query efficiency across your entire development workflow.
            </Text>
          </FadeIn>
          
          <FadeIn delay={0.8}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <HoverScale>
                <EnhancedButton 
                  size="lg" 
                  onClick={() => navigate('/login')} 
                  className="text-lg px-8"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </EnhancedButton>
              </HoverScale>
              
              <HoverScale>
                <EnhancedButton 
                  size="lg" 
                  variant="outline" 
                  onClick={() => navigate('/pricing')} 
                  className="text-lg px-8"
                >
                  View Pricing
                </EnhancedButton>
              </HoverScale>
            </div>
          </FadeIn>
        </Container>
      </Section>

      {/* Categories Filter */}
      <Section spacing="sm" className="border-b">
        <Container>
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Badge key={category} variant="outline" className="cursor-pointer hover:bg-accent">
                {category}
              </Badge>
            ))}
          </div>
        </Container>
      </Section>

      {/* Features Grid */}
      <Section spacing="lg">
        <Container>
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <StaggerItem key={index}>
                <HoverScale>
                  <Card 
                    className={`h-full transition-all duration-300 cursor-pointer group border-2 hover:border-primary/20 ${
                      feature.highlight ? 'ring-2 ring-primary/20 bg-primary/5 border-primary/30' : 'hover:shadow-xl'
                    }`}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <ScaleIn delay={index * 0.1}>
                            <div className={`p-3 rounded-xl transition-all duration-300 ${
                              feature.highlight 
                                ? 'bg-primary/15 text-primary shadow-lg' 
                                : 'bg-muted text-muted-foreground group-hover:bg-primary/15 group-hover:text-primary group-hover:shadow-md'
                            }`}>
                              <feature.icon className="h-6 w-6" />
                            </div>
                          </ScaleIn>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {feature.highlight && (
                            <Badge variant="default" className="text-xs">
                              Popular
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {feature.category}
                          </Badge>
                        </div>
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <CardDescription className="text-sm leading-relaxed">
                        {feature.description}
                      </CardDescription>
                      
                      <div className="space-y-2">
                        <Text size="sm" className="font-medium">Key Benefits:</Text>
                        <ul className="space-y-1">
                          {feature.benefits.map((benefit, i) => (
                            <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                              <div className="w-1 h-1 bg-primary rounded-full" />
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </HoverScale>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section spacing="lg" className="bg-muted/50">
        <Container className="text-center">
          <FadeIn>
            <Heading level={2} size="xl" className="mb-4">
              Ready to Optimize Your Database?
            </Heading>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <Text size="lg" variant="muted" className="mb-8">
              Join thousands of developers who have improved their database performance with DBooster.
            </Text>
          </FadeIn>
          
          <FadeIn delay={0.4}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <HoverScale>
                <EnhancedButton 
                  size="lg" 
                  onClick={() => navigate('/login')} 
                  className="text-lg px-8"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </EnhancedButton>
              </HoverScale>
              
              <HoverScale>
                <EnhancedButton 
                  size="lg" 
                  variant="outline" 
                  onClick={() => navigate('/contact')} 
                  className="text-lg px-8"
                >
                  Contact Sales
                </EnhancedButton>
              </HoverScale>
            </div>
          </FadeIn>
        </Container>
      </Section>
    </div>
  );
}
