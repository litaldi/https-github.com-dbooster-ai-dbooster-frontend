
import { 
  Home, 
  BarChart3, 
  Search, 
  FolderOpen, 
  TrendingUp, 
  User, 
  Settings, 
  Zap, 
  DollarSign, 
  Briefcase, 
  Mail, 
  HelpCircle, 
  Shield, 
  FileCheck, 
  Info, 
  CheckSquare, 
  Users, 
  Brain,
  BookOpen,
  Newspaper,
  Database,
  FileText,
  Activity,
  Globe,
  GraduationCap,
  Building,
  Target,
  Layers,
  Phone,
  UserPlus,
  Handshake,
  Award,
  Clock,
  MessageCircle
} from 'lucide-react';

export interface NavigationItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  description?: string;
  children?: NavigationItem[];
}

// Enhanced navigation structure with mega menu support
export const megaMenuNavigation: NavigationItem[] = [
  {
    href: '/product',
    label: 'Product',
    icon: Zap,
    description: 'AI-powered database optimization solutions',
    children: [
      { 
        href: '/features', 
        label: 'Features', 
        icon: Zap, 
        description: 'Comprehensive AI optimization tools and capabilities' 
      },
      { 
        href: '/how-it-works', 
        label: 'How It Works', 
        icon: Activity, 
        description: 'Understanding our optimization methodology' 
      },
      { 
        href: '/ai-studio', 
        label: 'AI Studio', 
        icon: Brain, 
        badge: 'New',
        description: 'Interactive AI-powered query optimization workspace' 
      },
      { 
        href: '/pricing', 
        label: 'Pricing', 
        icon: DollarSign, 
        description: 'Flexible plans for teams and enterprises' 
      }
    ]
  },
  {
    href: '/solutions',
    label: 'Solutions',
    icon: Target,
    description: 'Tailored solutions for your specific needs',
    children: [
      { 
        href: '/enterprise', 
        label: 'Enterprise', 
        icon: Building, 
        description: 'Scalable solutions for large organizations' 
      },
      { 
        href: '/database-types', 
        label: 'Database Types', 
        icon: Database, 
        description: 'Support for PostgreSQL, MySQL, MongoDB and more' 
      },
      { 
        href: '/use-cases', 
        label: 'Use Cases', 
        icon: Layers, 
        description: 'Real-world optimization scenarios and success stories' 
      }
    ]
  },
  {
    href: '/resources',
    label: 'Resources',
    icon: BookOpen,
    description: 'Learn, explore, and get support',
    children: [
      { 
        href: '/learn', 
        label: 'Documentation', 
        icon: BookOpen, 
        description: 'Comprehensive guides and API documentation' 
      },
      { 
        href: '/blog', 
        label: 'Blog', 
        icon: Newspaper, 
        description: 'Industry insights and product updates' 
      },
      { 
        href: '/learn', 
        label: 'Learning Hub', 
        icon: GraduationCap, 
        description: 'Tutorials, courses, and best practices' 
      },
      { 
        href: '/support', 
        label: 'Support', 
        icon: HelpCircle, 
        description: '24/7 expert support and community forums' 
      }
    ]
  },
  {
    href: '/company',
    label: 'Company',
    icon: Users,
    description: 'About DBooster and our mission',
    children: [
      { 
        href: '/about', 
        label: 'About Us', 
        icon: Info, 
        description: 'Our story, mission, and the team behind DBooster' 
      },
      { 
        href: '/contact', 
        label: 'Contact', 
        icon: Mail, 
        description: 'Get in touch with our team' 
      },
      { 
        href: '/careers', 
        label: 'Careers', 
        icon: UserPlus, 
        description: 'Join our team and shape the future of databases' 
      },
      { 
        href: '/partners', 
        label: 'Partners', 
        icon: Handshake, 
        description: 'Technology partnerships and integrations' 
      }
    ]
  }
];

// Dashboard sidebar navigation with contextual grouping
export const dashboardSidebarNavigation = [
  {
    group: 'Overview',
    items: [
      { 
        href: '/app', 
        label: 'Dashboard', 
        icon: BarChart3, 
        description: 'Performance overview and key metrics',
        shortcut: 'D'
      }
    ]
  },
  {
    group: 'Optimization',
    items: [
      { 
        href: '/queries', 
        label: 'Query Manager', 
        icon: Search, 
        description: 'Optimize and manage SQL queries',
        shortcut: 'Q'
      },
      { 
        href: '/ai-studio', 
        label: 'AI Studio', 
        icon: Brain, 
        badge: 'AI', 
        description: 'AI-powered optimization workspace',
        shortcut: 'A'
      }
    ]
  },
  {
    group: 'Data & Analytics',
    items: [
      { 
        href: '/repositories', 
        label: 'Repositories', 
        icon: Database, 
        description: 'Database connections and configurations',
        shortcut: 'R'
      },
      { 
        href: '/reports', 
        label: 'Performance Reports', 
        icon: FileText, 
        description: 'Detailed analytics and insights',
        shortcut: 'P'
      }
    ]
  },
  {
    group: 'Collaboration',
    items: [
      { 
        href: '/approvals', 
        label: 'Query Approvals', 
        icon: CheckSquare, 
        description: 'Review and approve query changes',
        shortcut: 'V'
      },
      { 
        href: '/teams', 
        label: 'Team Management', 
        icon: Users, 
        description: 'Manage team members and permissions',
        shortcut: 'T'
      }
    ]
  },
  {
    group: 'Tools',
    items: [
      { 
        href: '/sandbox', 
        label: 'Testing Sandbox', 
        icon: Settings, 
        description: 'Safe environment for testing queries',
        shortcut: 'S'
      }
    ]
  }
];

