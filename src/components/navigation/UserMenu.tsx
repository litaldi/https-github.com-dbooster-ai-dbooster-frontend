
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Sun, Moon, LogOut, LogIn } from 'lucide-react';
import { KeyboardShortcutsHelper } from '@/components/layout/KeyboardShortcutsHelper';

interface UserMenuItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface UserMenuProps {
  user: any;
  userMenuItems: UserMenuItem[];
  mobile?: boolean;
  closeMenu?: () => void;
  isCurrentRoute: (path: string) => boolean;
  theme: string;
  toggleTheme: () => void;
  handleLogout: () => void;
}

export function UserMenu({ 
  user,
  userMenuItems,
  mobile = false, 
  closeMenu = () => {},
  isCurrentRoute,
  theme,
  toggleTheme,
  handleLogout
}: UserMenuProps) {
  return (
    <div className={cn(
      "flex gap-1",
      mobile ? "flex-col space-y-1 border-t pt-4" : "items-center"
    )}>
      {user && userMenuItems.map((item) => (
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
      
      {user && !mobile && <KeyboardShortcutsHelper />}
      
      <Button
        variant="ghost"
        size={mobile ? "default" : "icon"}
        onClick={toggleTheme}
        className={cn(
          "flex items-center gap-2",
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
            "flex items-center gap-2",
            mobile && "justify-start w-full"
          )}
        >
          <LogOut className="h-4 w-4" />
          {mobile && <span>Logout</span>}
        </Button>
      ) : (
        <Button asChild>
          <Link to="/login">
            <LogIn className="h-4 w-4 mr-2" />
            Sign In
          </Link>
        </Button>
      )}
    </div>
  );
}
