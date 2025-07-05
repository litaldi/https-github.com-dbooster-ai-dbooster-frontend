
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { EnhancedHeroSection } from '@/components/home/EnhancedHeroSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { EnhancedCTASection } from '@/components/home/EnhancedCTASection';
import { StandardizedLoading } from '@/components/ui/standardized-loading';
import { enhancedToast } from '@/components/ui/enhanced-toast';

export default function Home() {
  const { user, loginDemo } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleGetStarted = async () => {
    setIsLoading(true);
    
    try {
      if (user) {
        enhancedToast.success({ 
          title: 'Welcome back to DBooster!', 
          description: 'Accessing your enterprise optimization dashboard...' 
        });
        navigate('/app');
      } else {
        await loginDemo();
        enhancedToast.success({ 
          title: 'Demo Environment Ready', 
          description: 'Explore DBooster with enterprise-grade sample data and real optimization scenarios.' 
        });
        navigate('/app');
      }
    } catch (error) {
      console.error('Navigation error:', error);
      enhancedToast.error({
        title: 'Access Issue',
        description: 'Unable to start your session. Please try again or contact support.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigateToLogin = () => {
    if (user) {
      navigate('/app/settings');
    } else {
      navigate('/login');
    }
  };

  const handleNavigateToLearn = () => {
    navigate('/features');
  };

  const guidanceSteps = [
    {
      title: "Connect Your Enterprise Database",
      description: "Securely integrate with your production or staging environment using our enterprise-grade connection wizard with SOC2 compliance",
      action: "Start secure connection"
    },
    {
      title: "AI Analysis & Optimization",
      description: "Our AI analyzes query patterns, identifies bottlenecks, and generates optimization recommendations with 73% average improvement",
      action: "Run AI analysis"
    },
    {
      title: "Deploy & Monitor Results",
      description: "Apply optimizations with confidence using our rollback-safe deployment and monitor performance improvements in real-time",
      action: "Deploy optimizations"
    }
  ];

  if (isLoading) {
    return <StandardizedLoading variant="overlay" text="Preparing your DBooster experience..." />;
  }

  return (
    <div className="min-h-screen">
      <EnhancedHeroSection 
        user={user}
        isLoading={isLoading}
        onGetStarted={handleGetStarted}
        onNavigateToLogin={handleNavigateToLogin}
        guidanceSteps={guidanceSteps}
      />
      
      <FeaturesSection />
      
      <EnhancedCTASection
        user={user}
        isLoading={isLoading}
        onGetStarted={handleGetStarted}
        onNavigateToLearn={handleNavigateToLearn}
      />
    </div>
  );
}
