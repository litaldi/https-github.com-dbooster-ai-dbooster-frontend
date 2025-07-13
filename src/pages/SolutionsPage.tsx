
import React from 'react';
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  Code2, 
  Users, 
  Building2, 
  ArrowRight,
  CheckCircle2,
  Zap,
  Target,
  TrendingUp
} from 'lucide-react';
import { Link } from 'react-router-dom';

const solutions = [
  {
    title: "For Developers",
    description: "Optimize queries and improve database performance in your development workflow.",
    icon: <Code2 className="h-8 w-8 text-blue-600" />,
    features: [
      "IDE integrations and extensions",
      "Real-time query optimization",
      "Local development tools",
      "Performance debugging"
    ],
    link: "/for-developers",
    badge: "Popular",
    stats: "10,000+ developers"
  },
  {
    title: "For Teams",
    description: "Collaborate on database optimization with team-friendly features and workflows.",
    icon: <Users className="h-8 w-8 text-green-600" />,
    features: [
      "Team collaboration tools",
      "Shared optimization rules",
      "Performance monitoring",
      "Code review integration"
    ],
    link: "/for-teams",
    badge: "Growing Fast",
    stats: "2,500+ teams"
  },
  {
    title: "For Enterprises",
    description: "Enterprise-grade database optimization with advanced security and compliance.",
    icon: <Building2 className="h-8 w-8 text-purple-600" />,
    features: [
      "Enterprise security & compliance",
      "Dedicated support manager",
      "Custom AI model training",
      "On-premise deployment"
    ],
    link: "/for-enterprises",
    badge: "Enterprise",
    stats: "500+ organizations"
  }
];

const benefits = [
  {
    title: "75% Performance Boost",
    description: "Average query performance improvement across all customers",
    icon: <TrendingUp className="h-6 w-6 text-green-600" />
  },
  {
    title: "60% Cost Reduction",
    description: "Infrastructure cost savings through optimized resource usage",
    icon: <Target className="h-6 w-6 text-blue-600" />
  },
  {
    title: "5 Min Setup",
    description: "Quick integration with existing database infrastructure",
    icon: <Zap className="h-6 w-6 text-orange-600" />
  }
];

export default function SolutionsPage() {
  return (
    <StandardPageLayout
      title="Database Optimization Solutions"
      subtitle="Tailored for Every Team"
      description="Discover how DBooster's AI-powered database optimization platform adapts to your specific needs, whether you're a developer, team, or enterprise."
    >
      <div className="space-y-20">
        {/* Benefits Overview */}
        <section className="bg-gradient-to-r from-primary/5 to-blue-500/5 p-12 rounded-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Proven Results Across All Solutions</h2>
            <p className="text-xl text-muted-foreground">
              Consistent performance improvements regardless of your team size or industry
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                <h3 className="text-2xl font-bold mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Solutions Grid */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Choose Your Solution</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Whether you're building alone or managing enterprise infrastructure, we have the right solution for your database optimization needs.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {solutions.map((solution, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20 relative">
                  {solution.badge && (
                    <div className="absolute -top-3 left-6">
                      <Badge className="bg-primary text-primary-foreground">
                        {solution.badge}
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-muted to-muted/50 rounded-xl flex items-center justify-center">
                      {solution.icon}
                    </div>
                    <CardTitle className="text-xl mb-2">{solution.title}</CardTitle>
                    <p className="text-muted-foreground leading-relaxed">
                      {solution.description}
                    </p>
                    <div className="text-sm text-primary font-medium mt-2">
                      {solution.stats}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {solution.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button asChild className="w-full">
                      <Link to={solution.link}>
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4" />
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
            <h2 className="text-3xl font-bold mb-4">Ready to Optimize Your Database?</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of developers and organizations who trust DBooster to optimize their database performance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="px-8">
                <Link to="/demo">
                  Try Demo Now
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
