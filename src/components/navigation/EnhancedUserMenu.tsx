
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { NavigationItem } from '@/config/navigation';
import { User, LogOut, Sun, Moon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
  closeMenu,
  isCurrentRoute,
  theme,
  toggleTheme,
  handleLogout
}: EnhancedUserMenuProps) {
  if (mobile) {
    return (
      <div className="space-y-2 pt-4 border-t">
        <div className="px-3 py-2">
          <p className="text-sm font-medium">
            {user ? user.email : 'Guest User'}
          </p>
        </div>
        
        {user && userMenuItems.map((item) => (
          <Button
            key={item.href}
            variant={isCurrentRoute(item.href) ? "default" : "ghost"}
            className="w-full justify-start"
            asChild
          >
            <Link to={item.href} onClick={closeMenu}>
              <item.icon className="h-4 w-4 mr-2" />
              {item.label}
            </Link>
          </Button>
        ))}
        
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={toggleTheme}
        >
          {theme === 'light' ? <Moon className="h-4 w-4 mr-2" /> : <Sun className="h-4 w-4 mr-2" />}
          Toggle Theme
        </Button>
        
        {user ? (
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600"
            onClick={() => {
              handleLogout();
              if (closeMenu) closeMenu();
            }}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        ) : (
          <Button className="w-full" asChild>
            <Link to="/login" onClick={closeMenu}>
              Sign In
            </Link>
          </Button>
        )}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={toggleTheme} size="icon">
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>
        <Button asChild>
          <Link to="/login">Sign In</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" onClick={toggleTheme} size="icon">
        {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-xs font-medium text-white">
              {user.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <span className="hidden md:inline">{user.email}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.email}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.user_metadata?.full_name || 'User'}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {userMenuItems.map((item) => (
            <DropdownMenuItem key={item.href} asChild>
              <Link to={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            </DropdownMenuItem>
          ))}
          
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
