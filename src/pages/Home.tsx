
import { useState, useMemo } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { useNavigate } from 'react-router-dom';
import { Database, Zap, Shield, TrendingUp, Users, Code } from 'lucide-react';
import { showSuccess } from '@/components/ui/feedback-toast';
import { BreadcrumbNav } from '@/components/ui/breadcrumb-nav';
import { Section, Container, Heading, Text } from '@/components/ui/visual-hierarchy';
import { SkipLink } from '@/components/ui/accessibility-helpers';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { HeroSection } from '@/components/home/HeroSection';
import { QuickActions } from '@/components/home/QuickActions';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { FadeIn, HoverScale } from '@/components/ui/enhanced-animations';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const { user, loginDemo } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleGetStarted = async () => {
    setIsLoading(true);
    
    try {
      if (user) {
        showSuccess({ 
          title: 'Redirecting to Dashboard', 
          description: 'Taking you to your dashboard...' 
        });
        navigate('/dashboard');
      } else {
        await loginDemo();
        showSuccess({ 
          title: 'Demo Started!', 
          description: 'Welcome to the DBooster demo experience.' 
        });
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Navigation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const features = useMemo(() => [
    {
      icon: Database,
      title: "Smart Query Analysis",
      description: "AI-powered analysis of your SQL queries to identify performance bottlenecks and optimization opportunities.",
      highlight: false,
      details: "Our advanced AI engine analyzes query execution plans, identifies missing indexes, and suggests optimizations that can improve performance by up to 10x."
    },
    {
      icon: Zap,
      title: "Real-time Optimization",
      description: "Get instant suggestions to improve query performance with detailed execution plans and recommendations.",
      highlight: true,
      details: "Real-time monitoring and analysis provides immediate feedback on query performance, helping you optimize as you develop."
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "SOC2 compliant with enterprise-grade security features and team collaboration tools.",
      highlight: false,
      details: "Bank-level security with encryption at rest and in transit, role-based access control, and comprehensive audit logging."
    },
    {
      icon: TrendingUp,
      title: "Performance Insights",
      description: "Track query performance trends and database health metrics with comprehensive analytics.",
      highlight: true,
      details: "Detailed dashboards and reports help you understand performance trends and make data-driven optimization decisions."
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share optimizations, review queries, and collaborate with your team on database improvements.",
      highlight: false,
      details: "Built-in collaboration tools including code reviews, shared workspaces, and team performance analytics."
    },
    {
      icon: Code,
      title: "GitHub Integration",
      description: "Seamlessly connect your repositories and automatically scan for SQL queries that need optimization.",
      highlight: false,
      details: "Automatic repository scanning, pull request integration, and CI/CD pipeline compatibility for seamless workflow integration."
    }
  ], []);

  const quickActions = useMemo(() => [
    {
      icon: Code,
      title: "How It Works",
      description: "Learn how DBooster optimizes your database queries in 4 simple steps.",
      action: () => navigate('/how-it-works'),
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Database,
      title: "Learning Hub",
      description: "Master database optimization with our comprehensive guides and tutorials.",
      action: () => navigate('/learn'),
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: TrendingUp,
      title: "View Pricing",
      description: "Choose the perfect plan for your team and scale as you grow.",
      action: () => navigate('/pricing'),
      color: "from-purple-500 to-pink-500"
    }
  ], [navigate]);

  const guidanceSteps = useMemo(() => [
    {
      id: 'welcome',
      title: 'Welcome to DBooster',
      description: 'Get started by exploring our AI-powered database optimization platform.',
      action: (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Click "Try Free Demo" to experience DBooster without signing up.</p>
        </div>
      )
    },
    {
      id: 'features',
      title: 'Explore Features',
      description: 'Discover the powerful tools available to optimize your database performance.',
      action: (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Scroll down to see our comprehensive feature set and how they can help your team.</p>
        </div>
      )
    },
    {
      id: 'get-started',
      title: 'Get Started',
      description: 'Ready to optimize? Start your journey with DBooster.',
      action: (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Use the demo mode to explore or sign up for full access to all features.</p>
        </div>
      )
    }
  ], []);

  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <SkipLink href="#main-content">Skip to main content</SkipLink>
        <BreadcrumbNav />
        
        <main id="main-content" role="main">
          <HeroSection
            user={user}
            isLoading={isLoading}
            onGetStarted={handleGetStarted}
            onNavigateToLogin={() => navigate(user ? '/settings' : '/login')}
            guidanceSteps={guidanceSteps}
          />

          <QuickActions actions={quickActions} />

          <FeaturesSection 
            features={features} 
            onViewAllFeatures={() => navigate('/features')} 
          />

          {/* CTA Section */}
          <Section spacing="lg" className="bg-muted/50">
            <Container className="text-center">
              <FadeIn>
                <Heading level={2} size="xl" className="mb-4">
                  Ready to Optimize Your Database?
                </Heading>
              </FadeIn>
              
              <FadeIn delay={0.2}>
                <Text size="lg" variant="muted" className="mb-8">
                  Join thousands of developers who have improved their database performance with DBooster.
                </Text>
              </FadeIn>
              
              <FadeIn delay={0.4}>
                <HoverScale>
                  <EnhancedButton 
                    size="lg" 
                    onClick={handleGetStarted} 
                    className="text-lg px-8 min-h-[48px] transition-all duration-300 shadow-lg hover:shadow-xl"
                    loading={isLoading}
                    loadingText="Getting Started..."
                    aria-label="Get started with DBooster now"
                  >
                    Get Started Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </EnhancedButton>
                </HoverScale>
              </FadeIn>
            </Container>
          </Section>
        </main>
      </div>
    </ErrorBoundary>
  );
}
