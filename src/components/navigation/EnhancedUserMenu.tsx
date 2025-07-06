
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { NavigationItem } from '@/config/navigation';
import { User, LogOut, Sun, Moon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
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
      <div className="space-y-3">
        {user && (
          <div className="px-4 py-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-3 text-left">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-blue-600 flex items-center justify-center text-sm font-medium text-white">
                {user.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium truncate text-left">
                  {user.user_metadata?.full_name || user.email}
                </p>
                <p className="text-xs text-muted-foreground truncate text-left">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {user && userMenuItems.map((item) => (
          <Button
            key={item.href}
            variant={isCurrentRoute(item.href) ? "default" : "ghost"}
            className="w-full justify-start h-12 text-left"
            asChild
          >
            <Link to={item.href} onClick={closeMenu} className="flex items-center gap-3 text-left">
              <item.icon className="h-4 w-4" />
              <span className="text-left">{item.label}</span>
            </Link>
          </Button>
        ))}
        
        <div className="flex flex-col gap-2 pt-2 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start h-12 text-left"
            onClick={toggleTheme}
          >
            <div className="flex items-center gap-3 text-left">
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              <span className="text-left">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
            </div>
          </Button>
          
          {user ? (
            <Button
              variant="ghost"
              className="w-full justify-start h-12 text-red-600 hover:text-red-700 hover:bg-red-50 text-left"
              onClick={() => {
                handleLogout();
                if (closeMenu) closeMenu();
              }}
            >
              <div className="flex items-center gap-3 text-left">
                <LogOut className="h-4 w-4" />
                <span className="text-left">Sign Out</span>
              </div>
            </Button>
          ) : (
            <Button className="w-full h-12 text-left" asChild>
              <Link to="/login" onClick={closeMenu} className="flex items-center gap-3 text-left">
                <User className="h-4 w-4" />
                <span className="text-left">Sign In</span>
              </Link>
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={toggleTheme} size="icon" className="h-10 w-10">
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>
        <Button asChild className="h-10 px-6">
          <Link to="/login">Sign In</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" onClick={toggleTheme} size="icon" className="h-10 w-10">
        {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-3 h-10 px-3">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-blue-600 flex items-center justify-center text-xs font-medium text-white">
              {user.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <span className="hidden md:inline text-sm font-medium text-left">{user.email}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 bg-background border shadow-lg">
          <DropdownMenuLabel>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-blue-600 flex items-center justify-center text-sm font-medium text-white">
                  {user.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium leading-none truncate text-left">
                    {user.user_metadata?.full_name || user.email}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground truncate mt-1 text-left">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {userMenuItems.map((item) => (
            <DropdownMenuItem key={item.href} asChild>
              <Link to={item.href} className="flex items-center gap-3 w-full text-left">
                <item.icon className="h-4 w-4" />
                <span className="text-left">{item.label}</span>
              </Link>
            </DropdownMenuItem>
          ))}
          
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 focus:bg-red-50">
            <div className="flex items-center gap-3 w-full text-left">
              <LogOut className="h-4 w-4" />
              <span className="text-left">Sign Out</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
