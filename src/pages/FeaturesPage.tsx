
import { StandardPageLayout } from '@/components/layout/StandardPageLayout';
import { FeatureCard } from '@/components/ui/enhanced-card-system';
import { Brain, Zap, Shield, BarChart3, Clock, Users } from 'lucide-react';

export default function FeaturesPage() {
  const features = [
    {
      title: 'AI-Powered Query Optimization',
      description: 'Automatically optimize your SQL queries using advanced machine learning algorithms for maximum performance.',
      icon: <Brain className="h-6 w-6" />,
      badge: 'AI'
    },
    {
      title: 'Real-time Performance Monitoring',
      description: 'Monitor database performance in real-time with comprehensive analytics and alerting.',
      icon: <BarChart3 className="h-6 w-6" />
    },
    {
      title: 'Instant Query Analysis',
      description: 'Get immediate feedback on query performance with detailed optimization recommendations.',
      icon: <Zap className="h-6 w-6" />
    },
    {
      title: 'Enterprise Security',
      description: 'Bank-grade security with SOC2 compliance, encryption at rest and in transit.',
      icon: <Shield className="h-6 w-6" />
    },
    {
      title: 'Historical Performance Tracking',
      description: 'Track query performance over time to identify trends and optimization opportunities.',
      icon: <Clock className="h-6 w-6" />
    },
    {
      title: 'Team Collaboration',
      description: 'Share optimizations and insights across your development team with built-in collaboration tools.',
      icon: <Users className="h-6 w-6" />
    }
  ];

  return (
    <StandardPageLayout
      title="Features"
      subtitle="Powerful database optimization tools"
      description="Discover how DBooster's AI-powered features can transform your database performance and streamline your development workflow."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
            badge={feature.badge}
          />
        ))}
      </div>
    </StandardPageLayout>
  );
}
