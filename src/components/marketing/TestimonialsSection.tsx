import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star, Quote } from 'lucide-react';
import { Section, Container, Heading, Text } from '@/components/ui/visual-hierarchy';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/animations';

interface Testimonial {
  id: string;
  content: string;
  author: {
    name: string;
    role: string;
    company: string;
    avatar?: string;
  };
  rating: number;
  metrics?: {
    improvement: string;
    timeframe: string;
  };
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    content: "DBooster transformed our database performance monitoring. We reduced query response times by 73% in the first month and saved countless hours of manual optimization work. The AI recommendations are incredibly accurate.",
    author: {
      name: "Sarah Chen",
      role: "Senior Database Engineer",
      company: "TechCorp Solutions"
    },
    rating: 5,
    metrics: {
      improvement: "73% faster queries",
      timeframe: "First month"
    }
  },
  {
    id: '2',
    content: "The automated query optimization saved us over $50K annually in infrastructure costs. DBooster's insights helped us identify bottlenecks we never knew existed. It's like having a database expert on our team 24/7.",
    author: {
      name: "Michael Rodriguez",
      role: "CTO",
      company: "DataFlow Inc"
    },
    rating: 5,
    metrics: {
      improvement: "$50K saved annually",
      timeframe: "Ongoing"
    }
  },
  {
    id: '3',
    content: "Implementation was seamless, and the results were immediate. Our application response times improved dramatically, and our users noticed the difference right away. The ROI was clear within weeks.",
    author: {
      name: "Emily Watson",
      role: "Lead Developer",
      company: "AppVentures"
    },
    rating: 5,
    metrics: {
      improvement: "85% response improvement",
      timeframe: "Within weeks"
    }
  },
  {
    id: '4',
    content: "DBooster's real-time monitoring and alerts prevented several potential outages. The predictive insights help us stay ahead of performance issues before they impact our customers.",
    author: {
      name: "David Kim",
      role: "DevOps Manager",
      company: "CloudScale Systems"
    },
    rating: 5,
    metrics: {
      improvement: "Zero downtime",
      timeframe: "6 months"
    }
  }
];

export function TestimonialsSection() {
  return (
    <Section spacing="xl" className="bg-muted/30">
      <Container>
        <div className="text-center mb-16">
          <FadeIn>
            <Badge variant="secondary" className="mb-4">
              <Star className="h-3 w-3 mr-1" />
              Customer Success Stories
            </Badge>
          </FadeIn>
          <FadeIn delay={0.2}>
            <Heading level={2} size="2xl" className="mb-4">
              Trusted by Database Teams Worldwide
            </Heading>
          </FadeIn>
          <FadeIn delay={0.4}>
            <Text size="lg" variant="muted" className="max-w-2xl mx-auto">
              See how development teams are transforming their database performance 
              and reducing costs with DBooster's AI-powered optimization.
            </Text>
          </FadeIn>
        </div>

        <StaggerContainer className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <StaggerItem key={testimonial.id}>
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < testimonial.rating 
                            ? 'text-yellow-500 fill-current' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <div className="relative mb-6">
                    <Quote className="absolute -top-2 -left-2 h-8 w-8 text-primary/20" />
                    <Text className="relative italic leading-relaxed pl-6">
                      "{testimonial.content}"
                    </Text>
                  </div>
                  
                  {testimonial.metrics && (
                    <div className="flex gap-2 mb-4">
                      <Badge variant="outline" className="text-green-700 border-green-200">
                        {testimonial.metrics.improvement}
                      </Badge>
                      <Badge variant="outline" className="text-blue-700 border-blue-200">
                        {testimonial.metrics.timeframe}
                      </Badge>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary font-medium">
                        {testimonial.author.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm">{testimonial.author.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {testimonial.author.role} at {testimonial.author.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <FadeIn delay={0.8}>
          <div className="text-center mt-12">
            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <span>98% Customer Satisfaction</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                <span>500+ Happy Teams</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                <span>50M+ Queries Optimized</span>
              </div>
            </div>
          </div>
        </FadeIn>
      </Container>
    </Section>
  );
}
