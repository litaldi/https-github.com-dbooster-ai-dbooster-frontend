
import { SmartHeader } from '@/components/navigation/SmartHeader';
import { Section, Container, Heading, Text } from '@/components/ui/visual-hierarchy';
import { FadeIn } from '@/components/ui/animations';
import { Card, CardContent } from '@/components/ui/card';
import { Accessibility as AccessibilityIcon, Users, Eye, Keyboard, Volume2, Heart } from 'lucide-react';

export default function Accessibility() {
  return (
    <div className="min-h-screen bg-background">
      <SmartHeader />
      
      <main className="pt-16">
        <Section spacing="xl" className="bg-gradient-to-b from-background to-muted/20">
          <Container>
            <FadeIn>
              <div className="text-center space-y-4 mb-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <AccessibilityIcon className="h-8 w-8 text-blue-600" />
                </div>
                <Heading level={1} size="3xl">Accessibility Statement</Heading>
                <Text size="lg" variant="muted" className="max-w-2xl mx-auto">
                  DBooster is committed to ensuring digital accessibility for people with disabilities.
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
                        <Heart className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="space-y-3">
                        <Heading level={2} size="lg">Our Commitment</Heading>
                        <Text variant="muted">
                          We believe that everyone should have equal access to database optimization tools. 
                          DBooster is designed to be usable by people of all abilities and is continuously 
                          improved to meet and exceed accessibility standards.
                        </Text>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>

              <FadeIn delay={0.2}>
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <Heading level={2} size="lg">Accessibility Standards</Heading>
                      <Text variant="muted">
                        DBooster aims to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. 
                        These guidelines help make web content more accessible to a wider range of people with disabilities.
                      </Text>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-green-600 mb-2">AA</div>
                          <Text size="sm" className="font-medium">WCAG 2.1 Level</Text>
                          <Text size="xs" variant="muted">Compliance Target</Text>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-blue-600 mb-2">4.5:1</div>
                          <Text size="sm" className="font-medium">Contrast Ratio</Text>
                          <Text size="xs" variant="muted">Minimum Standard</Text>
                        </div>
                        <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg text-center">
                          <div className="text-2xl font-bold text-purple-600 mb-2">100%</div>
                          <Text size="sm" className="font-medium">Keyboard Navigation</Text>
                          <Text size="xs" variant="muted">Full Support</Text>
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
                      <Heading level={2} size="lg">Accessibility Features</Heading>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Keyboard className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <Text size="sm" className="font-medium">Keyboard Navigation</Text>
                              <Text size="xs" variant="muted">
                                Full keyboard support with logical tab order and visible focus indicators
                              </Text>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Eye className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <Text size="sm" className="font-medium">Screen Reader Support</Text>
                              <Text size="xs" variant="muted">
                                Semantic HTML, ARIA labels, and descriptive alt text for all images
                              </Text>
                            </div>
                          </div>

                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Volume2 className="h-4 w-4 text-purple-600" />
                            </div>
                            <div>
                              <Text size="sm" className="font-medium">Audio Descriptions</Text>
                              <Text size="xs" variant="muted">
                                Audio cues and descriptions for important UI interactions
                              </Text>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="bg-muted/50 p-4 rounded-lg">
                            <Text size="sm" className="font-medium mb-2">Color & Contrast</Text>
                            <ul className="text-xs text-muted-foreground space-y-1">
                              <li>• High contrast color schemes</li>
                              <li>• Information not conveyed by color alone</li>
                              <li>• Support for reduced motion preferences</li>
                            </ul>
                          </div>

                          <div className="bg-muted/50 p-4 rounded-lg">
                            <Text size="sm" className="font-medium mb-2">Responsive Design</Text>
                            <ul className="text-xs text-muted-foreground space-y-1">
                              <li>• Mobile-friendly interface</li>
                              <li>• Scalable text up to 200%</li>
                              <li>• Touch-friendly button sizes</li>
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
                    <div className="space-y-4">
                      <Heading level={2} size="lg">Keyboard Shortcuts</Heading>
                      <Text variant="muted">
                        DBooster includes keyboard shortcuts to help you navigate efficiently:
                      </Text>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                            <Text size="sm">Home</Text>
                            <kbd className="px-2 py-1 bg-background border rounded text-xs">Ctrl + H</kbd>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                            <Text size="sm">Dashboard</Text>
                            <kbd className="px-2 py-1 bg-background border rounded text-xs">Ctrl + D</kbd>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                            <Text size="sm">Query Builder</Text>
                            <kbd className="px-2 py-1 bg-background border rounded text-xs">Ctrl + Q</kbd>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                            <Text size="sm">Settings</Text>
                            <kbd className="px-2 py-1 bg-background border rounded text-xs">Ctrl + S</kbd>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                            <Text size="sm">Help</Text>
                            <kbd className="px-2 py-1 bg-background border rounded text-xs">Ctrl + /</kbd>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-muted/50 rounded">
                            <Text size="sm">Skip to Content</Text>
                            <kbd className="px-2 py-1 bg-background border rounded text-xs">Tab</kbd>
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
                      <Heading level={2} size="lg">Supported Technologies</Heading>
                      <Text variant="muted">
                        DBooster is compatible with assistive technologies including:
                      </Text>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-muted/30 rounded-lg">
                          <Text size="sm" className="font-medium">NVDA</Text>
                          <Text size="xs" variant="muted">Screen Reader</Text>
                        </div>
                        <div className="text-center p-3 bg-muted/30 rounded-lg">
                          <Text size="sm" className="font-medium">JAWS</Text>
                          <Text size="xs" variant="muted">Screen Reader</Text>
                        </div>
                        <div className="text-center p-3 bg-muted/30 rounded-lg">
                          <Text size="sm" className="font-medium">VoiceOver</Text>
                          <Text size="xs" variant="muted">macOS/iOS</Text>
                        </div>
                        <div className="text-center p-3 bg-muted/30 rounded-lg">
                          <Text size="sm" className="font-medium">Dragon</Text>
                          <Text size="xs" variant="muted">Voice Control</Text>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>

              <FadeIn delay={0.6}>
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <Heading level={2} size="lg">Testing & Improvement</Heading>
                      <Text variant="muted">
                        We regularly test our platform with real users and assistive technologies to ensure 
                        the best possible experience for everyone.
                      </Text>
                      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                        <Text size="sm" className="text-blue-800">
                          <strong>Continuous Improvement:</strong> We conduct monthly accessibility audits and 
                          work with accessibility consultants to identify and address potential barriers.
                        </Text>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>

              <FadeIn delay={0.7}>
                <Card className="border-amber-200 bg-amber-50/50">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <Heading level={2} size="lg">Feedback Welcome</Heading>
                      <Text variant="muted">
                        We welcome your feedback on the accessibility of DBooster. If you encounter any 
                        accessibility barriers or have suggestions for improvement, please let us know.
                      </Text>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                          <Text size="sm" className="font-medium">Email us:</Text>
                          <a href="mailto:accessibility@dbooster.ai" className="text-primary hover:underline text-sm">
                            accessibility@dbooster.ai
                          </a>
                        </div>
                        <div className="flex-1">
                          <Text size="sm" className="font-medium">Response time:</Text>
                          <Text size="sm" variant="muted">Within 2 business days</Text>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            </div>
          </Container>
        </Section>
      </main>
    </div>
  );
}
