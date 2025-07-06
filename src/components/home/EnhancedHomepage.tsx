
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useSimplifiedAuth';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Zap, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HeroSection } from './HeroSection';
import { EnhancedMetricsShowcase } from './EnhancedMetricsShowcase';
import { SocialProofSection } from './SocialProofSection';
import { InteractiveDemoSection } from './InteractiveDemoSection';
import { seoOptimizer } from '@/utils/seoOptimizer';

export function EnhancedHomepage() {
  const { user, loginDemo } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
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
      <HeroSection 
        onGetStarted={handleGetStarted}
        onWatchDemo={handleWatchDemo}
        isLoading={isLoading}
        user={user}
      />

      <EnhancedMetricsShowcase />

      <div id="interactive-demo">
        <InteractiveDemoSection />
      </div>

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
