
import React, { useState } from 'react';
import { ChevronDown, Search, HelpCircle, MessageCircle, Book, Phone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { FadeIn, ScaleIn } from '@/components/ui/animations';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
}

const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'How does DBooster optimize my database queries?',
    answer: 'DBooster uses advanced AI algorithms to analyze your SQL queries, identify performance bottlenecks, and provide specific optimization recommendations. Our system examines query execution plans, index usage, and data access patterns to suggest improvements that can reduce query execution time by up to 73%.',
    category: 'optimization',
    tags: ['AI', 'performance', 'SQL']
  },
  {
    id: '2',
    question: 'Which databases does DBooster support?',
    answer: 'DBooster supports all major database systems including PostgreSQL, MySQL, SQL Server, Oracle, and MongoDB. Our universal optimization engine adapts to each database\'s specific features and optimization techniques.',
    category: 'compatibility',
    tags: ['databases', 'support', 'compatibility']
  },
  {
    id: '3',
    question: 'Is my data safe with DBooster?',
    answer: 'Absolutely. DBooster is SOC2 Type II compliant with end-to-end encryption, comprehensive audit trails, and role-based access control. We never store your actual data - only query metadata for analysis purposes.',
    category: 'security',
    tags: ['security', 'SOC2', 'privacy']
  },
  {
    id: '4',
    question: 'How quickly can I see results after implementing DBooster?',
    answer: 'Most users see immediate improvements within the first 24 hours of implementation. Our AI provides real-time optimization suggestions, and you can start applying recommendations right away. The setup process typically takes less than 5 minutes.',
    category: 'getting-started',
    tags: ['setup', 'results', 'implementation']
  },
  {
    id: '5',
    question: 'What\'s included in the free trial?',
    answer: 'Our free enterprise trial includes full access to all features for 14 days: AI query optimization, performance monitoring, security scanning, and team collaboration tools. No credit card required.',
    category: 'pricing',
    tags: ['trial', 'pricing', 'features']
  },
  {
    id: '6',
    question: 'Can DBooster integrate with my existing development workflow?',
    answer: 'Yes! DBooster integrates seamlessly with popular development tools including Git, Jenkins, GitHub Actions, and major IDEs. We provide APIs, webhooks, and plugins for smooth integration into your CI/CD pipeline.',
    category: 'integration',
    tags: ['integration', 'API', 'CI/CD']
  }
];

const categories = [
  { id: 'all', label: 'All Questions', icon: HelpCircle },
  { id: 'getting-started', label: 'Getting Started', icon: Book },
  { id: 'optimization', label: 'Optimization', icon: HelpCircle },
  { id: 'security', label: 'Security', icon: HelpCircle },
  { id: 'pricing', label: 'Pricing', icon: HelpCircle },
  { id: 'integration', label: 'Integration', icon: HelpCircle },
  { id: 'compatibility', label: 'Compatibility', icon: HelpCircle }
];

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openItems, setOpenItems] = useState<string[]>([]);

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4 py-12">
        <FadeIn>
          <div className="text-center mb-12">
            <ScaleIn>
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <HelpCircle className="w-8 h-8 text-primary" />
              </div>
            </ScaleIn>
            <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find answers to common questions about DBooster's AI-powered database optimization platform.
            </p>
          </div>
        </FadeIn>

        <div className="max-w-4xl mx-auto">
          <FadeIn delay={0.2}>
            <Card className="mb-8">
              <CardHeader>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search frequently asked questions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <FadeIn delay={0.3}>
              <Card className="lg:col-span-1 h-fit">
                <CardHeader>
                  <CardTitle className="text-lg">Categories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    const count = category.id === 'all' 
                      ? faqData.length 
                      : faqData.filter(faq => faq.category === category.id).length;
                    
                    return (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? 'default' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {category.label}
                        <Badge variant="secondary" className="ml-auto">
                          {count}
                        </Badge>
                      </Button>
                    );
                  })}
                </CardContent>
              </Card>
            </FadeIn>

            <div className="lg:col-span-3 space-y-4">
              {filteredFAQs.length === 0 ? (
                <FadeIn delay={0.4}>
                  <Card>
                    <CardContent className="py-12 text-center">
                      <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No questions found</h3>
                      <p className="text-muted-foreground">
                        Try adjusting your search terms or selecting a different category.
                      </p>
                    </CardContent>
                  </Card>
                </FadeIn>
              ) : (
                filteredFAQs.map((faq, index) => (
                  <FadeIn key={faq.id} delay={0.4 + index * 0.1}>
                    <Collapsible
                      open={openItems.includes(faq.id)}
                      onOpenChange={() => toggleItem(faq.id)}
                    >
                      <Card className="transition-all hover:shadow-md">
                        <CollapsibleTrigger asChild>
                          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-left text-lg font-semibold">
                                  {faq.question}
                                </CardTitle>
                                <div className="flex gap-2 mt-2">
                                  {faq.tags.map(tag => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <ChevronDown 
                                className={`w-5 h-5 text-muted-foreground transition-transform ${
                                  openItems.includes(faq.id) ? 'rotate-180' : ''
                                }`} 
                              />
                            </div>
                          </CardHeader>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <CardContent className="pt-0">
                            <p className="text-muted-foreground leading-relaxed">
                              {faq.answer}
                            </p>
                          </CardContent>
                        </CollapsibleContent>
                      </Card>
                    </Collapsible>
                  </FadeIn>
                ))
              )}
            </div>
          </div>

          <FadeIn delay={0.6}>
            <Card className="mt-12">
              <CardHeader>
                <CardTitle className="text-center">Still have questions?</CardTitle>
                <CardDescription className="text-center">
                  Can't find what you're looking for? Our support team is here to help.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Start Live Chat
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Schedule a Call
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
