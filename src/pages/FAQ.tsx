
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle, MessageCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function FAQ() {
  const faqs = [
    {
      question: "How does DBooster's AI optimization work?",
      answer: "DBooster uses machine learning algorithms trained on millions of database patterns to analyze your queries and identify optimization opportunities. It considers factors like query structure, indexing, table relationships, and execution plans to provide tailored recommendations."
    },
    {
      question: "Which databases does DBooster support?",
      answer: "DBooster supports PostgreSQL, MySQL, MongoDB, Microsoft SQL Server, Oracle, and most other major database systems. Our AI adapts to the specific syntax and optimization patterns of each database type."
    },
    {
      question: "How much can I expect to save on infrastructure costs?",
      answer: "On average, our customers see 60% reduction in infrastructure costs and 73% improvement in query performance. Results vary based on your current setup and the optimization opportunities available in your database."
    },
    {
      question: "Is DBooster secure? How do you protect my data?",
      answer: "Yes, DBooster is SOC2 Type II certified with bank-grade encryption. We use end-to-end encryption, never store your actual data, and only analyze query patterns and metadata. Your sensitive information never leaves your infrastructure."
    },
    {
      question: "How long does it take to see results?",
      answer: "Most users see immediate improvements after connecting their database. Full optimization benefits typically become apparent within 24-48 hours as the AI learns your usage patterns and provides more targeted recommendations."
    },
    {
      question: "Can DBooster handle large enterprise databases?",
      answer: "Absolutely. DBooster is designed to scale with enterprise-grade databases handling millions of queries per day. Our enterprise plan includes dedicated support, custom integrations, and advanced analytics features."
    },
    {
      question: "Do I need to modify my existing code?",
      answer: "In most cases, no. DBooster primarily works through database-level optimizations like improved indexing strategies and query rewriting suggestions. When code changes are recommended, they're clearly documented with step-by-step implementation guides."
    },
    {
      question: "What's included in the free plan?",
      answer: "The free plan includes basic query analysis for up to 1,000 queries per month, performance monitoring for one database, and access to our optimization recommendations. Paid plans offer unlimited queries, advanced features, and priority support."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <HelpCircle className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find answers to common questions about DBooster's AI-powered database optimization
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-4xl mx-auto mb-12">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
                <AccordionTrigger className="text-left font-semibold hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact Support */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <MessageCircle className="h-6 w-6" />
              Still have questions?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <a href="mailto:support@dbooster.ai">
                  <Mail className="mr-2 h-4 w-4" />
                  Email Support
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/support">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Support Center
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
