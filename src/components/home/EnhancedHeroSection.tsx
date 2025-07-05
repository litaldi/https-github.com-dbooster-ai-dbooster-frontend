
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, CheckCircle } from 'lucide-react';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EnhancedPerformanceCounters } from './EnhancedPerformanceCounters';
import { FloatingQuerySnippets } from './FloatingQuerySnippets';
import { Section, Container, Heading, Text } from '@/components/ui/visual-hierarchy';

interface EnhancedHeroSectionProps {
  user: any;
  isLoading: boolean;
  onGetStarted: () => void;
  onNavigateToLogin: () => void;
  guidanceSteps: Array<{
    title: string;
    description: string;
    action: string;
  }>;
}

export function EnhancedHeroSection({
  user,
  isLoading,
  onGetStarted,
  onNavigateToLogin,
  guidanceSteps
}: EnhancedHeroSectionProps) {
  return (
    <Section 
      spacing="xl" 
      className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/30"
    >
      <FloatingQuerySnippets />
      
      <Container>
        {/* Skip link for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
        >
          Skip to main content
        </a>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="space-y-8"
          >
            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Badge 
                variant="secondary" 
                className="px-4 py-2 text-sm font-medium"
                role="banner"
              >
                <CheckCircle className="mr-2 h-4 w-4 text-green-500" aria-hidden="true" />
                Trusted by 10,000+ developers worldwide
              </Badge>
            </motion.div>

            {/* Main Heading */}
            <div className="space-y-4">
              <Heading 
                level={1} 
                size="3xl" 
                className="text-foreground leading-tight"
              >
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  Supercharge
                </span>{' '}
                Your Database Performance with AI
              </Heading>
              
              <Text size="lg" variant="muted" className="max-w-2xl">
                Transform slow queries into lightning-fast operations. DBooster's AI analyzes your database, 
                identifies bottlenecks, and delivers optimization recommendations that improve performance by up to{' '}
                <strong className="text-primary font-semibold">73% faster</strong>.
              </Text>
            </div>

            {/* Key Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="grid sm:grid-cols-2 gap-4"
            >
              {[
                { text: 'Enterprise-grade security', icon: '🔒' },
                { text: '5-minute setup', icon: '⚡' },
                { text: 'Real-time optimization', icon: '📈' },
                { text: 'Team collaboration', icon: '👥' }
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-lg" role="img" aria-label={benefit.text}>
                    {benefit.icon}
                  </span>
                  <Text size="sm" className="text-muted-foreground">
                    {benefit.text}
                  </Text>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <EnhancedButton
                onClick={onGetStarted}
                size="lg"
                loading={isLoading}
                loadingText="Setting up your environment..."
                ariaLabel={user ? "Access your DBooster dashboard" : "Start free demo of DBooster"}
                className="group min-w-[200px] text-base font-medium"
              >
                {user ? 'Open Dashboard' : 'Start Free Demo'}
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </EnhancedButton>

              <EnhancedButton
                onClick={onNavigateToLogin}
                variant="outline"
                size="lg"
                ariaLabel="Watch DBooster product demo"
                className="group min-w-[180px] text-base font-medium"
              >
                <Play className="mr-2 h-5 w-5 transition-transform group-hover:scale-110" aria-hidden="true" />
                Watch Demo
              </EnhancedButton>
            </motion.div>
          </motion.div>

          {/* Interactive Demo Panel */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="space-y-6"
          >
            <Card className="p-6 shadow-xl border-0 bg-background/60 backdrop-blur-sm">
              <CardContent className="p-0">
                <div className="space-y-6">
                  <div className="text-center">
                    <Heading level={3} size="lg" className="mb-2">
                      Real Results from Real Users
                    </Heading>
                    <Text size="sm" variant="muted">
                      Performance improvements across our customer base
                    </Text>
                  </div>
                  
                  <EnhancedPerformanceCounters />
                </div>
              </CardContent>
            </Card>

            {/* Quick Start Guide */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="space-y-4"
            >
              <Heading level={3} size="sm" className="text-center">
                Get Started in 3 Steps
              </Heading>
              
              <div className="space-y-3">
                {guidanceSteps.map((step, index) => (
                  <Card key={index} className="p-4 bg-muted/50 border-0">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Text size="sm" className="font-medium mb-1">
                          {step.title}
                        </Text>
                        <Text size="xs" variant="muted" className="line-clamp-2">
                          {step.description}
                        </Text>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </Container>

      {/* Main content landmark */}
      <div id="main-content" className="sr-only">
        Main content starts here
      </div>
    </Section>
  );
}
