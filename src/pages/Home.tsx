
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { EnhancedHeroSection } from '@/components/home/EnhancedHeroSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { EnhancedCTASection } from '@/components/home/EnhancedCTASection';
import { StandardizedLoading } from '@/components/ui/standardized-loading';
import { enhancedToast } from '@/components/ui/enhanced-toast';
import { Database, Zap, Shield, TrendingUp, Users, Code } from 'lucide-react';

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

  const handleViewAllFeatures = () => {
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

  // Fixed: Convert Lucide components to JSX elements
  const features = [
    {
      icon: <Database className="h-6 w-6" />,
      title: "Smart Query Analysis",
      description: "AI-powered analysis of your SQL queries to identify performance bottlenecks and optimization opportunities.",
      highlight: false,
      details: "Our advanced AI engine analyzes query execution plans, identifies missing indexes, and suggests optimizations that can improve performance by up to 10x."
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Real-time Optimization",
      description: "Get instant suggestions to improve query performance with detailed execution plans and recommendations.",
      highlight: true,
      details: "Real-time monitoring and analysis provides immediate feedback on query performance, helping you optimize as you develop."
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Enterprise Security",
      description: "SOC2 compliant with enterprise-grade security features and team collaboration tools.",
      highlight: false,
      details: "Bank-level security with encryption at rest and in transit, role-based access control, and comprehensive audit logging."
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Performance Insights",
      description: "Track query performance trends and database health metrics with comprehensive analytics.",
      highlight: true,
      details: "Detailed dashboards and reports help you understand performance trends and make data-driven optimization decisions."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Team Collaboration",
      description: "Share optimizations, review queries, and collaborate with your team on database improvements.",
      highlight: false,
      details: "Built-in collaboration tools including code reviews, shared workspaces, and team performance analytics."
    },
    {
      icon: <Code className="h-6 w-6" />,
      title: "GitHub Integration",
      description: "Seamlessly connect your repositories and automatically scan for SQL queries that need optimization.",
      highlight: false,
      details: "Automatic repository scanning, pull request integration, and CI/CD pipeline compatibility for seamless workflow integration."
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
      
      <FeaturesSection 
        features={features}
        onViewAllFeatures={handleViewAllFeatures}
      />
      
      <EnhancedCTASection
        user={user}
        isLoading={isLoading}
        onGetStarted={handleGetStarted}
        onNavigateToLearn={handleNavigateToLearn}
      />
    </div>
  );
}
