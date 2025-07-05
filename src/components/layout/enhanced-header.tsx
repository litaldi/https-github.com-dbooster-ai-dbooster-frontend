
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Zap, Search, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface NavigationItem {
  name: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string;
  children?: NavigationItem[];
}

interface EnhancedHeaderProps {
  navigation: NavigationItem[];
  logo?: {
    text: string;
    icon?: React.ReactNode;
  };
  searchEnabled?: boolean;
  onSearch?: (query: string) => void;
  ctaButton?: {
    text: string;
    onClick: () => void;
    variant?: 'default' | 'outline';
  };
  className?: string;
}

export function EnhancedHeader({
  navigation,
  logo = { text: 'DBooster', icon: <Zap className="h-6 w-6" /> },
  searchEnabled = false,
  onSearch,
  ctaButton,
  className
}: EnhancedHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    const handleClickOutside = () => {
      setActiveDropdown(null);
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
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
          ? 'bg-background/95 backdrop-blur-lg border-b shadow-sm' 
          : 'bg-transparent',
        className
      )}
      role="banner"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group"
            aria-label="DBooster Homepage"
          >
            <motion.div
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
              className="p-2 bg-primary rounded-lg"
            >
              {logo.icon}
            </motion.div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              {logo.text}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1" role="navigation">
            {navigation.map((item) => {
              const isActive = isActiveRoute(item.href);
              const hasChildren = item.children && item.children.length > 0;
              
              return (
                <div key={item.name} className="relative">
                  {hasChildren ? (
                    <button
                      className={cn(
                        'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-accent hover:scale-105',
                        isActive 
                          ? 'bg-primary/10 text-primary' 
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDropdown(activeDropdown === item.name ? null : item.name);
                      }}
                      aria-expanded={activeDropdown === item.name}
                      aria-haspopup="true"
                    >
                      {item.icon}
                      <span className="ml-2">{item.name}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {item.badge}
                        </Badge>
                      )}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </button>
                  ) : (
                    <Link
                      to={item.href}
                      className={cn(
                        'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-accent hover:scale-105 relative',
                        isActive 
                          ? 'bg-primary/10 text-primary' 
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {item.icon}
                      <span className="ml-2">{item.name}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {item.badge}
                        </Badge>
                      )}
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                        />
                      )}
                    </Link>
                  )}

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {hasChildren && activeDropdown === item.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 mt-2 w-56 bg-background border rounded-lg shadow-lg py-2 z-50"
                      >
                        {item.children!.map((child) => (
                          <Link
                            key={child.name}
                            to={child.href}
                            className="flex items-center px-4 py-2 text-sm hover:bg-accent transition-colors"
                            onClick={() => setActiveDropdown(null)}
                          >
                            {child.icon}
                            <span className="ml-2">{child.name}</span>
                            {child.badge && (
                              <Badge variant="secondary" className="ml-auto text-xs">
                                {child.badge}
                              </Badge>
                            )}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </nav>

          {/* Search & CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            {searchEnabled && (
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                  aria-label="Search"
                />
              </form>
            )}
            
            {ctaButton && (
              <Button
                variant={ctaButton.variant || 'default'}
                onClick={ctaButton.onClick}
                className="font-medium"
              >
                {ctaButton.text}
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
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

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden border-t bg-background/95 backdrop-blur-lg"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {/* Search for Mobile */}
                {searchEnabled && (
                  <form onSubmit={handleSearch} className="px-3 py-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-full"
                        aria-label="Search"
                      />
                    </div>
                  </form>
                )}

                {/* Navigation Items */}
                {navigation.map((item) => {
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
                      {item.icon}
                      <span className="ml-3">{item.name}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
                
                {/* CTA for Mobile */}
                {ctaButton && (
                  <div className="pt-4 border-t mx-3">
                    <Button
                      variant={ctaButton.variant || 'default'}
                      onClick={() => {
                        ctaButton.onClick();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full font-medium"
                    >
                      {ctaButton.text}
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
