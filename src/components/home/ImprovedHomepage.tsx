
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useSimplifiedAuth';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Zap, Star, TrendingUp, Clock, Users, Award, Play, Building, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { seoOptimizer } from '@/utils/seoOptimizer';

export function ImprovedHomepage() {
  const { user, loginDemo } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    seoOptimizer.updatePageSEO({
      title: 'DBooster - Reduce Database Costs by 60% with AI-Powered Optimization',
      description: 'Transform your database performance with enterprise-grade AI optimization. Reduce query times by 73%, cut costs by 60%, and automate 80% of performance tuning tasks. Start free.',
      keywords: 'database optimization, AI database tuning, SQL query optimization, database performance, cost reduction, enterprise database tools',
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
      label: "Query Performance Boost",
      description: "Average improvement in query response times across all database types",
      color: "bg-green-500"
    },
    {
      icon: <Zap className="h-6 w-6 text-white" />,
      value: "60%",
      label: "Cost Reduction",
      description: "Infrastructure savings through intelligent query optimization",
      color: "bg-blue-500"
    },
    {
      icon: <Clock className="h-6 w-6 text-white" />,
      value: "5min",
      label: "Setup Time",
      description: "From connection to first optimization recommendations",
      color: "bg-purple-500"
    },
    {
      icon: <Users className="h-6 w-6 text-white" />,
      value: "50K+",
      label: "Developers",
      description: "Trust DBooster for their database optimization needs",
      color: "bg-orange-500"
    }
  ];

  const features = [
    {
      icon: <Zap className="h-8 w-8 text-blue-600" />,
      title: "AI-Powered Query Optimization",
      description: "Automatically identify and fix slow queries with machine learning algorithms trained on millions of database patterns."
    },
    {
      icon: <Shield className="h-8 w-8 text-green-600" />,
      title: "Enterprise Security",
      description: "SOC2 Type II compliant with bank-grade encryption, role-based access control, and comprehensive audit logging."
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-purple-600" />,
      title: "Real-time Performance Monitoring",
      description: "Monitor database performance in real-time with intelligent alerts and predictive analytics."
    },
    {
      icon: <Building className="h-8 w-8 text-orange-600" />,
      title: "Multi-Database Support",
      description: "Works with PostgreSQL, MySQL, MongoDB, and more. Scale across your entire database infrastructure."
    }
  ];

  const testimonials = [
    {
      quote: "DBooster reduced our query response times by 73% in the first month. The AI recommendations were spot-on and saved us thousands in infrastructure costs.",
      author: "Sarah Chen",
      role: "Senior Database Engineer",
      company: "TechCorp"
    },
    {
      quote: "The automated optimization suggestions have transformed how we manage our database performance. It's like having a team of database experts 24/7.",
      author: "Michael Rodriguez",
      role: "CTO",
      company: "StartupXYZ"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/30 py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-r from-primary/10 to-purple-500/10 blur-3xl rounded-full" />
        
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-wrap justify-center gap-3 mb-8"
            >
              <Badge variant="secondary" className="px-4 py-2 bg-primary/10 text-primary border-primary/20">
                <Star className="h-3 w-3 mr-2" />
                50,000+ Developers Trust DBooster
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 bg-green-50 text-green-700 border-green-200">
                <Shield className="h-3 w-3 mr-2" />
                SOC2 Certified
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            >
              <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent">
                Reduce Database Costs by{' '}
              </span>
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                60% with AI
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              Transform your database performance with enterprise-grade AI optimization. 
              <strong className="text-foreground"> Reduce query times by 73%</strong>, 
              <strong className="text-foreground"> cut infrastructure costs by 60%</strong>, and 
              <strong className="text-foreground"> automate 80% of performance tuning tasks</strong>.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 max-w-2xl mx-auto"
            >
              <div className="flex items-center justify-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Zap className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">73% Faster Queries</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-900">60% Cost Reduction</span>
              </div>
              <div className="flex items-center justify-center gap-2 p-3 bg-purple-50 rounded-lg border border-purple-200">
                <Building className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">Enterprise Ready</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
            >
              <Button
                size="lg"
                onClick={handleGetStarted}
                disabled={isLoading}
                className="min-w-[220px] h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="mr-2"
                    >
                      <Zap className="h-5 w-5" />
                    </motion.div>
                    Starting optimization...
                  </>
                ) : (
                  <>
                    {user ? 'Access Your Dashboard' : 'Start Free Optimization'}
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={handleDemoLogin}
                disabled={isLoading}
                className="min-w-[220px] h-14 text-lg font-semibold border-2 hover:bg-accent/10"
              >
                <Play className="mr-2 h-5 w-5" />
                Try Demo Mode
              </Button>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="text-sm text-muted-foreground"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>No credit card required • 5-minute setup • Cancel anytime</span>
              </div>
              <div>Join 50,000+ developers already optimizing with DBooster</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Metrics Showcase */}
      <section className="py-16 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 px-4 py-2 bg-primary/10 text-primary">
              <Award className="h-3 w-3 mr-2" />
              Industry-Leading Performance
            </Badge>
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Trusted by Industry Leaders
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real results from real customers who've transformed their database performance with DBooster
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-2 hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6 text-center">
                    <div className={`inline-flex p-3 rounded-full mb-4 ${metric.color}`}>
                      {metric.icon}
                    </div>
                    <div className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                      {metric.value}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{metric.label}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{metric.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Powerful Features for Modern Databases</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to optimize, monitor, and scale your database infrastructure
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex gap-4 p-6 bg-background rounded-lg border hover:shadow-md transition-shadow"
              >
                <div className="flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-lg text-muted-foreground">Trusted by developers and enterprises worldwide</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-muted/30 p-6 rounded-lg"
              >
                <p className="text-muted-foreground mb-4 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role} at {testimonial.company}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
