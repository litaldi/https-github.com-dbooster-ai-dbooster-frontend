
import { SmartHeader } from '@/components/navigation/SmartHeader';
import { Section, Container, Heading, Text } from '@/components/ui/visual-hierarchy';
import { FadeIn } from '@/components/ui/animations';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Eye, Lock, Database, Globe, UserCheck } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <SmartHeader />
      
      <main className="pt-16">
        <Section spacing="xl" className="bg-gradient-to-b from-background to-muted/20">
          <Container>
            <FadeIn>
              <div className="text-center space-y-4 mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <Heading level={1} size="3xl">Privacy Policy</Heading>
                <Text size="lg" variant="muted" className="max-w-2xl mx-auto">
                  Your privacy is paramount. Here's how we protect and handle your data.
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
                <Card className="border-green-200 bg-green-50/50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <UserCheck className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="space-y-3">
                        <Heading level={2} size="lg">Our Privacy Commitment</Heading>
                        <Text variant="muted">
                          DBooster is built with privacy by design. We collect only what's necessary to provide exceptional 
                          database optimization services, and we never sell your data to third parties.
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
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Eye className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="space-y-3">
                        <Heading level={2} size="lg">Information We Collect</Heading>
                        <div className="space-y-4">
                          <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                            <Text size="sm" className="font-medium">Account Information</Text>
                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                              <li>Email address and name</li>
                              <li>Authentication credentials</li>
                              <li>Profile preferences and settings</li>
                            </ul>
                          </div>
                          <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                            <Text size="sm" className="font-medium">Usage Data</Text>
                            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                              <li>Query optimization requests (anonymized)</li>
                              <li>Performance metrics and analytics</li>
                              <li>Feature usage patterns</li>
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
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Database className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="space-y-3">
                        <Heading level={2} size="lg">How We Handle Your Database Queries</Heading>
                        <Text variant="muted">
                          Your SQL queries are processed securely and are never stored in plain text. Here's our approach:
                        </Text>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                            <Text size="sm" className="font-medium text-green-800 mb-2">✓ What We Do</Text>
                            <ul className="text-xs text-green-700 space-y-1">
                              <li>• Encrypt queries in transit</li>
                              <li>• Process optimization recommendations</li>
                              <li>• Store anonymized performance metrics</li>
                              <li>• Delete query content after processing</li>
                            </ul>
                          </div>
                          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                            <Text size="sm" className="font-medium text-red-800 mb-2">✗ What We Never Do</Text>
                            <ul className="text-xs text-red-700 space-y-1">
                              <li>• Store your actual data</li>
                              <li>• Share queries with third parties</li>
                              <li>• Use your data for training without consent</li>
                              <li>• Access your production databases</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>

              <FadeIn delay={0.4}>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Lock className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div className="space-y-3">
                        <Heading level={2} size="lg">Data Security</Heading>
                        <Text variant="muted">
                          We implement industry-leading security measures to protect your information:
                        </Text>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                              <Lock className="h-4 w-4 text-blue-600" />
                            </div>
                            <Text size="sm" className="font-medium">AES-256 Encryption</Text>
                            <Text size="xs" variant="muted">Data encrypted at rest and in transit</Text>
                          </div>
                          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                              <Shield className="h-4 w-4 text-green-600" />
                            </div>
                            <Text size="sm" className="font-medium">SOC 2 Compliant</Text>
                            <Text size="xs" variant="muted">Regular security audits</Text>
                          </div>
                          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                              <Globe className="h-4 w-4 text-purple-600" />
                            </div>
                            <Text size="sm" className="font-medium">GDPR Ready</Text>
                            <Text size="xs" variant="muted">Full compliance with privacy laws</Text>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>

              <FadeIn delay={0.5}>
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <Heading level={2} size="lg">Your Rights</Heading>
                      <Text variant="muted">
                        You have complete control over your data. You can:
                      </Text>
                      <div className="grid md:grid-cols-2 gap-4">
                        <ul className="space-y-2">
                          <li className="flex items-center gap-2 text-sm">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                            Access your personal data
                          </li>
                          <li className="flex items-center gap-2 text-sm">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                            Correct inaccurate information
                          </li>
                          <li className="flex items-center gap-2 text-sm">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                            Delete your account and data
                          </li>
                        </ul>
                        <ul className="space-y-2">
                          <li className="flex items-center gap-2 text-sm">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                            Export your data
                          </li>
                          <li className="flex items-center gap-2 text-sm">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                            Opt out of analytics
                          </li>
                          <li className="flex items-center gap-2 text-sm">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                            Request data portability
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>

              <FadeIn delay={0.6}>
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <Heading level={2} size="lg">Third-Party Services</Heading>
                      <Text variant="muted">
                        We work with trusted partners to provide our services. These include:
                      </Text>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <ul className="text-sm space-y-2">
                          <li><strong>Authentication:</strong> Secure login through industry-standard OAuth providers</li>
                          <li><strong>Analytics:</strong> Privacy-focused analytics to improve our service</li>
                          <li><strong>Infrastructure:</strong> Enterprise-grade cloud hosting with data residency controls</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>

              <FadeIn delay={0.7}>
                <div className="text-center py-8 border-t">
                  <Text size="sm" variant="muted" className="mb-4">
                    Questions about our privacy practices?
                  </Text>
                  <Text size="sm" variant="muted">
                    Contact our Data Protection Officer at{' '}
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
