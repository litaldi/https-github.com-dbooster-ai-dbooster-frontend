
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { 
  Accessibility, 
  Eye, 
  Keyboard, 
  Volume2, 
  MousePointer, 
  Smartphone,
  Mail,
  ExternalLink
} from 'lucide-react';
import { Section, Container, Heading, Text } from '@/components/ui/visual-hierarchy';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/enhanced-animations';

export default function AccessibilityPage() {
  const features = [
    {
      icon: Eye,
      title: "Visual Accessibility",
      description: "High contrast ratios, scalable fonts, and clear visual hierarchy for users with visual impairments.",
      details: [
        "WCAG AA compliant color contrast (4.5:1 minimum)",
        "Scalable text up to 200% without horizontal scrolling",
        "Clear focus indicators and visual hierarchy",
        "Support for high contrast and dark mode themes"
      ]
    },
    {
      icon: Keyboard,
      title: "Keyboard Navigation",
      description: "Complete keyboard accessibility for users who cannot use a mouse or pointing device.",
      details: [
        "Full keyboard navigation support",
        "Logical tab order throughout the application",
        "Keyboard shortcuts for common actions",
        "Skip links to main content areas"
      ]
    },
    {
      icon: Volume2,
      title: "Screen Reader Support",
      description: "Comprehensive screen reader compatibility with proper semantic markup and ARIA labels.",
      details: [
        "Semantic HTML elements and landmarks",
        "Descriptive ARIA labels and properties",
        "Screen reader announcements for dynamic content",
        "Alternative text for all images and icons"
      ]
    },
    {
      icon: MousePointer,
      title: "Motor Accessibility",
      description: "Large click targets and accessible controls for users with motor impairments.",
      details: [
        "Minimum 44x44 pixel touch targets",
        "Generous spacing between interactive elements",
        "Drag and drop alternatives",
        "Timeout extensions and pause controls"
      ]
    },
    {
      icon: Smartphone,
      title: "Mobile Accessibility",
      description: "Responsive design that works across all devices and orientations.",
      details: [
        "Touch-friendly interface design",
        "Portrait and landscape orientation support",
        "Zoom up to 500% without loss of functionality",
        "Voice control and switch navigation support"
      ]
    }
  ];

  const standards = [
    {
      name: "WCAG 2.1 Level AA",
      description: "We conform to Web Content Accessibility Guidelines 2.1 at AA level",
      status: "Compliant"
    },
    {
      name: "Section 508",
      description: "Compliant with US federal accessibility standards",
      status: "Compliant"
    },
    {
      name: "EN 301 549",
      description: "European accessibility standard compliance",
      status: "Compliant"
    },
    {
      name: "AODA",
      description: "Accessibility for Ontarians with Disabilities Act compliance",
      status: "Compliant"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Section spacing="lg" className="text-left bg-gradient-to-b from-background to-muted/30">
        <Container>
          <FadeIn delay={0.2}>
            <Badge variant="secondary" className="mb-6">
              <Accessibility className="h-3 w-3 mr-1" />
              Accessibility Statement
            </Badge>
          </FadeIn>
          
          <FadeIn delay={0.4}>
            <Heading level={1} size="2xl" className="mb-6 text-left">
              Our Commitment to Accessibility
            </Heading>
          </FadeIn>
          
          <FadeIn delay={0.6}>
            <Text size="lg" variant="muted" className="mb-8 max-w-3xl text-left">
              DBooster is committed to ensuring digital accessibility for all users, including those with disabilities. 
              We continually improve the user experience for everyone and apply relevant accessibility standards.
            </Text>
          </FadeIn>
        </Container>
      </Section>

      {/* Compliance Standards */}
      <Section spacing="lg">
        <Container>
          <div className="text-left mb-12">
            <Heading level={2} size="xl" className="mb-4 text-left">
              Accessibility Standards
            </Heading>
            <Text size="lg" variant="muted" className="text-left">
              We adhere to internationally recognized accessibility standards and guidelines.
            </Text>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {standards.map((standard, index) => (
              <FadeIn key={index} delay={index * 0.1}>
                <Card className="h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-left">{standard.name}</CardTitle>
                      <Badge variant="outline" className="text-green-700 border-green-700">
                        {standard.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Text size="sm" variant="muted" className="text-left">
                      {standard.description}
                    </Text>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </Container>
      </Section>

      {/* Accessibility Features */}
      <Section spacing="lg" className="bg-muted/30">
        <Container>
          <div className="text-left mb-12">
            <Heading level={2} size="xl" className="mb-4 text-left">
              Accessibility Features
            </Heading>
            <Text size="lg" variant="muted" className="text-left">
              Our platform includes comprehensive accessibility features designed for all users.
            </Text>
          </div>

          <StaggerContainer className="space-y-8">
            {features.map((feature, index) => (
              <StaggerItem key={index}>
                <Card className="p-6">
                  <div className="flex gap-4 text-left">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <div className="flex-grow">
                      <Heading level={3} size="lg" className="mb-3 text-left">
                        {feature.title}
                      </Heading>
                      <Text variant="muted" className="mb-4 text-left">
                        {feature.description}
                      </Text>
                      <ul className="space-y-2 text-left">
                        {feature.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                            <Text size="sm" variant="muted" className="text-left">
                              {detail}
                            </Text>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </Section>

      {/* Testing and Feedback */}
      <Section spacing="lg">
        <Container>
          <div className="text-left mb-8">
            <Heading level={2} size="xl" className="mb-4 text-left">
              Continuous Testing & Improvement
            </Heading>
            <Text size="lg" variant="muted" className="mb-6 text-left">
              We regularly test our platform with assistive technologies and real users to ensure 
              optimal accessibility across all features.
            </Text>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="p-6">
              <Heading level={3} size="lg" className="mb-4 text-left">
                Testing Methods
              </Heading>
              <ul className="space-y-3 text-left">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <Text size="sm">Automated accessibility scanning with industry-standard tools</Text>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <Text size="sm">Manual testing with screen readers (NVDA, JAWS, VoiceOver)</Text>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <Text size="sm">Keyboard navigation testing across all features</Text>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <Text size="sm">User testing with individuals who have disabilities</Text>
                </li>
              </ul>
            </Card>

            <Card className="p-6">
              <Heading level={3} size="lg" className="mb-4 text-left">
                Assistive Technologies
              </Heading>
              <ul className="space-y-3 text-left">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <Text size="sm">Screen readers (NVDA, JAWS, VoiceOver, TalkBack)</Text>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <Text size="sm">Voice recognition software (Dragon NaturallySpeaking)</Text>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <Text size="sm">Switch navigation devices and alternative keyboards</Text>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <Text size="sm">Browser zoom and magnification tools</Text>
                </li>
              </ul>
            </Card>
          </div>
        </Container>
      </Section>

      {/* Contact and Feedback */}
      <Section spacing="lg" className="bg-gradient-to-r from-primary/10 to-purple-500/10">
        <Container>
          <div className="text-left max-w-3xl mx-auto">
            <Heading level={2} size="xl" className="mb-4 text-left">
              Feedback and Support
            </Heading>
            <Text size="lg" variant="muted" className="mb-8 text-left">
              We welcome your feedback on the accessibility of DBooster. If you encounter any 
              accessibility barriers or have suggestions for improvement, please contact us.
            </Text>

            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <EnhancedButton 
                size="lg" 
                className="justify-start"
                onClick={() => window.location.href = 'mailto:accessibility@dbooster.com'}
              >
                <Mail className="mr-2 h-4 w-4" />
                accessibility@dbooster.com
              </EnhancedButton>
              
              <EnhancedButton 
                size="lg" 
                variant="outline" 
                className="justify-start"
                onClick={() => window.open('/contact', '_blank')}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Contact Form
              </EnhancedButton>
            </div>

            <div className="mt-8 p-4 bg-muted/50 rounded-lg text-left">
              <Text size="sm" variant="muted" className="text-left">
                <strong>Response Time:</strong> We aim to respond to accessibility feedback within 2 business days. 
                For urgent accessibility issues, please indicate this in your message subject line.
              </Text>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
