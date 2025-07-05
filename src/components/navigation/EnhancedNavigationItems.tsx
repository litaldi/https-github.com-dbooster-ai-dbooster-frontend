
import React from 'react';
import { Link } from 'react-router-dom';
import { NavigationItem } from '@/config/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

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
    <>
      {items.map((item) => (
        <Button
          key={item.href}
          variant={isCurrentRoute(item.href) ? "default" : "ghost"}
          className={mobile ? "w-full justify-start" : ""}
          asChild
        >
          <Link to={item.href} onClick={handleClick} className="flex items-center gap-2">
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
            {item.badge && (
              <Badge variant="secondary" className="text-xs">
                {item.badge}
              </Badge>
            )}
          </Link>
        </Button>
      ))}
    </>
  );
}
