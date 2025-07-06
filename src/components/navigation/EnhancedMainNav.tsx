
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Search, 
  Zap, 
  ChevronDown, 
  User, 
  Settings,
  LogOut,
  Sun,
  Moon,
  Bell,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';
import { useTheme } from '@/components/theme-provider';

const navigationItems = [
  {
    label: 'Product',
    items: [
      { href: '/features', label: 'Features', description: 'AI-powered optimization tools' },
      { href: '/how-it-works', label: 'How It Works', description: 'Understanding our methodology' },
      { href: '/ai-studio', label: 'AI Studio', description: 'Interactive optimization workspace', badge: 'New' },
      { href: '/demo', label: 'Demo Mode', description: 'Try with sample data' }
    ]
  },
  {
    label: 'Solutions',
    items: [
      { href: '/for-developers', label: 'For Developers', description: 'Tools for individual developers' },
      { href: '/for-teams', label: 'Teams', description: 'Collaboration features' },
      { href: '/for-enterprises', label: 'Enterprises', description: 'Scalable solutions' },
      { href: '/use-cases', label: 'Use Cases', description: 'Real-world scenarios' }
    ]
  },
  { href: '/pricing', label: 'Pricing' },
  { href: '/learn', label: 'Resources' }
];

const authenticatedNavItems = [
  { href: '/app', label: 'Dashboard', icon: 'BarChart3' },
  { href: '/queries', label: 'Queries', icon: 'Search' },
  { href: '/repositories', label: 'Repositories', icon: 'Database' },
  { href: '/ai-studio', label: 'AI Studio', icon: 'Brain', badge: 'AI' }
];

