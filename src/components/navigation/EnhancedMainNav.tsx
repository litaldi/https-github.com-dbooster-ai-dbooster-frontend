
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  ChevronDown,
  Home,
  Zap,
  Users,
  Building,
  HelpCircle,
  Star,
  Globe,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const navigationItems = [
  { 
    name: 'Home', 
    href: '/', 
    icon: Home 
  },
  {
    name: 'Product',
    icon: Zap,
    children: [
      { name: 'Features', href: '/features', description: 'AI-powered optimization tools' },
      { name: 'How It Works', href: '/how-it-works', description: 'Simple 4-step process' },
      { name: 'Demo', href: '/demo', description: 'Try it yourself' },
      { name: 'AI Studio', href: '/ai-studio', description: 'Advanced AI workspace' }
    ]
  },
  {
    name: 'Solutions',
    icon: Users,
    children: [
      { name: 'For Developers', href: '/for-developers', description: 'Individual developers' },
      { name: 'For Teams', href: '/for-teams', description: 'Growing teams' },
      { name: 'For Enterprises', href: '/for-enterprises', description: 'Large organizations' },
      { name: 'Use Cases', href: '/use-cases', description: 'Real-world examples' }
    ]
  },
  {
    name: 'Resources',
    icon: HelpCircle,
    children: [
      { name: 'Learn', href: '/learn', description: 'Tutorials and guides' },
      { name: 'Blog', href: '/blog', description: 'Latest insights' },
      { name: 'FAQ', href: '/faq', description: 'Common questions' },
      { name: 'Support', href: '/support', description: 'Get help' }
    ]
  },
  { 
    name: 'Pricing', 
    href: '/pricing', 
    icon: Star 
  },
  {
    name: 'Company',
    icon: Building,
    children: [
      { name: 'About', href: '/about', description: 'Our story and mission' },
      { name: 'Contact', href: '/contact', description: 'Get in touch' },
      { name: 'Careers', href: '/careers', description: 'Join our team' },
      { name: 'Press', href: '/press', description: 'Media resources' }
    ]
  }
];

export function EnhancedMainNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = () => {
      setActiveDropdown(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const isActiveRoute = (href: string) => location.pathname === href;

  const toggleDropdown = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  return (
    <nav className="hidden lg:flex items-center space-x-1" role="navigation">
      {navigationItems.map((item) => {
        const hasChildren = item.children && item.children.length > 0;
        const isActive = item.href ? isActiveRoute(item.href) : false;
        
        return (
          <div key={item.name} className="relative">
            {hasChildren ? (
              <button
                className={cn(
                  'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-accent hover:scale-105',
                  'text-muted-foreground hover:text-foreground'
                )}
                onClick={(e) => toggleDropdown(item.name, e)}
                aria-expanded={activeDropdown === item.name}
                aria-haspopup="true"
              >
                {item.icon && <item.icon className="h-4 w-4 mr-2" />}
                <span>{item.name}</span>
                <ChevronDown className={cn(
                  "ml-1 h-4 w-4 transition-transform duration-200",
                  activeDropdown === item.name && "rotate-180"
                )} />
              </button>
            ) : (
              <Link
                to={item.href!}
                className={cn(
                  'flex items-center px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:bg-accent hover:scale-105 relative',
                  isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {item.icon && <item.icon className="h-4 w-4 mr-2" />}
                <span>{item.name}</span>
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
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-2 w-72 bg-background border rounded-lg shadow-xl py-2 z-50"
                >
                  {item.children!.map((child) => (
                    <Link
                      key={child.name}
                      to={child.href}
                      className="flex items-start px-4 py-3 text-sm hover:bg-accent transition-colors group"
                      onClick={() => setActiveDropdown(null)}
                    >
                      <div className="flex-1">
                        <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                          {child.name}
                        </div>
                        {child.description && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {child.description}
                          </div>
                        )}
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-all duration-200 group-hover:translate-x-1" />
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </nav>
  );
}
