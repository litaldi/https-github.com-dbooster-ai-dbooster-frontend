
import React from 'react';
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Check, X, Zap, Star, Building, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const pricingTiers = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for individual developers and small projects",
    icon: <Zap className="h-6 w-6" />,
    badge: "Most Popular",
    features: [
      { name: "Up to 3 database connections", included: true },
      { name: "Basic query optimization", included: true },
      { name: "Performance monitoring", included: true },
      { name: "Email support", included: true },
      { name: "1GB data processing/month", included: true },
      { name: "Advanced AI recommendations", included: false },
      { name: "Custom integrations", included: false },
      { name: "Priority support", included: false },
      { name: "Team collaboration", included: false }
    ],
    cta: "Get Started Free",
    ctaVariant: "default" as const
  },
  {
    name: "Professional",
    price: "$49",
    period: "/month",
    description: "For growing teams and production applications",
    icon: <Star className="h-6 w-6" />,
    badge: "Best Value",
    features: [
      { name: "Unlimited database connections", included: true },
      { name: "Advanced AI query optimization", included: true },
      { name: "Real-time performance analytics", included: true },
      { name: "Priority email & chat support", included: true },
      { name: "100GB data processing/month", included: true },
      { name: "Advanced AI recommendations", included: true },
      { name: "API access", included: true },
      { name: "Team collaboration (up to 5 users)", included: true },
      { name: "Custom integrations", included: false }
    ],
    cta: "Start Professional Trial",
    ctaVariant: "default" as const
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For large organizations with complex requirements",
    icon: <Building className="h-6 w-6" />,
    badge: "Enterprise",
    features: [
      { name: "Unlimited everything", included: true },
      { name: "Custom AI model training", included: true },
      { name: "Dedicated success manager", included: true },
      { name: "24/7 phone & email support", included: true },
      { name: "Unlimited data processing", included: true },
      { name: "Advanced AI recommendations", included: true },
      { name: "Custom integrations", included: true },
      { name: "Unlimited team members", included: true },
      { name: "On-premise deployment", included: true }
    ],
    cta: "Contact Sales",
    ctaVariant: "outline" as const
  }
];

const faqs = [
  {
    question: "How does the free plan work?",
    answer: "Our free Starter plan includes essential database optimization features for up to 3 database connections. It's perfect for individual developers and small projects to get started with AI-powered optimization."
  },
  {
    question: "Can I upgrade or downgrade my plan anytime?",
    answer: "Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at your next billing cycle."
  },
  {
    question: "What databases do you support?",
    answer: "We support all major databases including PostgreSQL, MySQL, MongoDB, Oracle, SQL Server, and many more. Our universal platform works with both cloud and on-premise installations."
  },
  {
    question: "Is there a setup fee?",
    answer: "No setup fees, no hidden costs. You only pay for the plan you choose, and you can start with our free plan to test our platform."
  },
  {
    question: "Do you offer custom enterprise solutions?",
    answer: "Yes, our Enterprise plan includes custom solutions, dedicated support, and can be tailored to your specific requirements including on-premise deployment."
  }
];

export default function PricingPage() {
  return (
    <StandardPageLayout
      title="Simple, Transparent Pricing"
      subtitle="Choose the perfect plan for your database optimization needs"
      description="Start free and scale as you grow. No hidden fees, no surprises."
    >
      <div className="space-y-20">
        {/* Pricing Cards */}
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative ${tier.badge === "Best Value" ? "lg:scale-105 lg:z-10" : ""}`}
              >
                <Card className={`h-full border-2 ${tier.badge === "Best Value" ? "border-primary shadow-xl" : "hover:border-primary/20"} transition-all duration-300`}>
                  {tier.badge && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="px-4 py-1 bg-primary text-primary-foreground">
                        {tier.badge}
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-8">
                    <div className="flex items-center justify-center mb-4">
                      <div className="p-3 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-xl">
                        {tier.icon}
                      </div>
                    </div>
                    <CardTitle className="text-2xl">{tier.name}</CardTitle>
                    <div className="text-4xl font-bold mt-4">
                      {tier.price}
                      {tier.period && <span className="text-lg text-muted-foreground">{tier.period}</span>}
                    </div>
                    <p className="text-muted-foreground mt-2">{tier.description}</p>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {tier.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-3">
                          {feature.included ? (
                            <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                          ) : (
                            <X className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                          )}
                          <span className={feature.included ? "" : "text-muted-foreground"}>
                            {feature.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      asChild 
                      variant={tier.ctaVariant} 
                      size="lg" 
                      className="w-full"
                    >
                      <Link to={tier.name === "Enterprise" ? "/contact" : "/login"}>
                        {tier.cta}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features Comparison */}
        <section className="bg-muted/30 p-12 rounded-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose DBooster?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join thousands of developers and enterprises who trust DBooster for their database optimization needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">73%</div>
              <div className="text-lg font-semibold mb-2">Average Query Speed Improvement</div>
              <p className="text-muted-foreground">Our AI algorithms consistently deliver significant performance gains</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">60%</div>
              <div className="text-lg font-semibold mb-2">Infrastructure Cost Reduction</div>
              <p className="text-muted-foreground">Optimize resource usage and reduce your cloud database costs</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">5min</div>
              <div className="text-lg font-semibold mb-2">Setup Time</div>
              <p className="text-muted-foreground">Get started quickly with our intuitive setup process</p>
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
          
          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                    <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="text-center bg-gradient-to-r from-primary/5 to-blue-500/5 p-12 rounded-2xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start optimizing your database performance today with our free plan, or contact us for a custom enterprise solution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="px-8">
              <Link to="/login">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8">
              <Link to="/contact">Contact Sales</Link>
            </Button>
          </div>
        </section>
      </div>
    </StandardPageLayout>
  );
}
