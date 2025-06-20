
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Zap, 
  TrendingUp, 
  Shield, 
  Users, 
  GitBranch, 
  ArrowRight,
  CheckCircle,
  DollarSign,
  Clock
} from 'lucide-react';
import { FadeIn, StaggerContainer, StaggerItem, HoverScale } from '@/components/ui/animations';
import { Section, Container, Heading, Text } from '@/components/ui/visual-hierarchy';

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  benefits: string[];
  category: string;
  isPopular?: boolean;
  metrics?: {
    improvement: string;
    timeToValue: string;
    costSaving: string;
  };
}

interface EnhancedFeaturesShowcaseProps {
  onViewAllFeatures: () => void;
  onStartTrial: () => void;
}

export function EnhancedFeaturesShowcase({ onViewAllFeatures, onStartTrial }: EnhancedFeaturesShowcaseProps) {
  const [activeCategory, setActiveCategory] = useState('core');

  const features: Feature[] = [
    {
      icon: Brain,
      title: "AI Query Analyzer",
      description: "Advanced machine learning algorithms analyze your SQL queries to identify performance bottlenecks and optimization opportunities instantly.",
      benefits: ["10x faster query execution", "Automated index recommendations", "Real-time performance scoring"],
      category: "core",
      isPopular: true,
      metrics: {
        improvement: "87% average performance gain",
        timeToValue: "< 30 seconds",
        costSaving: "60% infrastructure cost reduction"
      }
    },
    {
      icon: Zap,
      title: "Smart Optimization Engine",
      description: "Get intelligent, context-aware recommendations that understand your database schema, query patterns, and business logic.",
      benefits: ["Context-aware suggestions", "Schema-intelligent optimization", "Query pattern recognition"],
      category: "core",
      isPopular: true,
      metrics: {
        improvement: "92% query optimization success rate",
        timeToValue: "Instant recommendations",
        costSaving: "45% development time saved"
      }
    },
    {
      icon: TrendingUp,
      title: "Performance Analytics",
      description: "Comprehensive dashboards and analytics to track query performance trends, identify recurring issues, and measure optimization impact.",
      benefits: ["Historical performance tracking", "Trend analysis", "ROI measurement"],
      category: "analytics",
      metrics: {
        improvement: "Complete visibility into DB performance",
        timeToValue: "Real-time insights",
        costSaving: "30% reduction in debugging time"
      }
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "SOC2 compliant platform with enterprise-grade security, audit logging, and team collaboration features built for modern development teams.",
      benefits: ["SOC2 compliance", "End-to-end encryption", "Comprehensive audit trails"],
      category: "enterprise",
      metrics: {
        improvement: "100% compliance ready",
        timeToValue: "Enterprise deployment in 1 day",
        costSaving: "Zero security overhead"
      }
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share optimizations, conduct code reviews, and collaborate on database improvements with built-in team workflows and knowledge sharing.",
      benefits: ["Shared optimization libraries", "Code review workflows", "Knowledge management"],
      category: "collaboration",
      metrics: {
        improvement: "3x faster team knowledge sharing",
        timeToValue: "Immediate team productivity boost",
        costSaving: "25% reduction in code review time"
      }
    },
    {
      icon: GitBranch,
      title: "CI/CD Integration",
      description: "Seamlessly integrate with your development workflow through GitHub, GitLab, and popular CI/CD platforms for automated query optimization.",
      benefits: ["Automated PR scanning", "CI/CD pipeline integration", "Pre-deployment optimization"],
      category: "integration",
      metrics: {
        improvement: "100% automated optimization coverage",
        timeToValue: "5-minute setup",
        costSaving: "Prevent 95% of production performance issues"
      }
    }
  ];

  const categories = [
    { id: 'core', label: 'Core AI Features', icon: Brain },
    { id: 'analytics', label: 'Analytics & Insights', icon: TrendingUp },
    { id: 'enterprise', label: 'Enterprise Ready', icon: Shield },
    { id: 'collaboration', label: 'Team Features', icon: Users },
    { id: 'integration', label: 'Integrations', icon: GitBranch }
  ];

  const filteredFeatures = features.filter(feature => feature.category === activeCategory);

  return (
    <Section spacing="lg">
      <Container>
        <div className="text-center mb-12">
          <FadeIn>
            <Badge variant="outline" className="mb-4 px-4 py-2">
              <Zap className="h-3 w-3 mr-2" />
              Complete Feature Set
            </Badge>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <Heading level={2} size="xl" className="mb-4">
              Everything You Need to Optimize Database Performance
            </Heading>
          </FadeIn>
          
          <FadeIn delay={0.4}>
            <Text size="lg" variant="muted" className="max-w-3xl mx-auto mb-8">
              From AI-powered query analysis to enterprise-grade security and team collaboration – 
              DBooster provides a complete toolkit for modern database optimization.
            </Text>
          </FadeIn>
        </div>

        <FadeIn delay={0.6}>
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 mb-8">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id}
                    className="flex items-center gap-2 text-xs lg:text-sm"
                  >
                    <Icon className="h-3 w-3 lg:h-4 lg:w-4" />
                    <span className="hidden sm:inline">{category.label}</span>
                    <span className="sm:hidden">{category.label.split(' ')[0]}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <StaggerContainer className="grid md:grid-cols-2 gap-6">
                  {filteredFeatures.map((feature, index) => (
                    <StaggerItem key={index}>
                      <HoverScale>
                        <Card className={`h-full transition-all duration-300 border-2 hover:shadow-xl ${
                          feature.isPopular 
                            ? 'ring-2 ring-primary/20 bg-primary/5 border-primary/30' 
                            : 'hover:border-primary/20'
                        }`}>
                          <CardHeader className="pb-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className={`p-3 rounded-xl ${
                                  feature.isPopular 
                                    ? 'bg-primary/15 text-primary shadow-lg' 
                                    : 'bg-muted text-muted-foreground'
                                }`}>
                                  <feature.icon className="h-6 w-6" />
                                </div>
                                {feature.isPopular && (
                                  <Badge variant="default" className="animate-pulse">
                                    Most Popular
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <CardTitle className="text-xl mb-2">
                              {feature.title}
                            </CardTitle>
                            
                            <CardDescription className="text-base leading-relaxed">
                              {feature.description}
                            </CardDescription>
                          </CardHeader>
                          
                          <CardContent className="space-y-4">
                            <div>
                              <Text size="sm" className="font-semibold mb-2">Key Benefits:</Text>
                              <div className="space-y-1">
                                {feature.benefits.map((benefit, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                                    <Text size="sm" variant="muted">{benefit}</Text>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            {feature.metrics && (
                              <div className="border-t pt-4">
                                <Text size="sm" className="font-semibold mb-2">Impact Metrics:</Text>
                                <div className="grid grid-cols-1 gap-2">
                                  <div className="flex items-center gap-2">
                                    <TrendingUp className="h-3 w-3 text-blue-500" />
                                    <Text size="xs" variant="muted">{feature.metrics.improvement}</Text>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Clock className="h-3 w-3 text-green-500" />
                                    <Text size="xs" variant="muted">{feature.metrics.timeToValue}</Text>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <DollarSign className="h-3 w-3 text-purple-500" />
                                    <Text size="xs" variant="muted">{feature.metrics.costSaving}</Text>
                                  </div>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </HoverScale>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </TabsContent>
            ))}
          </Tabs>
        </FadeIn>

        <div className="text-center mt-12 space-y-6">
          <FadeIn delay={0.8}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <HoverScale>
                <EnhancedButton 
                  size="lg" 
                  onClick={onStartTrial}
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
                  onClick={onViewAllFeatures}
                  className="text-lg px-8"
                >
                  View All Features
                </EnhancedButton>
              </HoverScale>
            </div>
          </FadeIn>
          
          <FadeIn delay={1.0}>
            <Text size="sm" variant="muted">
              Join 10,000+ developers already optimizing with DBooster
            </Text>
          </FadeIn>
        </div>
      </Container>
    </Section>
  );
}