export function EnhancedMainNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActiveRoute = (href: string) => location.pathname === href;

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled 
          ? 'bg-background/95 backdrop-blur-xl border-b shadow-lg' 
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={user ? '/app' : '/'} className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ duration: 0.3 }}
              className="relative p-2 bg-gradient-to-r from-primary to-blue-600 rounded-xl shadow-lg"
            >
              <Zap className="h-5 w-5 text-white" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                DBooster
              </span>
              <span className="text-xs text-muted-foreground -mt-1">AI Database Optimizer</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {user ? (
              // Authenticated Navigation
              <div className="flex items-center space-x-1">
                {authenticatedNavItems.map((item) => (
                  <Button
                    key={item.href}
                    variant={isActiveRoute(item.href) ? "default" : "ghost"}
                    className={cn(
                      "relative h-10 px-4 font-medium transition-all duration-200",
                      isActiveRoute(item.href) 
                        ? "bg-primary text-primary-foreground shadow-md" 
                        : "hover:bg-accent/80 hover:scale-105"
                    )}
                    asChild
                  >
                    <Link to={item.href} className="flex items-center gap-2">
                      <span>{item.label}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </Button>
                ))}
              </div>
            ) : (
              // Public Navigation
              <div className="flex items-center space-x-1">
                {navigationItems.map((item) => (
                  <div key={item.label} className="relative">
                    {item.items ? (
                      <div
                        onMouseEnter={() => setActiveDropdown(item.label)}
                        onMouseLeave={() => setActiveDropdown(null)}
                      >
                        <Button
                          variant="ghost"
                          className="h-10 px-4 font-medium hover:bg-accent/80 transition-all duration-200"
                        >
                          {item.label}
                          <ChevronDown className="ml-1 h-3 w-3" />
                        </Button>
                        
                        <AnimatePresence>
                          {activeDropdown === item.label && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              transition={{ duration: 0.15 }}
                              className="absolute top-full left-0 mt-2 w-80 bg-background/95 backdrop-blur-xl border rounded-xl shadow-xl z-50 p-6"
                            >
                              <div className="space-y-1">
                                {item.items.map((subItem) => (
                                  <Link
                                    key={subItem.href}
                                    to={subItem.href}
                                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors group"
                                  >
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-sm">{subItem.label}</span>
                                        {subItem.badge && (
                                          <Badge variant="secondary" className="text-xs">
                                            {subItem.badge}
                                          </Badge>
                                        )}
                                      </div>
                                      <p className="text-xs text-muted-foreground">
                                        {subItem.description}
                                      </p>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Button
                        variant={isActiveRoute(item.href!) ? "default" : "ghost"}
                        className="h-10 px-4 font-medium hover:bg-accent/80 transition-all duration-200"
                        asChild
                      >
                        <Link to={item.href!}>{item.label}</Link>
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Search Button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 hover:bg-accent/80"
              onClick={() => setShowSearch(!showSearch)}
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 hover:bg-accent/80"
              onClick={toggleTheme}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  className="h-10 px-3 hover:bg-accent/80"
                  onClick={() => setActiveDropdown(activeDropdown === 'user' ? null : 'user')}
                >
                  <div className="h-7 w-7 rounded-full bg-gradient-to-r from-primary to-blue-600 flex items-center justify-center text-xs font-medium text-white mr-2">
                    {user.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-medium max-w-32 truncate">
                    {user.email}
                  </span>
                  <ChevronDown className="ml-1 h-3 w-3" />
                </Button>

                <AnimatePresence>
                  {activeDropdown === 'user' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full right-0 mt-2 w-64 bg-background/95 backdrop-blur-xl border rounded-xl shadow-xl z-50 p-2"
                    >
                      <div className="p-3 border-b">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-blue-600 flex items-center justify-center text-sm font-medium text-white">
                            {user.email?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {user.user_metadata?.full_name || user.email}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="py-1">
                        <Link
                          to="/app/account"
                          className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          <User className="h-4 w-4" />
                          Profile Settings
                        </Link>
                        <Link
                          to="/app/settings"
                          className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-accent/50 transition-colors"
                        >
                          <Settings className="h-4 w-4" />
                          App Settings
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-lg" asChild>
                  <Link to="/login">Get Started Free</Link>
                </Button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-10 w-10"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 180 }}
                  exit={{ rotate: 0 }}
                >
                  <X className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 180 }}
                  animate={{ rotate: 0 }}
                  exit={{ rotate: 180 }}
                >
                  <Menu className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t py-4"
            >
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search features, documentation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 h-10"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden border-t bg-background/95 backdrop-blur-xl"
            >
              <div className="px-4 py-6 space-y-6">
                {/* Search in Mobile */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search..."
                    className="pl-10 h-12"
                  />
                </div>

                {/* Navigation Items */}
                <div className="space-y-4">
                  {user ? (
                    // Authenticated Mobile Nav
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-muted-foreground px-3">
                        Dashboard
                      </h3>
                      {authenticatedNavItems.map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={cn(
                            "flex items-center gap-3 px-3 py-3 rounded-lg font-medium transition-colors",
                            isActiveRoute(item.href)
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-accent"
                          )}
                        >
                          <span>{item.label}</span>
                          {item.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    // Public Mobile Nav
                    <div className="space-y-2">
                      {navigationItems.map((item) => (
                        <div key={item.label}>
                          {item.items ? (
                            <div className="space-y-2">
                              <h3 className="text-sm font-semibold text-muted-foreground px-3">
                                {item.label}
                              </h3>
                              {item.items.map((subItem) => (
                                <Link
                                  key={subItem.href}
                                  to={subItem.href}
                                  onClick={() => setIsMobileMenuOpen(false)}
                                  className="flex flex-col gap-1 px-3 py-3 rounded-lg hover:bg-accent transition-colors"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{subItem.label}</span>
                                    {subItem.badge && (
                                      <Badge variant="secondary" className="text-xs">
                                        {subItem.badge}
                                      </Badge>
                                    )}
                                  </div>
                                  <span className="text-sm text-muted-foreground">
                                    {subItem.description}
                                  </span>
                                </Link>
                              ))}
                            </div>
                          ) : (
                            <Link
                              to={item.href!}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={cn(
                                "block px-3 py-3 rounded-lg font-medium transition-colors",
                                isActiveRoute(item.href!)
                                  ? "bg-primary text-primary-foreground"
                                  : "hover:bg-accent"
                              )}
                            >
                              {item.label}
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* User Section */}
                  <div className="border-t pt-4 space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start h-12"
                      onClick={toggleTheme}
                    >
                      <Sun className="h-4 w-4 mr-3 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                      <Moon className="absolute h-4 w-4 ml-3 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                      <span className="ml-6">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
                    </Button>

                    {user ? (
                      <>
                        <div className="px-3 py-3 bg-muted/30 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-blue-600 flex items-center justify-center text-sm font-medium text-white">
                              {user.email?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {user.user_metadata?.full_name || user.email}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <Link
                          to="/app/account"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-accent transition-colors"
                        >
                          <User className="h-4 w-4" />
                          Profile Settings
                        </Link>
                        
                        <Link
                          to="/app/settings"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-accent transition-colors"
                        >
                          <Settings className="h-4 w-4" />
                          App Settings
                        </Link>
                        
                        <Button
                          variant="ghost"
                          className="w-full justify-start h-12 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={handleLogout}
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Sign Out
                        </Button>
                      </>
                    ) : (
                      <div className="space-y-2">
                        <Button 
                          variant="ghost" 
                          className="w-full h-12" 
                          asChild
                        >
                          <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                            Sign In
                          </Link>
                        </Button>
                        <Button 
                          className="w-full h-12 bg-gradient-to-r from-primary to-blue-600" 
                          asChild
                        >
                          <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                            Get Started Free
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
