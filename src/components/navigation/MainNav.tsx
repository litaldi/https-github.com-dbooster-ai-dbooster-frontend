
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/auth-context';
import { useTheme } from '@/components/theme-provider';
import { cn } from '@/lib/utils';
import { 
  Menu, 
  Home, 
  BarChart3, 
  Search, 
  FolderOpen, 
  TrendingUp, 
  User, 
  Settings, 
  LogIn, 
  LogOut,
  Sun,
  Moon,
  Database,
  CheckSquare,
  Users,
  Upload,
  TestTube,
  FileText,
  HelpCircle,
  BookOpen
} from 'lucide-react';
import { DemoBadge } from '@/components/demo-badge';

const publicNavItems = [
  { href: '/home', label: 'Home', icon: Home },
];

const authenticatedNavItems = [
  { href: '/', label: 'Dashboard', icon: BarChart3 },
  { href: '/repositories', label: 'Repositories', icon: FolderOpen },
  { href: '/queries', label: 'Queries', icon: Search },
  { href: '/ai-features', label: 'AI Features', icon: TestTube },
  { href: '/reports', label: 'Reports', icon: TrendingUp },
  { href: '/approvals', label: 'Approvals', icon: CheckSquare },
  { href: '/teams', label: 'Teams', icon: Users },
  { href: '/db-import', label: 'DB Import', icon: Upload },
  { href: '/sandbox', label: 'Sandbox', icon: TestTube },
  { href: '/audit-log', label: 'Audit Log', icon: FileText },
  { href: '/support', label: 'Support', icon: HelpCircle },
  { href: '/docs-help', label: 'Docs & Help', icon: BookOpen },
];

const userMenuItems = [
  { href: '/account', label: 'Profile', icon: User },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function MainNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const navItems = user ? authenticatedNavItems : publicNavItems;

  const NavLinks = ({ mobile = false, closeMenu = () => {} }) => (
    <div className={cn(
      "flex gap-1",
      mobile ? "flex-col space-y-1" : "items-center"
    )}>
      {navItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            "flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors rounded-md",
            "hover:bg-accent hover:text-accent-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            location.pathname === item.href 
              ? "bg-accent text-accent-foreground" 
              : "text-muted-foreground hover:text-foreground",
            mobile && "justify-start w-full"
          )}
          onClick={closeMenu}
          aria-current={location.pathname === item.href ? 'page' : undefined}
        >
          <item.icon className="h-4 w-4" aria-hidden="true" />
          {item.label}
        </Link>
      ))}
    </div>
  );

  const UserMenu = ({ mobile = false, closeMenu = () => {} }) => (
    <div className={cn(
      "flex gap-1",
      mobile ? "flex-col space-y-1 border-t pt-4" : "items-center"
    )}>
      {user && userMenuItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            "flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors rounded-md",
            "hover:bg-accent hover:text-accent-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            location.pathname === item.href 
              ? "bg-accent text-accent-foreground" 
              : "text-muted-foreground hover:text-foreground",
            mobile && "justify-start w-full"
          )}
          onClick={closeMenu}
          aria-current={location.pathname === item.href ? 'page' : undefined}
        >
          <item.icon className="h-4 w-4" aria-hidden="true" />
          {item.label}
        </Link>
      ))}
      
      <Button
        variant="ghost"
        size={mobile ? "default" : "icon"}
        onClick={toggleTheme}
        className={cn(
          "flex items-center gap-2",
          mobile && "justify-start w-full"
        )}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        {mobile && <span>Toggle Theme</span>}
      </Button>
      
      {user ? (
        <Button
          variant="ghost"
          size={mobile ? "default" : "sm"}
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-2",
            mobile && "justify-start w-full"
          )}
        >
          <LogOut className="h-4 w-4" />
          {mobile && <span>Logout</span>}
        </Button>
      ) : (
        <Link
          to="/login"
          className={cn(
            "flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors rounded-md",
            "hover:bg-accent hover:text-accent-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            location.pathname === '/login' 
              ? "bg-accent text-accent-foreground" 
              : "text-muted-foreground hover:text-foreground",
            mobile && "justify-start w-full"
          )}
          onClick={closeMenu}
          aria-current={location.pathname === '/login' ? 'page' : undefined}
        >
          <LogIn className="h-4 w-4" />
          Login
        </Link>
      )}
    </div>
  );

  return (
    <nav 
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link 
            to={user ? "/" : "/home"} 
            className="flex items-center space-x-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Database className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <span className="text-xl font-bold">DBooster</span>
              <p className="text-xs text-muted-foreground hidden sm:block">Database Optimizer</p>
            </div>
          </Link>

          {/* Demo Badge */}
          <div className="flex-1 flex justify-center">
            <DemoBadge />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <NavLinks />
            <div className="mx-2 h-6 w-px bg-border" />
            <UserMenu />
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
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                      <Database className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <span className="text-lg font-bold">DBooster</span>
                      <p className="text-xs text-muted-foreground">Database Optimizer</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col space-y-4">
                    <NavLinks mobile closeMenu={() => setIsOpen(false)} />
                    <UserMenu mobile closeMenu={() => setIsOpen(false)} />
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
