
import { EnhancedFeaturesGrid } from '@/components/ui/enhanced-features-grid';
import { Brain, Database, Shield } from 'lucide-react';

export default function Features() {
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
      cta: {
        text: "Try AI Optimizer",
        onClick: () => console.log('Navigate to AI optimizer')
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
        onClick: () => console.log('Navigate to monitoring')
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
        onClick: () => console.log('Navigate to security')
      },
      gradient: "bg-gradient-to-br from-purple-500/10 to-purple-600/5"
    }
  ];

  return (
    <div className="min-h-screen">
      <div className="py-20 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Powerful Features for Database Optimization
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover how DBooster's AI-powered features can transform your database performance and reduce costs.
        </p>
      </div>
      
      <EnhancedFeaturesGrid
        title="Everything You Need for Database Excellence"
        subtitle="Comprehensive tools and features designed for enterprise database optimization."
        features={features}
        columns={3}
      />
    </div>
  );
}
