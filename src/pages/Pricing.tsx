import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Zap, Users, Building, Star, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { NewsletterSignup } from '@/components/marketing/NewsletterSignup';

const pricingPlans = [
  {
    name: 'Starter',
    price: 29,
    period: 'month',
    description: 'Perfect for small teams and individual developers',
    features: [
      'Up to 5 database connections',
      '1,000 query optimizations/month',
      'Basic performance monitoring',
      'Email support',
      'Query history (30 days)',
      'Standard security features'
    ],
    icon: Zap,
    popular: false,
    cta: 'Start Free Trial'
  },
  {
    name: 'Professional',
    price: 99,
    period: 'month',
    description: 'Ideal for growing teams with advanced needs',
    features: [
      'Up to 25 database connections',
      '10,000 query optimizations/month',
      'Advanced performance monitoring',
      'Priority email & chat support',
      'Query history (90 days)',
      'Team collaboration features',
      'API access',
      'Custom alerts',
      'Advanced security & compliance'
    ],
    icon: Users,
    popular: true,
    cta: 'Start Free Trial'
  },
  {
    name: 'Enterprise',
    price: 299,
    period: 'month',
    description: 'For large organizations with mission-critical databases',
    features: [
      'Unlimited database connections',
      'Unlimited query optimizations',
      'Real-time monitoring & alerts',
      '24/7 phone & dedicated support',
      'Unlimited query history',
      'Advanced team management',
      'Full API access',
      'Custom integrations',
      'SOC 2 compliance',
      'Dedicated success manager',
      'Custom SLA',
      'On-premise deployment options'
    ],
    icon: Building,
    popular: false,
    cta: 'Contact Sales'
  }
];

export default function Pricing() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="h-3 w-3 mr-1" />
              Simple, Transparent Pricing
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Choose the Perfect Plan for
              <span className="text-primary"> Your Team</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Start with our free trial and scale as you grow. All plans include our core 
              optimization features with no hidden fees or surprise charges.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Check className="h-4 w-4 text-green-500" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-1">
                <Check className="h-4 w-4 text-green-500" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-1">
                <Check className="h-4 w-4 text-green-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative h-full flex flex-col ${
                  plan.popular 
                    ? 'border-primary shadow-lg scale-105' 
                    : 'hover:shadow-md'
                } transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-6">
                  <div className="flex justify-center mb-4">
                    <div className={`p-3 rounded-2xl ${
                      plan.popular 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted'
                    }`}>
                      <plan.icon className="h-8 w-8" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription className="text-base">
                    {plan.description}
                  </CardDescription>
                  <div className="mt-4">
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold">${plan.price}</span>
                      <span className="text-muted-foreground">/{plan.period}</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1 flex flex-col">
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    size="lg" 
                    className="w-full"
                    variant={plan.popular ? 'default' : 'outline'}
                    asChild
                  >
                    {plan.cta === 'Contact Sales' ? (
                      <Link to="/contact">
                        {plan.cta}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    ) : (
                      <Link to="/login">
                        {plan.cta}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">
                Get answers to common questions about our pricing and plans.
              </p>
            </div>
            
            <div className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Can I change plans anytime?</h3>
                  <p className="text-muted-foreground">
                    Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, 
                    and we'll prorate any charges or credits accordingly.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">What happens after the free trial?</h3>
                  <p className="text-muted-foreground">
                    Your free trial includes full access to all Starter plan features for 14 days. 
                    After the trial, you can choose to continue with a paid plan or your account will be paused.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Do you offer annual discounts?</h3>
                  <p className="text-muted-foreground">
                    Yes! Save 20% when you pay annually. Annual plans also include priority support 
                    and additional features not available on monthly plans.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Is there a money-back guarantee?</h3>
                  <p className="text-muted-foreground">
                    We offer a 30-day money-back guarantee on all plans. If you're not completely satisfied, 
                    we'll refund your payment, no questions asked.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">Stay Informed</h2>
              <p className="text-muted-foreground">
                Get notified about new features, pricing updates, and exclusive offers.
              </p>
            </div>
            <NewsletterSignup />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Optimize Your Database Performance?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Start your free trial today and see the difference DBooster can make.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/login">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <Link to="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
