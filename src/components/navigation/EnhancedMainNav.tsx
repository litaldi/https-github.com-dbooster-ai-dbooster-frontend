
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  BarChart3, 
  Database, 
  Shield, 
  Settings, 
  User,
  Menu,
  X,
  Brain
} from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Analytics', href: '/app/analytics', icon: BarChart3 },
  { name: 'Queries', href: '/app/queries', icon: Database },
  { name: 'Security', href: '/app/security', icon: Shield },
  { name: 'Settings', href: '/app/settings', icon: Settings },
];

export function EnhancedMainNav() {
  const location = useLocation();
  const { user, isDemo, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  // Add scroll detection for enhanced nav styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <motion.nav 
      className={`fixed top-0 w-full z-40 transition-all duration-300 ${
        isScrolled 
          ? 'border-b bg-background/95 backdrop-blur-md shadow-sm supports-[backdrop-filter]:bg-background/90' 
          : 'border-b border-transparent bg-background/60 backdrop-blur-sm'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <Link to="/" className="flex items-center space-x-2 group">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              >
                <Brain className="h-8 w-8 text-primary transition-colors group-hover:text-blue-600" />
              </motion.div>
              <span className="font-bold text-xl bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                DBooster
              </span>
              <AnimatePresence>
                {isDemo && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Badge variant="secondary" className="ml-2">
                      Demo
                    </Badge>
                  </motion.div>
                )}
              </AnimatePresence>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.4, 
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                >
                  <Link
                    to={item.href}
                    className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${
                      active
                        ? 'text-primary bg-primary/10 shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    }`}
                  >
                    <Icon className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                      active ? 'text-primary' : ''
                    }`} />
                    <span className="relative">
                      {item.name}
                      {active && (
                        <motion.div
                          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"
                          layoutId="activeTab"
                          transition={{ duration: 0.3, ease: "easeOut" }}
                        />
                      )}
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  {user.email}
                </span>
                <Button variant="outline" size="sm" onClick={signOut}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/login">Get Started</Link>
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="md:hidden py-4 space-y-2 border-t border-border/50"
            >
              {navItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: index * 0.1,
                      ease: "easeOut"
                    }}
                  >
                    <Link
                      to={item.href}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive(item.href)
                          ? 'text-primary bg-primary/10 shadow-sm'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
