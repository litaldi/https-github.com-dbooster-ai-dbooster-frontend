
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
}

export function Breadcrumb({ items, className, showHome = true }: BreadcrumbProps) {
  const location = useLocation();

  // Auto-generate breadcrumb items from current path if none provided
  const autoItems = React.useMemo(() => {
    if (items.length > 0) return items;
    
    const pathSegments = location.pathname.split('/').filter(Boolean);
    return pathSegments.map((segment, index) => {
      const href = '/' + pathSegments.slice(0, index + 1).join('/');
      const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
      
      return {
        label,
        href: index === pathSegments.length - 1 ? undefined : href
      };
    });
  }, [items, location.pathname]);

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={cn('flex items-center space-x-1 text-sm', className)}
    >
      {showHome && (
        <>
          <Link 
            to="/" 
            className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-muted"
            aria-label="Go to home"
          >
            <Home className="h-4 w-4" />
          </Link>
          {autoItems.length > 0 && (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </>
      )}
      
      {autoItems.map((item, index) => {
        const isLast = index === autoItems.length - 1;
        const Icon = item.icon;
        
        return (
          <div key={index} className="flex items-center space-x-1">
            {index > 0 && (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
            
            {item.href && !isLast ? (
              <Link 
                to={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors px-2 py-1.5 rounded-md hover:bg-muted flex items-center gap-1.5"
              >
                {Icon && <Icon className="h-3.5 w-3.5" />}
                {item.label}
              </Link>
            ) : (
              <span className={cn(
                'px-2 py-1.5 rounded-md flex items-center gap-1.5',
                isLast ? 'text-foreground font-medium' : 'text-muted-foreground'
              )}>
                {Icon && <Icon className="h-3.5 w-3.5" />}
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}
