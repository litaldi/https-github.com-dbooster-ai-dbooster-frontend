
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Users, Zap, Shield } from 'lucide-react';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Section, Container, Heading, Text } from '@/components/ui/visual-hierarchy';

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
  const testimonials = [
    {
      quote: "DBooster reduced our query times by 68% and saved us $45K annually in cloud costs.",
      author: "Sarah Chen",
      role: "Senior Database Engineer",
      company: "TechCorp"
    },
    {
      quote: "The AI recommendations were spot-on. We optimized our entire database in just one afternoon.",
      author: "Michael Rodriguez",
      role: "CTO",
      company: "StartupXYZ"
    },
    {
      quote: "Finally, a tool that actually understands our complex database relationships.",
      author: "Emma Thompson",
      role: "Lead Developer",
      company: "Enterprise Solutions"
    }
  ];

  const trustIndicators = [
    { icon: <Users className="h-5 w-5" />, text: "10,000+ Active Users" },
    { icon: <Star className="h-5 w-5" />, text: "4.9/5 Average Rating" },
    { icon: <Zap className="h-5 w-5" />, text: "73% Avg Performance Gain" },
    { icon: <Shield className="h-5 w-5" />, text: "SOC2 Compliant" }
  ];

  return (
    <Section spacing="xl" className="bg-gradient-to-t from-primary/5 to-background">
      <Container>
        <div className="text-center space-y-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="secondary" className="mb-4">
              Join thousands of developers
            </Badge>
            
            <Heading level={2} size="2xl" className="mb-4">
              Ready to{' '}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Transform
              </span>{' '}
              Your Database Performance?
            </Heading>
            
            <Text size="lg" variant="muted" className="max-w-3xl mx-auto">
              Join thousands of developers who have already supercharged their databases with DBooster's AI-powered optimization platform.
            </Text>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            {trustIndicators.map((indicator, index) => (
              <div key={index} className="flex flex-col items-center gap-2 text-center">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  {indicator.icon}
                </div>
                <Text size="sm" className="font-medium">
                  {indicator.text}
                </Text>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Testimonials */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid md:grid-cols-3 gap-6 mb-16"
        >
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 bg-background/60 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-0">
                <div className="flex items-start gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                
                <blockquote className="text-sm italic mb-4 text-muted-foreground">
                  "{testimonial.quote}"
                </blockquote>
                
                <div>
                  <div className="font-semibold text-sm">{testimonial.author}</div>
                  <div className="text-xs text-muted-foreground">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center space-y-6"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <EnhancedButton
              onClick={onGetStarted}
              size="lg"
              loading={isLoading}
              loadingText="Preparing your experience..."
              ariaLabel={user ? "Access your DBooster dashboard" : "Start your free DBooster demo"}
              className="group min-w-[240px] text-base font-semibold"
            >
              {user ? 'Open Dashboard' : 'Start Free Demo Now'}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </EnhancedButton>

            <EnhancedButton
              onClick={onNavigateToLearn}
              variant="outline"
              size="lg"
              ariaLabel="Learn more about DBooster features"
              className="min-w-[200px] text-base font-medium"
            >
              Learn More
            </EnhancedButton>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
            <span>✅ No credit card required</span>
            <span className="hidden sm:inline">•</span>
            <span>✅ 5-minute setup</span>
            <span className="hidden sm:inline">•</span>
            <span>✅ Cancel anytime</span>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}
