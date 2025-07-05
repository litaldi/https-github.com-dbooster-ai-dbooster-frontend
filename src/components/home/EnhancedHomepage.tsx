
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useSimplifiedAuth';
import { HeroSection } from './HeroSection';
import { EnhancedMetricsShowcase } from './EnhancedMetricsShowcase';
import { SocialProofSection } from './SocialProofSection';
import { InteractiveDemoSection } from './InteractiveDemoSection';
import { EnhancedCTASection } from './EnhancedCTASection';
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

  const handleNavigateToLearn = () => {
    navigate('/learn');
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

      <EnhancedCTASection 
        user={user}
        isLoading={isLoading}
        onGetStarted={handleGetStarted}
        onNavigateToLearn={handleNavigateToLearn}
      />
    </div>
  );
}
