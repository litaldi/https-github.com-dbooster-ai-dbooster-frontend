
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { EnhancedHero } from '@/components/ui/enhanced-hero';
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
  Building,
  Clock,
  CheckCircle2,
  Users
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

  const heroProps = {
    subtitle: "Enterprise Database Optimization",
    title: "Reduce Query Times by 73% with AI-Powered Optimization",
    description: "Transform your database performance with enterprise-grade AI optimization. Join thousands of companies automating 80% of performance tuning tasks while cutting database costs by 40-60%.",
    primaryCTA: {
      text: user ? 'Access Dashboard' : 'Start Free Enterprise Trial',
      onClick: handleGetStarted,
      loading: isLoading
    },
    secondaryCTA: {
      text: 'Watch Demo',
      onClick: () => navigate('/features')
    },
    badges: [
      {
        icon: <Star className="h-3 w-3" />,
        text: "Enterprise AI-Powered Database Optimization",
        variant: 'secondary' as const
      }
    ],
    metrics: [
      {
        value: "73%",
        label: "Faster Queries",
        icon: <Zap className="h-5 w-5 text-white" />,
        color: "bg-blue-500"
      },
      {
        value: "60%",
        label: "Cost Reduction",
        icon: <TrendingUp className="h-5 w-5 text-white" />,
        color: "bg-green-500"
      },
      {
        value: "5min",
        label: "Setup Time",
        icon: <Clock className="h-5 w-5 text-white" />,
        color: "bg-purple-500"
      }
    ]
  };

  const features = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI Query Optimizer",
      description: "Advanced machine learning algorithms analyze your SQL queries and provide instant optimization recommendations.",
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
      badge: {
        text: "Enterprise",
        variant: 'outline' as const
      },
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
      badge: {
        text: "SOC2 Certified",
        variant: 'secondary' as const
      },
      cta: {
        text: "Security Details",
        onClick: () => navigate('/security')
      },
      gradient: "bg-gradient-to-br from-purple-500/10 to-purple-600/5"
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Performance Analytics",
      description: "Deep insights into your database performance with predictive analytics and optimization recommendations.",
      benefits: [
        "Advanced performance metrics",
        "Predictive analytics",
        "Cost optimization insights",
        "Custom reporting dashboards"
      ],
      cta: {
        text: "View Analytics",
        onClick: () => navigate('/reports')
      },
      gradient: "bg-gradient-to-br from-orange-500/10 to-orange-600/5"
    },
    {
      icon: <Rocket className="h-8 w-8" />,
      title: "Quick Setup",
      description: "Get started in minutes with our streamlined onboarding process and intelligent database connection wizard.",
      benefits: [
        "5-minute setup process",
        "Automatic configuration detection",
        "Step-by-step guided wizard",
        "Zero downtime integration"
      ],
      cta: {
        text: "Start Setup",
        onClick: handleGetStarted
      },
      gradient: "bg-gradient-to-br from-red-500/10 to-red-600/5"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Team Collaboration",
      description: "Collaborate with your team on database optimization with shared workspaces and role-based permissions.",
      benefits: [
        "Shared team workspaces",
        "Role-based permissions",
        "Collaboration tools",
        "Team performance insights"
      ],
      cta: {
        text: "Team Features",
        onClick: () => navigate('/features')
      },
      gradient: "bg-gradient-to-br from-teal-500/10 to-teal-600/5"
    }
  ];

  return (
    <div className="min-h-screen">
      <EnhancedHero {...heroProps} />
      
      <EnhancedFeaturesGrid
        title="Everything You Need for Database Excellence"
        subtitle="Comprehensive tools and features designed for enterprise database optimization and team collaboration."
        features={features}
        columns={3}
      />
      
      <EnhancedCTASection
        title="Ready to Transform Your Database Performance?"
        description="Join thousands of developers and enterprises who have improved their database performance by up to 10x with DBooster's AI-powered optimization recommendations."
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
          'SOC2 compliant',
          '24/7 support'
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
