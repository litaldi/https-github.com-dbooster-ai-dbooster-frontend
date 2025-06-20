
import { useAuth } from '@/contexts/auth-context';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Database, 
  Zap, 
  TrendingUp, 
  Shield, 
  Users, 
  Clock,
  CheckCircle,
  Star,
  BarChart3
} from 'lucide-react';
import { FadeIn, ScaleIn, StaggerContainer, StaggerItem, HoverScale } from '@/components/ui/enhanced-animations';
import { Section, Container, Heading, Text } from '@/components/ui/visual-hierarchy';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (user) {
      navigate('/app');
    }
  }, [user, navigate]);

  // Don't render if user is authenticated (will redirect)
  if (user) {
    return null;
  }

  const features = [
    {
      icon: Zap,
      title: "AI-Powered Optimization",
      description: "Advanced machine learning algorithms analyze your queries and suggest optimizations that can improve performance by up to 10x."
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "SOC2 compliant with enterprise-grade security. Your data is encrypted in transit and at rest with zero-trust architecture."
    },
    {
      icon: TrendingUp,
      title: "Performance Analytics",
      description: "Comprehensive dashboards and reports showing query performance trends, optimization impact, and cost savings."
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share optimizations across your team, review changes together, and maintain consistent database performance standards."
    }
  ];

  const benefits = [
    "Reduce query response times by up to 10x",
    "Cut infrastructure costs by 60%",
    "Automated performance monitoring",
    "Enterprise-grade security & compliance",
    "Real-time optimization suggestions",
    "Team collaboration tools"
  ];

  const stats = [
    { value: "10x", label: "Faster Queries" },
    { value: "60%", label: "Cost Reduction" },
    { value: "99.9%", label: "Uptime" },
    { value: "24/7", label: "Monitoring" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Section spacing="xl" className="text-center bg-gradient-to-b from-background to-muted/30">
        <Container>
          <FadeIn delay={0.2}>
            <Badge variant="secondary" className="mb-6">
              <Star className="h-3 w-3 mr-1" />
              AI-Powered Database Optimization
            </Badge>
          </FadeIn>
          
          <FadeIn delay={0.4}>
            <Heading level={1} size="3xl" className="mb-6 max-w-4xl mx-auto">
              Transform Your Database Performance with 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> AI Intelligence</span>
            </Heading>
          </FadeIn>
          
          <FadeIn delay={0.6}>
            <Text size="xl" variant="muted" className="mb-8 max-w-3xl mx-auto">
              Reduce query response times by up to 10x and cut infrastructure costs by 60% with our 
              intelligent database optimization platform. Built for modern development teams.
            </Text>
          </FadeIn>
          
          <FadeIn delay={0.8}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <HoverScale>
                <Button 
                  size="lg" 
                  onClick={() => navigate('/login')} 
                  className="text-lg px-8"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </HoverScale>
              
              <HoverScale>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => navigate('/how-it-works')} 
                  className="text-lg px-8"
                >
                  How It Works
                </Button>
              </HoverScale>
            </div>
          </FadeIn>

          {/* Stats */}
          <FadeIn delay={1.0}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <ScaleIn key={index} delay={1.2 + index * 0.1}>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                </ScaleIn>
              ))}
            </div>
          </FadeIn>
        </Container>
      </Section>

      {/* Features Section */}
      <Section spacing="xl">
        <Container>
          <div className="text-center mb-16">
            <FadeIn>
              <Heading level={2} size="2xl" className="mb-4">
                Everything You Need for Database Excellence
              </Heading>
            </FadeIn>
            <FadeIn delay={0.2}>
              <Text size="lg" variant="muted" className="max-w-2xl mx-auto">
                Comprehensive tools and insights to optimize your database performance, 
                reduce costs, and improve query efficiency.
              </Text>
            </FadeIn>
          </div>

          <StaggerContainer className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <StaggerItem key={index}>
                <HoverScale>
                  <Card className="h-full border-2 hover:border-primary/20 transition-colors duration-300">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <ScaleIn delay={index * 0.1}>
                          <div className="p-3 rounded-xl bg-primary/15 text-primary">
                            <feature.icon className="h-6 w-6" />
                          </div>
                        </ScaleIn>
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base leading-relaxed">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </HoverScale>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </Section>

      {/* Benefits Section */}
      <Section spacing="xl" className="bg-muted/30">
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <FadeIn>
                <Heading level={2} size="2xl" className="mb-6">
                  Why Teams Choose DBooster
                </Heading>
              </FadeIn>
              <FadeIn delay={0.2}>
                <Text size="lg" variant="muted" className="mb-8">
                  Join thousands of developers and database administrators who have transformed 
                  their database performance with our AI-powered optimization platform.
                </Text>
              </FadeIn>
              <StaggerContainer className="space-y-4">
                {benefits.map((benefit, index) => (
                  <StaggerItem key={index}>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <Text>{benefit}</Text>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <ScaleIn delay={0.4}>
                <Card className="p-6 text-center">
                  <BarChart3 className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                  <div className="text-2xl font-bold">156%</div>
                  <div className="text-sm text-muted-foreground">Avg Performance Gain</div>
                </Card>
              </ScaleIn>
              <ScaleIn delay={0.6}>
                <Card className="p-6 text-center">
                  <Clock className="h-8 w-8 text-green-500 mx-auto mb-3" />
                  <div className="text-2xl font-bold">2.3s</div>
                  <div className="text-sm text-muted-foreground">Avg Time Saved</div>
                </Card>
              </ScaleIn>
              <ScaleIn delay={0.8}>
                <Card className="p-6 text-center">
                  <Database className="h-8 w-8 text-purple-500 mx-auto mb-3" />
                  <div className="text-2xl font-bold">10K+</div>
                  <div className="text-sm text-muted-foreground">Queries Optimized</div>
                </Card>
              </ScaleIn>
              <ScaleIn delay={1.0}>
                <Card className="p-6 text-center">
                  <Users className="h-8 w-8 text-orange-500 mx-auto mb-3" />
                  <div className="text-2xl font-bold">500+</div>
                  <div className="text-sm text-muted-foreground">Happy Teams</div>
                </Card>
              </ScaleIn>
            </div>
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section spacing="lg">
        <Container className="text-center">
          <FadeIn>
            <Heading level={2} size="2xl" className="mb-4">
              Ready to Optimize Your Database?
            </Heading>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <Text size="lg" variant="muted" className="mb-8 max-w-2xl mx-auto">
              Start your free trial today and see how much you can improve your database performance. 
              No credit card required.
            </Text>
          </FadeIn>
          
          <FadeIn delay={0.4}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <HoverScale>
                <Button 
                  size="lg" 
                  onClick={() => navigate('/login')} 
                  className="text-lg px-8"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </HoverScale>
              
              <HoverScale>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => navigate('/contact')} 
                  className="text-lg px-8"
                >
                  Contact Sales
                </Button>
              </HoverScale>
            </div>
          </FadeIn>
        </Container>
      </Section>
    </div>
  );
}
