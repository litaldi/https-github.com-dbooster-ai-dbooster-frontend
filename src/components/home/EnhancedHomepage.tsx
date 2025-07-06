
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useSimplifiedAuth';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Zap, Star, TrendingUp, Clock, Users, Award, Play, Building, CheckCircle2, Database, BarChart3, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { seoOptimizer } from '@/utils/seoOptimizer';

export function EnhancedHomepage() {
  const { user, loginDemo } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    seoOptimizer.updatePageSEO({
      title: 'DBooster - Transform Database Performance with AI | Reduce Costs by 60%',
      description: 'Revolutionary AI-powered database optimization platform. Reduce query times by 73%, cut costs by 60%, and automate performance tuning. Start free - 50,000+ developers trust DBooster.',
      keywords: 'database optimization, AI database tuning, SQL query optimization, database performance, cost reduction, enterprise database tools, automated tuning',
      canonicalUrl: window.location.origin
    });
  }, []);

  const handleGetStarted = async () => {
    setIsLoading(true);
    try {
      if (user) {
        navigate('/app');
      } else {
        await loginDemo();
        navigate('/app');
      }
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    try {
      await loginDemo();
      navigate('/app');
    } catch (error) {
      console.error('Demo login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const metrics = [
    {
      icon: <TrendingUp className="h-6 w-6 text-white" />,
      value: "73%",
      label: "Query Speed Improvement",
      description: "Average performance boost across all database types and query complexities",
      color: "bg-emerald-500"
    },
    {
      icon: <Zap className="h-6 w-6 text-white" />,
      value: "60%",
      label: "Infrastructure Cost Savings",
      description: "Reduced server costs through intelligent optimization algorithms",
      color: "bg-blue-500"
    },
    {
      icon: <Clock className="h-6 w-6 text-white" />,
      value: "2.3s",
      label: "Average Time Saved",
      description: "Per query optimization, compounding to massive time savings daily",
      color: "bg-purple-500"
    },
    {
      icon: <Users className="h-6 w-6 text-white" />,
      value: "50K+",
      label: "Happy Developers",
      description: "Developers worldwide optimizing their databases with DBooster",
      color: "bg-orange-500"
    }
  ];

  const features = [
    {
      icon: <Brain className="h-8 w-8 text-blue-600" />,
      title: "AI-Powered Query Intelligence",
      description: "Machine learning algorithms analyze millions of query patterns to provide optimization recommendations that actually work, not generic advice.",
      badge: "AI-Powered"
    },
    {
      icon: <Shield className="h-8 w-8 text-green-600" />,
      title: "Enterprise-Grade Security",
      description: "SOC2 Type II compliant with bank-grade encryption, zero-trust architecture, and comprehensive audit logging for enterprise peace of mind.",
      badge: "SOC2 Certified"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-purple-600" />,
      title: "Real-Time Performance Analytics",
      description: "Live monitoring dashboards with predictive analytics, anomaly detection, and automated alerting to prevent issues before they impact users.",
      badge: "Real-Time"
    },
    {
      icon: <Database className="h-8 w-8 text-orange-600" />,
      title: "Universal Database Support",
      description: "Native support for PostgreSQL, MySQL, MongoDB, Oracle, SQL Server, and more. One platform for your entire database infrastructure.",
      badge: "Multi-DB"
    }
  ];

  const testimonials = [
    {
      quote: "DBooster transformed our database performance overnight. We saw a 73% improvement in query response times within the first week, saving us $50K annually in infrastructure costs.",
      author: "Sarah Chen",
      role: "Senior Database Engineer",
      company: "TechFlow Inc",
      avatar: "SC"
    },
    {
      quote: "The AI recommendations are incredibly accurate. It's like having a team of senior database architects working 24/7 to optimize our queries. Absolutely game-changing for our startup.",
      author: "Michael Rodriguez",
      role: "CTO",
      company: "DataVault",
      avatar: "MR"
    },
    {
      quote: "Security was our biggest concern, but DBooster's SOC2 compliance and encryption gave us confidence. The performance improvements paid for itself in the first month.",
      author: "Jennifer Park",
      role: "VP of Engineering",
      company: "Enterprise Solutions Ltd",
      avatar: "JP"
    }
  ];

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero Section - Dramatically Enhanced */}
      <section className="relative bg-gradient-to-br from-background via-background to-primary/5 py-20 md:py-32 overflow-hidden">
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-blue-500/10" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 bg-gradient-to-r from-primary/20 to-purple-500/20 blur-3xl rounded-full animate-pulse" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" />
        
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-6xl mx-auto">
            {/* Enhanced Trust Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-wrap justify-center gap-3 mb-8"
            >
              <Badge variant="secondary" className="px-4 py-2 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors">
                <Star className="h-3 w-3 mr-2" />
                50,000+ Developers Trust DBooster
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 bg-green-50 text-green-700 border-green-200 hover:bg-green-100 transition-colors">
                <Shield className="h-3 w-3 mr-2" />
                SOC2 Type II Certified
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 transition-colors">
                <Award className="h-3 w-3 mr-2" />
                #1 Database Optimization Platform
              </Badge>
            </motion.div>

            {/* Dramatically Enhanced Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight"
            >
              <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/90 bg-clip-text text-transparent">
                Transform Your Database
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Performance with AI
              </span>
            </motion.h1>

            {/* Enhanced Value Proposition */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-xl md:text-2xl text-muted-foreground mb-6 max-w-4xl mx-auto leading-relaxed"
            >
              Revolutionary AI-powered database optimization platform that 
              <strong className="text-foreground"> reduces query response times by 73%</strong>, 
              <strong className="text-foreground"> cuts infrastructure costs by 60%</strong>, and 
              <strong className="text-foreground"> automates 95% of performance tuning tasks</strong>.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-lg text-muted-foreground mb-10 max-w-3xl mx-auto"
            >
              Stop wrestling with slow queries and expensive infrastructure. Let our enterprise-grade AI do the heavy lifting while you focus on building amazing products.
            </motion.p>

            {/* Enhanced Performance Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 max-w-3xl mx-auto"
            >
              <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-200 hover:shadow-md transition-all duration-300">
                <div className="p-2 bg-emerald-500 rounded-full">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-emerald-700">73%</div>
                  <div className="text-sm font-medium text-emerald-600">Faster Queries</div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-300">
                <div className="p-2 bg-blue-500 rounded-full">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-700">60%</div>
                  <div className="text-sm font-medium text-blue-600">Cost Reduction</div>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-200 hover:shadow-md transition-all duration-300">
                <div className="p-2 bg-purple-500 rounded-full">
                  <Building className="h-5 w-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-700">5min</div>
                  <div className="text-sm font-medium text-purple-600">Setup Time</div>
                </div>
              </div>
            </motion.div>

            {/* Enhanced CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-10"
            >
              <Button
                size="lg"
                onClick={handleGetStarted}
                disabled={isLoading}
                className="min-w-[280px] h-16 text-lg font-semibold shadow-2xl hover:shadow-3xl transition-all duration-300 group bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mr-3"
                    >
                      <Zap className="h-6 w-6" />
                    </motion.div>
                    Optimizing your experience...
                  </>
                ) : (
                  <>
                    {user ? 'Access Your Dashboard' : 'Start Free Database Analysis'}
                    <ArrowRight className="ml-3 h-6 w-6 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={handleDemoLogin}
                disabled={isLoading}
                className="min-w-[280px] h-16 text-lg font-semibold border-2 hover:bg-accent/10 hover:border-primary/50 transition-all duration-300"
              >
                <Play className="mr-3 h-6 w-6" />
                Try Interactive Demo
              </Button>
            </motion.div>
            
            {/* Enhanced Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="text-center space-y-3"
            >
              <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="font-medium">No credit card required • 5-minute setup • Cancel anytime</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Join 50,000+ developers and 1,200+ companies optimizing with DBooster
              </div>
              <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground pt-2">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  Free Forever Plan
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  Enterprise Support
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  99.9% Uptime SLA
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced Metrics Showcase */}
      <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Badge variant="secondary" className="mb-6 px-6 py-3 bg-primary/10 text-primary text-base">
                <Award className="h-4 w-4 mr-2" />
                Proven Results Across 50,000+ Implementations
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Results That Speak for Themselves
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Real performance improvements from real customers who've transformed their database infrastructure with DBooster's AI-powered optimization
              </p>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {metrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Card className="h-full border-2 hover:shadow-2xl transition-all duration-300 hover:border-primary/20 bg-gradient-to-br from-background to-muted/20">
                  <CardContent className="p-8 text-center">
                    <div className={`inline-flex p-4 rounded-full mb-6 ${metric.color} shadow-lg`}>
                      {metric.icon}
                    </div>
                    <div className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                      {metric.value}
                    </div>
                    <h3 className="font-semibold text-xl mb-3 text-foreground">{metric.label}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{metric.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Enterprise-Grade Database Optimization</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Everything you need to optimize, monitor, and scale your database infrastructure with confidence
              </p>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex gap-6 p-8 bg-gradient-to-br from-background to-muted/20 rounded-2xl border hover:shadow-xl transition-all duration-300 hover:border-primary/20"
              >
                <div className="flex-shrink-0">
                  <div className="p-3 bg-gradient-to-br from-muted to-muted/50 rounded-xl">
                    {feature.icon}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-semibold">{feature.title}</h3>
                    <Badge variant="outline" className="text-xs">
                      {feature.badge}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-lg">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials */}
      <section className="py-20 bg-gradient-to-br from-primary/5 to-blue-500/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Loved by Developers Worldwide</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Trusted by startups to Fortune 500 companies for mission-critical database optimization
              </p>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-background/80 backdrop-blur-sm p-8 rounded-2xl border shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <blockquote className="text-muted-foreground mb-6 italic leading-relaxed">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Final CTA */}
      <section className="py-20 bg-gradient-to-r from-primary/10 via-blue-500/10 to-purple-500/10">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to 10x Your Database Performance?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Join thousands of developers and enterprises who've revolutionized their database performance 
              with DBooster's AI-powered optimization. Start your transformation today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="min-w-[280px] h-16 text-lg font-semibold shadow-2xl hover:shadow-3xl bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 transition-all duration-300"
              >
                {user ? 'Access Your Dashboard' : 'Start Free Analysis Now'}
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/features')}
                className="min-w-[280px] h-16 text-lg font-semibold border-2 hover:bg-accent/10"
              >
                Explore All Features
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-primary">50K+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-primary">1.2M+</div>
                <div className="text-sm text-muted-foreground">Queries Optimized</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-primary">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime SLA</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Expert Support</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
