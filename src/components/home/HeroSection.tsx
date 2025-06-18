
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { ArrowRight, Star, HelpCircle } from 'lucide-react';
import { FadeIn, ScaleIn, HoverScale } from '@/components/ui/enhanced-animations';
import { Section, Container, Heading, Text } from '@/components/ui/visual-hierarchy';
import { TooltipGuidance, UserGuidance } from '@/components/ui/user-guidance';
import { FloatingQuerySnippets } from './FloatingQuerySnippets';
import { PerformanceCounter } from './PerformanceCounter';
import { InteractiveQueryInput } from './InteractiveQueryInput';

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
    <Section spacing="lg" className="relative text-center bg-gradient-to-b from-background via-background to-muted/30 overflow-hidden">
      <Container className="relative z-10">
        {/* Floating Query Snippets Background */}
        <FloatingQuerySnippets />
        
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
            className="mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent"
          >
            Optimize Database Performance 10x Faster with AI
          </Heading>
        </FadeIn>
        
        <FadeIn delay={0.6}>
          <Text size="lg" variant="muted" className="mb-8 max-w-3xl mx-auto leading-relaxed">
            Transform your SQL queries with advanced AI analysis. Get instant optimization recommendations, 
            performance insights, and automated improvements that can boost your database performance by up to 10x.
          </Text>
        </FadeIn>
        
        <FadeIn delay={0.8}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <TooltipGuidance content="Start exploring DBooster with our interactive demo">
              <HoverScale>
                <EnhancedButton 
                  size="xl" 
                  onClick={onGetStarted} 
                  className="text-lg px-8 min-h-[56px] min-w-[200px] shadow-lg hover:shadow-xl transition-all duration-300"
                  loading={isLoading}
                  loadingText="Starting..."
                  aria-label={user ? 'Go to Dashboard' : 'Try Free Demo'}
                >
                  {user ? 'Go to Dashboard' : 'Try Free Demo'}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </EnhancedButton>
              </HoverScale>
            </TooltipGuidance>
            
            <HoverScale>
              <EnhancedButton 
                size="xl" 
                variant="outline" 
                onClick={onNavigateToLogin} 
                className="text-lg px-8 min-h-[56px] transition-all duration-300"
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
                    size="xl" 
                    className="text-lg px-4"
                    aria-label="Open getting started guide"
                  >
                    <HelpCircle className="h-6 w-6" />
                  </EnhancedButton>
                </TooltipGuidance>
              }
            />
          </div>
        </FadeIn>

        {/* Performance Metrics */}
        <FadeIn delay={1.0}>
          <div className="mb-12">
            <Text size="sm" variant="muted" className="mb-6 font-medium">
              Trusted by thousands of developers worldwide
            </Text>
            <PerformanceCounter />
          </div>
        </FadeIn>

        {/* Interactive Query Demo */}
        <FadeIn delay={1.2}>
          <div className="mb-8">
            <InteractiveQueryInput />
          </div>
        </FadeIn>

        {/* Social Proof */}
        <FadeIn delay={1.4}>
          <Text size="sm" variant="muted" className="max-w-2xl mx-auto">
            "DBooster transformed our database performance monitoring. We reduced query response times by 73% 
            in the first month and saved countless hours of manual optimization work."
          </Text>
          <Text size="sm" variant="muted" className="mt-2 font-medium">
            — Database Engineering Team, Fortune 500 Company
          </Text>
        </FadeIn>
      </Container>

      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-green-500/5 pointer-events-none" />
    </Section>
  );
}
