
import { SmartHeader } from '@/components/navigation/SmartHeader';
import { Section, Container, Heading, Text } from '@/components/ui/visual-hierarchy';
import { FadeIn } from '@/components/ui/animations';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, Keyboard, Volume2, MousePointer, 
  Smartphone, Globe, Heart, CheckCircle 
} from 'lucide-react';

export default function Accessibility() {
  return (
    <div className="min-h-screen bg-background">
      <SmartHeader />
      
      <main className="pt-16">
        <Section spacing="xl" className="bg-gradient-to-b from-background to-muted/20">
          <Container>
            <FadeIn>
              <div className="text-center space-y-4 mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                  <Heart className="h-8 w-8 text-purple-600" />
                </div>
                <Heading level={1} size="3xl">Accessibility Statement</Heading>
                <Text size="lg" variant="muted" className="max-w-2xl mx-auto">
                  DBooster is committed to ensuring digital accessibility for people with disabilities
                </Text>
                <div className="flex justify-center gap-2 flex-wrap">
                  <Badge variant="outline" className="border-purple-200 text-purple-700">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    WCAG 2.1 AA
                  </Badge>
                  <Badge variant="outline" className="border-blue-200 text-blue-700">
                    <Eye className="h-3 w-3 mr-1" />
                    Screen Reader Compatible
                  </Badge>
                  <Badge variant="outline" className="border-green-200 text-green-700">
                    <Keyboard className="h-3 w-3 mr-1" />
                    Keyboard Navigation
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
                <Card className="border-purple-200 bg-purple-50/50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Heart className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="space-y-3">
                        <Heading level={2} size="lg">Our Commitment</Heading>
                        <Text variant="muted">
                          We are committed to providing a website and application that is accessible to the 
                          widest possible audience, regardless of technology or ability. We actively work to 
                          increase the accessibility and usability of our platform.
                        </Text>
                        <div className="bg-white p-4 rounded-lg border border-purple-200">
                          <Text size="sm" className="font-medium text-purple-900 mb-2">
                            Our Accessibility Goals
                          </Text>
                          <ul className="text-sm text-purple-800 space-y-1">
                            <li>• Provide equal access to information and functionality</li>
                            <li>• Ensure compatibility with assistive technologies</li>
                            <li>• Maintain high usability standards for all users</li>
                            <li>• Continuously improve accessibility features</li>
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
                    <div className="space-y-6">
                      <Heading level={2} size="lg">Accessibility Features</Heading>
                      <Text variant="muted">
                        DBooster includes numerous accessibility features designed to support users 
                        with diverse needs and abilities.
                      </Text>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <Eye className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                            <div>
                              <Text size="sm" className="font-medium">Visual Accessibility</Text>
                              <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                                <li>• High contrast color schemes</li>
                                <li>• Resizable text up to 200%</li>
                                <li>• Clear visual hierarchy</li>
                                <li>• Alternative text for images</li>
                                <li>• Focus indicators for interactive elements</li>
                              </ul>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <Keyboard className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                            <div>
                              <Text size="sm" className="font-medium">Keyboard Navigation</Text>
                              <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                                <li>• Full keyboard navigation support</li>
                                <li>• Logical tab order</li>
                                <li>• Keyboard shortcuts for common actions</li>
                                <li>• Skip navigation links</li>
                                <li>• No keyboard traps</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <Volume2 className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                            <div>
                              <Text size="sm" className="font-medium">Screen Reader Support</Text>
                              <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                                <li>• ARIA labels and descriptions</li>
                                <li>• Semantic HTML structure</li>
                                <li>• Screen reader announcements</li>
                                <li>• Accessible form labels</li>
                                <li>• Status and error notifications</li>
                              </ul>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <MousePointer className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                            <div>
                              <Text size="sm" className="font-medium">Motor Accessibility</Text>
                              <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                                <li>• Large click targets (44px minimum)</li>
                                <li>• Drag and drop alternatives</li>
                                <li>• No time-based interactions</li>
                                <li>• Gesture alternatives</li>
                                <li>• Voice control compatibility</li>
                              </ul>
                            </div>
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
                      <Heading level={2} size="lg">Supported Assistive Technologies</Heading>
                      <Text variant="muted">
                        DBooster is designed to work seamlessly with a wide range of assistive technologies.
                      </Text>
                      
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="text-center p-4 border rounded-lg">
                          <Volume2 className="h-8 w-8 text-primary mx-auto mb-2" />
                          <Text size="sm" className="font-medium">Screen Readers</Text>
                          <Text size="xs" variant="muted" className="mt-1">
                            JAWS, NVDA, VoiceOver, TalkBack
                          </Text>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <Keyboard className="h-8 w-8 text-primary mx-auto mb-2" />
                          <Text size="sm" className="font-medium">Keyboard Navigation</Text>
                          <Text size="xs" variant="muted" className="mt-1">
                            Standard and alternative keyboards
                          </Text>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <Eye className="h-8 w-8 text-primary mx-auto mb-2" />
                          <Text size="sm" className="font-medium">Screen Magnifiers</Text>
                          <Text size="xs" variant="muted" className="mt-1">
                            ZoomText, MAGic, built-in magnifiers
                          </Text>
                        </div>
                        <div className="text-center p-4 border rounded-lg">
                          <Smartphone className="h-8 w-8 text-primary mx-auto mb-2" />
                          <Text size="sm" className="font-medium">Mobile Accessibility</Text>
                          <Text size="xs" variant="muted" className="mt-1">
                            iOS VoiceOver, Android TalkBack
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
                    <div className="space-y-4">
                      <Heading level={2} size="lg">Accessibility Standards Compliance</Heading>
                      <Text variant="muted">
                        Our platform conforms to widely accepted accessibility standards and guidelines.
                      </Text>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <Text size="sm" className="font-medium text-green-900 mb-2">
                            WCAG 2.1 Level AA Compliance
                          </Text>
                          <Text size="sm" className="text-green-800 mb-3">
                            We conform to the Web Content Accessibility Guidelines (WCAG) 2.1 
                            at the AA level, ensuring our platform meets international standards.
                          </Text>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <Text size="xs">Perceivable content</Text>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <Text size="xs">Operable interface</Text>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <Text size="xs">Understandable information</Text>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <Text size="xs">Robust compatibility</Text>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <Text size="sm" className="font-medium text-blue-900 mb-2">
                            Additional Standards
                          </Text>
                          <Text size="sm" className="text-blue-800 mb-3">
                            We also adhere to other accessibility standards and best practices 
                            to ensure comprehensive accessibility support.
                          </Text>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-blue-600" />
                              <Text size="xs">Section 508 (US Federal)</Text>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-blue-600" />
                              <Text size="xs">EN 301 549 (European)</Text>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-blue-600" />
                              <Text size="xs">AODA (Ontario, Canada)</Text>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-blue-600" />
                              <Text size="xs">DDA (Australia)</Text>
                            </div>
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
                    <div className="space-y-3">
                      <Heading level={2} size="lg">Ongoing Accessibility Efforts</Heading>
                      <Text variant="muted">
                        Accessibility is an ongoing commitment. We continuously work to improve 
                        and maintain the accessibility of our platform.
                      </Text>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
                          <Text size="sm">Accessibility Audits</Text>
                          <Badge variant="outline">Quarterly</Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
                          <Text size="sm">User Testing with Disabilities</Text>
                          <Badge variant="outline">Bi-annually</Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
                          <Text size="sm">Staff Accessibility Training</Text>
                          <Badge variant="outline">Ongoing</Badge>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-muted/30 rounded">
                          <Text size="sm">Automated Accessibility Testing</Text>
                          <Badge variant="outline">Continuous</Badge>
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
                      <Heading level={2} size="lg">Feedback and Support</Heading>
                      <Text variant="muted">
                        We welcome your feedback on the accessibility of DBooster. Your input helps 
                        us identify areas for improvement and prioritize accessibility enhancements.
                      </Text>
                      
                      <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                        <Text size="sm" className="font-medium text-primary mb-2">
                          How to Report Accessibility Issues
                        </Text>
                        <div className="space-y-2">
                          <Text size="sm" variant="muted">
                            If you encounter any accessibility barriers while using DBooster, please let us know:
                          </Text>
                          <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                            <li>• Email: <a href="mailto:accessibility@dbooster.ai" className="text-primary hover:underline">accessibility@dbooster.ai</a></li>
                            <li>• Phone: +1 (555) 123-4567</li>
                            <li>• Online form: Available in our Help Center</li>
                          </ul>
                          <Text size="sm" variant="muted">
                            We aim to respond to accessibility feedback within 2 business days.
                          </Text>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>

              <FadeIn delay={0.7}>
                <div className="text-center py-8 border-t">
                  <Text size="sm" variant="muted">
                    This accessibility statement was last reviewed and updated on December 18, 2024.
                  </Text>
                  <Text size="xs" variant="muted" className="mt-2">
                    For questions about this statement, contact us at{' '}
                    <a href="mailto:accessibility@dbooster.ai" className="text-primary hover:underline">
                      accessibility@dbooster.ai
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
