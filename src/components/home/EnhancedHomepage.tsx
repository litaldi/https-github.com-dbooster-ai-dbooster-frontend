
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Shield, Zap, TrendingUp, Star, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EnhancedMetricsShowcase } from './EnhancedMetricsShowcase';
import { SocialProofSection } from './SocialProofSection';
import { InteractiveDemoSection } from './InteractiveDemoSection';
import { seoOptimizer } from '@/utils/seoOptimizer';

export function EnhancedHomepage() {
  const { user, loginDemo } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    // Optimize SEO for homepage
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

  const handleWatchDemo = () => {
    const demoSection = document.getElementById('interactive-demo');
    demoSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/30 py-20 md:py-32">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-r from-primary/10 to-purple-500/10 blur-3xl rounded-full" />
        
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-5xl mx-auto">
            {/* Trust Badge */}
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

            {/* Main Headline */}
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

            {/* Value Proposition */}
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

            {/* Key Benefits */}
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

            {/* CTAs */}
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
                onClick={handleWatchDemo}
                className="min-w-[220px] h-14 text-lg font-semibold border-2 hover:bg-accent/10"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch 2-Min Demo
              </Button>
            </motion.div>
            
            {/* Trust Signals */}
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

      {/* Enhanced Metrics Showcase */}
      <EnhancedMetricsShowcase />

      {/* Interactive Demo Section */}
      <div id="interactive-demo">
        <InteractiveDemoSection />
      </div>

      {/* Social Proof Section */}
      <SocialProofSection />

      {/* Final CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary/5 to-purple-500/5">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Database Performance?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of developers and enterprises who've improved their database performance 
              by up to 10x with DBooster's AI-powered optimization recommendations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
              <Button
                size="lg"
                onClick={handleGetStarted}
                disabled={isLoading}
                className="min-w-[200px] h-12 text-base font-semibold shadow-lg hover:shadow-xl"
              >
                {user ? 'Go to Your Dashboard' : 'Start Free Analysis'}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate('/features')}
                className="min-w-[200px] h-12 text-base font-semibold border-2"
              >
                Explore All Features
              </Button>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Shield className="h-4 w-4" />
                Enterprise Security
              </span>
              <span className="flex items-center gap-1">
                <Zap className="h-4 w-4" />
                5-Min Setup
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                24/7 Support
              </span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
