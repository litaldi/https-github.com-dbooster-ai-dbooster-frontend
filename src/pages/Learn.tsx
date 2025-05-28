
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Video, 
  FileText, 
  Download, 
  Search, 
  Clock, 
  Users, 
  Star,
  ArrowRight,
  Play,
  ExternalLink,
  Lightbulb,
  Target,
  TrendingUp
} from 'lucide-react';
import { FadeIn, StaggerContainer, StaggerItem, HoverScale } from '@/components/ui/enhanced-animations';
import { Section, Container, Heading, Text } from '@/components/ui/visual-hierarchy';

export default function Learn() {
  const navigate = useNavigate();

  const guides = [
    {
      type: 'guide',
      icon: BookOpen,
      title: "Complete Guide to SQL Query Optimization",
      description: "Master the fundamentals of writing efficient SQL queries with our comprehensive guide.",
      duration: "45 min read",
      difficulty: "Beginner",
      featured: true,
      tags: ["SQL", "Performance", "Basics"]
    },
    {
      type: 'video',
      icon: Video,
      title: "AI-Powered Database Optimization Workshop",
      description: "Learn how to leverage AI tools for database performance optimization in this hands-on workshop.",
      duration: "2 hours",
      difficulty: "Intermediate",
      featured: true,
      tags: ["AI", "Workshop", "Advanced"]
    },
    {
      type: 'article',
      icon: FileText,
      title: "Understanding Database Indexes",
      description: "Deep dive into database indexing strategies and when to use different types of indexes.",
      duration: "20 min read",
      difficulty: "Intermediate",
      featured: false,
      tags: ["Indexes", "Performance", "Database"]
    },
    {
      type: 'guide',
      icon: Target,
      title: "Query Performance Monitoring",
      description: "Set up comprehensive monitoring for your database queries and identify bottlenecks.",
      duration: "30 min read",
      difficulty: "Advanced",
      featured: false,
      tags: ["Monitoring", "Performance", "Analytics"]
    },
    {
      type: 'video',
      icon: Video,
      title: "ChatGPT for Database Developers",
      description: "Learn how to effectively use ChatGPT and other AI tools for database development tasks.",
      duration: "1 hour",
      difficulty: "Beginner",
      featured: false,
      tags: ["ChatGPT", "AI Tools", "Productivity"]
    },
    {
      type: 'article',
      icon: Lightbulb,
      title: "Midjourney for Data Visualization",
      description: "Creative techniques for generating data visualization concepts and designs using Midjourney.",
      duration: "15 min read",
      difficulty: "Beginner",
      featured: false,
      tags: ["Midjourney", "Visualization", "Design"]
    }
  ];

  const quickTips = [
    {
      title: "Use EXPLAIN ANALYZE",
      description: "Always use EXPLAIN ANALYZE to understand query execution plans.",
      time: "2 min"
    },
    {
      title: "Index Foreign Keys",
      description: "Don't forget to index your foreign key columns for better JOIN performance.",
      time: "1 min"
    },
    {
      title: "Avoid SELECT *",
      description: "Only select the columns you actually need to reduce data transfer.",
      time: "1 min"
    },
    {
      title: "Use LIMIT Wisely",
      description: "Always use LIMIT when you don't need all results to improve performance.",
      time: "1 min"
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'article': return FileText;
      case 'guide': return BookOpen;
      default: return BookOpen;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Section spacing="lg" className="text-center bg-gradient-to-b from-background to-muted/30">
        <Container>
          <FadeIn delay={0.2}>
            <Badge variant="secondary" className="mb-6">
              <BookOpen className="h-3 w-3 mr-1" />
              Learning Center
            </Badge>
          </FadeIn>
          
          <FadeIn delay={0.4}>
            <Heading level={1} size="2xl" className="mb-6">
              Master Database Optimization
            </Heading>
          </FadeIn>
          
          <FadeIn delay={0.6}>
            <Text size="lg" variant="muted" className="mb-8 max-w-3xl mx-auto">
              Comprehensive guides, tutorials, and resources to help you become an expert in 
              database optimization and AI-powered development tools.
            </Text>
          </FadeIn>
          
          <FadeIn delay={0.8}>
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search guides and tutorials..." 
                className="pl-10"
              />
            </div>
          </FadeIn>
        </Container>
      </Section>

      {/* Featured Content */}
      <Section spacing="lg">
        <Container>
          <div className="mb-8">
            <Heading level={2} size="lg" className="mb-2">Featured Content</Heading>
            <Text variant="muted">Start with our most popular and comprehensive resources</Text>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-12">
            {guides.filter(guide => guide.featured).map((guide, index) => (
              <HoverScale key={index}>
                <Card className="h-full transition-all duration-300 hover:shadow-xl border-2 hover:border-primary/20 group cursor-pointer">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-primary/15 text-primary group-hover:shadow-md transition-all duration-300">
                          <guide.icon className="h-6 w-6" />
                        </div>
                        <Badge variant="default" className="text-xs">
                          Featured
                        </Badge>
                      </div>
                      {guide.type === 'video' && (
                        <div className="p-2 rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300">
                          <Play className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
                      {guide.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="leading-relaxed">
                      {guide.description}
                    </CardDescription>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {guide.duration}
                        </div>
                        <Badge className={`text-xs ${getDifficultyColor(guide.difficulty)}`}>
                          {guide.difficulty}
                        </Badge>
                      </div>
                      <EnhancedButton variant="ghost" size="sm">
                        Start Learning
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </EnhancedButton>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {guide.tags.map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </HoverScale>
            ))}
          </div>
        </Container>
      </Section>

      {/* All Guides */}
      <Section spacing="lg" className="bg-muted/30">
        <Container>
          <div className="mb-8">
            <Heading level={2} size="lg" className="mb-2">All Learning Resources</Heading>
            <Text variant="muted">Browse our complete library of guides, tutorials, and articles</Text>
          </div>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.filter(guide => !guide.featured).map((guide, index) => {
              const TypeIcon = getTypeIcon(guide.type);
              return (
                <StaggerItem key={index}>
                  <HoverScale>
                    <Card className="h-full transition-all duration-300 hover:shadow-lg group cursor-pointer">
                      <CardHeader className="pb-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 rounded-lg bg-muted text-muted-foreground group-hover:bg-primary/15 group-hover:text-primary transition-all duration-300">
                            <TypeIcon className="h-5 w-5" />
                          </div>
                          <Badge variant="outline" className="text-xs capitalize">
                            {guide.type}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300">
                          {guide.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <CardDescription className="text-sm leading-relaxed">
                          {guide.description}
                        </CardDescription>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {guide.duration}
                          </div>
                          <Badge className={`text-xs ${getDifficultyColor(guide.difficulty)}`}>
                            {guide.difficulty}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {guide.tags.slice(0, 2).map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {guide.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{guide.tags.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </HoverScale>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </Container>
      </Section>

      {/* Quick Tips */}
      <Section spacing="lg">
        <Container>
          <div className="mb-8">
            <Heading level={2} size="lg" className="mb-2">Quick Tips</Heading>
            <Text variant="muted">Bite-sized optimization tips you can implement right away</Text>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickTips.map((tip, index) => (
              <FadeIn key={index} delay={index * 0.1}>
                <Card className="p-4 hover:shadow-md transition-shadow duration-200 border-l-4 border-l-primary">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Text size="sm" className="font-medium">{tip.title}</Text>
                      <Badge variant="outline" className="text-xs">
                        {tip.time}
                      </Badge>
                    </div>
                    <Text size="sm" variant="muted" className="leading-relaxed">
                      {tip.description}
                    </Text>
                  </div>
                </Card>
              </FadeIn>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section spacing="lg" className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <Container className="text-center">
          <FadeIn>
            <Heading level={2} size="xl" className="mb-4">
              Ready to Apply What You've Learned?
            </Heading>
          </FadeIn>
          
          <FadeIn delay={0.2}>
            <Text size="lg" variant="muted" className="mb-8">
              Put your knowledge into practice with DBooster's AI-powered optimization tools.
            </Text>
          </FadeIn>
          
          <FadeIn delay={0.4}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <HoverScale>
                <EnhancedButton 
                  size="lg" 
                  onClick={() => navigate('/login')} 
                  className="text-lg px-8"
                >
                  Start Optimizing
                  <ArrowRight className="ml-2 h-4 w-4" />
                </EnhancedButton>
              </HoverScale>
              
              <HoverScale>
                <EnhancedButton 
                  size="lg" 
                  variant="outline" 
                  onClick={() => navigate('/features')} 
                  className="text-lg px-8"
                >
                  Explore Features
                </EnhancedButton>
              </HoverScale>
            </div>
          </FadeIn>
        </Container>
      </Section>
    </div>
  );
}
