
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { ArrowRight, AlertTriangle, TrendingUp, Zap } from 'lucide-react';
import { FadeIn, ScaleIn, HoverScale } from '@/components/ui/enhanced-animations';
import { Section, Container, Heading, Text } from '@/components/ui/visual-hierarchy';

interface ProblemSolutionHeroProps {
  onGetStarted: () => void;
  onLearnMore: () => void;
  isLoading?: boolean;
}

export function ProblemSolutionHero({ onGetStarted, onLearnMore, isLoading = false }: ProblemSolutionHeroProps) {
  return (
    <Section spacing="lg" className="text-center bg-gradient-to-b from-background via-background to-muted/30 relative overflow-hidden">
      <Container>
        {/* Problem Statement */}
        <FadeIn delay={0.1}>
          <div className="flex items-center justify-center gap-2 mb-6">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <Text size="sm" variant="muted" className="font-medium">
              Database queries taking forever? Infrastructure costs spiraling?
            </Text>
          </div>
        </FadeIn>
        
        <FadeIn delay={0.2}>
          <ScaleIn delay={0.3}>
            <Badge variant="secondary" className="mb-6 px-4 py-2">
              <Zap className="h-3 w-3 mr-2" />
              AI-Powered Database Optimization That Actually Works
            </Badge>
          </ScaleIn>
        </FadeIn>
        
        {/* Solution Statement */}
        <FadeIn delay={0.4}>
          <Heading 
            level={1} 
            size="3xl" 
            className="mb-6 bg-gradient-to-r from-primary via-primary to-primary/60 bg-clip-text text-transparent"
          >
            Stop Wrestling with Slow Queries.<br />
            <span className="text-foreground">Start Optimizing with AI.</span>
          </Heading>
        </FadeIn>
        
        <FadeIn delay={0.6}>
          <Text size="xl" variant="muted" className="mb-4 max-w-4xl mx-auto leading-relaxed">
            DBooster analyzes your SQL queries in seconds and delivers optimization recommendations that 
            <strong className="text-foreground"> reduce response times by up to 10x</strong> and 
            <strong className="text-foreground"> cut infrastructure costs by 60%</strong>.
          </Text>
        </FadeIn>

        <FadeIn delay={0.7}>
          <Text size="lg" variant="subtle" className="mb-8 max-w-3xl mx-auto">
            No more guessing, no more trial-and-error debugging. Just paste your query and get 
            expert-level optimizations instantly.
          </Text>
        </FadeIn>
        
        {/* Impact Metrics */}
        <FadeIn delay={0.8}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">10x</div>
              <Text size="sm" variant="muted">Faster Queries</Text>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">60%</div>
              <Text size="sm" variant="muted">Cost Reduction</Text>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">5min</div>
              <Text size="sm" variant="muted">Setup Time</Text>
            </div>
          </div>
        </FadeIn>
        
        {/* CTAs */}
        <FadeIn delay={0.9}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <HoverScale>
              <EnhancedButton 
                size="xl" 
                onClick={onGetStarted} 
                className="text-lg px-8 min-h-[56px] min-w-[200px] shadow-lg hover:shadow-xl"
                loading={isLoading}
                loadingText="Starting your optimization journey..."
              >
                Optimize My Database Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </EnhancedButton>
            </HoverScale>
            
            <HoverScale>
              <EnhancedButton 
                size="xl" 
                variant="outline" 
                onClick={onLearnMore} 
                className="text-lg px-8 min-h-[56px] min-w-[200px] border-2"
              >
                <TrendingUp className="mr-2 h-5 w-5" />
                See How It Works
              </EnhancedButton>
            </HoverScale>
          </div>
        </FadeIn>
        
        <FadeIn delay={1.0}>
          <Text size="sm" variant="muted" className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Join 10,000+ developers who've already optimized their databases
          </Text>
        </Fadein>
      </Container>
    </Section>
  );
}
