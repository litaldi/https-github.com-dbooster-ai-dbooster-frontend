
import { SmartHeader } from '@/components/navigation/SmartHeader';
import { Section, Container, Heading, Text } from '@/components/ui/visual-hierarchy';
import { FadeIn } from '@/components/ui/animations';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Lock, Eye, Database, Clock } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <SmartHeader />
      
      <main className="pt-16">
        <Section spacing="xl" className="bg-gradient-to-b from-background to-muted/20">
          <Container>
            <FadeIn>
              <div className="text-center space-y-4 mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <Heading level={1} size="3xl">Privacy Policy</Heading>
                <Text size="lg" variant="muted" className="max-w-2xl mx-auto">
                  Your privacy is fundamental to how we build and operate DBooster
                </Text>
                <Text size="sm" variant="muted">
                  Last updated: December 18, 2024
                </Text>
              </div>
            </FadeIn>
          </Container>
        </Section>

        <Section spacing="lg">
          <Container size="md">
            <div className="space-y-8">
              <FadeIn delay={0.1}>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Database className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="space-y-3">
                        <Heading level={2} size="lg">Information We Collect</Heading>
                        <Text variant="muted">
                          We collect information you provide directly to us, such as when you create an account, 
                          connect your database, or contact us for support.
                        </Text>
                        <div className="space-y-2">
                          <Text size="sm" className="font-medium">Account Information:</Text>
                          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            <li>Name, email address, and contact information</li>
                            <li>Account credentials and authentication data</li>
                            <li>Billing and payment information</li>
                          </ul>
                        </div>
                        <div className="space-y-2">
                          <Text size="sm" className="font-medium">Usage Data:</Text>
                          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                            <li>Database performance metrics and optimization results</li>
                            <li>Query patterns and execution statistics (anonymized)</li>
                            <li>Feature usage and interaction data</li>
                            <li>Log data and error reports</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>

              <FadeIn delay={0.2}>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Lock className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="space-y-3">
                        <Heading level={2} size="lg">How We Use Your Information</Heading>
                        <Text variant="muted">
                          We use the information we collect to provide, maintain, and improve our services.
                        </Text>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-green-50 p-4 rounded-lg">
                            <Text size="sm" className="font-medium text-green-900 mb-2">Service Delivery</Text>
                            <ul className="text-sm text-green-800 space-y-1">
                              <li>• Provide database optimization recommendations</li>
                              <li>• Generate performance analytics and reports</li>
                              <li>• Enable real-time monitoring capabilities</li>
                            </ul>
                          </div>
                          <div className="bg-blue-50 p-4 rounded-lg">
                            <Text size="sm" className="font-medium text-blue-900 mb-2">Platform Improvement</Text>
                            <ul className="text-sm text-blue-800 space-y-1">
                              <li>• Analyze usage patterns to enhance features</li>
                              <li>• Develop new optimization algorithms</li>
                              <li>• Improve system performance and reliability</li>
                            </ul>
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
                      <Heading level={2} size="lg">Data Security & Protection</Heading>
                      <Text variant="muted">
                        We implement comprehensive security measures to protect your data and maintain the highest 
                        standards of privacy and security.
                      </Text>
                      
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="text-center p-4 border rounded-lg">
                          <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                          <Text size="sm" className="font-medium">Encryption</Text>
                          <Text size="xs" variant="muted" className="mt-1">
                            All data encrypted in transit and at rest using AES-256
                          </Text>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <Lock className="h-8 w-8 text-primary mx-auto mb-2" />
                          <Text size="sm" className="font-medium">Access Control</Text>
                          <Text size="xs" variant="muted" className="mt-1">
                            Role-based access with multi-factor authentication
                          </Text>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <Eye className="h-8 w-8 text-primary mx-auto mb-2" />
                          <Text size="sm" className="font-medium">Monitoring</Text>
                          <Text size="xs" variant="muted" className="mt-1">
                            24/7 security monitoring and incident response
                          </Text>
                        </div>
                      </div>

                      <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                        <Text size="sm" className="font-medium text-primary mb-2">
                          SOC 2 Type II Compliance
                        </Text>
                        <Text size="sm" variant="muted">
                          DBooster is SOC 2 Type II compliant, ensuring we meet the highest standards for 
                          security, availability, processing integrity, confidentiality, and privacy.
                        </Text>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>

              <FadeIn delay={0.4}>
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <Heading level={2} size="lg">Your Privacy Rights</Heading>
                      <Text variant="muted">
                        You have comprehensive rights regarding your personal data. We are committed to 
                        honoring these rights and making them easy to exercise.
                      </Text>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <Text size="sm" className="font-medium">Data Access & Portability</Text>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Request copies of your personal data</li>
                            <li>• Export your data in machine-readable formats</li>
                            <li>• Access your data processing history</li>
                          </ul>
                        </div>
                        <div className="space-y-3">
                          <Text size="sm" className="font-medium">Data Control</Text>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Update or correct your information</li>
                            <li>• Delete your account and associated data</li>
                            <li>• Opt-out of non-essential data processing</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>

              <FadeIn delay={0.5}>
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <Heading level={2} size="lg">Data Retention & Deletion</Heading>
                      <Text variant="muted">
                        We retain your data only as long as necessary to provide our services and comply 
                        with legal obligations.
                      </Text>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
                          <Text size="sm">Account Data</Text>
                          <Text size="sm" variant="muted">Retained while account is active</Text>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
                          <Text size="sm">Performance Analytics</Text>
                          <Text size="sm" variant="muted">Aggregated data retained for 2 years</Text>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
                          <Text size="sm">Support Communications</Text>
                          <Text size="sm" variant="muted">Retained for 3 years after resolution</Text>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
                          <Text size="sm">Legal & Compliance Data</Text>
                          <Text size="sm" variant="muted">Retained as required by law</Text>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>

              <FadeIn delay={0.6}>
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <Heading level={2} size="lg">International Data Transfers</Heading>
                      <Text variant="muted">
                        We may transfer your data internationally to provide our services. When we do, 
                        we ensure appropriate safeguards are in place.
                      </Text>
                      
                      <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                        <Text size="sm" className="font-medium text-amber-900 mb-2">
                          Standard Contractual Clauses
                        </Text>
                        <Text size="sm" className="text-amber-800">
                          We use Standard Contractual Clauses approved by the European Commission 
                          to ensure GDPR-level protection for international transfers.
                        </Text>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>

              <FadeIn delay={0.7}>
                <div className="text-center py-8 border-t">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
                    <Clock className="h-4 w-4" />
                    <span>Last updated December 18, 2024</span>
                  </div>
                  <Text size="sm" variant="muted">
                    Questions about our privacy practices? Contact our Data Protection Officer at{' '}
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
