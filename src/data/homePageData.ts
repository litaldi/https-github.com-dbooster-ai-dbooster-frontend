
import { Database, Zap, Shield, TrendingUp, Users, Code } from 'lucide-react';

export const features = [
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
];

export const getQuickActions = (navigate: (path: string) => void) => [
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
];

export const guidanceSteps = [
  {
    id: 'welcome',
    title: 'Welcome to DBooster',
    description: 'Get started by exploring our AI-powered database optimization platform.',
    content: 'Click "Try Free Demo" to experience DBooster without signing up.'
  },
  {
    id: 'features',
    title: 'Explore Features',
    description: 'Discover the powerful tools available to optimize your database performance.',
    content: 'Scroll down to see our comprehensive feature set and how they can help your team.'
  },
  {
    id: 'get-started',
    title: 'Get Started',
    description: 'Ready to optimize? Start your journey with DBooster.',
    content: 'Use the demo mode to explore or sign up for full access to all features.'
  }
];
