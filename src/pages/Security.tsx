
import { SmartHeader } from '@/components/navigation/SmartHeader';
import { Section, Container, Heading, Text } from '@/components/ui/visual-hierarchy';
import { FadeIn } from '@/components/ui/animations';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, Eye, CheckCircle, AlertTriangle, Award } from 'lucide-react';

export default function Security() {
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
                <Heading level={1} size="3xl">Security & Compliance</Heading>
                <Text size="lg" variant="muted" className="max-w-2xl mx-auto">
                  Enterprise-grade security built into every layer of DBooster's infrastructure
                </Text>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="border-green-200 text-green-700">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    SOC 2 Type II
                  </Badge>
                  <Badge variant="outline" className="border-blue-200 text-blue-700">
                    <Shield className="h-3 w-3 mr-1" />
                    ISO 27001
                  </Badge>
                  <Badge variant="outline" className="border-purple-200 text-purple-700">
                    <Award className="h-3 w-3 mr-1" />
                    GDPR Compliant
                  </Badge>
                </div>
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
                        <Lock className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="space-y-3">
                        <Heading level={2} size="lg">Data Encryption</Heading>
                        <Text variant="muted">
                          All data is protected with military-grade encryption both in transit and at rest, 
                          ensuring your sensitive database information remains secure at all times.
                        </Text>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="bg-white p-4 rounded-lg border border-green-200">
                            <Text size="sm" className="font-medium text-green-900 mb-2">Encryption in Transit</Text>
                            <ul className="text-sm text-green-800 space-y-1">
                              <li>• TLS 1.3 for all API communications</li>
                              <li>• Certificate pinning for mobile apps</li>
                              <li>• Perfect Forward Secrecy (PFS)</li>
                            </ul>
                          </div>
                          <div className="bg-white p-4 rounded-lg border border-green-200">
                            <Text size="sm" className="font-medium text-green-900 mb-2">Encryption at Rest</Text>
                            <ul className="text-sm text-green-800 space-y-1">
                              <li>• AES-256 encryption for all stored data</li>
                              <li>• Encrypted database backups</li>
                              <li>• Hardware Security Module (HSM) key management</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>

              <FadeIn delay={0.2}>
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <Heading level={2} size="lg">Access Control & Authentication</Heading>
                      
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="text-center p-4 border rounded-lg">
                          <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                          <Text size="sm" className="font-medium">Multi-Factor Authentication</Text>
                          <Text size="xs" variant="muted" className="mt-1">
                            TOTP, SMS, and hardware key support
                          </Text>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <Eye className="h-8 w-8 text-primary mx-auto mb-2" />
                          <Text size="sm" className="font-medium">Role-Based Access</Text>
                          <Text size="xs" variant="muted" className="mt-1">
                            Granular permissions and least privilege principle
                          </Text>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <CheckCircle className="h-8 w-8 text-primary mx-auto mb-2" />
                          <Text size="sm" className="font-medium">SSO Integration</Text>
                          <Text size="xs" variant="muted" className="mt-1">
                            SAML 2.0 and OAuth 2.0 support
                          </Text>
                        </div>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <Text size="sm" className="font-medium text-blue-900 mb-2">
                          Zero-Trust Architecture
                        </Text>
                        <Text size="sm" className="text-blue-800">
                          Every request is authenticated, authorized, and encrypted regardless of location. 
                          We never trust, always verify.
                        </Text>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>

              <FadeIn delay={0.3}>
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <Heading level={2} size="lg">Compliance Certifications</Heading>
                      <Text variant="muted">
                        DBooster meets the most stringent compliance standards to ensure your data 
                        handling meets regulatory requirements.
                      </Text>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <Award className="h-6 w-6 text-primary mt-1" />
                            <div>
                              <Text size="sm" className="font-medium">SOC 2 Type II</Text>
                              <Text size="xs" variant="muted">
                                Independently audited for security, availability, processing integrity, 
                                confidentiality, and privacy controls.
                              </Text>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <Shield className="h-6 w-6 text-primary mt-1" />
                            <div>
                              <Text size="sm" className="font-medium">ISO 27001</Text>
                              <Text size="xs" variant="muted">
                                International standard for information security management systems (ISMS).
                              </Text>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <CheckCircle className="h-6 w-6 text-primary mt-1" />
                            <div>
                              <Text size="sm" className="font-medium">GDPR Compliant</Text>
                              <Text size="xs" variant="muted">
                                Full compliance with European General Data Protection Regulation.
                              </Text>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <Eye className="h-6 w-6 text-primary mt-1" />
                            <div>
                              <Text size="sm" className="font-medium">CCPA Compliant</Text>
                              <Text size="xs" variant="muted">
                                Adherence to California Consumer Privacy Act requirements.
                              </Text>
                            </div>
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
                    <div className="space-y-4">
                      <Heading level={2} size="lg">Infrastructure Security</Heading>
                      <Text variant="muted">
                        Our infrastructure is built on enterprise-grade cloud providers with 
                        additional security layers and monitoring.
                      </Text>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <Text size="sm" className="font-medium mb-2">Network Security</Text>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• DDoS protection and rate limiting</li>
                            <li>• Web Application Firewall (WAF)</li>
                            <li>• Network segmentation and isolation</li>
                            <li>• Intrusion detection and prevention</li>
                          </ul>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <Text size="sm" className="font-medium mb-2">Application Security</Text>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            <li>• Regular security code reviews</li>
                            <li>• Automated vulnerability scanning</li>
                            <li>• Dependency security monitoring</li>
                            <li>• Container security scanning</li>
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
                    <div className="space-y-4">
                      <Heading level={2} size="lg">Incident Response & Monitoring</Heading>
                      <Text variant="muted">
                        24/7 security monitoring with rapid incident detection and response capabilities.
                      </Text>
                      
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-red-50 border border-red-200 rounded-lg">
                          <AlertTriangle className="h-6 w-6 text-red-600 mx-auto mb-2" />
                          <Text size="sm" className="font-medium text-red-900">Detection</Text>
                          <Text size="xs" className="text-red-700 mt-1">
                            Real-time threat detection
                          </Text>
                        </div>
                        <div className="text-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <Eye className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                          <Text size="sm" className="font-medium text-yellow-900">Analysis</Text>
                          <Text size="xs" className="text-yellow-700 mt-1">
                            Automated threat analysis
                          </Text>
                        </div>
                        <div className="text-center p-3 bg-green-50 border border-green-200 rounded-lg">
                          <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
                          <Text size="sm" className="font-medium text-green-900">Response</Text>
                          <Text size="xs" className="text-green-700 mt-1">
                            Rapid incident containment
                          </Text>
                        </div>
                      </div>

                      <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                        <Text size="sm" className="font-medium text-primary mb-2">
                          Security Operations Center (SOC)
                        </Text>
                        <Text size="sm" variant="muted">
                          Our dedicated security team monitors systems 24/7 with average incident 
                          response time of less than 15 minutes for critical alerts.
                        </Text>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>

              <FadeIn delay={0.6}>
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <Heading level={2} size="lg">Vulnerability Management</Heading>
                      <Text variant="muted">
                        Proactive security testing and vulnerability management to stay ahead of threats.
                      </Text>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
                          <Text size="sm">Penetration Testing</Text>
                          <Badge variant="outline">Quarterly</Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
                          <Text size="sm">Vulnerability Assessments</Text>
                          <Badge variant="outline">Monthly</Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
                          <Text size="sm">Security Code Reviews</Text>
                          <Badge variant="outline">Every Release</Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
                          <Text size="sm">Dependency Scanning</Text>
                          <Badge variant="outline">Continuous</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>

              <FadeIn delay={0.7}>
                <div className="text-center py-8 border-t">
                  <Text size="sm" variant="muted">
                    Security concerns or questions? Contact our security team at{' '}
                    <a href="mailto:security@dbooster.ai" className="text-primary hover:underline">
                      security@dbooster.ai
                    </a>
                  </Text>
                  <Text size="xs" variant="muted" className="mt-2">
                    For security vulnerabilities, please use our{' '}
                    <a href="mailto:security@dbooster.ai" className="text-primary hover:underline">
                      responsible disclosure process
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
