
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useSimplifiedAuth';
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
      title: 'DBooster - AI-Powered Database Optimization | Reduce Costs by 60%',
      description: 'Israeli-built enterprise AI database optimization platform. Reduce query response times by 73%, cut infrastructure costs by 60%. Trusted by 1,200+ companies worldwide.',
      keywords: 'database optimization, AI database tuning, SQL query optimization, database performance, Israeli tech, enterprise database tools',
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
    </div>
  );
}
