
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Calendar, 
  User, 
  ArrowRight, 
  Clock, 
  TrendingUp,
  Database,
  Zap,
  Brain,
  Code,
  BarChart3,
  BookOpen,
  Star,
  Filter
} from 'lucide-react';
import { FadeIn, StaggerContainer, StaggerItem, HoverScale } from '@/components/ui/enhanced-animations';
import { Section, Container, Heading, Text } from '@/components/ui/visual-hierarchy';

export default function Blog() {
  const navigate = useNavigate();

  const featuredPost = {
    id: 1,
    title: "The Future of Database Optimization: How AI is Revolutionizing Query Performance",
    excerpt: "Discover how artificial intelligence is transforming the way we approach database optimization, making it more accessible and effective than ever before.",
    author: "Sarah Chen",
    authorRole: "Senior Database Engineer",
    publishDate: "March 15, 2024",
    readTime: "8 min read",
    category: "AI & Machine Learning",
    tags: ["AI", "Database", "Performance", "Innovation"],
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&h=400&fit=crop",
    featured: true
  };

  const blogPosts = [
    {
      id: 2,
      title: "5 Common SQL Performance Mistakes and How to Fix Them",
      excerpt: "Learn about the most frequent SQL optimization pitfalls and practical solutions to improve your query performance.",
      author: "Marcus Johnson",
      authorRole: "Database Architect",
      publishDate: "March 12, 2024",
      readTime: "6 min read",
      category: "Best Practices",
      tags: ["SQL", "Performance", "Optimization"],
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=250&fit=crop"
    },
    {
      id: 3,
      title: "Database Indexing Strategies for Modern Applications",
      excerpt: "A comprehensive guide to choosing the right indexing strategy for your application's specific needs and query patterns.",
      author: "Emily Rodriguez",
      authorRole: "Performance Engineer",
      publishDate: "March 10, 2024",
      readTime: "12 min read",
      category: "Technical Deep Dive",
      tags: ["Indexing", "Database Design", "Performance"],
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop"
    },
    {
      id: 4,
      title: "Getting Started with Database Performance Monitoring",
      excerpt: "Essential metrics and tools every developer should know for effective database performance monitoring and alerting.",
      author: "David Kim",
      authorRole: "DevOps Engineer",
      publishDate: "March 8, 2024",
      readTime: "7 min read",
      category: "Monitoring",
      tags: ["Monitoring", "DevOps", "Metrics"],
      image: "https://images.unsplash.com/photo-1527576539890-dfa815648363?w=400&h=250&fit=crop"
    },
    {
      id: 5,
      title: "The Economics of Database Optimization: ROI Analysis",
      excerpt: "Understanding the financial impact of database optimization and how to measure return on investment for performance improvements.",
      author: "Lisa Zhang",
      authorRole: "Technical Product Manager",
      publishDate: "March 5, 2024",
      readTime: "10 min read",
      category: "Business Impact",
      tags: ["ROI", "Economics", "Business"],
      image: "https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?w=400&h=250&fit=crop"
    },
    {
      id: 6,
      title: "Team Collaboration in Database Development",
      excerpt: "Best practices for collaborative database development, including code reviews, shared standards, and knowledge sharing.",
      author: "Alex Thompson",
      authorRole: "Engineering Manager",
      publishDate: "March 3, 2024",
      readTime: "5 min read",
      category: "Team Management",
      tags: ["Collaboration", "Team", "Process"],
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=250&fit=crop"
    },
    {
      id: 7,
      title: "Cloud Database Performance: AWS vs Azure vs GCP",
      excerpt: "Comparing database performance characteristics across major cloud providers and optimization strategies for each platform.",
      author: "Roberto Silva",
      authorRole: "Cloud Architect",
      publishDate: "March 1, 2024",
      readTime: "15 min read",
      category: "Cloud Computing",
      tags: ["Cloud", "AWS", "Azure", "GCP"],
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=250&fit=crop"
    }
  ];

  const categories = [
    { name: "All", count: 12, icon: BookOpen },
    { name: "AI & Machine Learning", count: 3, icon: Brain },
    { name: "Best Practices", count: 4, icon: Star },
    { name: "Technical Deep Dive", count: 2, icon: Code },
    { name: "Monitoring", count: 2, icon: BarChart3 },
    { name: "Business Impact", count: 1, icon: TrendingUp }
  ];

  const getCategoryIcon = (category: string) => {
    const categoryMap: { [key: string]: any } = {
      "AI & Machine Learning": Brain,
      "Best Practices": Star,
      "Technical Deep Dive": Code,
      "Monitoring": BarChart3,
      "Business Impact": TrendingUp,
      "Team Management": User,
      "Cloud Computing": Database
    };
    return categoryMap[category] || BookOpen;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Section spacing="lg" className="text-center bg-gradient-to-b from-background to-muted/30">
        <Container>
          <FadeIn delay={0.2}>
            <Badge variant="secondary" className="mb-6">
              <BookOpen className="h-3 w-3 mr-1" />
              Blog & Insights
            </Badge>
          </FadeIn>
          
          <FadeIn delay={0.4}>
            <Heading level={1} size="2xl" className="mb-6">
              Database Optimization Insights
            </Heading>
          </FadeIn>
          
          <FadeIn delay={0.6}>
            <Text size="lg" variant="muted" className="mb-8 max-w-3xl mx-auto">
              Stay updated with the latest trends, best practices, and insights in database optimization, 
              AI-powered development, and performance engineering.
            </Text>
          </FadeIn>
          
          <FadeIn delay={0.8}>
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search articles..." 
                className="pl-10"
              />
            </div>
          </FadeIn>
        </Container>
      </Section>

      {/* Categories Filter */}
      <Section spacing="sm" className="border-b">
        <Container>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Text size="sm" variant="muted">Filter by category:</Text>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Badge 
                  key={category.name} 
                  variant="outline" 
                  className="cursor-pointer hover:bg-accent flex items-center gap-1 px-3 py-1"
                >
                  <IconComponent className="h-3 w-3" />
                  {category.name} ({category.count})
                </Badge>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* Featured Article */}
      <Section spacing="lg">
        <Container>
          <div className="mb-8">
            <Heading level={2} size="lg" className="mb-2">Featured Article</Heading>
            <Text variant="muted">Don't miss our latest insights</Text>
          </div>

          <FadeIn>
            <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group cursor-pointer border-2 hover:border-primary/20">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="relative overflow-hidden">
                  <img 
                    src={featuredPost.image} 
                    alt={featuredPost.title}
                    className="w-full h-64 lg:h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant="default" className="bg-primary/90 backdrop-blur-sm">
                      Featured
                    </Badge>
                  </div>
                </div>
                
                <div className="p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="outline" className="flex items-center gap-1">
                      {React.createElement(getCategoryIcon(featuredPost.category), { className: "h-3 w-3" })}
                      {featuredPost.category}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {featuredPost.readTime}
                    </div>
                  </div>
                  
                  <Heading level={3} size="lg" className="mb-4 group-hover:text-primary transition-colors duration-300">
                    {featuredPost.title}
                  </Heading>
                  
                  <Text variant="muted" className="mb-6 leading-relaxed">
                    {featuredPost.excerpt}
                  </Text>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <Text size="sm" className="font-medium">{featuredPost.author}</Text>
                        <Text size="xs" variant="muted">{featuredPost.authorRole}</Text>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {featuredPost.publishDate}
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <EnhancedButton variant="outline" className="group/btn">
                      Read Article
                      <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
                    </EnhancedButton>
                  </div>
                </div>
              </div>
            </Card>
          </FadeIn>
        </Container>
      </Section>

      {/* Articles Grid */}
      <Section spacing="lg" className="bg-muted/30">
        <Container>
          <div className="mb-8">
            <Heading level={2} size="lg" className="mb-2">Latest Articles</Heading>
            <Text variant="muted">Explore our complete library of database optimization content</Text>
          </div>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post, index) => {
              const CategoryIcon = getCategoryIcon(post.category);
              return (
                <StaggerItem key={post.id}>
                  <HoverScale>
                    <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300 group cursor-pointer">
                      <div className="relative overflow-hidden">
                        <img 
                          src={post.image} 
                          alt={post.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3">
                          <Badge variant="secondary" className="text-xs bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
                            <CategoryIcon className="h-3 w-3 mr-1" />
                            {post.category}
                          </Badge>
                        </div>
                      </div>
                      
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {post.publishDate}
                          <span>•</span>
                          <Clock className="h-3 w-3" />
                          {post.readTime}
                        </div>
                        
                        <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors duration-300">
                          {post.title}
                        </CardTitle>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <CardDescription className="text-sm leading-relaxed line-clamp-3">
                          {post.excerpt}
                        </CardDescription>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                              <User className="h-3 w-3 text-primary" />
                            </div>
                            <div>
                              <Text size="xs" className="font-medium">{post.author}</Text>
                              <Text size="xs" variant="muted">{post.authorRole}</Text>
                            </div>
                          </div>
                          
                          <EnhancedButton variant="ghost" size="sm">
                            Read More
                            <ArrowRight className="ml-1 h-3 w-3" />
                          </EnhancedButton>
                        </div>
                        
                        <div className="flex flex-wrap gap-1">
                          {post.tags.slice(0, 2).map((tag, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {post.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{post.tags.length - 2}
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

          <div className="text-center mt-12">
            <EnhancedButton variant="outline" size="lg">
              Load More Articles
              <ArrowRight className="ml-2 h-4 w-4" />
            </EnhancedButton>
          </div>
        </Container>
      </Section>

      {/* Newsletter Signup */}
      <Section spacing="lg">
        <Container>
          <FadeIn>
            <Card className="max-w-2xl mx-auto text-center p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-primary/20">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              
              <Heading level={3} size="lg" className="mb-3">
                Stay Updated
              </Heading>
              
              <Text variant="muted" className="mb-6">
                Subscribe to our newsletter for the latest database optimization insights, 
                tips, and industry trends delivered to your inbox.
              </Text>
              
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <Input 
                  placeholder="Enter your email" 
                  type="email"
                  className="flex-1"
                />
                <EnhancedButton>
                  Subscribe
                  <ArrowRight className="ml-2 h-4 w-4" />
                </EnhancedButton>
              </div>
              
              <Text size="xs" variant="muted" className="mt-3">
                No spam, unsubscribe at any time.
              </Text>
            </Card>
          </FadeIn>
        </Container>
      </Section>
    </div>
  );
}
