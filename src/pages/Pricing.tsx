
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { 
  Check, 
  X, 
  Star, 
  Zap, 
  Shield, 
  Users, 
  Database, 
  ArrowRight,
  HelpCircle,
  Crown,
  Rocket
} from 'lucide-react';
import { FadeIn, StaggerContainer, StaggerItem, HoverScale } from '@/components/ui/enhanced-animations';
import { Section, Container, Heading, Text } from '@/components/ui/visual-hierarchy';

export default function Pricing() {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Starter",
      icon: Zap,
      price: "Free",
      period: "forever",
      description: "Perfect for individual developers and small projects",
      popular: false,
      features: [
        { name: "Up to 5 queries per month", included: true },
        { name: "Basic performance insights", included: true },
        { name: "Community support", included: true },
        { name: "Single database connection", included: true },
        { name: "Advanced AI optimizations", included: false },
        { name: "Team collaboration", included: false },
        { name: "Priority support", included: false },
        { name: "Custom integrations", included: false }
      ],
      cta: "Get Started Free",
      highlight: false
    },
    {
      name: "Professional",
      icon: Star,
      price: "$29",
      period: "per month",
      description: "Ideal for professional developers and growing teams",
      popular: true,
      features: [
        { name: "Up to 1,000 queries per month", included: true },
        { name: "Advanced AI optimizations", included: true },
        { name: "Performance monitoring", included: true },
        { name: "Up to 5 database connections", included: true },
        { name: "Team collaboration (5 members)", included: true },
        { name: "Email support", included: true },
        { name: "API access", included: true },
        { name: "Custom integrations", included: false }
      ],
      cta: "Start Free Trial",
      highlight: true
    },
    {
      name: "Enterprise",
      icon: Crown,
      price: "$99",
      period: "per month",
      description: "For large teams and enterprise-scale applications",
      popular: false,
      features: [
        { name: "Unlimited queries", included: true },
        { name: "Advanced AI optimizations", included: true },
        { name: "Real-time monitoring", included: true },
        { name: "Unlimited database connections", included: true },
        { name: "Unlimited team members", included: true },
        { name: "Priority support", included: true },
        { name: "Custom integrations", included: true },
        { name: "SLA guarantee", included: true }
      ],
      cta: "Contact Sales",
      highlight: false
    }
  ];

  const faqs = [
    {
      question: "Can I switch plans at any time?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any charges."
    },
    {
      question: "What databases do you support?",
      answer: "We support all major databases including PostgreSQL, MySQL, SQL Server, Oracle, MongoDB, and more. Our AI adapts to your specific database type."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We're SOC2 compliant and use enterprise-grade encryption. We never store your actual data, only analyze query patterns and performance metrics."
    },
    {
      question: "Do you offer custom plans?",
      answer: "Yes, we offer custom enterprise plans for organizations with specific needs. Contact our sales team to discuss your requirements."
    },
    {
      question: "What happens after my free trial?",
      answer: "After your 14-day free trial, you can choose to continue with a paid plan or downgrade to our free Starter plan. No credit card required for the trial."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Yes, you can cancel your subscription at any time. You'll continue to have access to paid features until the end of your billing period."
    }
  ];

  const additionalFeatures = [
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "SOC2 compliance, SSO, and advanced security features"
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share insights, review optimizations, and collaborate seamlessly"
    },
    {
      icon: Database,
      title: "Multi-Database Support",
      description: "Works with all major database systems and cloud providers"
    },
    {
      icon: Rocket,
      title: "CI/CD Integration",
      description: "Seamlessly integrate with your development workflow"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Section spacing="lg" className="text-center bg-gradient-to-b from-background to-muted/30">
        <Container>
          <FadeIn delay={0.2}>
            <Badge variant="secondary" className="mb-6">
              <Star className="h-3 w-3 mr-1" />
              Pricing Plans
            </Badge>
          </FadeIn>
          
          <FadeIn delay={0.4}>
            <Heading level={1} size="2xl" className="mb-6">
              Choose Your Optimization Plan
            </Heading>
          </FadeIn>
          
          <FadeIn delay={0.6}>
            <Text size="lg" variant="muted" className="mb-8 max-w-3xl mx-auto">
              Start free and scale as you grow. All plans include our core AI optimization features 
              with transparent, predictable pricing.
            </Text>
          </FadeIn>
          
          <FadeIn delay={0.8}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full text-green-800 dark:text-green-300 text-sm font-medium">
              <Check className="h-4 w-4" />
              14-day free trial • No credit card required
            </div>
          </FadeIn>
        </Container>
      </Section>

      {/* Pricing Cards */}
      <Section spacing="lg">
        <Container>
          <StaggerContainer className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <StaggerItem key={index}>
                <HoverScale>
                  <Card className={`relative h-full transition-all duration-300 ${
                    plan.highlight 
                      ? 'ring-2 ring-primary shadow-2xl scale-105 border-primary/50' 
                      : 'hover:shadow-xl border-2 hover:border-primary/20'
                  }`}>
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1">
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    
                    <CardHeader className="text-center pb-6">
                      <div className="flex items-center justify-center mb-4">
                        <div className={`p-3 rounded-xl ${
                          plan.highlight ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
                        }`}>
                          <plan.icon className="h-8 w-8" />
                        </div>
                      </div>
                      
                      <CardTitle className="text-2xl font-bold mb-2">
                        {plan.name}
                      </CardTitle>
                      
                      <div className="mb-4">
                        <span className="text-4xl font-bold">{plan.price}</span>
                        {plan.price !== "Free" && (
                          <span className="text-muted-foreground ml-1">/{plan.period}</span>
                        )}
                      </div>
                      
                      <CardDescription className="text-sm leading-relaxed">
                        {plan.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                      <EnhancedButton 
                        className={`w-full ${plan.highlight ? 'shadow-lg' : ''}`}
                        variant={plan.highlight ? 'default' : 'outline'}
                        size="lg"
                        onClick={() => navigate('/login')}
                      >
                        {plan.cta}
                        {plan.name !== "Enterprise" && <ArrowRight className="ml-2 h-4 w-4" />}
                      </EnhancedButton>
                      
                      <Separator />
                      
                      <div className="space-y-3">
                        <Text className="font-semibold text-sm">What's included:</Text>
                        {plan.features.map((feature, i) => (
                          <div key={i} className="flex items-start gap-3">
                            {feature.included ? (
                              <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                            ) : (
                              <X className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            )}
                            <Text 
                              size="sm" 
                              className={`leading-relaxed ${
                                !feature.included ? 'text-muted-foreground line-through' : ''
                              }`}
                            >
                              {feature.name}
                            </Text>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </HoverScale>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </Section>

      {/* Additional Features */}
      <Section spacing="lg" className="bg-muted/30">
        <Container>
          <div className="text-center mb-12">
            <Heading level={2} size="xl" className="mb-4">
              Everything You Need to Succeed
            </Heading>
            <Text size="lg" variant="muted">
              All plans include these powerful features to help you optimize your database performance
            </Text>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {additionalFeatures.map((feature, index) => (
              <FadeIn key={index} delay={index * 0.1}>
                <Card className="text-center p-6 hover:shadow-lg transition-shadow duration-300">
                  <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg mb-3">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </Card>
              </FadeIn>
            ))}
          </div>
        </Container>
      </Section>

      {/* FAQ Section */}
      <Section spacing="lg">
        <Container>
          <div className="text-center mb-12">
            <Heading level={2} size="xl" className="mb-4">
              Frequently Asked Questions
            </Heading>
            <Text size="lg" variant="muted">
              Everything you need to know about our pricing and plans
            </Text>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <FadeIn key={index} delay={index * 0.1}>
                <Card className="p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start gap-3 mb-3">
                    <HelpCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <Text className="font-semibold">{faq.question}</Text>
                  </div>
                  <Text size="sm" variant="muted" className="leading-relaxed ml-8">
                    {faq.answer}
                  </Text>
                </Card>
              </FadeIn>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section spacing="lg" className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <Container className="text-center">
          <FadeIn>
            <Heading level={2} size="xl" className="mb-4">
              Ready to Optimize Your Database?
            </Heading>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <Text size="lg" variant="muted" className="mb-8">
              Start your free trial today and see the difference AI-powered optimization can make.
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
