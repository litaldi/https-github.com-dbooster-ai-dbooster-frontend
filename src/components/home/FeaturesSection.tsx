
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { ArrowRight } from 'lucide-react';
import { FadeIn, ScaleIn, StaggerContainer, StaggerItem, HoverScale } from '@/components/ui/enhanced-animations';
import { Section, Container, Heading, Text } from '@/components/ui/visual-hierarchy';
import { ProgressiveDisclosure } from '@/components/ui/accessibility-helpers';

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  highlight: boolean;
  details: string;
}

interface FeaturesSectionProps {
  features: Feature[];
  onViewAllFeatures: () => void;
}

export function FeaturesSection({ features, onViewAllFeatures }: FeaturesSectionProps) {
  return (
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
                  className={`h-full transition-all duration-300 cursor-pointer group border-2 hover:border-primary/20 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 ${
                    feature.highlight ? 'ring-2 ring-primary/20 bg-primary/5 border-primary/30' : 'hover:shadow-xl'
                  }`}
                  tabIndex={0}
                  role="article"
                  aria-labelledby={`feature-title-${index}`}
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
                    <CardTitle 
                      id={`feature-title-${index}`}
                      className="text-lg md:text-xl group-hover:text-primary transition-colors duration-300"
                    >
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="text-sm md:text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                    
                    <ProgressiveDisclosure
                      summary={<span className="text-sm font-medium text-primary">Learn more</span>}
                    >
                      <Text size="sm" variant="muted" className="mt-2">
                        {feature.details}
                      </Text>
                    </ProgressiveDisclosure>
                  </CardContent>
                </Card>
              </HoverScale>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <div className="text-center mt-12">
          <HoverScale>
            <EnhancedButton 
              size="lg" 
              variant="outline" 
              onClick={onViewAllFeatures} 
              className="text-lg px-8"
              aria-label="View all features page"
            >
              View All Features
              <ArrowRight className="ml-2 h-4 w-4" />
            </EnhancedButton>
          </HoverScale>
        </div>
      </Container>
    </Section>
  );
}
