
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Search, 
  Code, 
  Zap, 
  Database, 
  Shield, 
  ExternalLink,
  Clock,
  Users,
  Star
} from 'lucide-react';
import { FadeIn, ScaleIn } from '@/components/ui/animations';

const documentationSections = [
  {
    title: 'Getting Started',
    description: 'Quick setup and basic configuration',
    icon: Zap,
    articles: [
      { title: 'Installation Guide', time: '5 min', difficulty: 'Beginner' },
      { title: 'First Query Optimization', time: '10 min', difficulty: 'Beginner' },
      { title: 'Dashboard Overview', time: '8 min', difficulty: 'Beginner' }
    ],
    color: 'bg-blue-500'
  },
  {
    title: 'API Documentation',
    description: 'Complete REST API reference',
    icon: Code,
    articles: [
      { title: 'Authentication', time: '15 min', difficulty: 'Intermediate' },
      { title: 'Query Endpoints', time: '20 min', difficulty: 'Intermediate' },
      { title: 'Webhooks', time: '12 min', difficulty: 'Advanced' }
    ],
    color: 'bg-green-500'
  },
  {
    title: 'Database Integration',
    description: 'Connect and optimize your databases',
    icon: Database,
    articles: [
      { title: 'PostgreSQL Setup', time: '10 min', difficulty: 'Beginner' },
      { title: 'MySQL Configuration', time: '10 min', difficulty: 'Beginner' },
      { title: 'Advanced Query Analysis', time: '25 min', difficulty: 'Advanced' }
    ],
    color: 'bg-purple-500'
  },
  {
    title: 'Security & Compliance',
    description: 'Security best practices and compliance',
    icon: Shield,
    articles: [
      { title: 'SOC2 Compliance Guide', time: '15 min', difficulty: 'Intermediate' },
      { title: 'Data Encryption', time: '12 min', difficulty: 'Intermediate' },
      { title: 'Access Control', time: '18 min', difficulty: 'Advanced' }
    ],
    color: 'bg-red-500'
  }
];

export default function Documentation() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSections = documentationSections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.articles.some(article => article.title.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4 py-12">
        <FadeIn>
          <div className="text-center mb-12">
            <ScaleIn>
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
            </ScaleIn>
            <h1 className="text-4xl font-bold mb-4">Documentation Hub</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive guides, API documentation, and best practices for DBooster's AI-powered database optimization platform.
            </p>
          </div>
        </FadeIn>

        <div className="max-w-6xl mx-auto">
          <FadeIn delay={0.2}>
            <Card className="mb-8">
              <CardHeader>
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search documentation..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="gap-2">
                      <ExternalLink className="w-4 h-4" />
                      API Reference
                    </Button>
                    <Button className="gap-2">
                      <Star className="w-4 h-4" />
                      Quick Start
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredSections.map((section, index) => {
              const Icon = section.icon;
              return (
                <FadeIn key={section.title} delay={0.3 + index * 0.1}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-lg ${section.color} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">{section.title}</CardTitle>
                          <CardDescription className="text-base">
                            {section.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {section.articles.map((article, articleIndex) => (
                        <div key={articleIndex} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{article.title}</h4>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="w-3 h-3" />
                                {article.time}
                              </span>
                              <Badge variant={
                                article.difficulty === 'Beginner' ? 'secondary' :
                                article.difficulty === 'Intermediate' ? 'default' : 'destructive'
                              } className="text-xs">
                                {article.difficulty}
                              </Badge>
                            </div>
                          </div>
                          <ExternalLink className="w-4 h-4 text-muted-foreground" />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </FadeIn>
              );
            })}
          </div>

          <FadeIn delay={0.6}>
            <Card className="mt-12">
              <CardHeader>
                <CardTitle className="text-center">Need Help?</CardTitle>
                <CardDescription className="text-center">
                  Can't find what you're looking for? Our support team is here to help.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Contact Support
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Community Forum
                  </Button>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
