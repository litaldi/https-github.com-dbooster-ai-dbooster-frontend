
import React from 'react';
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { 
  Search, 
  Calendar, 
  User, 
  ArrowRight,
  BookOpen,
  TrendingUp,
  Database,
  Code,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

const blogPosts = [
  {
    title: "10 Database Optimization Techniques That Actually Work",
    excerpt: "Discover proven strategies to improve your database performance by up to 75% with these practical optimization techniques.",
    author: "Sarah Rodriguez",
    date: "Dec 15, 2024",
    category: "Performance",
    readTime: "8 min read",
    featured: true
  },
  {
    title: "AI-Powered Query Optimization: The Future is Here",
    excerpt: "How machine learning is revolutionizing database query optimization and what it means for developers.",
    author: "David Chen",
    date: "Dec 12, 2024",
    category: "AI & ML",
    readTime: "6 min read"
  },
  {
    title: "PostgreSQL vs MySQL: Performance Benchmarks 2024",
    excerpt: "Comprehensive performance comparison between PostgreSQL and MySQL across different workloads and use cases.",
    author: "Michael Thompson",
    date: "Dec 10, 2024",
    category: "Databases",
    readTime: "12 min read"
  },
  {
    title: "Index Optimization Strategies for Large-Scale Applications",
    excerpt: "Learn how to create and maintain indexes that scale with your application's growth.",
    author: "Lisa Wang",
    date: "Dec 8, 2024",
    category: "Performance",
    readTime: "10 min read"
  },
  {
    title: "Database Security Best Practices for 2024",
    excerpt: "Essential security measures every developer should implement to protect their database infrastructure.",
    author: "Sarah Rodriguez",
    date: "Dec 5, 2024",
    category: "Security",
    readTime: "7 min read"
  },
  {
    title: "Monitoring Database Performance: Key Metrics to Track",
    excerpt: "A comprehensive guide to database monitoring and the metrics that matter most for performance optimization.",
    author: "David Chen",
    date: "Dec 3, 2024",
    category: "Monitoring",
    readTime: "9 min read"
  }
];

const categories = [
  { name: "All Posts", count: 24 },
  { name: "Performance", count: 8 },
  { name: "AI & ML", count: 5 },
  { name: "Databases", count: 6 },
  { name: "Security", count: 3 },
  { name: "Monitoring", count: 2 }
];

export default function BlogPage() {
  return (
    <StandardPageLayout
      title="DBooster Blog"
      subtitle="Database Optimization Insights"
      description="Stay updated with the latest trends, tips, and best practices in database optimization and performance tuning."
    >
      <div className="space-y-16">
        {/* Search and Categories */}
        <section>
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search articles..."
                  className="pl-12 h-12"
                />
              </div>
            </div>
            
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category, index) => (
                <Button
                  key={index}
                  variant={index === 0 ? "default" : "outline"}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  {category.name}
                  <Badge variant="secondary" className="text-xs">
                    {category.count}
                  </Badge>
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Post */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="md:flex">
                <div className="md:w-1/3 bg-gradient-to-br from-primary/10 to-blue-500/10 p-8 flex items-center justify-center">
                  <TrendingUp className="h-24 w-24 text-primary" />
                </div>
                <div className="md:w-2/3 p-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Badge>Featured</Badge>
                    <Badge variant="outline">{blogPosts[0].category}</Badge>
                  </div>
                  <CardTitle className="text-2xl mb-4">{blogPosts[0].title}</CardTitle>
                  <p className="text-muted-foreground mb-6 text-lg">{blogPosts[0].excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {blogPosts[0].author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {blogPosts[0].date}
                      </div>
                      <span>{blogPosts[0].readTime}</span>
                    </div>
                    <Button>
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </section>

        {/* Blog Posts Grid */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(1).map((post, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow group">
                  <CardHeader>
                    <div className="w-full h-48 bg-gradient-to-br from-muted to-muted/50 rounded-lg mb-4 flex items-center justify-center">
                      {post.category === 'Performance' && <Zap className="h-12 w-12 text-primary" />}
                      {post.category === 'AI & ML' && <BookOpen className="h-12 w-12 text-primary" />}
                      {post.category === 'Databases' && <Database className="h-12 w-12 text-primary" />}
                      {post.category === 'Security' && <Code className="h-12 w-12 text-primary" />}
                      {post.category === 'Monitoring' && <TrendingUp className="h-12 w-12 text-primary" />}
                    </div>
                    <Badge variant="outline" className="w-fit mb-2">
                      {post.category}
                    </Badge>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {post.author}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {post.date}
                        </div>
                      </div>
                      <span className="text-xs">{post.readTime}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Newsletter Signup */}
        <section className="bg-gradient-to-r from-primary/5 to-blue-500/5 p-12 rounded-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <BookOpen className="h-16 w-16 mx-auto mb-6 text-primary" />
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Get the latest database optimization tips, tutorials, and insights delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1"
              />
              <Button>Subscribe</Button>
            </div>
          </motion.div>
        </section>
      </div>
    </StandardPageLayout>
  );
}
