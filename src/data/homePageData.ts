
import { ArrowRight, Database, Zap, TrendingUp, Shield } from 'lucide-react';

export const features = [
  {
    id: 'ai-optimization',
    title: 'AI-Powered Query Optimization',
    description: 'Automatically identify and fix performance bottlenecks in your database queries with intelligent recommendations.',
    icon: Zap,
    color: 'from-blue-500 to-cyan-500'
  },
  {
    id: 'real-time-monitoring',
    title: 'Real-time Performance Monitoring',
    description: 'Monitor your database performance in real-time with detailed analytics and alerts.',
    icon: TrendingUp,
    color: 'from-green-500 to-emerald-500'
  },
  {
    id: 'security-analysis',
    title: 'Security & Compliance Analysis',
    description: 'Ensure your database follows security best practices and compliance requirements.',
    icon: Shield,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 'schema-optimization',
    title: 'Smart Schema Optimization',
    description: 'Get intelligent recommendations for database schema improvements and indexing strategies.',
    icon: Database,
    color: 'from-orange-500 to-red-500'
  }
];

export const getQuickActions = (navigate: (path: string) => void) => [
  {
    title: 'Connect Repository',
    description: 'Link your GitHub repository to start analyzing your database queries',
    action: () => navigate('/app/repositories'),
    icon: ArrowRight
  },
  {
    title: 'Run Query Analysis',
    description: 'Analyze existing queries for performance improvements',
    action: () => navigate('/app/queries'),
    icon: ArrowRight
  },
  {
    title: 'View Dashboard',
    description: 'See your database performance metrics and recommendations',
    action: () => navigate('/app/dashboard'),
    icon: ArrowRight
  }
];

export const guidanceSteps = [
  {
    step: 1,
    title: 'Connect Your Repository',
    description: 'Link your GitHub repository to start analyzing your database code',
    icon: Database
  },
  {
    step: 2,
    title: 'Analyze Performance',
    description: 'Our AI scans your queries and identifies optimization opportunities',
    icon: Zap
  },
  {
    step: 3,
    title: 'Implement Improvements',
    description: 'Apply recommended optimizations and see immediate performance gains',
    icon: TrendingUp
  }
];
