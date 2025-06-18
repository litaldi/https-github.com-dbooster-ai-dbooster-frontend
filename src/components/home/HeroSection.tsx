
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { ArrowRight, Star, HelpCircle } from 'lucide-react';
import { FadeIn, ScaleIn, HoverScale } from '@/components/ui/enhanced-animations';
import { Section, Container, Heading, Text } from '@/components/ui/visual-hierarchy';
import { TooltipGuidance, UserGuidance } from '@/components/ui/user-guidance';

interface HeroSectionProps {
  user: any;
  isLoading: boolean;
  onGetStarted: () => void;
  onNavigateToLogin: () => void;
  guidanceSteps: any[];
}

export function HeroSection({ 
  user, 
  isLoading, 
  onGetStarted, 
  onNavigateToLogin, 
  guidanceSteps 
}: HeroSectionProps) {
  return (
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
          <Heading 
            level={1} 
            size="2xl" 
            className="mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
          >
            Optimize Your Database Performance with AI
          </Heading>
        </FadeIn>
        
        <FadeIn delay={0.6}>
          <Text size="lg" variant="muted" className="mb-8 max-w-3xl mx-auto leading-relaxed">
            DBooster uses advanced AI to analyze your SQL queries, identify performance issues, and provide intelligent optimization recommendations that can improve your database performance by up to 10x.
          </Text>
        </FadeIn>
        
        <FadeIn delay={0.8}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <TooltipGuidance content="Start exploring DBooster with our interactive demo">
              <HoverScale>
                <EnhancedButton 
                  size="lg" 
                  onClick={onGetStarted} 
                  className="text-lg px-8 min-h-[48px] min-w-[120px] transition-all duration-300"
                  loading={isLoading}
                  loadingText="Starting..."
                  aria-label={user ? 'Go to Dashboard' : 'Try Free Demo'}
                >
                  {user ? 'Go to Dashboard' : 'Try Free Demo'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </EnhancedButton>
              </HoverScale>
            </TooltipGuidance>
            
            <HoverScale>
              <EnhancedButton 
                size="lg" 
                variant="outline" 
                onClick={onNavigateToLogin} 
                className="text-lg px-8 min-h-[48px] transition-all duration-300"
                aria-label={user ? 'Go to Settings' : 'Sign In'}
              >
                {user ? 'Settings' : 'Sign In'}
              </EnhancedButton>
            </HoverScale>

            <UserGuidance
              title="Getting Started Guide"
              description="Learn how to make the most of DBooster"
              steps={guidanceSteps}
              trigger={
                <TooltipGuidance content="Need help getting started?">
                  <EnhancedButton 
                    variant="ghost" 
                    size="lg" 
                    className="text-lg px-4"
                    aria-label="Open getting started guide"
                  >
                    <HelpCircle className="h-5 w-5" />
                  </EnhancedButton>
                </TooltipGuidance>
              }
            />
          </div>
        </FadeIn>
      </Container>
    </Section>
  );
}
