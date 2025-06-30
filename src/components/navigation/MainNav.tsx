
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Home, BarChart3, Search, FolderOpen, TrendingUp, User, Settings, Zap, DollarSign, Briefcase, Mail, HelpCircle, Shield, FileCheck, Info, CheckSquare, Users, TestTube } from 'lucide-react';
import { DemoBadge } from '@/components/demo-badge';
import { useNavigation } from '@/hooks/useNavigation';
import { NavigationItems } from './NavigationItems';
import { UserMenu } from './UserMenu';
import { NavigationLogo } from './NavigationLogo';

const publicNavItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/features', label: 'Features', icon: Zap },
  { href: '/how-it-works', label: 'How It Works', icon: Info },
  { href: '/pricing', label: 'Pricing', icon: DollarSign },
  { href: '/learn', label: 'Learn', icon: Info },
  { href: '/blog', label: 'Blog', icon: Info },
];

const authenticatedNavItems = [
  { href: '/app', label: 'Dashboard', icon: BarChart3 },
  { href: '/app/queries', label: 'Queries', icon: Search },
  { href: '/app/repositories', label: 'Repositories', icon: FolderOpen },
  { href: '/app/query-optimization', label: 'AI Optimization', icon: TestTube },
  { href: '/app/reports', label: 'Reports', icon: TrendingUp },
  { href: '/app/approvals', label: 'Approvals', icon: CheckSquare },
  { href: '/app/teams', label: 'Teams', icon: Users },
  { href: '/app/sandbox', label: 'Sandbox', icon: TestTube },
];

const userMenuItems = [
  { href: '/app/account', label: 'Profile', icon: User },
  { href: '/app/settings', label: 'Settings', icon: Settings },
];

const companyMenuItems = [
  { href: '/about', label: 'About', icon: Briefcase },
  { href: '/contact', label: 'Contact', icon: Mail },
  { href: '/support', label: 'Support', icon: HelpCircle },
];

const legalMenuItems = [
  { href: '/privacy', label: 'Privacy', icon: Shield },
  { href: '/terms', label: 'Terms', icon: FileCheck },
  { href: '/accessibility', label: 'Accessibility', icon: Info },
];

export function MainNav() {
  const {
    isOpen,
    setIsOpen,
    user,
    theme,
    handleLogout,
    toggleTheme,
    closeMenu,
    isCurrentRoute
  } = useNavigation();

  const navItems = user ? authenticatedNavItems : publicNavItems;

  return (
    <nav 
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <NavigationLogo user={user} />

          <div className="flex-1 flex justify-center">
            <DemoBadge />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <NavigationItems 
              items={navItems} 
              isCurrentRoute={isCurrentRoute}
            />
            <div className="mx-2 h-6 w-px bg-border" />
            <UserMenu
              user={user}
              userMenuItems={userMenuItems}
              isCurrentRoute={isCurrentRoute}
              theme={theme}
              toggleTheme={toggleTheme}
              handleLogout={handleLogout}
            />
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  aria-label="Open navigation menu"
                  aria-expanded={isOpen}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-6">
                <div className="flex flex-col space-y-6">
                  <NavigationLogo user={user} />
                  
                  <div className="flex flex-col space-y-4">
                    <NavigationItems 
                      items={navItems} 
                      mobile 
                      closeMenu={closeMenu}
                      isCurrentRoute={isCurrentRoute}
                    />
                    
                    {/* Additional menu sections for mobile */}
                    <div className="border-t pt-4 space-y-1">
                      <h4 className="text-sm font-medium text-muted-foreground px-3 mb-2">Company</h4>
                      <NavigationItems 
                        items={companyMenuItems}
                        mobile
                        closeMenu={closeMenu}
                        isCurrentRoute={isCurrentRoute}
                      />
                    </div>
                    
                    <div className="border-t pt-4 space-y-1">
                      <h4 className="text-sm font-medium text-muted-foreground px-3 mb-2">Legal</h4>
                      <NavigationItems 
                        items={legalMenuItems}
                        mobile
                        closeMenu={closeMenu}
                        isCurrentRoute={isCurrentRoute}
                      />
                    </div>
                    
                    <UserMenu
                      user={user}
                      userMenuItems={userMenuItems}
                      mobile
                      closeMenu={closeMenu}
                      isCurrentRoute={isCurrentRoute}
                      theme={theme}
                      toggleTheme={toggleTheme}
                      handleLogout={handleLogout}
                    />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
