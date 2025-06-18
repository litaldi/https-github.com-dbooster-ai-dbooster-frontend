
import { Zap } from 'lucide-react';
import { SkipLink } from '@/components/ui/enhanced-accessibility';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { EnhancedHeroSection } from '@/components/home/EnhancedHeroSection';
import { QuickActions } from '@/components/home/QuickActions';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { EnhancedCTASection } from '@/components/home/EnhancedCTASection';
import { EnhancedOnboarding } from '@/components/onboarding/EnhancedOnboarding';
import { EnhancedBreadcrumb } from '@/components/ui/enhanced-navigation';
import { useHomePage } from '@/hooks/useHomePage';

export default function Home() {
  const {
    user,
    isLoading,
    showOnboarding,
    features,
    quickActions,
    guidanceSteps,
    handleGetStarted,
    navigate
  } = useHomePage();

  if (user && showOnboarding) {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
          <SkipLink href="#main-content" />
          <EnhancedBreadcrumb 
            items={[{ label: 'Enterprise Setup', icon: Zap }]} 
            className="p-6"
          />
          
          <main id="main-content" role="main" className="container mx-auto px-6 py-12">
            <EnhancedOnboarding />
          </main>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <SkipLink href="#main-content" />
        
        <main id="main-content" role="main">
          <EnhancedHeroSection
            user={user}
            isLoading={isLoading}
            onGetStarted={handleGetStarted}
            onNavigateToLogin={() => navigate(user ? '/app/settings' : '/login')}
            guidanceSteps={guidanceSteps}
          />

          <QuickActions actions={quickActions} />

          <FeaturesSection 
            features={features} 
            onViewAllFeatures={() => navigate('/features')} 
          />

          <EnhancedCTASection
            user={user}
            isLoading={isLoading}
            onGetStarted={handleGetStarted}
            onNavigateToLearn={() => navigate('/learn')}
          />
        </main>
      </div>
    </ErrorBoundary>
  );
}
