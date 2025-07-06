
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronDown, ExternalLink } from 'lucide-react';
import { NavigationItem } from '@/config/navigation';

interface MegaMenuProps {
  items: NavigationItem[];
  className?: string;
}

export function EnhancedMegaMenu({ items, className }: MegaMenuProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const isActiveRoute = (href: string) => location.pathname === href;

  return (
    <nav 
      ref={menuRef}
      className={cn("hidden lg:flex items-center space-x-1", className)}
      role="navigation"
      aria-label="Main navigation"
      dir="ltr"
    >
      {items.map((item) => {
        const hasChildren = item.children && item.children.length > 0;
        const isActive = activeMenu === item.label;
        
        return (
          <div key={item.label} className="relative">
            {hasChildren ? (
              <Button
                variant="ghost"
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-300",
                  "hover:bg-accent/50 hover:text-accent-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isActive && "bg-accent/30 text-accent-foreground"
                )}
                onClick={() => setActiveMenu(isActive ? null : item.label)}
                onMouseEnter={() => setActiveMenu(item.label)}
                aria-expanded={isActive}
                aria-haspopup="true"
              >
                <span>{item.label}</span>
                <ChevronDown className={cn(
                  "h-3 w-3 transition-transform duration-200",
                  isActive && "rotate-180"
                )} />
              </Button>
            ) : (
              <Button
                variant="ghost"
                asChild
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-300",
                  "hover:bg-accent/50 hover:text-accent-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isActiveRoute(item.href) && "bg-accent text-accent-foreground"
                )}
              >
                <Link to={item.href}>
                  <span>{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              </Button>
            )}

            {hasChildren && isActive && (
              <div 
                className={cn(
                  "absolute top-full left-0 mt-2 w-96 bg-background/95 backdrop-blur-lg",
                  "border rounded-lg shadow-xl z-50 p-6",
                  "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200"
                )}
                onMouseLeave={() => setActiveMenu(null)}
                dir="ltr"
              >
                <div className="mb-4">
                  <h3 className="font-semibold text-lg mb-2">{item.label}</h3>
                  {item.description && (
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  )}
                </div>

                <div className="space-y-1">
                  {item.children!.map((child) => (
                    <Link
                      key={child.href}
                      to={child.href}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-md transition-colors duration-200",
                        "hover:bg-accent/50 group",
                        isActiveRoute(child.href) && "bg-accent/30"
                      )}
                      onClick={() => setActiveMenu(null)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{child.label}</span>
                          {child.badge && (
                            <Badge variant="secondary" className="text-xs">
                              {child.badge}
                            </Badge>
                          )}
                          <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-50 transition-opacity" />
                        </div>
                        {child.description && (
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {child.description}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
