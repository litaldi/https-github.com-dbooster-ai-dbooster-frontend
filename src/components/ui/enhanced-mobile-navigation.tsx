import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { NavigationItem } from '@/config/navigation';
import { 
  Menu, 
  X, 
  ChevronRight, 
  ChevronDown,
  Search,
  User,
  Settings,
  Home,
  ArrowLeft
} from 'lucide-react';

interface MobileNavigationProps {
  items: NavigationItem[];
  className?: string;
}

interface MobileMenuLevel {
  items: NavigationItem[];
  title: string;
  parent?: string;
}

export function EnhancedMobileNavigation({ items, className }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLevel, setCurrentLevel] = useState<MobileMenuLevel>({
    items,
    title: 'Menu'
  });
  const [breadcrumbs, setBreadcrumbs] = useState<MobileMenuLevel[]>([]);
  const location = useLocation();

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
    setCurrentLevel({ items, title: 'Menu' });
    setBreadcrumbs([]);
  }, [location.pathname, items]);

  const handleSubMenuOpen = (item: NavigationItem) => {
    if (!item.children) return;
    
    setBreadcrumbs(prev => [...prev, currentLevel]);
    setCurrentLevel({
      items: item.children,
      title: item.label,
      parent: currentLevel.title
    });
  };

  const handleBackNavigation = () => {
    const previousLevel = breadcrumbs[breadcrumbs.length - 1];
    if (previousLevel) {
      setCurrentLevel(previousLevel);
      setBreadcrumbs(prev => prev.slice(0, -1));
    }
  };

  const isActiveRoute = (href: string) => location.pathname === href;

  return (
    <div className={cn('lg:hidden', className)}>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="relative h-10 w-10"
            aria-label="Open mobile menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        
        <SheetContent 
          side="left" 
          className="w-full max-w-sm p-0 overflow-hidden"
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <SheetHeader className="px-6 py-4 border-b bg-background/50 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                {breadcrumbs.length > 0 ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBackNavigation}
                    className="p-0 h-auto font-medium"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                ) : (
                  <SheetTitle className="text-lg font-semibold">
                    {currentLevel.title}
                  </SheetTitle>
                )}
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8"
                  aria-label="Close menu"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Breadcrumb Trail */}
              {breadcrumbs.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2">
                  <span>Menu</span>
                  {breadcrumbs.map((level, index) => (
                    <React.Fragment key={index}>
                      <ChevronRight className="h-3 w-3" />
                      <span>{level.title}</span>
                    </React.Fragment>
                  ))}
                  <ChevronRight className="h-3 w-3" />
                  <span className="text-foreground font-medium">{currentLevel.title}</span>
                </div>
              )}
            </SheetHeader>

            {/* Search Bar */}
            <div className="px-6 py-4 border-b bg-muted/20">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 overflow-y-auto">
              <div className="py-2">
                {currentLevel.items.map((item, index) => (
                  <MobileNavigationItem
                    key={`${item.href}-${index}`}
                    item={item}
                    isActive={isActiveRoute(item.href)}
                    onSubMenuOpen={handleSubMenuOpen}
                    onItemClick={() => setIsOpen(false)}
                  />
                ))}
              </div>
            </nav>

            {/* Quick Actions Footer */}
            <div className="border-t bg-muted/10 p-4">
              <div className="space-y-2">
                <Link
                  to="/app"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Home className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Dashboard</span>
                </Link>
                
                <Link
                  to="/app/account"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Profile</span>
                </Link>
                
                <Link
                  to="/app/settings"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Settings</span>
                </Link>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

interface MobileNavigationItemProps {
  item: NavigationItem;
  isActive: boolean;
  onSubMenuOpen: (item: NavigationItem) => void;
  onItemClick: () => void;
}

function MobileNavigationItem({ 
  item, 
  isActive, 
  onSubMenuOpen, 
  onItemClick 
}: MobileNavigationItemProps) {
  const hasChildren = item.children && item.children.length > 0;
  const Icon = item.icon;

  if (hasChildren) {
    return (
      <button
        onClick={() => onSubMenuOpen(item)}
        className={cn(
          'w-full flex items-center justify-between p-4 text-left',
          'hover:bg-accent/50 transition-colors border-b border-border/30',
          'focus:outline-none focus:bg-accent/50'
        )}
      >
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-muted-foreground" />
          <div className="flex-1">
            <span className="font-medium text-foreground">{item.label}</span>
            {item.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {item.description}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {item.badge && (
            <Badge variant="secondary" className="text-xs">
              {item.badge}
            </Badge>
          )}
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </button>
    );
  }

  return (
    <Link
      to={item.href}
      onClick={onItemClick}
      className={cn(
        'flex items-center gap-3 p-4 transition-colors border-b border-border/30',
        'hover:bg-accent/50 focus:outline-none focus:bg-accent/50',
        isActive && 'bg-primary/10 border-primary/20 text-primary'
      )}
    >
      <Icon className={cn(
        'h-5 w-5',
        isActive ? 'text-primary' : 'text-muted-foreground'
      )} />
      
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className={cn(
            'font-medium',
            isActive ? 'text-primary' : 'text-foreground'
          )}>
            {item.label}
          </span>
          {item.badge && (
            <Badge variant="secondary" className="text-xs">
              {item.badge}
            </Badge>
          )}
        </div>
        {item.description && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {item.description}
          </p>
        )}
      </div>
      
      {isActive && (
        <div className="w-1 h-6 bg-primary rounded-full" />
      )}
    </Link>
  );
}

// Mobile Bottom Navigation for quick access
export interface MobileBottomNavProps {
  items: Array<{
    href: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }>;
  className?: string;
}

export function MobileBottomNavigation({ items, className }: MobileBottomNavProps) {
  const location = useLocation();

  return (
    <nav className={cn(
      'fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm',
      'border-t border-border lg:hidden',
      className
    )}>
      <div className="flex items-center justify-around px-2 py-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex flex-col items-center gap-1 p-2 rounded-lg transition-colors',
                'hover:bg-accent/50 focus:outline-none focus:bg-accent/50',
                'min-w-0 flex-1 relative',
                isActive && 'text-primary'
              )}
            >
              <div className="relative">
                <Icon className={cn(
                  'h-5 w-5',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )} />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 h-2 w-2 bg-destructive rounded-full" />
                )}
              </div>
              <span className={cn(
                'text-xs font-medium truncate w-full text-center',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}