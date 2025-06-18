
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Section, Container, Heading, Text } from '@/components/ui/visual-hierarchy';
import { FadeIn, HoverScale } from '@/components/ui/enhanced-animations';
import { EnhancedButton } from '@/components/ui/enhanced-button';

interface EnhancedCTASectionProps {
  user: any;
  isLoading: boolean;
  onGetStarted: () => void;
  onNavigateToLearn: () => void;
}

export function EnhancedCTASection({ 
  user, 
  isLoading, 
  onGetStarted, 
  onNavigateToLearn 
}: EnhancedCTASectionProps) {
  return (
    <Section spacing="lg" className="bg-gradient-to-r from-primary/5 to-purple-500/5">
      <Container className="text-center">
        <FadeIn>
          <Heading level={2} size="xl" className="mb-4">
            Ready to Supercharge Your Database?
          </Heading>
        </FadeIn>
        
        <FadeIn delay={0.2}>
          <Text size="lg" variant="muted" className="mb-8 max-w-2xl mx-auto">
            Join thousands of developers who have improved their database performance by up to 10x with DBooster's AI-powered optimization recommendations.
          </Text>
        </FadeIn>
        
        <FadeIn delay={0.4}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <HoverScale>
              <EnhancedButton 
                size="xl" 
                onClick={onGetStarted} 
                className="min-w-[200px]"
                loading={isLoading}
                loadingText="Setting up your workspace..."
                aria-label="Start optimizing your database performance now"
              >
                {user ? 'Go to Your Dashboard' : 'Start Free Analysis'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </EnhancedButton>
            </HoverScale>
            
            <HoverScale>
              <EnhancedButton 
                variant="outline" 
                size="xl"
                onClick={onNavigateToLearn}
                className="min-w-[200px]"
              >
                Explore Learning Hub
              </EnhancedButton>
            </HoverScale>
          </div>
        </FadeIn>
        
        <FadeIn delay={0.6}>
          <Text size="sm" variant="muted" className="mt-6">
            No credit card required • 2-minute setup • Cancel anytime
          </Text>
        </FadeIn>
      </Container>
    </Section>
  );
}
