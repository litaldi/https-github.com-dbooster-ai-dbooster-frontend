
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Check, 
  X, 
  Zap, 
  Crown, 
  Building, 
  Users,
  ArrowRight,
  Star
} from 'lucide-react';

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    description: 'Perfect for individual developers and small projects',
    icon: <Zap className="h-6 w-6" />,
    features: [
      'Up to 3 databases',
      'Basic query optimization',
      'Performance monitoring',
      'Email support',
      '1GB data processing/month'
    ],
    limitations: [
      'Advanced AI features',
      'Team collaboration',
      'Custom integrations'
    ],
    cta: 'Get Started Free',
    popular: false
  },
  {
    name: 'Professional',
    price: '$29',
    period: '/month',
    description: 'Ideal for growing teams and production applications',
    icon: <Crown className="h-6 w-6" />,
    features: [
      'Unlimited databases',
      'Advanced AI optimization',
      'Real-time monitoring',
      'Team collaboration (5 users)',
      'Priority support',
      '50GB data processing/month',
      'Custom alerts',
      'Performance analytics'
    ],
    limitations: [
      'Enterprise SSO',
      'Dedicated support'
    ],
    cta: 'Start 14-Day Trial',
    popular: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large organizations with complex requirements',
    icon: <Building className="h-6 w-6" />,
    features: [
      'Everything in Professional',
      'Unlimited team members',
      'Enterprise SSO',
      'Dedicated account manager',
      '24/7 phone support',
      'Unlimited data processing',
      'Custom integrations',
      'SLA guarantees',
      'On-premise deployment'
    ],
    limitations: [],
    cta: 'Contact Sales',
    popular: false
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4">
            <Star className="h-3 w-3 mr-1" />
            Pricing Plans
          </Badge>
          <h1 className="text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Choose the perfect plan for your needs. Start free and scale as you grow.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-primary to-blue-600 text-white">
                    Most Popular
                  </Badge>
                </div>
              )}
              <Card className={`h-full shadow-lg hover:shadow-xl transition-all duration-300 ${
                plan.popular ? 'ring-2 ring-primary border-primary scale-105' : ''
              }`}>
                <CardHeader className="text-center pb-8">
                  <div className="flex justify-center mb-4">
                    <div className={`p-3 rounded-lg ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-primary to-blue-600 text-white' 
                        : 'bg-primary/10 text-primary'
                    }`}>
                      {plan.icon}
                    </div>
                  </div>
                  <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground text-lg">{plan.period}</span>}
                  </div>
                  <p className="text-muted-foreground">{plan.description}</p>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                    {plan.limitations.map((limitation, idx) => (
                      <div key={idx} className="flex items-center gap-3 opacity-60">
                        <X className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{limitation}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    asChild 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-primary to-blue-600 hover:shadow-lg' 
                        : ''
                    }`}
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    <Link to={plan.name === 'Enterprise' ? '/contact' : '/login'}>
                      {plan.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center bg-gradient-to-r from-primary/10 to-blue-600/10 rounded-2xl p-12"
        >
          <Users className="h-12 w-12 mx-auto mb-6 text-primary" />
          <h2 className="text-3xl font-bold mb-4">Questions About Pricing?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Our team is here to help you choose the right plan for your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link to="/contact">
                Contact Sales
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8">
              <Link to="/faq">View FAQ</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
