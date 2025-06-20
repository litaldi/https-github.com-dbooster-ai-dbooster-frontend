
import { useAuth } from '@/contexts/auth-context';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { useHomePage } from '@/hooks/useHomePage';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { 
    isLoading, 
    features, 
    guidanceSteps, 
    handleGetStarted 
  } = useHomePage();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (user) {
      navigate('/app');
    }
  }, [user, navigate]);

  // Don't render if user is authenticated (will redirect)
  if (user) {
    return null;
  }

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
