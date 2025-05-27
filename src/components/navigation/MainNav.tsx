
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/lib/utils';
import { 
  Menu, 
  Home, 
  BarChart3, 
  Bookmark, 
  FolderOpen, 
  TrendingUp, 
  User, 
  Settings, 
  LogIn, 
  LogOut 
} from 'lucide-react';

const navItems = [
  { href: '/home', label: 'Home', icon: Home, public: true },
  { href: '/', label: 'Dashboard', icon: BarChart3, public: false },
  { href: '/queries', label: 'Saved Queries', icon: Bookmark, public: false },
  { href: '/repositories', label: 'Repositories', icon: FolderOpen, public: false },
  { href: '/reports', label: 'Analytics', icon: TrendingUp, public: false },
  { href: '/account', label: 'Profile', icon: User, public: false },
  { href: '/settings', label: 'Settings', icon: Settings, public: false },
];

export function MainNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };

  const filteredNavItems = navItems.filter(item => item.public || user);

  const NavLinks = ({ mobile = false }) => (
    <>
      {filteredNavItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
            location.pathname === item.href 
              ? "text-primary" 
              : "text-muted-foreground",
            mobile && "text-base py-2"
          )}
          onClick={() => mobile && setIsOpen(false)}
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </Link>
      ))}
      
      {user ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-2 justify-start text-sm font-medium",
            mobile && "text-base py-2 h-auto"
          )}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      ) : (
        <Link
          to="/login"
          className={cn(
            "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary text-muted-foreground",
            location.pathname === '/login' && "text-primary",
            mobile && "text-base py-2"
          )}
          onClick={() => mobile && setIsOpen(false)}
        >
          <LogIn className="h-4 w-4" />
          Login
        </Link>
      )}
    </>
  );

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/home" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">DBooster</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLinks />
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex flex-col space-y-4 mt-8">
                  <NavLinks mobile />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
