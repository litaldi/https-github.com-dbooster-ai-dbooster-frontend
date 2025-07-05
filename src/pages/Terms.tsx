
import { SmartHeader } from '@/components/navigation/SmartHeader';
import { Section, Container, Heading, Text } from '@/components/ui/visual-hierarchy';
import { FadeIn } from '@/components/ui/animations';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Scale, FileText, Clock } from 'lucide-react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <SmartHeader />
      
      <main className="pt-16">
        <Section spacing="xl" className="bg-gradient-to-b from-background to-muted/20">
          <Container>
            <FadeIn>
              <div className="text-center space-y-4 mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <Scale className="h-8 w-8 text-primary" />
                </div>
                <Heading level={1} size="3xl">Terms of Service</Heading>
                <Text size="lg" variant="muted" className="max-w-2xl mx-auto">
                  Clear, fair terms for using DBooster's database optimization platform
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
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="space-y-3">
                        <Heading level={2} size="lg">1. Acceptance of Terms</Heading>
                        <Text variant="muted">
                          By accessing and using DBooster, you accept and agree to be bound by the terms and provision of this agreement. 
                          These terms apply to all visitors, users, and others who access or use the service.
                        </Text>
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
                        <Shield className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="space-y-3">
                        <Heading level={2} size="lg">2. Use License</Heading>
                        <Text variant="muted">
                          Permission is granted to use DBooster for database optimization purposes. This license shall automatically 
                          terminate if you violate any of these restrictions and may be terminated by us at any time.
                        </Text>
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <Text size="sm">
                            <strong>You may not:</strong>
                          </Text>
                          <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                            <li>Reverse engineer or attempt to extract source code</li>
                            <li>Use the service for illegal or unauthorized purposes</li>
                            <li>Interfere with or disrupt the service or servers</li>
                            <li>Create derivative works without permission</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>

              <FadeIn delay={0.3}>
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <Heading level={2} size="lg">3. Service Availability</Heading>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <Text size="sm" className="font-medium text-blue-900 mb-2">Uptime Commitment</Text>
                          <Text size="sm" variant="muted">
                            We strive for 99.9% uptime but cannot guarantee uninterrupted service availability.
                          </Text>
                        </div>
                        <div className="bg-amber-50 p-4 rounded-lg">
                          <Text size="sm" className="font-medium text-amber-900 mb-2">Maintenance Windows</Text>
                          <Text size="sm" variant="muted">
                            Scheduled maintenance will be communicated 24 hours in advance when possible.
                          </Text>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>

              <FadeIn delay={0.4}>
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <Heading level={2} size="lg">4. Data and Privacy</Heading>
                      <Text variant="muted">
                        Your database queries and optimization data are processed securely and are not shared with third parties. 
                        We implement industry-standard security measures to protect your information.
                      </Text>
                      <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                        <Text size="sm" className="text-green-800">
                          <strong>Data Protection:</strong> All query data is encrypted in transit and at rest. 
                          We comply with GDPR, CCPA, and other applicable data protection regulations.
                        </Text>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>

              <FadeIn delay={0.5}>
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <Heading level={2} size="lg">5. Limitation of Liability</Heading>
                      <Text variant="muted">
                        DBooster shall not be liable for any indirect, incidental, special, consequential, or punitive damages, 
                        or any loss of profits or revenues, whether incurred directly or indirectly.
                      </Text>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>

              <FadeIn delay={0.6}>
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <Heading level={2} size="lg">6. Changes to Terms</Heading>
                      <Text variant="muted">
                        We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. 
                        Your continued use of the service constitutes acceptance of any changes.
                      </Text>
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
                    Questions about these terms? Contact us at{' '}
                    <a href="mailto:legal@dbooster.ai" className="text-primary hover:underline">
                      legal@dbooster.ai
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
