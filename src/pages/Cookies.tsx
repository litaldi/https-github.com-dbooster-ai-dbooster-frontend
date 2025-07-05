
import { SmartHeader } from '@/components/navigation/SmartHeader';
import { Section, Container, Heading, Text } from '@/components/ui/visual-hierarchy';
import { FadeIn } from '@/components/ui/animations';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Cookie, Settings, Shield, Info, CheckCircle2 } from 'lucide-react';

export default function Cookies() {
  return (
    <div className="min-h-screen bg-background">
      <SmartHeader />
      
      <main className="pt-16">
        <Section spacing="xl" className="bg-gradient-to-b from-background to-muted/20">
          <Container>
            <FadeIn>
              <div className="text-center space-y-4 mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                  <Cookie className="h-8 w-8 text-orange-600" />
                </div>
                <Heading level={1} size="3xl">Cookie Policy</Heading>
                <Text size="lg" variant="muted" className="max-w-2xl mx-auto">
                  How we use cookies to improve your experience while respecting your privacy
                </Text>
                <Text size="sm" variant="muted">
                  Last updated: December 2024
                </Text>
              </div>
            </FadeIn>
          </Container>
        </Section>

        <Section spacing="lg">
          <Container size="md">
            <div className="space-y-8">
              <FadeIn delay={0.1}>
                <Card className="border-blue-200 bg-blue-50/50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Info className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="space-y-3">
                        <Heading level={2} size="lg">What Are Cookies?</Heading>
                        <Text variant="muted">
                          Cookies are small text files that are placed on your device when you visit our website. 
                          They help us provide you with a better, faster, and safer experience by remembering your 
                          preferences and enabling essential website functionality.
                        </Text>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>

              <FadeIn delay={0.2}>
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <Heading level={2} size="lg">Types of Cookies We Use</Heading>
                      
                      <div className="grid gap-4">
                        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                            <Text size="sm" className="font-medium text-green-800">Essential Cookies</Text>
                          </div>
                          <Text size="sm" variant="muted" className="text-green-700">
                            Required for basic website functionality, security, and user authentication. 
                            These cannot be disabled.
                          </Text>
                          <div className="mt-2 text-xs text-green-600">
                            Examples: Session management, security tokens, load balancing
                          </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Settings className="h-5 w-5 text-blue-600" />
                            <Text size="sm" className="font-medium text-blue-800">Functional Cookies</Text>
                          </div>
                          <Text size="sm" variant="muted" className="text-blue-700">
                            Remember your preferences and settings to provide a personalized experience.
                          </Text>
                          <div className="mt-2 text-xs text-blue-600">
                            Examples: Language preferences, theme settings, dashboard layout
                          </div>
                        </div>

                        <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Shield className="h-5 w-5 text-purple-600" />
                            <Text size="sm" className="font-medium text-purple-800">Analytics Cookies</Text>
                          </div>
                          <Text size="sm" variant="muted" className="text-purple-700">
                            Help us understand how you use our website to improve performance and user experience.
                          </Text>
                          <div className="mt-2 text-xs text-purple-600">
                            Examples: Page views, feature usage, performance metrics (anonymized)
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>

              <FadeIn delay={0.3}>
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <Heading level={2} size="lg">Your Cookie Choices</Heading>
                      <Text variant="muted">
                        You have control over which cookies you accept. Here are your options:
                      </Text>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <Text size="sm" className="font-medium">Browser Settings</Text>
                          <Text size="sm" variant="muted">
                            Most browsers allow you to control cookies through their settings. 
                            You can block or delete cookies, but this may affect website functionality.
                          </Text>
                        </div>
                        <div className="space-y-3">
                          <Text size="sm" className="font-medium">Cookie Preferences</Text>
                          <Text size="sm" variant="muted">
                            Use our cookie preference center to customize which types of cookies you accept.
                          </Text>
                          <Button size="sm" variant="outline">
                            Manage Cookie Preferences
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>

              <FadeIn delay={0.4}>
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <Heading level={2} size="lg">Third-Party Cookies</Heading>
                      <Text variant="muted">
                        We may use third-party services that set their own cookies. These include:
                      </Text>
                      
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <ul className="space-y-2 text-sm text-muted-foreground">
                          <li>• <strong>Authentication providers</strong> - For secure login functionality</li>
                          <li>• <strong>Analytics services</strong> - To understand website usage (anonymized data only)</li>
                          <li>• <strong>Performance monitoring</strong> - To ensure optimal website performance</li>
                        </ul>
                      </div>
                      
                      <Text size="sm" variant="muted">
                        We carefully vet all third-party services to ensure they meet our privacy standards.
                      </Text>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>

              <FadeIn delay={0.5}>
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <Heading level={2} size="lg">Data Retention</Heading>
                      <Text variant="muted">
                        Different types of cookies are stored for different periods:
                      </Text>
                      
                      <div className="grid gap-3">
                        <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
                          <Text size="sm">Session Cookies</Text>
                          <Text size="sm" variant="muted">Deleted when you close your browser</Text>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
                          <Text size="sm">Functional Cookies</Text>
                          <Text size="sm" variant="muted">Up to 1 year</Text>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
                          <Text size="sm">Analytics Cookies</Text>
                          <Text size="sm" variant="muted">Up to 2 years (anonymized)</Text>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>

              <FadeIn delay={0.6}>
                <div className="text-center py-8 border-t">
                  <Text size="sm" variant="muted">
                    Questions about our cookie policy? Contact us at{' '}
                    <a href="mailto:privacy@dbooster.ai" className="text-primary hover:underline">
                      privacy@dbooster.ai
                    </a>
                  </Text>
                </div>
              </FadeIn>
            </div>
          </Container>
        </Section>
      </main>
    </div>
  );
}