// Footer navigation structure
export const footerNavigation = {
  product: [
    { href: '/features', label: 'Features' },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/ai-studio', label: 'AI Studio' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/integrations', label: 'Integrations' }
  ],
  resources: [
    { href: '/learn', label: 'Documentation' },
    { href: '/blog', label: 'Blog' },
    { href: '/support', label: 'Support Center' },
    { href: '/status', label: 'System Status' },
    { href: '/changelog', label: 'Changelog' }
  ],
  company: [
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
    { href: '/careers', label: 'Careers' },
    { href: '/partners', label: 'Partners' },
    { href: '/press', label: 'Press Kit' }
  ],
  legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/security', label: 'Security' },
    { href: '/accessibility', label: 'Accessibility' },
    { href: '/cookies', label: 'Cookie Policy' }
  ]
};

// Quick actions for dashboard
export const quickActions = [
  {
    href: '/ai-studio',
    label: 'Optimize Query',
    icon: Brain,
    description: 'Get AI recommendations for your SQL queries',
    shortcut: 'Cmd+O'
  },
  {
    href: '/repositories/new',
    label: 'Add Database',
    icon: Database,
    description: 'Connect a new database for optimization',
    shortcut: 'Cmd+N'
  },
  {
    href: '/reports/new',
    label: 'Generate Report',
    icon: FileText,
    description: 'Create a performance analysis report',
    shortcut: 'Cmd+R'
  }
];

export const socialProofIndicators = {
  customerCount: '50,000+',
  queryOptimizations: '2.5M+',
  averageImprovement: '73%',
  costSavings: '60%',
  certifications: ['SOC2 Type II', 'ISO 27001', 'GDPR Compliant']
};

// Legacy exports for backward compatibility
export const publicNavItems: NavigationItem[] = [
  { href: '/', label: 'Home', icon: Home, description: 'DBooster homepage' },
  { href: '/features', label: 'Features', icon: Zap, description: 'AI-powered database optimization features' },
  { href: '/how-it-works', label: 'How It Works', icon: Activity, description: 'Learn how DBooster optimizes your database queries' },
  { href: '/pricing', label: 'Pricing', icon: DollarSign, description: 'Choose the right plan for your team' },
  { href: '/learn', label: 'Learn', icon: GraduationCap, description: 'Tutorials and guides for database optimization' },
  { href: '/blog', label: 'Blog', icon: Newspaper, description: 'Industry insights and DBooster updates' },
];

export const authenticatedNavItems: NavigationItem[] = [
  { href: '/app', label: 'Dashboard', icon: BarChart3, description: 'Your performance overview and metrics' },
  { href: '/queries', label: 'Query Manager', icon: Search, description: 'Optimize and manage your SQL queries' },
  { href: '/repositories', label: 'Repositories', icon: Database, description: 'Manage your database connections' },
  { href: '/ai-studio', label: 'AI Studio', icon: Brain, badge: 'AI', description: 'AI-powered optimization tools' },
  { href: '/reports', label: 'Performance Reports', icon: FileText, description: 'Detailed analytics and insights' },
  { href: '/approvals', label: 'Query Approvals', icon: CheckSquare, description: 'Review and approve query changes' },
  { href: '/teams', label: 'Team Management', icon: Users, description: 'Manage team members and permissions' },
  { href: '/sandbox', label: 'Testing Sandbox', icon: Settings, description: 'Safe environment for testing queries' },
];

export const userMenuItems: NavigationItem[] = [
  { href: '/app/account', label: 'Profile Settings', icon: User, description: 'Manage your account preferences' },
  { href: '/app/settings', label: 'App Settings', icon: Settings, description: 'Configure DBooster settings' },
];

export const companyMenuItems: NavigationItem[] = [
  { href: '/about', label: 'About DBooster', icon: Briefcase, description: 'Learn about our mission and team' },
  { href: '/contact', label: 'Contact Support', icon: Mail, description: 'Get help from our support team' },
  { href: '/support', label: 'Help Center', icon: HelpCircle, description: 'Documentation and support resources' },
];

export const legalMenuItems: NavigationItem[] = [
  { href: '/privacy', label: 'Privacy Policy', icon: Shield, description: 'How we protect your data' },
  { href: '/terms', label: 'Terms of Service', icon: FileCheck, description: 'Legal terms and conditions' },
  { href: '/accessibility', label: 'Accessibility', icon: Globe, description: 'Our commitment to accessibility' },
];
