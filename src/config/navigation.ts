
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
  GraduationCap
} from 'lucide-react';

export interface NavigationItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  description?: string;
}

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
