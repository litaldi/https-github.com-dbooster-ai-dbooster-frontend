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
  MessageCircle,
  Code,
  Play,
  Lightbulb,
  Rocket,
  Package,
  Plus
} from 'lucide-react';

export interface NavigationItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  description?: string;
  children?: NavigationItem[];
  shortcut?: string;
}

// Dashboard sidebar navigation
export const dashboardSidebarNavigation = [
  {
    group: 'Overview',
    items: [
      { href: '/app', label: 'Dashboard', icon: BarChart3, description: 'Performance overview and metrics' },
      { href: '/app/analytics', label: 'Analytics', icon: TrendingUp, description: 'Detailed performance analytics' },
    ]
  },
  {
    group: 'Optimization',
    items: [
      { href: '/app/queries', label: 'Query Manager', icon: Search, description: 'Optimize and manage SQL queries', shortcut: '⌘K' },
      { href: '/app/repositories', label: 'Repositories', icon: Database, description: 'Database connections and repos' },
      { href: '/app/ai-studio', label: 'AI Studio', icon: Brain, badge: 'AI', description: 'AI-powered optimization tools' },
    ]
  },
  {
    group: 'Reports',
    items: [
      { href: '/app/reports', label: 'Performance Reports', icon: FileText, description: 'Detailed analytics and insights' },
      { href: '/app/monitoring', label: 'Real-time Monitor', icon: Activity, description: 'Live performance monitoring' },
    ]
  },
  {
    group: 'Settings',
    items: [
      { href: '/app/settings', label: 'Settings', icon: Settings, description: 'App configuration and preferences' },
      { href: '/app/account', label: 'Profile', icon: User, description: 'Account and profile settings' },
    ]
  }
];

// Quick actions for dashboard
export const quickActions = [
  { href: '/app/queries/new', label: 'New Query', icon: Plus, shortcut: 'Cmd+N' },
  { href: '/app/repositories/connect', label: 'Connect DB', icon: Database, shortcut: 'Cmd+D' },
];

// Main navigation structure with updated mega menu
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
        href: '/demo', 
        label: 'Demo Mode', 
        icon: Play, 
        description: 'Try DBooster with sample data' 
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
        href: '/for-developers', 
        label: 'For Developers', 
        icon: Code, 
        description: 'Tools and features designed for individual developers' 
      },
      { 
        href: '/for-teams', 
        label: 'Teams', 
        icon: Users, 
        description: 'Collaboration features for development teams' 
      },
      { 
        href: '/for-enterprises', 
        label: 'Enterprises', 
        icon: Building, 
        description: 'Scalable solutions for large organizations' 
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
        href: '/faq', 
        label: 'FAQ', 
        icon: HelpCircle, 
        description: 'Frequently asked questions and answers' 
      },
      { 
        href: '/support', 
        label: 'Support Center', 
        icon: MessageCircle, 
        description: '24/7 expert support and community forums' 
      },
      { 
        href: '/status', 
        label: 'System Status', 
        icon: Activity, 
        description: 'Real-time system status and uptime monitoring' 
      },
      { 
        href: '/changelog', 
        label: 'Changelog', 
        icon: Clock, 
        description: 'Latest updates and feature releases' 
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
        href: '/partners', 
        label: 'Partners', 
        icon: Handshake, 
        description: 'Technology partnerships and integrations' 
      },
      { 
        href: '/press', 
        label: 'Press Kit', 
        icon: Package, 
        description: 'Media resources and press materials' 
      },
      { 
        href: '/careers', 
        label: 'Careers', 
        icon: Rocket, 
        description: 'Join our team and build the future of database optimization' 
      }
    ]
  }
];

// Updated footer navigation
export const footerNavigation = {
  product: [
    { href: '/features', label: 'Features' },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/ai-studio', label: 'AI Studio' },
    { href: '/demo', label: 'Demo Mode' },
    { href: '/pricing', label: 'Pricing' }
  ],
  solutions: [
    { href: '/for-developers', label: 'For Developers' },
    { href: '/for-teams', label: 'Teams' },
    { href: '/for-enterprises', label: 'Enterprises' },
    { href: '/use-cases', label: 'Use Cases' }
  ],
  resources: [
    { href: '/learn', label: 'Documentation' },
    { href: '/blog', label: 'Blog' },
    { href: '/faq', label: 'FAQ' },
    { href: '/support', label: 'Support Center' },
    { href: '/status', label: 'System Status' },
    { href: '/changelog', label: 'Changelog' }
  ],
  company: [
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
    { href: '/partners', label: 'Partners' },
    { href: '/press', label: 'Press Kit' },
    { href: '/careers', label: 'Careers' }
  ],
  support: [
    { href: '/faq', label: 'Help Center' },
    { href: '/support', label: 'Contact Support' },
    { href: '/status', label: 'System Status' }
  ],
  legal: [
    { href: '/terms', label: 'Terms of Service' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/cookies', label: 'Cookie Policy' },
    { href: '/security', label: 'Security' },
    { href: '/accessibility', label: 'Accessibility' }
  ]
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

export const socialProofIndicators = {
  customerCount: '50,000+',
  queryOptimizations: '2.5M+',
  averageImprovement: '73%',
  costSavings: '60%',
  certifications: ['SOC2 Type II', 'ISO 27001', 'GDPR Compliant']
};

// Contact information
export const contactInfo = {
  email: 'support@dbooster.ai',
  phone: '+972-54-000-0000',
  address: 'Tel Aviv, Israel',
  social: {
    linkedin: 'https://linkedin.com/company/dbooster',
    twitter: 'https://twitter.com/dbooster',
    github: 'https://github.com/dbooster'
  }
};
