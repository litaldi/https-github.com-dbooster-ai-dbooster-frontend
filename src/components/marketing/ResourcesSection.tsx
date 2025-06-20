import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Download, 
  BookOpen, 
  Video, 
  Code, 
  Users,
  TrendingUp,
  Shield
} from 'lucide-react';
import { Section, Container, Heading, Text } from '@/components/ui/visual-hierarchy';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/enhanced-animations';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'whitepaper' | 'guide' | 'video' | 'code' | 'case-study';
  category: string;
  downloadUrl: string;
  size?: string;
  duration?: string;
  featured?: boolean;
}

const resources: Resource[] = [
  {
    id: '1',
    title: 'Database Optimization Best Practices',
    description: 'Comprehensive guide covering advanced techniques for SQL query optimization, indexing strategies, and performance monitoring.',
    type: 'whitepaper',
    category: 'Optimization',
    downloadUrl: '/resources/db-optimization-guide.pdf',
    size: '2.1 MB',
    featured: true
  },
  {
    id: '2',
    title: 'AI-Powered Query Analysis',
    description: 'Deep dive into how machine learning algorithms analyze and optimize database queries for maximum performance.',
    type: 'whitepaper',
    category: 'AI & ML',
    downloadUrl: '/resources/ai-query-analysis.pdf',
    size: '1.8 MB',
    featured: true
  },
  {
    id: '3',
    title: 'Getting Started with DBooster',
    description: 'Step-by-step tutorial for setting up DBooster and optimizing your first database queries.',
    type: 'guide',
    category: 'Getting Started',
    downloadUrl: '/resources/getting-started-guide.pdf',
    size: '950 KB'
  },
  {
    id: '4',
    title: 'Enterprise Migration Case Study',
    description: 'Learn how TechCorp reduced their database costs by 60% and improved performance by 10x using DBooster.',
    type: 'case-study',
    category: 'Case Studies',
    downloadUrl: '/resources/techcorp-case-study.pdf',
    size: '1.2 MB'
  },
  {
    id: '5',
    title: 'Advanced Query Optimization Techniques',
    description: 'Video series covering complex optimization scenarios and real-world problem solving.',
    type: 'video',
    category: 'Advanced',
    downloadUrl: '/resources/advanced-optimization-videos',
    duration: '45 min'
  },
  {
    id: '6',
    title: 'API Integration Examples',
    description: 'Code samples and templates for integrating DBooster APIs into your existing applications.',
    type: 'code',
    category: 'Development',
    downloadUrl: '/resources/api-examples.zip',
    size: '3.2 MB'
  }
];

const getResourceIcon = (type: Resource['type']) => {
  const iconMap = {
    whitepaper: FileText,
    guide: BookOpen,
    video: Video,
    code: Code,
    'case-study': TrendingUp
  };
  return iconMap[type];
};

const getResourceColor = (type: Resource['type']) => {
  const colorMap = {
    whitepaper: 'blue',
    guide: 'green',
    video: 'purple',
    code: 'orange',
    'case-study': 'pink'
  };
  return colorMap[type];
};

export function ResourcesSection() {
  const featuredResources = resources.filter(resource => resource.featured);
  const otherResources = resources.filter(resource => !resource.featured);

  const handleDownload = (resource: Resource) => {
    // In a real app, this would handle the actual download
    console.log(`Downloading: ${resource.title}`);
    // For demo purposes, we'll just show a message
    alert(`Download started: ${resource.title}`);
  };

  return (
    <Section spacing="xl" className="bg-gradient-to-b from-background to-muted/20">
      <Container>
        <div className="text-center mb-16">
          <FadeIn>
            <Badge variant="secondary" className="mb-4">
              <Download className="h-3 w-3 mr-1" />
              Free Resources
            </Badge>
          </FadeIn>
          <FadeIn delay={0.2}>
            <Heading level={2} size="2xl" className="mb-4">
              Expert Knowledge at Your Fingertips
            </Heading>
          </FadeIn>
          <FadeIn delay={0.4}>
            <Text size="lg" variant="muted" className="max-w-2xl mx-auto">
              Download our comprehensive guides, whitepapers, and resources to master 
              database optimization and get the most out of DBooster.
            </Text>
          </FadeIn>
        </div>

        {/* Featured Resources */}
        <div className="mb-12">
          <FadeIn delay={0.6}>
            <div className="flex items-center gap-2 mb-8">
              <TrendingUp className="h-5 w-5 text-primary" />
              <Heading level={3} size="lg">Featured Resources</Heading>
            </div>
          </FadeIn>
          
          <StaggerContainer className="grid md:grid-cols-2 gap-6">
            {featuredResources.map((resource, index) => {
              const Icon = getResourceIcon(resource.type);
              const color = getResourceColor(resource.type);
              
              return (
                <StaggerItem key={resource.id}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg bg-${color}-100 dark:bg-${color}-900/20`}>
                            <Icon className={`h-5 w-5 text-${color}-600 dark:text-${color}-400`} />
                          </div>
                          <div>
                            <Badge variant="outline" className="mb-2">
                              {resource.category}
                            </Badge>
                            <CardTitle className="text-lg">{resource.title}</CardTitle>
                          </div>
                        </div>
                        <Badge className="bg-primary text-primary-foreground">Featured</Badge>
                      </div>
                      <CardDescription className="mt-2">
                        {resource.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          {resource.size && <span>Size: {resource.size}</span>}
                          {resource.duration && <span>Duration: {resource.duration}</span>}
                        </div>
                        <Button 
                          onClick={() => handleDownload(resource)}
                          className="gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>

        {/* Other Resources */}
        <div>
          <FadeIn delay={0.8}>
            <div className="flex items-center gap-2 mb-8">
              <BookOpen className="h-5 w-5 text-primary" />
              <Heading level={3} size="lg">All Resources</Heading>
            </div>
          </FadeIn>
          
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherResources.map((resource, index) => {
              const Icon = getResourceIcon(resource.type);
              const color = getResourceColor(resource.type);
              
              return (
                <StaggerItem key={resource.id}>
                  <Card className="h-full hover:shadow-md transition-all duration-300">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-lg bg-${color}-100 dark:bg-${color}-900/20`}>
                          <Icon className={`h-4 w-4 text-${color}-600 dark:text-${color}-400`} />
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {resource.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-base leading-tight">
                        {resource.title}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {resource.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-muted-foreground">
                          {resource.size && <span>{resource.size}</span>}
                          {resource.duration && <span>{resource.duration}</span>}
                        </div>
                        <Button 
                          onClick={() => handleDownload(resource)}
                          size="sm"
                          variant="outline"
                          className="gap-1"
                        >
                          <Download className="h-3 w-3" />
                          Get
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>

        {/* Call to Action */}
        <FadeIn delay={1.0}>
          <div className="text-center mt-16 p-8 bg-muted/50 rounded-2xl">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Shield className="h-5 w-5 text-primary" />
              <Text size="sm" className="font-medium">Enterprise Resources</Text>
            </div>
            <Heading level={3} size="lg" className="mb-3">
              Need Custom Documentation?
            </Heading>
            <Text variant="muted" className="mb-6 max-w-md mx-auto">
              Our enterprise customers get access to custom implementation guides, 
              dedicated training materials, and priority support resources.
            </Text>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg">
                <Users className="h-4 w-4 mr-2" />
                Contact Sales
              </Button>
              <Button size="lg" variant="outline">
                View Enterprise Plans
              </Button>
            </div>
          </div>
        </FadeIn>
      </Container>
    </Section>
  );
}
