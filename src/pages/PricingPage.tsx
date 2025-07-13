
import React from 'react';
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  X, 
  ArrowRight, 
  Zap, 
  Users, 
  Building,
  Star,
  Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: "Developer",
    price: "$29",
    period: "/month",
    description: "Perfect for individual developers and small projects",
    icon: <Zap className="h-8 w-8 text-blue-600" />,
    features: [
      "Up to 5 databases",
      "Basic query optimization",
      "Real-time monitoring",
      "Email support",
      "Standard integrations",
      "Community access"
    ],
    notIncluded: [
      "Advanced AI features",
      "Custom optimization rules",
      "Priority support",
      "Team collaboration"
    ],
    cta: "Start Free Trial",
    popular: false
  },
  {
    name: "Team",
    price: "$99",
    period: "/month",
    description: "Ideal for growing teams and collaborative development",
    icon: <Users className="h-8 w-8 text-green-600" />,
    features: [
      "Up to 25 databases",
      "Advanced AI optimization",
      "Team collaboration tools",
      "Custom dashboards",
      "Priority email support",
      "Advanced integrations",
      "Query sharing & reviews",
      "Performance benchmarking"
    ],
    notIncluded: [
      "Dedicated support manager",
      "Custom AI training",
      "SLA guarantees"
    ],
    cta: "Start Free Trial",
    popular: true,
    badge: "Most Popular"
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large organizations requiring enterprise-grade features",
    icon: <Building className="h-8 w-8 text-purple-600" />,
    features: [
      "Unlimited databases",
      "Custom AI model training",
      "Dedicated support manager",
      "99.9% SLA guarantee",
      "On-premise deployment",
      "Advanced security & compliance",
      "Custom integrations",
      "White-label options",
      "24/7 phone support"
    ],
    notIncluded: [],
    cta: "Contact Sales",
    popular: false
  }
];

const faqs = [
  {
    question: "Is there a free trial?",
    answer: "Yes! We offer a 14-day free trial for all plans with full access to features. No credit card required."
  },
  {
    question: "Can I change plans anytime?",
    answer: "Absolutely. You can upgrade or downgrade your plan at any time. Changes take effect immediately."
  },
  {
    question: "What databases do you support?",
    answer: "We support PostgreSQL, MySQL, MongoDB, SQL Server, Oracle, and most other popular database systems."
  },
  {
    question: "Is my data secure?",
    answer: "Yes. We use bank-grade encryption, are SOC2 Type II compliant, and only require read-only access to your database."
  }
];

export default function PricingPage() {
  return (
    <StandardPageLayout
      title="Simple, Transparent Pricing"
      subtitle="Choose Your Plan"
      description="Start with a free trial, then choose the plan that scales with your needs. All plans include core optimization features."
    >
      <div className="space-y-20">
        {/* Pricing Cards */}
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className={`h-full relative ${plan.popular ? 'border-2 border-primary shadow-xl scale-105' : 'border hover:border-primary/20'} transition-all duration-300`}>
                  {plan.badge && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground px-4 py-1">
                        <Star className="h-3 w-3 mr-1" />
                        {plan.badge}
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-muted to-muted/50 rounded-xl flex items-center justify-center">
                      {plan.icon}
                    </div>
                    <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                    <p className="text-muted-foreground mb-4">{plan.description}</p>
                    <div className="text-center">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                      {plan.notIncluded.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center gap-2">
                          <X className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      asChild 
                      className={`w-full ${plan.popular ? 'bg-primary text-primary-foreground' : ''}`}
                      variant={plan.popular ? 'default' : 'outline'}
                      size="lg"
                    >
                      <Link to={plan.name === 'Enterprise' ? '/contact' : '/demo'}>
                        {plan.cta}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Enterprise Features */}
        <section className="bg-muted/30 p-12 rounded-2xl">
          <div className="text-center mb-12">
            <Shield className="h-16 w-16 mx-auto mb-6 text-primary" />
            <h2 className="text-3xl font-bold mb-4">Enterprise-Grade Security</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              All plans include enterprise-level security features to protect your data and ensure compliance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="font-semibold mb-2">SOC2 Type II Certified</h3>
              <p className="text-sm text-muted-foreground">Independently audited security controls</p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold mb-2">End-to-End Encryption</h3>
              <p className="text-sm text-muted-foreground">All data encrypted in transit and at rest</p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold mb-2">Read-Only Access</h3>
              <p className="text-sm text-muted-foreground">Never requires write access to your database</p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about our pricing and plans
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary/5 to-blue-500/5 p-12 rounded-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Optimize Your Database?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Start your free 14-day trial today. No credit card required, cancel anytime.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="px-8">
                <Link to="/demo">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8">
                <Link to="/contact">Contact Sales</Link>
              </Button>
            </div>
          </motion.div>
        </section>
      </div>
    </StandardPageLayout>
  );
}
