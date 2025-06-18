
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code, Palette, Accessibility, ArrowRight } from 'lucide-react';
import { FadeIn, HoverScale } from '@/components/ui/enhanced-animations';
import { Section, Container, Heading, Text } from '@/components/ui/visual-hierarchy';
import { useTheme } from 'next-themes';

interface InteractiveDemoSectionProps {
  onTryDemo: () => void;
}

export function InteractiveDemoSection({ onTryDemo }: InteractiveDemoSectionProps) {
  const { theme, setTheme } = useTheme();
  const [activeFeature, setActiveFeature] = useState('optimization');

  const demoFeatures = {
    optimization: {
      title: "Query Optimization",
      description: "Watch AI analyze and optimize a complex SQL query in real-time",
      before: "SELECT * FROM orders o JOIN customers c ON o.customer_id = c.id WHERE o.created_at > '2024-01-01'",
      after: "SELECT o.id, o.total, c.name FROM orders o JOIN customers c ON o.customer_id = c.id WHERE o.created_at > '2024-01-01' AND o.status = 'active' ORDER BY o.created_at DESC LIMIT 1000",
      improvement: "87% faster execution"
    },
    themes: {
      title: "Accessible Themes",
      description: "Experience seamless theme switching with full accessibility support",
      feature: "Live theme preview"
    },
    accessibility: {
      title: "Accessibility Features",
      description: "See keyboard navigation, screen reader support, and high contrast modes in action",
      feature: "WCAG 2.1 AA compliant"
    }
  };

  return (
    <Section spacing="lg" className="bg-muted/20">
      <Container>
        <div className="text-center mb-12">
          <FadeIn>
            <Badge variant="outline" className="mb-4 px-4 py-2">
              <Code className="h-3 w-3 mr-2" />
              Interactive Preview
            </Badge>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <Heading level={2} size="xl" className="mb-4">
              Experience DBooster in Action
            </Heading>
          </FadeIn>
          
          <FadeIn delay={0.4}>
            <Text size="lg" variant="muted" className="max-w-2xl mx-auto">
              Don't just read about it – see how DBooster transforms your database performance 
              and development experience.
            </Text>
          </FadeIn>
        </div>

        <FadeIn delay={0.6}>
          <Card className="max-w-4xl mx-auto border-2 border-primary/20 shadow-lg">
            <CardHeader>
              <Tabs value={activeFeature} onValueChange={setActiveFeature} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="optimization" className="flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    Query Optimization
                  </TabsTrigger>
                  <TabsTrigger value="themes" className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Theme System
                  </TabsTrigger>
                  <TabsTrigger value="accessibility" className="flex items-center gap-2">
                    <Accessibility className="h-4 w-4" />
                    Accessibility
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="optimization" className="mt-6">
                  <div className="space-y-4">
                    <div>
                      <Text className="font-semibold mb-2 text-red-600">Before Optimization:</Text>
                      <Card className="bg-red-50 dark:bg-red-900/20 border-red-200">
                        <CardContent className="p-4">
                          <code className="text-sm">{demoFeatures.optimization.before}</code>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="text-center py-2">
                      <Badge variant="secondary" className="animate-pulse">
                        AI Processing...
                      </Badge>
                    </div>
                    
                    <div>
                      <Text className="font-semibold mb-2 text-green-600">After Optimization:</Text>
                      <Card className="bg-green-50 dark:bg-green-900/20 border-green-200">
                        <CardContent className="p-4">
                          <code className="text-sm">{demoFeatures.optimization.after}</code>
                        </CardContent>
                      </Card>
                      <Badge variant="default" className="mt-2 bg-green-600">
                        {demoFeatures.optimization.improvement}
                      </Badge>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="themes" className="mt-6">
                  <div className="text-center space-y-4">
                    <Text variant="muted">Try switching themes to see the seamless transition:</Text>
                    <div className="flex justify-center gap-2">
                      <EnhancedButton 
                        variant={theme === 'light' ? 'default' : 'outline'} 
                        onClick={() => setTheme('light')}
                        size="sm"
                      >
                        Light
                      </EnhancedButton>
                      <EnhancedButton 
                        variant={theme === 'dark' ? 'default' : 'outline'} 
                        onClick={() => setTheme('dark')}
                        size="sm"
                      >
                        Dark
                      </EnhancedButton>
                      <EnhancedButton 
                        variant={theme === 'system' ? 'default' : 'outline'} 
                        onClick={() => setTheme('system')}
                        size="sm"
                      >
                        System
                      </EnhancedButton>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="accessibility" className="mt-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                      <CardContent className="p-4">
                        <Text className="font-semibold mb-2">Keyboard Navigation</Text>
                        <Text size="sm" variant="muted">
                          Try pressing Tab to navigate through elements. All interactive components 
                          are fully keyboard accessible.
                        </Text>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-purple-200 bg-purple-50 dark:bg-purple-900/20">
                      <CardContent className="p-4">
                        <Text className="font-semibold mb-2">Screen Reader Support</Text>
                        <Text size="sm" variant="muted">
                          Every element includes proper ARIA labels and semantic HTML for 
                          optimal screen reader compatibility.
                        </Text>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardHeader>
          </Card>
        </FadeIn>

        <div className="text-center mt-8">
          <FadeIn delay={0.8}>
            <HoverScale>
              <EnhancedButton 
                size="lg" 
                onClick={onTryDemo}
                className="text-lg px-8"
              >
                Try Full Interactive Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </EnhancedButton>
            </HoverScale>
          </FadeIn>
        </div>
      </Container>
    </Section>
  );
}
