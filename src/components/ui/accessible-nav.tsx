
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  description?: string;
  children?: NavItem[];
}

interface AccessibleNavProps {
  items: NavItem[];
  logo: React.ReactNode;
  actions: React.ReactNode;
}

export function AccessibleNav({ items, logo, actions }: AccessibleNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActiveRoute = (href: string) => {
    return location.pathname === href || (href !== '/' && location.pathname.startsWith(href));
  };

  return (
    <nav className="bg-background border-b sticky top-0 z-50" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {logo}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {items.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  isActiveRoute(item.href)
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground"
                )}
                aria-current={isActiveRoute(item.href) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center">
            {actions}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              className="text-muted-foreground hover:text-primary"
            >
              <span className="sr-only">Toggle navigation menu</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div id="mobile-menu" className="md:hidden border-t bg-background">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {items.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block px-3 py-2 text-base font-medium rounded-md transition-colors",
                  isActiveRoute(item.href)
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-primary hover:bg-muted"
                )}
                aria-current={isActiveRoute(item.href) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-muted">
            <div className="px-2">
              {actions}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
