
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  Brain, 
  TrendingUp, 
  CheckCircle, 
  ArrowRight, 
  Database,
  Zap,
  BarChart3,
  GitBranch,
  Shield,
  Users,
  PlayCircle,
  Star
} from 'lucide-react';
import { FadeIn, ScaleIn, StaggerContainer, StaggerItem, HoverScale } from '@/components/ui/enhanced-animations';
import { Section, Container, Heading, Text } from '@/components/ui/visual-hierarchy';

export default function HowItWorks() {
  const navigate = useNavigate();

  const steps = [
    {
      number: 1,
      icon: Upload,
      title: "Connect Your Database",
      description: "Securely connect your existing database or upload your SQL queries. We support all major database systems including PostgreSQL, MySQL, and more.",
      details: [
        "Secure connection protocols",
        "Support for all major databases",
        "No data storage on our servers",
        "Instant setup in under 2 minutes"
      ],
      color: "from-blue-500 to-cyan-500"
    },
    {
      number: 2,
      icon: Brain,
      title: "AI Analysis & Optimization",
      description: "Our advanced AI analyzes your queries, identifies performance bottlenecks, and generates intelligent optimization recommendations.",
      details: [
        "Advanced machine learning algorithms",
        "Real-time performance analysis",
        "Intelligent pattern recognition",
        "Context-aware suggestions"
      ],
      color: "from-purple-500 to-pink-500"
    },
    {
      number: 3,
      icon: TrendingUp,
      title: "Performance Insights",
      description: "Get detailed insights with performance metrics, execution plans, and actionable recommendations to improve your database efficiency.",
      details: [
        "Detailed performance metrics",
        "Visual execution plans",
        "ROI impact analysis",
        "Historical trend tracking"
      ],
      color: "from-green-500 to-emerald-500"
    },
    {
      number: 4,
      icon: CheckCircle,
      title: "Implement & Monitor",
      description: "Apply the optimizations and continuously monitor performance improvements with our real-time dashboard and alerting system.",
      details: [
        "One-click optimization deployment",
        "Real-time monitoring dashboard",
        "Performance alerts and notifications",
        "Continuous improvement suggestions"
      ],
      color: "from-orange-500 to-red-500"
    }
  ];

  const benefits = [
    {
      icon: Zap,
      title: "Up to 10x Faster Queries",
      description: "Dramatically improve query performance with AI-powered optimizations"
    },
    {
      icon: BarChart3,
      title: "Reduce Database Costs",
      description: "Lower infrastructure costs through efficient resource utilization"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "SOC2 compliant with enterprise-grade security features"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share insights and optimizations across your development team"
    },
    {
      icon: GitBranch,
      title: "CI/CD Integration",
      description: "Seamlessly integrate with your existing development workflow"
    },
    {
      icon: Database,
      title: "Multi-Database Support",
      description: "Works with PostgreSQL, MySQL, SQL Server, and more"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Section spacing="lg" className="text-center bg-gradient-to-b from-background to-muted/30">
        <Container>
          <FadeIn delay={0.2}>
            <Badge variant="secondary" className="mb-6">
              <PlayCircle className="h-3 w-3 mr-1" />
              How It Works
            </Badge>
          </FadeIn>
          
          <FadeIn delay={0.4}>
            <Heading level={1} size="2xl" className="mb-6">
              Database Optimization Made Simple
            </Heading>
          </FadeIn>
          
          <FadeIn delay={0.6}>
            <Text size="lg" variant="muted" className="mb-8 max-w-3xl mx-auto">
              From connection to optimization in just 4 simple steps. Our AI-powered platform 
              makes database performance optimization accessible to developers of all skill levels.
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
                  Try It Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </EnhancedButton>
              </HoverScale>
              
              <HoverScale>
                <EnhancedButton 
                  size="lg" 
                  variant="outline" 
                  onClick={() => navigate('/features')} 
                  className="text-lg px-8"
                >
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Watch Demo
                </EnhancedButton>
              </HoverScale>
            </div>
          </FadeIn>
        </Container>
      </Section>

      {/* Process Steps */}
      <Section spacing="lg">
        <Container>
          <div className="space-y-16">
            {steps.map((step, index) => (
              <FadeIn key={step.number} delay={index * 0.2}>
                <div className={`flex flex-col lg:flex-row items-center gap-8 ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}>
                  {/* Content */}
                  <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                        {step.number}
                      </div>
                      <div>
                        <Heading level={3} size="lg" className="mb-2">
                          {step.title}
                        </Heading>
                        <Badge variant="outline">Step {step.number}</Badge>
                      </div>
                    </div>
                    
                    <Text size="lg" variant="muted" className="leading-relaxed">
                      {step.description}
                    </Text>
                    
                    <div className="grid sm:grid-cols-2 gap-3">
                      {step.details.map((detail, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <Text size="sm" variant="muted">{detail}</Text>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Visual */}
                  <div className="flex-1 max-w-md">
                    <ScaleIn delay={index * 0.2 + 0.3}>
                      <Card className="p-8 text-center border-2 border-dashed border-muted-foreground/20 hover:border-primary/30 transition-colors duration-300">
                        <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center shadow-lg`}>
                          <step.icon className="h-10 w-10 text-white" />
                        </div>
                        <Text className="font-medium">{step.title}</Text>
                        <Text size="sm" variant="muted" className="mt-2">
                          Visual representation of {step.title.toLowerCase()}
                        </Text>
                      </Card>
                    </ScaleIn>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </Container>
      </Section>

      {/* Benefits Grid */}
      <Section spacing="lg" className="bg-muted/30">
        <Container>
          <div className="text-center mb-12">
            <Heading level={2} size="xl" className="mb-4">
              Why Choose DBooster?
            </Heading>
            <Text size="lg" variant="muted" className="max-w-2xl mx-auto">
              Join thousands of developers who have transformed their database performance with our AI-powered platform.
            </Text>
          </div>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <StaggerItem key={index}>
                <HoverScale>
                  <Card className="h-full text-center p-6 hover:shadow-lg transition-shadow duration-300 group">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                      <benefit.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg mb-3 group-hover:text-primary transition-colors duration-300">
                      {benefit.title}
                    </CardTitle>
                    <CardDescription className="leading-relaxed">
                      {benefit.description}
                    </CardDescription>
                  </Card>
                </HoverScale>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </Section>

      {/* Testimonial Section */}
      <Section spacing="lg">
        <Container>
          <FadeIn>
            <Card className="max-w-4xl mx-auto p-8 text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-primary/20">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <Text size="lg" className="mb-6 italic">
                "DBooster reduced our query response times by 8x and saved us thousands in infrastructure costs. 
                The AI recommendations were spot-on and easy to implement."
              </Text>
              <div>
                <Text className="font-semibold">Sarah Chen</Text>
                <Text size="sm" variant="muted">Senior Database Engineer, TechCorp</Text>
              </div>
            </Card>
          </FadeIn>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section spacing="lg" className="bg-gradient-to-r from-primary/10 to-purple-500/10">
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
                  Schedule Demo
                </EnhancedButton>
              </HoverScale>
            </div>
          </FadeIn>
        </Container>
      </Section>
    </div>
  );
}
