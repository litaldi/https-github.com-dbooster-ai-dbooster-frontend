
import { useAuth } from '@/contexts/auth-context';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { MoonIcon, SunIcon, LogOut } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { showSuccess, showError } from '@/components/ui/feedback-toast';
import { DemoBadge } from '@/components/demo-badge';
import { Link } from 'react-router-dom';

export function Header() {
  const { user, logout, isDemo } = useAuth();
  const { theme, setTheme } = useTheme();

  const handleLogout = async () => {
    try {
      await logout();
      showSuccess({
        title: "Signed out successfully",
        description: isDemo ? "Demo session ended." : "You have been logged out of your account.",
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      showError({
        title: "Logout failed",
        description: error.message || "An error occurred while signing out.",
      });
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const userName = user?.user_metadata?.full_name || user?.user_metadata?.name || 'User';
  const userEmail = user?.email || '';
  const userAvatar = user?.user_metadata?.avatar_url;

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <div className="flex h-14 items-center px-4 md:px-6 gap-4">
        <SidebarTrigger 
          aria-label="Toggle sidebar"
          className="hover:bg-accent hover:text-accent-foreground transition-colors min-h-[44px] min-w-[44px]"
        />
        
        <div className="flex-1 flex items-center gap-3">
          <DemoBadge />
        </div>
        
        <div className="flex items-center gap-2">
          <EnhancedButton
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            className="min-h-[44px] min-w-[44px]"
          >
            <SunIcon className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </EnhancedButton>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <EnhancedButton 
                variant="ghost" 
                className="relative h-8 w-8 rounded-full min-h-[44px] min-w-[44px] p-0"
                aria-label="User menu"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage 
                    src={userAvatar} 
                    alt={`${userName}'s avatar`} 
                  />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </EnhancedButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-56 bg-background border shadow-lg" 
              align="end" 
              forceMount
              sideOffset={8}
            >
              <div className="flex flex-col space-y-1 p-2">
                <p className="text-sm font-medium leading-none">
                  {userName}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {userEmail}
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/account" className="cursor-pointer w-full">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="cursor-pointer w-full">
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                <LogOut className="w-4 h-4 mr-2" />
                {isDemo ? 'Exit Demo' : 'Log out'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
