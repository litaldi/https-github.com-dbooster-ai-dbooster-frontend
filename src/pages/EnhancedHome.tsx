
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { EnhancedHeroSection } from '@/components/ui/enhanced-hero-section';
import { EnhancedFeaturesGrid } from '@/components/ui/enhanced-features-grid';
import { EnhancedCTASection } from '@/components/ui/enhanced-cta-section';
import { 
  Brain, 
  Zap, 
  Shield, 
  TrendingUp, 
  Database, 
  BarChart3, 
  Rocket,
  Star,
  Users,
  Clock,
} from 'lucide-react';

export default function EnhancedHome() {
  const { user, loginDemo } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

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
    navigate('/features');
  };

  // Hero section props
  const heroProps = {
    preheadline: "Enterprise Database Optimization",
    headline: "Reduce Database Costs by 60%",
    subheadline: "with AI-Powered Optimization",
    description: "Transform your database performance with enterprise-grade AI optimization. Reduce query times by 73%, cut infrastructure costs by 60%, and automate 80% of performance tuning tasks.",
    primaryCTA: {
      text: user ? 'Access Dashboard' : 'Start Free Enterprise Trial',
      onClick: handleGetStarted,
      loading: isLoading,
      variant: 'gradient' as const
    },
    secondaryCTA: {
      text: 'Watch 2-Min Demo',
      onClick: handleWatchDemo,
      variant: 'outline' as const
    },
    badges: [
      {
        text: "50,000+ Developers Trust DBooster",
        icon: <Star className="h-3 w-3" />,
        variant: 'default' as const
      },
      {
        text: "SOC2 Certified",
        icon: <Shield className="h-3 w-3" />,
        variant: 'success' as const
      }
    ],
    metrics: [
      {
        value: "73%",
        label: "Faster Queries",
        icon: <Zap className="h-5 w-5 text-blue-600" />,
        color: "bg-blue-50 border-blue-200"
      },
      {
        value: "60%",
        label: "Cost Reduction",
        icon: <TrendingUp className="h-5 w-5 text-green-600" />,
        color: "bg-green-50 border-green-200"
      },
      {
        value: "5min",
        label: "Setup Time",
        icon: <Clock className="h-5 w-5 text-purple-600" />,
        color: "bg-purple-50 border-purple-200"
      }
    ]
  };

  // Features for the features grid
  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI Query Optimizer",
      description: "Advanced machine learning algorithms analyze your SQL queries and provide instant optimization recommendations with 73% average improvement.",
      benefits: [
        "Automatic query analysis and optimization",
        "Real-time performance suggestions",
        "Support for complex queries and joins",
        "Integration with popular databases"
      ],
      badge: {
        text: "Most Popular",
        variant: 'default' as const
      },
      cta: {
        text: "Try AI Optimizer",
        onClick: () => navigate('/ai-studio')
      },
      gradient: "bg-gradient-to-br from-blue-500/10 to-blue-600/5"
    },
    {
      icon: <Database className="h-8 w-8" />,
      title: "Database Monitoring",
      description: "Real-time monitoring and alerts for your database performance with comprehensive analytics dashboard.",
      benefits: [
        "24/7 performance monitoring",
        "Custom alerting and notifications",
        "Historical performance trends",
        "Proactive issue detection"
      ],
      cta: {
        text: "View Monitoring",
        onClick: () => navigate('/app')
      },
      gradient: "bg-gradient-to-br from-green-500/10 to-green-600/5"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Security & Compliance",
      description: "Enterprise-grade security with SOC2 compliance, end-to-end encryption, and comprehensive audit logging.",
      benefits: [
        "SOC2 Type II compliance",
        "End-to-end encryption",
        "Comprehensive audit trails",
        "Role-based access control"
      ],
      cta: {
        text: "Security Details",
        onClick: () => navigate('/features')
      },
      gradient: "bg-gradient-to-br from-purple-500/10 to-purple-600/5"
    }
  ];

  return (
    <div className="min-h-screen">
      <EnhancedHeroSection {...heroProps} />
      
      <EnhancedFeaturesGrid
        title="Everything You Need for Database Excellence"
        subtitle="Comprehensive tools and features designed for enterprise database optimization."
        features={features}
        columns={3}
      />
      
      <EnhancedCTASection
        title="Ready to Transform Your Database Performance?"
        description="Join thousands of developers and enterprises who have improved their database performance by up to 10x with DBooster's AI-powered optimization."
        primaryCTA={{
          text: user ? 'Go to Your Dashboard' : 'Start Free Analysis',
          onClick: handleGetStarted,
          loading: isLoading
        }}
        secondaryCTA={{
          text: 'Explore Features',
          onClick: () => navigate('/features')
        }}
        trustSignals={[
          'No credit card required',
          '2-minute setup',
          'Cancel anytime',
          'SOC2 compliant'
        ]}
        badge={{
          text: 'Limited Time: Enterprise Trial Free',
          icon: <Star className="w-4 h-4" />
        }}
        backgroundVariant="gradient"
      />
    </div>
  );
}
