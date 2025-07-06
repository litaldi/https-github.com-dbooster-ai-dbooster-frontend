
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function FAQPage() {
  const faqs = [
    {
      question: "How does DBooster's AI optimization work?",
      answer: "DBooster uses advanced machine learning algorithms to analyze your database queries, schema, and performance metrics. It identifies bottlenecks, suggests index optimizations, and recommends query rewrites based on proven optimization patterns."
    },
    {
      question: "Is my data secure with DBooster?",
      answer: "Absolutely. We use bank-grade encryption, are SOC2 Type II compliant, and only require read-only access to your database. Your data never leaves your infrastructure - we only analyze query patterns and metadata."
    },
    {
      question: "Which databases does DBooster support?",
      answer: "DBooster supports PostgreSQL, MySQL, MongoDB, SQL Server, Oracle, and many other popular databases. We're continuously adding support for new database systems."
    },
    {
      question: "How long does it take to see results?",
      answer: "Most users see initial optimization recommendations within minutes of connecting their database. Significant performance improvements are typically observed within the first week of implementing our suggestions."
    },
    {
      question: "Can I try DBooster for free?",
      answer: "Yes! We offer a 14-day free trial with full access to all features. No credit card required to start."
    },
    {
      question: "Do you offer on-premise deployment?",
      answer: "Yes, we offer on-premise deployment for Enterprise customers who need to keep their data within their own infrastructure."
    }
  ];

  return (
    <StandardPageLayout
      title="Frequently Asked Questions"
      subtitle="Everything you need to know about DBooster"
      description="Find answers to common questions about our AI-powered database optimization platform."
    >
      <div className="max-w-4xl mx-auto">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left text-lg font-semibold">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </StandardPageLayout>
  );
}
