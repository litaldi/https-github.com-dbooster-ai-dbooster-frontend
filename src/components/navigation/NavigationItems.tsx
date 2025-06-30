
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface NavigationItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavigationItemsProps {
  items: NavigationItem[];
  mobile?: boolean;
  closeMenu?: () => void;
  isCurrentRoute: (path: string) => boolean;
}

export function NavigationItems({ 
  items, 
  mobile = false, 
  closeMenu = () => {}, 
  isCurrentRoute 
}: NavigationItemsProps) {
  return (
    <div className={cn(
      "flex gap-1",
      mobile ? "flex-col space-y-1" : "items-center"
    )}>
      {items.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            "flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors rounded-md",
            "hover:bg-accent hover:text-accent-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            isCurrentRoute(item.href)
              ? "bg-accent text-accent-foreground" 
              : "text-muted-foreground hover:text-foreground",
            mobile && "justify-start w-full"
          )}
          onClick={closeMenu}
          aria-current={isCurrentRoute(item.href) ? 'page' : undefined}
        >
          <item.icon className="h-4 w-4" aria-hidden="true" />
          {item.label}
        </Link>
      ))}
    </div>
  );
}
