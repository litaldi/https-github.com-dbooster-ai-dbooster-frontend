
import React from 'react';
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Code, 
  Users, 
  Building, 
  Target, 
  ArrowRight,
  CheckCircle2,
  Zap,
  BarChart3,
  Shield,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';

const solutionCategories = [
  {
    title: "For Developers",
    description: "Individual developers looking to optimize their database queries and improve application performance.",
    icon: <Code className="h-8 w-8 text-blue-600" />,
    href: "/for-developers",
    features: [
      "Personal query optimization workspace",
      "AI-powered query suggestions",
      "Performance monitoring tools",
      "Integration with popular IDEs"
    ],
    badge: "Most Popular"
  },
  {
    title: "For Teams",
    description: "Development teams collaborating on database optimization and performance improvements.",
    icon: <Users className="h-8 w-8 text-green-600" />,
    href: "/for-teams",
    features: [
      "Team collaboration features",
      "Shared query libraries",
      "Performance dashboards",
      "Code review integration"
    ]
  },
  {
    title: "For Enterprises",
    description: "Large organizations requiring enterprise-grade security, compliance, and scale.",
    icon: <Building className="h-8 w-8 text-purple-600" />,
    href: "/for-enterprises", 
    features: [
      "Enterprise security & compliance",
      "Custom AI model training",
      "Dedicated support",
      "Multi-region deployment"
    ],
    badge: "Enterprise"
  },
  {
    title: "Use Cases",
    description: "Real-world scenarios and success stories across different industries and applications.",
    icon: <Target className="h-8 w-8 text-orange-600" />,
    href: "/use-cases",
    features: [
      "Industry-specific examples",
      "Performance benchmarks", 
      "Implementation guides",
      "ROI case studies"
    ]
  }
];

const benefits = [
  {
    icon: <Zap className="h-6 w-6 text-yellow-500" />,
    title: "75% Performance Improvement",
    description: "Average query performance boost across all customer implementations"
  },
  {
    icon: <BarChart3 className="h-6 w-6 text-blue-500" />,
    title: "Real-time Analytics", 
    description: "Monitor and optimize database performance with live insights"
  },
  {
    icon: <Shield className="h-6 w-6 text-green-500" />,
    title: "Enterprise Security",
    description: "SOC2 Type II compliant with advanced security controls"
  },
  {
    icon: <Clock className="h-6 w-6 text-purple-500" />,
    title: "Instant Results",
    description: "See optimization recommendations within minutes of connection"
  }
];

export default function SolutionsPage() {
  return (
    <StandardPageLayout
      title="Solutions for Every Scale"
      subtitle="Optimize Your Database Performance"
      description="From individual developers to enterprise teams, DBooster provides tailored solutions for database optimization at any scale."
    >
      <div className="space-y-20">
        {/* Key Benefits */}
        <section className="text-center">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-muted to-muted/50 rounded-xl flex items-center justify-center">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Solution Categories */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Choose Your Solution</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Whether you're working solo or managing enterprise infrastructure, we have the right solution for your needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {solutionCategories.map((solution, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 group">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-muted to-muted/50 rounded-xl group-hover:scale-105 transition-transform">
                          {solution.icon}
                        </div>
                        <div>
                          <CardTitle className="text-xl">{solution.title}</CardTitle>
                          {solution.badge && (
                            <Badge variant="secondary" className="mt-2">
                              {solution.badge}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {solution.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {solution.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button asChild className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Link to={solution.href}>
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
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
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of developers and organizations optimizing their database performance with DBooster.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="px-8">
                <Link to="/demo">
                  Try Demo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8">
                <Link to="/pricing">View Pricing</Link>
              </Button>
            </div>
          </motion.div>
        </section>
      </div>
    </StandardPageLayout>
  );
}
