
import { useState } from 'react';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-context';
import { useNavigate } from 'react-router-dom';
import { Database, Zap, Shield, TrendingUp, Users, Code, ArrowRight, Star } from 'lucide-react';
import { showSuccess } from '@/components/ui/feedback-toast';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';
import { FadeIn, ScaleIn, StaggerContainer, StaggerItem, HoverScale } from '@/components/ui/enhanced-animations';
import { Section, Container, Heading, Text } from '@/components/ui/visual-hierarchy';

export default function Home() {
  const { user, loginDemo } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleGetStarted = async () => {
    setIsLoading(true);
    
    try {
      if (user) {
        showSuccess({ 
          title: 'Redirecting to Dashboard', 
          description: 'Taking you to your dashboard...' 
        });
        navigate('/');
      } else {
        await loginDemo();
        showSuccess({ 
          title: 'Demo Started!', 
          description: 'Welcome to the DBooster demo experience.' 
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: Database,
      title: "Smart Query Analysis",
      description: "AI-powered analysis of your SQL queries to identify performance bottlenecks and optimization opportunities.",
      highlight: false
    },
    {
      icon: Zap,
      title: "Real-time Optimization",
      description: "Get instant suggestions to improve query performance with detailed execution plans and recommendations.",
      highlight: true
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "SOC2 compliant with enterprise-grade security features and team collaboration tools.",
      highlight: false
    },
    {
      icon: TrendingUp,
      title: "Performance Insights",
      description: "Track query performance trends and database health metrics with comprehensive analytics.",
      highlight: true
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share optimizations, review queries, and collaborate with your team on database improvements.",
      highlight: false
    },
    {
      icon: Code,
      title: "GitHub Integration",
      description: "Seamlessly connect your repositories and automatically scan for SQL queries that need optimization.",
      highlight: false
    }
  ];

  return (
    <div className="min-h-screen">
      <BreadcrumbNav />
      
      {/* Hero Section */}
      <Section spacing="lg" className="text-center bg-gradient-to-b from-background to-muted/50">
        <Container>
          <FadeIn delay={0.2}>
            <ScaleIn delay={0.3}>
              <Badge variant="secondary" className="mb-6">
                <Star className="h-3 w-3 mr-1" />
                AI-Powered Database Optimization
              </Badge>
            </ScaleIn>
          </FadeIn>
          
          <FadeIn delay={0.4}>
            <Heading level={1} size="2xl" className="mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Optimize Your Database Performance with AI
            </Heading>
          </FadeIn>
          
          <FadeIn delay={0.6}>
            <Text size="lg" variant="muted" className="mb-8 max-w-3xl mx-auto leading-relaxed">
              DBooster uses advanced AI to analyze your SQL queries, identify performance issues, and provide intelligent optimization recommendations that can improve your database performance by up to 10x.
            </Text>
          </FadeIn>
          
          <FadeIn delay={0.8}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <HoverScale>
                <EnhancedButton 
                  size="lg" 
                  onClick={handleGetStarted} 
                  className="text-lg px-8 min-h-[48px] min-w-[120px] transition-all duration-300"
                  loading={isLoading}
                  loadingText="Starting..."
                >
                  {user ? 'Go to Dashboard' : 'Try Free Demo'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </EnhancedButton>
              </HoverScale>
              
              <HoverScale>
                <EnhancedButton 
                  size="lg" 
                  variant="outline" 
                  onClick={() => navigate('/login')} 
                  className="text-lg px-8 min-h-[48px] transition-all duration-300"
                >
                  {user ? 'Settings' : 'Sign In'}
                </EnhancedButton>
              </HoverScale>
            </div>
          </FadeIn>
        </Container>
      </Section>

      {/* Features Section */}
      <Section spacing="lg">
        <Container>
          <FadeIn delay={0.2}>
            <div className="text-center mb-12 md:mb-16">
              <Heading level={2} size="xl" className="mb-4">
                Everything You Need for Database Optimization
              </Heading>
              <Text size="lg" variant="muted" className="max-w-3xl mx-auto">
                Comprehensive tools and insights to help you optimize your database performance and reduce costs.
              </Text>
            </div>
          </FadeIn>
          
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <StaggerItem key={index}>
                <HoverScale>
                  <Card 
                    className={`h-full transition-all duration-300 cursor-pointer group border-2 hover:border-primary/20 ${
                      feature.highlight ? 'ring-2 ring-primary/20 bg-primary/5 border-primary/30' : 'hover:shadow-xl'
                    }`}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3 mb-3">
                        <ScaleIn delay={index * 0.1}>
                          <div className={`p-3 rounded-xl transition-all duration-300 ${
                            feature.highlight 
                              ? 'bg-primary/15 text-primary shadow-lg' 
                              : 'bg-muted text-muted-foreground group-hover:bg-primary/15 group-hover:text-primary group-hover:shadow-md'
                          }`}>
                            <feature.icon className="h-6 w-6" />
                          </div>
                        </ScaleIn>
                        {feature.highlight && (
                          <Badge variant="default" className="text-xs animate-pulse">
                            Popular
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg md:text-xl group-hover:text-primary transition-colors duration-300">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm md:text-base leading-relaxed">
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
            <HoverScale>
              <EnhancedButton 
                size="lg" 
                onClick={handleGetStarted} 
                className="text-lg px-8 min-h-[48px] transition-all duration-300 shadow-lg hover:shadow-xl"
                loading={isLoading}
                loadingText="Getting Started..."
              >
                Get Started Now
                <ArrowRight className="ml-2 h-4 w-4" />
              </EnhancedButton>
            </HoverScale>
          </FadeIn>
        </Container>
      </Section>
    </div>
  );
}
