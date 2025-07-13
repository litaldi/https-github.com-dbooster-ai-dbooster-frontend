
import React, { useState } from 'react';
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle,
  MessageSquare,
  BookOpen,
  Mail
} from 'lucide-react';
import { Link } from 'react-router-dom';

const faqCategories = [
  { name: "All", count: 24 },
  { name: "Getting Started", count: 6 },
  { name: "Database Connection", count: 5 },
  { name: "Optimization", count: 7 },
  { name: "Pricing & Billing", count: 4 },
  { name: "Security", count: 2 }
];

const faqs = [
  {
    category: "Getting Started",
    question: "How do I get started with DBooster?",
    answer: "Getting started is simple! Sign up for a free account, connect your database with read-only credentials, and DBooster will immediately begin analyzing your queries. You'll see optimization recommendations within minutes."
  },
  {
    category: "Getting Started",
    question: "What databases does DBooster support?",
    answer: "DBooster supports 50+ database types including PostgreSQL, MySQL, MongoDB, SQL Server, Oracle, Redis, and many more. We're constantly adding support for new databases based on user requests."
  },
  {
    category: "Database Connection",
    question: "Is it safe to connect my database to DBooster?",
    answer: "Absolutely! DBooster only requires read-only access to your database. We cannot modify, delete, or write any data. All connections use encrypted channels and we're SOC2 Type II compliant."
  },
  {
    category: "Database Connection",
    question: "Do you store my database data?",
    answer: "No, we do not store your actual database data. We only analyze query patterns and metadata to provide optimization recommendations. Your sensitive data never leaves your infrastructure."
  },
  {
    category: "Optimization",
    question: "How much performance improvement can I expect?",
    answer: "On average, our customers see a 75% improvement in query performance. However, results vary based on your current database setup and query complexity. Some customers have seen improvements of up to 90%."
  },
  {
    category: "Optimization",
    question: "Do I need to be a database expert to use DBooster?",
    answer: "Not at all! DBooster is designed for developers of all skill levels. Our AI provides clear, actionable recommendations with explanations. You don't need deep database expertise to benefit from our optimizations."
  },
  {
    category: "Optimization",
    question: "How does the AI optimization work?",
    answer: "Our AI analyzes your query patterns, database schema, and execution plans using machine learning models trained on millions of queries. It identifies bottlenecks and suggests specific optimizations like index creation, query rewriting, and schema improvements."
  },
  {
    category: "Pricing & Billing",
    question: "Is there a free plan available?",
    answer: "Yes! We offer a free Community plan that includes basic optimization features for individual developers. Paid plans start at $29/month for teams with advanced features and priority support."
  },
  {
    category: "Pricing & Billing",
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, you can cancel your subscription at any time. There are no long-term commitments or cancellation fees. Your subscription will remain active until the end of your current billing period."
  },
  {
    category: "Security",
    question: "What security certifications do you have?",
    answer: "DBooster is SOC2 Type II compliant and follows industry-standard security practices. We use encryption in transit and at rest, regular security audits, and maintain strict access controls."
  },
  {
    category: "Security",
    question: "Where is my data processed?",
    answer: "Data processing occurs in secure, compliant cloud infrastructure. We offer deployment options in multiple regions and can accommodate specific data residency requirements for enterprise customers."
  }
];

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <StandardPageLayout
      title="Frequently Asked Questions"
      subtitle="Get Answers Fast"
      description="Find answers to common questions about DBooster's database optimization platform, features, and pricing."
    >
      <div className="space-y-16">
        {/* Search and Filter */}
        <section>
          <div className="space-y-6">
            {/* Search */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 text-lg"
              />
            </div>
            
            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-2">
              {faqCategories.map((category, index) => (
                <Button
                  key={index}
                  variant={selectedCategory === category.name ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.name)}
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

        {/* FAQ List */}
        <section>
          <div className="space-y-4 max-w-4xl mx-auto">
            {filteredFAQs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader 
                    className="cursor-pointer"
                    onClick={() => toggleFAQ(index)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Badge variant="outline" className="mb-2">
                          {faq.category}
                        </Badge>
                        <CardTitle className="text-lg text-left">
                          {faq.question}
                        </CardTitle>
                      </div>
                      <div className="ml-4">
                        {expandedFAQ === index ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  {expandedFAQ === index && (
                    <CardContent className="pt-0">
                      <p className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredFAQs.length === 0 && (
            <div className="text-center py-12">
              <HelpCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No FAQs Found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or browse different categories.
              </p>
            </div>
          )}
        </section>

        {/* Still Need Help */}
        <section className="bg-muted/30 p-12 rounded-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
            <p className="text-xl text-muted-foreground">
              Can't find what you're looking for? We're here to help.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-primary" />
                <CardTitle>Contact Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Get help from our support team
                </p>
                <Button asChild className="w-full">
                  <Link to="/support">Contact Support</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-primary" />
                <CardTitle>Documentation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Browse our comprehensive docs
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/documentation">View Docs</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <Mail className="h-12 w-12 mx-auto mb-4 text-primary" />
                <CardTitle>Email Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Send us a message directly
                </p>
                <Button asChild variant="outline" className="w-full">
                  <a href="mailto:support@dbooster.ai">
                    support@dbooster.ai
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </StandardPageLayout>
  );
}
