
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
  TestTube 
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
  { href: '/how-it-works', label: 'How It Works', icon: Info },
  { href: '/pricing', label: 'Pricing', icon: DollarSign },
  { href: '/learn', label: 'Learn', icon: Info },
  { href: '/blog', label: 'Blog', icon: Info },
];

export const authenticatedNavItems: NavigationItem[] = [
  { href: '/app', label: 'Dashboard', icon: BarChart3 },
  { href: '/app/queries', label: 'Queries', icon: Search },
  { href: '/app/repositories', label: 'Repositories', icon: FolderOpen },
  { href: '/app/query-optimization', label: 'AI Optimization', icon: TestTube, badge: 'AI' },
  { href: '/app/reports', label: 'Reports', icon: TrendingUp },
  { href: '/app/approvals', label: 'Approvals', icon: CheckSquare },
  { href: '/app/teams', label: 'Teams', icon: Users },
  { href: '/app/sandbox', label: 'Sandbox', icon: TestTube },
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
  { href: '/accessibility', label: 'Accessibility', icon: Info },
];
