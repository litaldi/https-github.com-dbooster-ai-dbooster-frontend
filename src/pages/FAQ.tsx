
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronDown, Search, HelpCircle, MessageCircle, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'technical' | 'pricing' | 'security';
}

const faqData: FAQItem[] = [
  {
    id: '1',
    question: 'What is DBooster and how does it work?',
    answer: 'DBooster is an AI-powered database optimization platform that analyzes your SQL queries and database performance to provide intelligent recommendations. Our AI engine examines query patterns, execution plans, and database schema to suggest optimizations that can reduce response times by up to 73%.',
    category: 'general'
  },
  {
    id: '2',
    question: 'Which databases does DBooster support?',
    answer: 'DBooster currently supports PostgreSQL, MySQL, SQL Server, and MongoDB. We\'re continuously adding support for more database systems based on user demand. Each database type has specialized optimization rules tailored to its unique characteristics.',
    category: 'technical'
  },
  {
    id: '3',
    question: 'How much does DBooster cost?',
    answer: 'DBooster offers flexible pricing starting at $29/month for small teams. We have a free tier for individual developers, and enterprise plans for larger organizations. All plans include core optimization features, with advanced analytics and team collaboration available in higher tiers.',
    category: 'pricing'
  },
  {
    id: '4',
    question: 'Is my database data secure with DBooster?',
    answer: 'Absolutely. DBooster is SOC2 Type II certified and follows industry-leading security practices. We only analyze query structures and metadata - never your actual data. All communications are encrypted, and we offer on-premises deployment options for enterprise customers.',
    category: 'security'
  },
  {
    id: '5',
    question: 'Can I try DBooster before committing to a paid plan?',
    answer: 'Yes! We offer a comprehensive free demo that lets you explore all features without any limitations. You can also start with our free tier for individual use, which includes basic optimization recommendations and limited query analysis.',
    category: 'general'
  },
  {
    id: '6',
    question: 'How long does it take to see results?',
    answer: 'Most users see immediate insights within minutes of connecting their database. Query optimization recommendations are generated in real-time, and you can start implementing improvements right away. Performance gains are typically visible within hours of applying our suggestions.',
    category: 'general'
  },
  {
    id: '7',
    question: 'Do I need to install anything on my database server?',
    answer: 'No installation required! DBooster works by analyzing your query logs and database metadata through secure connections. For cloud databases, we connect using standard connection strings. For on-premises databases, we offer lightweight monitoring agents.',
    category: 'technical'
  },
  {
    id: '8',
    question: 'What if I have questions or need help?',
    answer: 'We provide 24/7 support through multiple channels: live chat, email support, comprehensive documentation, and community forums. Enterprise customers get dedicated success managers and priority support with guaranteed response times.',
    category: 'general'
  },
  {
    id: '9',
    question: 'Can DBooster handle large-scale enterprise databases?',
    answer: 'Absolutely. DBooster is designed to scale with your needs, from small applications to enterprise systems processing millions of queries daily. Our enterprise plan includes advanced features like multi-database management, team collaboration, and custom optimization rules.',
    category: 'technical'
  },
  {
    id: '10',
    question: 'What makes DBooster different from other database tools?',
    answer: 'DBooster combines AI-powered analysis with practical, actionable recommendations. Unlike generic monitoring tools, we provide specific optimization suggestions with predicted performance improvements. Our focus is on making database optimization accessible to developers of all skill levels.',
    category: 'general'
  }
];

const categories = [
  { key: 'all', label: 'All Questions' },
  { key: 'general', label: 'General' },
  { key: 'technical', label: 'Technical' },
  { key: 'pricing', label: 'Pricing' },
  { key: 'security', label: 'Security' }
];

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const filteredFAQs = faqData.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'general': return 'bg-blue-500/10 text-blue-600';
      case 'technical': return 'bg-green-500/10 text-green-600';
      case 'pricing': return 'bg-purple-500/10 text-purple-600';
      case 'security': return 'bg-orange-500/10 text-orange-600';
      default: return 'bg-gray-500/10 text-gray-600';
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-8" dir="ltr">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-4"
      >
        <Badge variant="secondary" className="mb-4 px-4 py-2">
          <HelpCircle className="h-4 w-4 mr-2" />
          Frequently Asked Questions
        </Badge>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          How can we help you?
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Find answers to common questions about DBooster, database optimization, and getting started.
        </p>
      </motion.div>

      {/* Search and Filter Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="space-y-6"
      >
        {/* Search Bar */}
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 text-center md:text-left"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <Button
              key={category.key}
              variant={selectedCategory === category.key ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.key)}
              className="text-sm"
            >
              {category.label}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* FAQ Items */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="space-y-4"
      >
        {filteredFAQs.length === 0 ? (
          <Card className="p-8 text-center">
            <CardContent>
              <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No questions found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search terms or browse all categories.
              </p>
              <Button onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredFAQs.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-0">
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-full p-6 text-left hover:bg-muted/30 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <Badge 
                            variant="secondary" 
                            className={cn("text-xs", getCategoryColor(item.category))}
                          >
                            {item.category}
                          </Badge>
                        </div>
                        <h3 className="text-lg font-semibold leading-tight">
                          {item.question}
                        </h3>
                      </div>
                      <ChevronDown 
                        className={cn(
                          "h-5 w-5 text-muted-foreground transition-transform duration-200 flex-shrink-0",
                          openItems.has(item.id) && "rotate-180"
                        )}
                      />
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {openItems.has(item.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-0">
                          <div className="border-t pt-4">
                            <p className="text-muted-foreground leading-relaxed">
                              {item.answer}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Contact Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-gradient-to-r from-primary/5 to-blue-500/5 p-8 rounded-lg text-center space-y-6"
      >
        <MessageCircle className="h-12 w-12 text-primary mx-auto" />
        <h2 className="text-2xl font-bold">Still have questions?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Our support team is here to help. Get in touch through live chat, email, or schedule a demo 
          to see how DBooster can optimize your database performance.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild>
            <Link to="/contact">
              <Mail className="h-4 w-4 mr-2" />
              Contact Support
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/login">
              Try Demo
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
