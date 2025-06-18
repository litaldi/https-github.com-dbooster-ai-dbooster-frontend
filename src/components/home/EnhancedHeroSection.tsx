
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { ArrowRight, Star, HelpCircle, Zap, Building, Shield } from 'lucide-react';
import { FadeIn, ScaleIn, HoverScale } from '@/components/ui/enhanced-animations';
import { Section, Container, Heading, Text } from '@/components/ui/visual-hierarchy';
import { TooltipGuidance, UserGuidance } from '@/components/ui/user-guidance';
import { FloatingQuerySnippets } from './FloatingQuerySnippets';
import { EnhancedPerformanceCounters } from './EnhancedPerformanceCounters';
import { InteractiveQueryInput } from './InteractiveQueryInput';
import { InteractiveButton } from '@/components/ui/micro-interactions';

interface EnhancedHeroSectionProps {
  user: any;
  isLoading: boolean;
  onGetStarted: () => void;
  onNavigateToLogin: () => void;
  guidanceSteps: any[];
}

export function EnhancedHeroSection({ 
  user, 
  isLoading, 
  onGetStarted, 
  onNavigateToLogin, 
  guidanceSteps 
}: EnhancedHeroSectionProps) {
  return (
    <Section spacing="lg" className="relative text-center bg-gradient-to-b from-background via-background to-muted/30 overflow-hidden">
      <Container className="relative z-10">
        {/* Floating Query Snippets Background */}
        <FloatingQuerySnippets />
        
        <FadeIn delay={0.2}>
          <ScaleIn delay={0.3}>
            <Badge variant="secondary" className="mb-6 bg-primary/10 text-primary border-primary/20">
              <Star className="h-3 w-3 mr-1" />
              Enterprise AI-Powered Database Optimization
            </Badge>
          </ScaleIn>
        </FadeIn>
        
        <FadeIn delay={0.4}>
          <Heading 
            level={1} 
            size="2xl" 
            className="mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent"
          >
            Reduce Query Response Times by 73% with Enterprise AI
          </Heading>
        </FadeIn>
        
        <FadeIn delay={0.6}>
          <Text size="lg" variant="muted" className="mb-8 max-w-4xl mx-auto leading-relaxed">
            Transform your database performance with enterprise-grade AI optimization. 
            Join thousands of companies automating 80% of performance tuning tasks while cutting database costs by 40-60%.
          </Text>
        </FadeIn>

        {/* Key Benefits */}
        <FadeIn delay={0.7}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 p-3 bg-blue-50 rounded-lg">
              <Zap className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">73% Faster Queries</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-3 bg-green-50 rounded-lg">
              <Building className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">60% Cost Reduction</span>
            </div>
            <div className="flex items-center justify-center gap-2 p-3 bg-purple-50 rounded-lg">
              <Shield className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium">SOC2 Enterprise Ready</span>
            </div>
          </div>
        </FadeIn>
        
        <FadeIn delay={0.8}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <TooltipGuidance content="Start your enterprise database optimization journey">
              <InteractiveButton
                onClick={onGetStarted}
                className="bg-primary text-primary-foreground shadow-lg hover:shadow-xl text-lg px-8 min-h-[56px] min-w-[220px] rounded-lg transition-all duration-300"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Starting optimization...
                  </>
                ) : (
                  <>
                    {user ? 'Access Dashboard' : 'Start Free Enterprise Trial'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </InteractiveButton>
            </TooltipGuidance>
            
            <InteractiveButton
              onClick={onNavigateToLogin}
              variant="subtle"
              className="border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground text-lg px-8 min-h-[56px] rounded-lg transition-all duration-300"
            >
              {user ? 'Settings' : 'Enterprise Sign In'}
            </InteractiveButton>

            <UserGuidance
              title="Enterprise Setup Guide"
              description="Learn how to maximize ROI with database optimization"
              steps={guidanceSteps}
              trigger={
                <TooltipGuidance content="Need help with enterprise setup?">
                  <InteractiveButton
                    variant="subtle"
                    className="text-lg px-4 min-h-[56px] hover:bg-accent rounded-lg"
                  >
                    <HelpCircle className="h-6 w-6" />
                  </InteractiveButton>
                </TooltipGuidance>
              }
            />
          </div>
        </FadeIn>

        {/* Enhanced Performance Metrics */}
        <FadeIn delay={1.0}>
          <div className="mb-12">
            <EnhancedPerformanceCounters />
          </div>
        </FadeIn>

        {/* Interactive Query Demo */}
        <FadeIn delay={1.2}>
          <div className="mb-8">
            <InteractiveQueryInput />
          </div>
        </FadeIn>

        {/* Enterprise Social Proof */}
        <FadeIn delay={1.4}>
          <div className="bg-muted/20 rounded-lg p-6 max-w-4xl mx-auto">
            <Text size="sm" variant="muted" className="max-w-3xl mx-auto leading-relaxed">
              "DBQuery Optimizer transformed our enterprise database performance monitoring. We reduced query response times by 73% 
              in the first month and cut database costs by $50,000 annually while automating 80% of our performance tuning tasks."
            </Text>
            <Text size="sm" variant="muted" className="mt-3 font-medium">
              — Senior Database Engineering Manager, Fortune 500 Financial Services Company
            </Text>
            <div className="flex justify-center gap-2 mt-4">
              <Badge variant="outline" className="text-xs">SOC2 Compliant</Badge>
              <Badge variant="outline" className="text-xs">Enterprise Ready</Badge>
              <Badge variant="outline" className="text-xs">24/7 Support</Badge>
            </div>
          </div>
        </FadeIn>
      </Container>

      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-green-500/5 pointer-events-none" />
    </Section>
  );
}
