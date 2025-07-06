
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/enhanced-card-system';
import { ArrowRight, Database, Brain, TrendingUp } from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      number: '01',
      title: 'Connect Your Database',
      description: 'Securely connect your database with read-only access. We support MySQL, PostgreSQL, MongoDB, and more.',
      icon: <Database className="h-8 w-8" />,
    },
    {
      number: '02',
      title: 'AI Analysis',
      description: 'Our AI analyzes your queries, indexes, and database structure to identify optimization opportunities.',
      icon: <Brain className="h-8 w-8" />,
    },
    {
      number: '03',
      title: 'Get Recommendations',
      description: 'Receive detailed optimization recommendations with performance impact predictions and implementation guides.',
      icon: <TrendingUp className="h-8 w-8" />,
    }
  ];

  return (
    <StandardPageLayout
      title="How It Works"
      subtitle="Three simple steps to better performance"
      description="Learn how DBooster analyzes your database and provides actionable optimization recommendations in minutes, not hours."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="relative">
            <Card variant="elevated" className="h-full">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-gradient-to-r from-primary to-blue-600 flex items-center justify-center text-white">
                  {step.icon}
                </div>
                <div className="text-sm font-mono text-muted-foreground mb-2">{step.number}</div>
                <CardTitle size="lg">{step.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">{step.description}</p>
              </CardContent>
            </Card>
            
            {index < steps.length - 1 && (
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                <ArrowRight className="h-6 w-6 text-primary" />
              </div>
            )}
          </div>
        ))}
      </div>
    </StandardPageLayout>
  );
}
