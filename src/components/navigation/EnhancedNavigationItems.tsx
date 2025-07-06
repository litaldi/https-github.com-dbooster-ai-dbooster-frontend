
import React from 'react';
import { Link } from 'react-router-dom';
import { NavigationItem } from '@/config/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface EnhancedNavigationItemsProps {
  items: NavigationItem[];
  mobile?: boolean;
  closeMenu?: () => void;
  isCurrentRoute: (path: string) => boolean;
}

export function EnhancedNavigationItems({ 
  items, 
  mobile = false, 
  closeMenu, 
  isCurrentRoute 
}: EnhancedNavigationItemsProps) {
  const handleClick = () => {
    if (closeMenu) closeMenu();
  };

  return (
    <div className={cn(
      mobile ? "flex flex-col space-y-1" : "flex items-center space-x-1"
    )} dir="ltr">
      {items.map((item) => (
        <Button
          key={item.href}
          variant={isCurrentRoute(item.href) ? "default" : "ghost"}
          className={cn(
            "relative transition-all duration-200",
            mobile 
              ? "w-full justify-start h-12 px-4 text-left" 
              : "h-10 px-4 hover:scale-105",
            !mobile && isCurrentRoute(item.href) && "shadow-sm"
          )}
          asChild
        >
          <Link to={item.href} onClick={handleClick} className="flex items-center gap-3">
            <item.icon className="h-4 w-4 flex-shrink-0" />
            <span className="font-medium">{item.label}</span>
            {item.badge && (
              <Badge variant="secondary" className="ml-auto text-xs">
                {item.badge}
              </Badge>
            )}
          </Link>
        </Button>
      ))}
    </div>
  );
}
