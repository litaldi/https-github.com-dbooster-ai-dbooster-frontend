
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/lib/utils';
import { 
  Database, 
  Menu, 
  X, 
  ChevronDown,
  Home,
  BarChart3,
  Users,
  HelpCircle,
  Settings,
  LogOut,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navigationItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Features', href: '/features', icon: Database },
  { name: 'Pricing', href: '/pricing', icon: BarChart3 },
  { name: 'About', href: '/about', icon: Users },
  { name: 'Contact', href: '/contact', icon: HelpCircle },
];

export function ProfessionalNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isDemo } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const isActiveRoute = (href: string) => location.pathname === href;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled 
          ? 'bg-background/95 backdrop-blur-xl border-b shadow-sm' 
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to={user ? "/app" : "/"} 
            className="flex items-center space-x-3 group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
          >
            <div className="p-2 bg-gradient-to-r from-primary to-blue-600 rounded-lg shadow-lg group-hover:shadow-xl transition-shadow">
              <Database className="h-6 w-6 text-white" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                DBooster
              </span>
              <p className="text-xs text-muted-foreground hidden sm:block">AI Database Optimizer</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const isActive = isActiveRoute(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    'hover:bg-accent hover:text-accent-foreground hover:scale-105',
                    'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                    isActive 
                      ? 'bg-primary/10 text-primary shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Menu & CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 hover:bg-accent"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-blue-600 flex items-center justify-center text-xs font-medium text-white">
                    {user.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium">
                    {user.user_metadata?.full_name || user.email?.split('@')[0]}
                  </span>
                  {isDemo && <Badge variant="secondary" className="text-xs">Demo</Badge>}
                  <ChevronDown className="h-4 w-4" />
                </Button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-background border rounded-lg shadow-lg py-2 z-50"
                    >
                      <Link
                        to="/app"
                        className="flex items-center px-4 py-2 text-sm hover:bg-accent"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Dashboard
                      </Link>
                      <Link
                        to="/app/settings"
                        className="flex items-center px-4 py-2 text-sm hover:bg-accent"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                      <hr className="my-2" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button variant="ghost" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button asChild className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90">
                  <Link to="/login">Get Started Free</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <AnimatePresence mode="wait">
              {!isMobileMenuOpen ? (
                <Menu className="h-5 w-5" />
              ) : (
                <X className="h-5 w-5" />
              )}
            </AnimatePresence>
          </Button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t bg-background/95 backdrop-blur-xl"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigationItems.map((item) => {
                  const isActive = isActiveRoute(item.href);
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors',
                        isActive 
                          ? 'bg-primary/10 text-primary' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      )}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      {item.name}
                    </Link>
                  );
                })}
                
                <div className="pt-4 border-t space-y-2">
                  {user ? (
                    <>
                      <div className="px-3 py-2 text-sm text-muted-foreground">
                        Signed in as {user.email}
                        {isDemo && <Badge variant="secondary" className="ml-2 text-xs">Demo</Badge>}
                      </div>
                      <Link
                        to="/app"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md"
                      >
                        <User className="h-5 w-5 mr-3" />
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md"
                      >
                        <LogOut className="h-5 w-5 mr-3" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Button variant="ghost" className="w-full justify-start" asChild>
                        <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                          Sign In
                        </Link>
                      </Button>
                      <Button className="w-full bg-gradient-to-r from-primary to-blue-600" asChild>
                        <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                          Get Started Free
                        </Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
