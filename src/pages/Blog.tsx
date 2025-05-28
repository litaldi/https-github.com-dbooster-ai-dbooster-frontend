
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  User, 
  ArrowRight, 
  BookOpen,
  TrendingUp,
  Lightbulb,
  Target,
  Zap,
  Brain,
  Star,
  ChevronRight
} from 'lucide-react';
import { FadeIn, ScaleIn, StaggerContainer, StaggerItem, HoverScale } from '@/components/ui/enhanced-animations';
import { Section, Container, Heading, Text } from '@/components/ui/visual-hierarchy';

export default function Blog() {
  const navigate = useNavigate();

  const featuredPost = {
    id: 1,
    title: "10 Advanced SQL Optimization Techniques That Will Transform Your Database Performance",
    excerpt: "Discover the hidden gems of SQL optimization that most developers never learn. From advanced indexing strategies to query plan analysis.",
    author: "Sarah Chen",
    date: "2024-03-15",
    readTime: "8 min read",
    category: "Optimization",
    image: "/placeholder.svg",
    featured: true,
    tags: ["SQL", "Performance", "Advanced"]
  };

  const recentPosts = [
    {
      id: 2,
      title: "AI-Powered Query Analysis: The Future of Database Optimization",
      excerpt: "How machine learning is revolutionizing the way we optimize database queries and what it means for developers.",
      author: "Mike Johnson",
      date: "2024-03-12",
      readTime: "6 min read",
      category: "AI & Machine Learning",
      tags: ["AI", "Machine Learning", "Future Tech"]
    },
    {
      id: 3,
      title: "Common PostgreSQL Performance Pitfalls and How to Avoid Them",
      excerpt: "Learn about the most frequent PostgreSQL performance issues and proven strategies to prevent them.",
      author: "Emma Rodriguez",
      date: "2024-03-10",
      readTime: "5 min read",
      category: "PostgreSQL",
      tags: ["PostgreSQL", "Performance", "Best Practices"]
    },
    {
      id: 4,
      title: "Building Scalable Database Architectures for Modern Applications",
      excerpt: "A comprehensive guide to designing database architectures that can handle millions of users.",
      author: "David Kim",
      date: "2024-03-08",
      readTime: "12 min read",
      category: "Architecture",
      tags: ["Architecture", "Scalability", "Design"]
    },
    {
      id: 5,
      title: "Query Optimization Checklist: 15 Steps to Faster Queries",
      excerpt: "A practical checklist every developer should follow to ensure optimal query performance.",
      author: "Lisa Wang",
      date: "2024-03-05",
      readTime: "4 min read",
      category: "Quick Tips",
      tags: ["Checklist", "Quick Tips", "Optimization"]
    },
    {
      id: 6,
      title: "Understanding Database Indexes: A Visual Guide",
      excerpt: "Learn how database indexes work with clear visualizations and practical examples.",
      author: "Alex Thompson",
      date: "2024-03-03",
      readTime: "7 min read",
      category: "Fundamentals",
      tags: ["Indexes", "Fundamentals", "Visual Learning"]
    },
    {
      id: 7,
      title: "Real-World Case Study: Optimizing a High-Traffic E-commerce Database",
      excerpt: "How we improved query performance by 300% for a major e-commerce platform.",
      author: "Rachel Green",
      date: "2024-03-01",
      readTime: "10 min read",
      category: "Case Studies",
      tags: ["Case Study", "E-commerce", "Real World"]
    }
  ];

  const categories = [
    { name: "All Posts", count: 24, active: true },
    { name: "Optimization", count: 8 },
    { name: "AI & Machine Learning", count: 5 },
    { name: "PostgreSQL", count: 6 },
    { name: "Quick Tips", count: 4 },
    { name: "Case Studies", count: 3 }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Section spacing="lg" className="text-center bg-gradient-to-b from-background to-muted/30">
        <Container>
          <FadeIn delay={0.2}>
            <Badge variant="secondary" className="mb-6">
              <BookOpen className="h-3 w-3 mr-1" />
              DBooster Blog
            </Badge>
          </FadeIn>
          
          <FadeIn delay={0.4}>
            <Heading level={1} size="2xl" className="mb-6">
              Database Optimization Insights & Best Practices
            </Heading>
          </FadeIn>
          
          <FadeIn delay={0.6}>
            <Text size="lg" variant="muted" className="mb-8 max-w-3xl mx-auto">
              Stay updated with the latest database optimization techniques, AI-powered insights, 
              and real-world case studies from industry experts.
            </Text>
          </FadeIn>
        </Container>
      </Section>

      {/* Categories Filter */}
      <Section spacing="sm" className="border-b">
        <Container>
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Badge 
                key={category.name} 
                variant={category.active ? "default" : "outline"} 
                className="cursor-pointer hover:bg-accent px-4 py-2"
              >
                {category.name} ({category.count})
              </Badge>
            ))}
          </div>
        </Container>
      </Section>

      {/* Featured Post */}
      <Section spacing="lg">
        <Container>
          <FadeIn>
            <div className="mb-8">
              <Heading level={2} size="lg" className="mb-4 flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Featured Post
              </Heading>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <HoverScale>
              <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-purple-500/5 hover:shadow-xl transition-all duration-300 cursor-pointer">
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <div className="h-48 md:h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Brain className="h-16 w-16 text-white" />
                    </div>
                  </div>
                  <div className="md:w-2/3 p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="default">{featuredPost.category}</Badge>
                      <Badge variant="outline">Featured</Badge>
                    </div>
                    <CardTitle className="text-2xl mb-3 hover:text-primary transition-colors">
                      {featuredPost.title}
                    </CardTitle>
                    <CardDescription className="text-base mb-4 leading-relaxed">
                      {featuredPost.excerpt}
                    </CardDescription>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {featuredPost.author}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {featuredPost.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {featuredPost.readTime}
                        </div>
                      </div>
                      
                      <EnhancedButton variant="ghost" size="sm" className="group">
                        Read More
                        <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </EnhancedButton>
                    </div>
                  </div>
                </div>
              </Card>
            </HoverScale>
          </FadeIn>
        </Container>
      </Section>

      {/* Recent Posts Grid */}
      <Section spacing="lg" className="bg-muted/30">
        <Container>
          <div className="mb-8">
            <Heading level={2} size="lg" className="mb-4">
              Recent Posts
            </Heading>
          </div>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPosts.map((post, index) => (
              <StaggerItem key={post.id}>
                <HoverScale>
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
                    <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Target className="h-12 w-12 text-white" />
                    </div>
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {post.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <CardDescription className="line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </CardDescription>
                      
                      <div className="flex flex-wrap gap-1">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <User className="h-3 w-3" />
                            {post.author}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {post.date}
                            <span>•</span>
                            <Clock className="h-3 w-3" />
                            {post.readTime}
                          </div>
                        </div>
                        
                        <EnhancedButton variant="ghost" size="sm" className="group p-2">
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </EnhancedButton>
                      </div>
                    </CardContent>
                  </Card>
                </HoverScale>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Container>
      </Section>

      {/* Newsletter Signup */}
      <Section spacing="lg">
        <Container>
          <FadeIn>
            <Card className="max-w-2xl mx-auto text-center p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-primary/20">
              <Lightbulb className="h-12 w-12 mx-auto mb-4 text-primary" />
              <CardTitle className="text-2xl mb-4">
                Stay Updated with Database Insights
              </CardTitle>
              <CardDescription className="mb-6 text-base">
                Get the latest database optimization tips, AI insights, and industry best practices 
                delivered to your inbox every week.
              </CardDescription>
              
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <EnhancedButton className="sm:px-6">
                  Subscribe
                  <ArrowRight className="ml-2 h-4 w-4" />
                </EnhancedButton>
              </div>
              
              <Text size="sm" variant="muted" className="mt-3">
                No spam, unsubscribe at any time. Join 1,000+ developers.
              </Text>
            </Card>
          </FadeIn>
        </Container>
      </Section>
    </div>
  );
}
