
import { useAuth } from '@/contexts/auth-context';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  Database, 
  Zap, 
  TrendingUp, 
  Shield, 
  Users, 
  Clock,
  CheckCircle,
  Star,
  BarChart3
} from 'lucide-react';
import { FadeIn, ScaleIn, StaggerContainer, StaggerItem, HoverScale } from '@/components/ui/enhanced-animations';
import { Section, Container, Heading, Text } from '@/components/ui/visual-hierarchy';
import { EnhancedHeroSection } from '@/components/home/EnhancedHeroSection';
import { EnhancedCTASection } from '@/components/home/EnhancedCTASection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { EnhancedPerformanceCounters } from '@/components/home/EnhancedPerformanceCounters';
import { TestimonialsSection } from '@/components/marketing/TestimonialsSection';
import { NewsletterSignup } from '@/components/marketing/NewsletterSignup';
import { ResourcesSection } from '@/components/marketing/ResourcesSection';

export default function Home() {
  const { user, loginDemo } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (user) {
      navigate('/app');
    }
  }, [user, navigate]);

  const handleGetStarted = async () => {
    if (user) {
      navigate('/app');
      return;
    }

    setIsLoading(true);
    try {
      await loginDemo();
      navigate('/app');
    } catch (error) {
      // Error handled in auth context
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render if user is authenticated (will redirect)
  if (user) {
    return null;
  }

  const features = [
    {
      icon: Database,
      title: "Smart Query Analysis",
      description: "AI-powered analysis identifies performance bottlenecks and optimization opportunities automatically.",
      highlight: "AI-Powered",
      details: "Advanced machine learning algorithms analyze your queries in real-time"
    },
    {
      icon: Zap,
      title: "Instant Optimization",
      description: "Get immediate suggestions to improve query performance with one-click implementation.",
      highlight: "One-Click Fix",
      details: "Automated optimization suggestions with instant implementation"
    },
    {
      icon: TrendingUp,
      title: "Performance Monitoring",
      description: "Real-time monitoring and alerts keep your database running at peak efficiency.",
      highlight: "Real-Time",
      details: "Continuous monitoring with intelligent alerting system"
    }
  ];

  const guidanceSteps = [
    {
      target: '[data-tour="get-started"]',
      title: "Welcome to DBooster!",
      content: "Start your journey by exploring our demo environment with real database scenarios."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <EnhancedHeroSection 
        user={user}
        isLoading={isLoading}
        onGetStarted={handleGetStarted}
        onNavigateToLogin={() => navigate('/login')}
        guidanceSteps={guidanceSteps}
      />
      <EnhancedPerformanceCounters />
      <FeaturesSection 
        features={features}
        onViewAllFeatures={() => navigate('/features')}
      />
      <TestimonialsSection />
      <ResourcesSection />
      <div className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <NewsletterSignup />
          </div>
        </div>
      </div>
      <EnhancedCTASection 
        user={user}
        isLoading={isLoading}
        onGetStarted={handleGetStarted}
        onNavigateToLearn={() => navigate('/learn')}
      />
    </div>
  );
}
