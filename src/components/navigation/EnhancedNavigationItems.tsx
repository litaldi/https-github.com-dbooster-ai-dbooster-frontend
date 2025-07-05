
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { NavigationItem } from '@/config/navigation';

interface EnhancedNavigationItemsProps {
  items: NavigationItem[];
  mobile?: boolean;
  closeMenu?: () => void;
  isCurrentRoute: (path: string) => boolean;
  className?: string;
}

export function EnhancedNavigationItems({ 
  items, 
  mobile = false, 
  closeMenu = () => {}, 
  isCurrentRoute,
  className
}: EnhancedNavigationItemsProps) {
  return (
    <nav
      className={cn(
        "flex gap-1",
        mobile ? "flex-col space-y-1" : "items-center",
        className
      )}
      role="navigation"
      aria-label={mobile ? "Mobile navigation" : "Main navigation"}
    >
      {items.map((item) => {
        const isActive = isCurrentRoute(item.href);
        
        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md",
              "hover:bg-accent hover:text-accent-foreground hover:scale-[1.02]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              isActive
                ? "bg-accent text-accent-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground",
              mobile && "justify-start w-full"
            )}
            onClick={closeMenu}
            aria-current={isActive ? 'page' : undefined}
            title={item.description}
          >
            <span>{item.label}</span>
            {item.badge && (
              <Badge variant="secondary" className="text-xs ml-auto bg-primary/10 text-primary border-primary/20">
                {item.badge}
              </Badge>
            )}
            {mobile && item.description && (
              <span className="text-xs text-muted-foreground block mt-1">
                {item.description}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
