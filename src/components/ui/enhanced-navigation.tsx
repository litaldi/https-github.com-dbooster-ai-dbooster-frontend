
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ChevronRight, Home } from 'lucide-react';
import { EnhancedButton } from './enhanced-button';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface EnhancedBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function EnhancedBreadcrumb({ items, className }: EnhancedBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center space-x-1 text-sm', className)}>
      <Link 
        to="/" 
        className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted"
        aria-label="Go to home"
      >
        <Home className="h-4 w-4" />
      </Link>
      
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const Icon = item.icon;
        
        return (
          <div key={index} className="flex items-center space-x-1">
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            
            {item.href && !isLast ? (
              <Link 
                to={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted flex items-center gap-1"
              >
                {Icon && <Icon className="h-3 w-3" />}
                {item.label}
              </Link>
            ) : (
              <span className={cn(
                'px-2 py-1 rounded-md flex items-center gap-1',
                isLast ? 'text-foreground font-medium' : 'text-muted-foreground'
              )}>
                {Icon && <Icon className="h-3 w-3" />}
                {item.label}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
}

interface QuickNavigationProps {
  sections: Array<{
    id: string;
    label: string;
    href: string;
    icon?: React.ComponentType<{ className?: string }>;
  }>;
  className?: string;
}

export function QuickNavigation({ sections, className }: QuickNavigationProps) {
  const location = useLocation();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <nav className={cn('flex items-center space-x-1', className)}>
      {sections.map((section) => {
        const isActive = location.pathname === section.href;
        const isHovered = hoveredId === section.id;
        const Icon = section.icon;
        
        return (
          <Link
            key={section.id}
            to={section.href}
            onMouseEnter={() => setHoveredId(section.id)}
            onMouseLeave={() => setHoveredId(null)}
            className={cn(
              'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
              isActive 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground hover:bg-muted',
              isHovered && !isActive && 'scale-105'
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            {Icon && <Icon className="h-4 w-4" />}
            <span>{section.label}</span>
            {isActive && (
              <div className="w-1 h-1 bg-primary-foreground rounded-full ml-1" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

interface BackNavigationProps {
  onBack?: () => void;
  label?: string;
  className?: string;
}

export function BackNavigation({ onBack, label = 'Go Back', className }: BackNavigationProps) {
  return (
    <EnhancedButton
      variant="ghost"
      onClick={onBack || (() => window.history.back())}
      className={cn('gap-2 px-2', className)}
      aria-label={label}
    >
      <ChevronRight className="h-4 w-4 rotate-180" />
      {label}
    </EnhancedButton>
  );
}
