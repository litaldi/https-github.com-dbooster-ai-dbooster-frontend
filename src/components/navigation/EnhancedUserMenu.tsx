
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Sun, Moon, LogOut, LogIn } from 'lucide-react';
import { KeyboardShortcutsHelper } from '@/components/layout/KeyboardShortcutsHelper';
import { NavigationItem } from '@/config/navigation';

interface EnhancedUserMenuProps {
  user: any;
  userMenuItems: NavigationItem[];
  mobile?: boolean;
  closeMenu?: () => void;
  isCurrentRoute: (path: string) => boolean;
  theme: string;
  toggleTheme: () => void;
  handleLogout: () => void;
}

export function EnhancedUserMenu({ 
  user,
  userMenuItems,
  mobile = false, 
  closeMenu = () => {},
  isCurrentRoute,
  theme,
  toggleTheme,
  handleLogout
}: EnhancedUserMenuProps) {
  return (
    <div className={cn(
      "flex gap-1",
      mobile ? "flex-col space-y-1 border-t pt-4" : "items-center"
    )}>
      {user && userMenuItems.map((item) => {
        const isActive = isCurrentRoute(item.href);
        const Icon = item.icon;
        
        return (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all duration-200 rounded-md",
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
            <Icon className="h-4 w-4" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
      
      {user && !mobile && <KeyboardShortcutsHelper />}
      
      <Button
        variant="ghost"
        size={mobile ? "default" : "icon"}
        onClick={toggleTheme}
        className={cn(
          "flex items-center gap-2 transition-all duration-200 hover:scale-[1.02]",
          mobile && "justify-start w-full"
        )}
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        {mobile && <span>Toggle Theme</span>}
      </Button>
      
      {user ? (
        <Button
          variant="ghost"
          size={mobile ? "default" : "sm"}
          onClick={handleLogout}
          className={cn(
            "flex items-center gap-2 transition-all duration-200 hover:scale-[1.02] hover:bg-destructive/10 hover:text-destructive",
            mobile && "justify-start w-full"
          )}
          aria-label="Sign out of DBooster"
        >
          <LogOut className="h-4 w-4" />
          {mobile && <span>Sign Out</span>}
        </Button>
      ) : (
        <Button asChild className="transition-all duration-200 hover:scale-[1.02]">
          <Link to="/login">
            <LogIn className="h-4 w-4 mr-2" />
            Get Started
          </Link>
        </Button>
      )}
    </div>
  );
}
