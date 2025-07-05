
import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ChevronDown, Menu, X } from 'lucide-react';
import { EnhancedButton } from './enhanced-button';

interface NavItem {
  label: string;
  href: string;
  description?: string;
  children?: NavItem[];
  external?: boolean;
}

interface AccessibleNavProps {
  items: NavItem[];
  logo?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function AccessibleNav({ items, logo, actions, className }: AccessibleNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);
  const location = useLocation();
  
  const navRef = React.useRef<HTMLElement>(null);
  const mobileMenuRef = React.useRef<HTMLDivElement>(null);

  // Close mobile menu on route change
  React.useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (mobileMenuOpen) {
          setMobileMenuOpen(false);
        }
        if (openDropdown) {
          setOpenDropdown(null);
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileMenuOpen, openDropdown]);

  // Focus management for mobile menu
  React.useEffect(() => {
    if (mobileMenuOpen && mobileMenuRef.current) {
      const focusableElements = mobileMenuRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      firstElement?.focus();
    }
  }, [mobileMenuOpen]);

  const isCurrentPage = (href: string) => {
    return location.pathname === href;
  };

  const toggleDropdown = (itemLabel: string) => {
    setOpenDropdown(openDropdown === itemLabel ? null : itemLabel);
  };

  const handleKeyDown = (event: React.KeyboardEvent, callback: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      callback();
    }
  };

  return (
    <nav
      ref={navRef}
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          {logo && (
            <div className="flex-shrink-0">
              {logo}
            </div>
          )}

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-1">
            {items.map((item) => (
              <div key={item.label} className="relative">
                {item.children ? (
                  <>
                    <button
                      className={cn(
                        "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        "hover:bg-accent hover:text-accent-foreground",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      )}
                      onClick={() => toggleDropdown(item.label)}
                      onKeyDown={(e) => handleKeyDown(e, () => toggleDropdown(item.label))}
                      aria-expanded={openDropdown === item.label}
                      aria-haspopup="true"
                    >
                      {item.label}
                      <ChevronDown 
                        className={cn(
                          "h-4 w-4 transition-transform duration-200",
                          openDropdown === item.label && "rotate-180"
                        )} 
                      />
                    </button>
                    {openDropdown === item.label && (
                      <div className="absolute left-0 top-full mt-1 w-64 rounded-lg border bg-popover p-2 shadow-lg">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            to={child.href}
                            className={cn(
                              "block rounded-md px-3 py-2 text-sm transition-colors",
                              "hover:bg-accent hover:text-accent-foreground",
                              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                              isCurrentPage(child.href) && "bg-accent text-accent-foreground"
                            )}
                            onClick={() => setOpenDropdown(null)}
                          >
                            <div className="font-medium">{child.label}</div>
                            {child.description && (
                              <div className="text-xs text-muted-foreground">{child.description}</div>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.href}
                    className={cn(
                      "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      "hover:bg-accent hover:text-accent-foreground",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      isCurrentPage(item.href) && "bg-accent text-accent-foreground"
                    )}
                    aria-current={isCurrentPage(item.href) ? 'page' : undefined}
                    {...(item.external && { target: '_blank', rel: 'noopener noreferrer' })}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {actions}
            
            {/* Mobile menu button */}
            <div className="lg:hidden">
              <EnhancedButton
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Menu className="h-5 w-5" aria-hidden="true" />
                )}
              </EnhancedButton>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div
            id="mobile-menu"
            ref={mobileMenuRef}
            className="lg:hidden border-t bg-background/95 backdrop-blur"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
            <div className="space-y-1 px-4 py-6">
              {items.map((item) => (
                <div key={item.label}>
                  {item.children ? (
                    <>
                      <button
                        className="flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-base font-medium hover:bg-accent hover:text-accent-foreground"
                        onClick={() => toggleDropdown(item.label)}
                        aria-expanded={openDropdown === item.label}
                      >
                        {item.label}
                        <ChevronDown 
                          className={cn(
                            "h-4 w-4 transition-transform duration-200",
                            openDropdown === item.label && "rotate-180"
                          )} 
                        />
                      </button>
                      {openDropdown === item.label && (
                        <div className="ml-4 space-y-1 border-l pl-4">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              to={child.href}
                              className={cn(
                                "block rounded-md px-3 py-2 text-sm transition-colors",
                                "hover:bg-accent hover:text-accent-foreground",
                                isCurrentPage(child.href) && "bg-accent text-accent-foreground"
                              )}
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <div className="font-medium">{child.label}</div>
                              {child.description && (
                                <div className="text-xs text-muted-foreground">{child.description}</div>
                              )}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      to={item.href}
                      className={cn(
                        "block rounded-md px-3 py-2 text-base font-medium transition-colors",
                        "hover:bg-accent hover:text-accent-foreground",
                        isCurrentPage(item.href) && "bg-accent text-accent-foreground"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                      aria-current={isCurrentPage(item.href) ? 'page' : undefined}
                      {...(item.external && { target: '_blank', rel: 'noopener noreferrer' })}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
