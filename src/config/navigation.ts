
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
  Globe
} from 'lucide-react';

export interface NavigationItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  description?: string;
}

export const publicNavItems: NavigationItem[] = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/features', label: 'Features', icon: Zap },
  { href: '/how-it-works', label: 'How It Works', icon: Activity },
  { href: '/pricing', label: 'Pricing', icon: DollarSign },
  { href: '/learn', label: 'Learn', icon: BookOpen },
  { href: '/blog', label: 'Blog', icon: Newspaper },
];

export const authenticatedNavItems: NavigationItem[] = [
  { href: '/app', label: 'Dashboard', icon: BarChart3 },
  { href: '/queries', label: 'Queries', icon: Search },
  { href: '/repositories', label: 'Repositories', icon: Database },
  { href: '/ai-studio', label: 'AI Studio', icon: Brain, badge: 'AI' },
  { href: '/reports', label: 'Reports', icon: FileText },
  { href: '/approvals', label: 'Approvals', icon: CheckSquare },
  { href: '/teams', label: 'Teams', icon: Users },
  { href: '/sandbox', label: 'Sandbox', icon: Settings },
];

export const userMenuItems: NavigationItem[] = [
  { href: '/app/account', label: 'Profile', icon: User },
  { href: '/app/settings', label: 'Settings', icon: Settings },
];

export const companyMenuItems: NavigationItem[] = [
  { href: '/about', label: 'About', icon: Briefcase },
  { href: '/contact', label: 'Contact', icon: Mail },
  { href: '/support', label: 'Support', icon: HelpCircle },
];

export const legalMenuItems: NavigationItem[] = [
  { href: '/privacy', label: 'Privacy', icon: Shield },
  { href: '/terms', label: 'Terms', icon: FileCheck },
  { href: '/accessibility', label: 'Accessibility', icon: Globe },
];
