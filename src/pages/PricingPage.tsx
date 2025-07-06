
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/enhanced-card-system';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

export default function PricingPage() {
  const plans = [
    {
      name: 'Starter',
      price: '$29',
      period: '/month',
      description: 'Perfect for individual developers',
      features: [
        'Up to 3 database connections',
        'Basic query optimization',
        'Email support',
        'Performance dashboard'
      ],
      cta: 'Start Free Trial'
    },
    {
      name: 'Professional',
      price: '$99',
      period: '/month',
      description: 'Ideal for growing teams',
      badge: 'Most Popular',
      features: [
        'Up to 10 database connections',
        'Advanced AI optimization',
        'Real-time monitoring',
        'Team collaboration',
        'Priority support',
        'Custom integrations'
      ],
      cta: 'Start Free Trial',
      highlighted: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For large organizations',
      features: [
        'Unlimited database connections',
        'White-label solution',
        'Dedicated support',
        'SLA guarantee',
        'Custom training',
        'On-premise deployment'
      ],
      cta: 'Contact Sales'
    }
  ];

  return (
    <StandardPageLayout
      title="Pricing"
      subtitle="Choose the perfect plan for your needs"
      description="Start with a free 14-day trial. No credit card required. Cancel anytime."
      centered
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <Card 
            key={index} 
            variant={plan.highlighted ? "elevated" : "default"}
            className={plan.highlighted ? "ring-2 ring-primary relative" : ""}
          >
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">
                  {plan.badge}
                </Badge>
              </div>
            )}
            
            <CardHeader className="text-center">
              <CardTitle size="lg">{plan.name}</CardTitle>
              <div className="mt-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
              </div>
              <p className="text-muted-foreground mt-2">{plan.description}</p>
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            
            <CardFooter>
              <Button 
                className="w-full" 
                variant={plan.highlighted ? "default" : "outline"}
                size="lg"
              >
                {plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </StandardPageLayout>
  );
}
