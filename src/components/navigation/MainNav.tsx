
import { useAuth } from '@/contexts/auth-context';
import { DemoBadge } from '@/components/demo-badge';
import { AccessibleNav } from '@/components/ui/accessible-nav';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { NavigationLogo } from './NavigationLogo';
import { 
  Home, 
  Database, 
  BarChart3, 
  Brain, 
  Settings, 
  FileText,
  HelpCircle,
  Shield,
  Building,
  BookOpen,
  Mail,
  Phone,
  Scale,
  Eye,
  LogIn,
  UserPlus
} from 'lucide-react';

export function MainNav() {
  const { user, isDemo } = useAuth();

  const publicNavItems = [
    {
      label: 'Features',
      href: '/features',
      description: 'Explore AI-powered optimization tools',
      children: [
        { label: 'AI Query Optimizer', href: '/features/optimizer', description: 'Intelligent SQL optimization' },
        { label: 'Performance Analytics', href: '/features/analytics', description: 'Real-time performance insights' },
        { label: 'Security Monitoring', href: '/features/security', description: 'Enterprise-grade protection' },
        { label: 'Database Connections', href: '/features/connections', description: 'Secure multi-database support' },
      ]
    },
    {
      label: 'Solutions',
      href: '/solutions',
      description: 'Industry-specific optimization solutions',
      children: [
        { label: 'Enterprise', href: '/solutions/enterprise', description: 'Scale for large organizations' },
        { label: 'Startups', href: '/solutions/startups', description: 'Cost-effective optimization' },
        { label: 'E-commerce', href: '/solutions/ecommerce', description: 'High-traffic optimization' },
        { label: 'SaaS', href: '/solutions/saas', description: 'Multi-tenant performance' },
      ]
    },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Learn', href: '/learn' },
  ];

  const authenticatedNavItems = [
    { label: 'Dashboard', href: '/app' },
    { label: 'AI Studio', href: '/ai-studio' },
    { label: 'Queries', href: '/queries' },
    { label: 'Reports', href: '/reports' },
  ];

  const navItems = user ? authenticatedNavItems : publicNavItems;

  const logo = (
    <NavigationLogo user={user} />
  );

  const actions = (
    <div className="flex items-center gap-3">
      <DemoBadge />
      {isDemo && (
        <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
          <Eye className="h-3 w-3" />
          Demo Mode
        </div>
      )}
      {!user && (
        <div className="flex items-center gap-2">
          <EnhancedButton variant="ghost" size="sm" asChild>
            <a href="/login">
              <LogIn className="h-4 w-4 mr-1" />
              Sign In
            </a>
          </EnhancedButton>
          <EnhancedButton size="sm" asChild>
            <a href="/signup">
              <UserPlus className="h-4 w-4 mr-1" />
              Get Started
            </a>
          </EnhancedButton>
        </div>
      )}
    </div>
  );

  return <AccessibleNav items={navItems} logo={logo} actions={actions} />;
}
