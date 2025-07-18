
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/auth-context';
import { LogoutButton } from '@/components/auth/LogoutButton';
import { User, Settings, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { NotificationBell } from '@/components/notifications/SmartNotifications';
import { AccessibilityMenu } from '@/components/accessibility-menu';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const { user, isDemo } = useAuth();
  const navigate = useNavigate();

  const handleStartForFree = () => {
    // Navigate to demo page where users can experience the product
    navigate('/demo');
  };

  const handleTryDemo = () => {
    navigate('/demo');
  };

  const handleSignUp = () => {
    navigate('/login?mode=signup');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" dir="ltr">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="md:hidden" />
          <div className="hidden md:block">
            <h1 className="text-lg font-semibold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              DBooster
            </h1>
          </div>
        </div>

        {/* Center space for future content */}
        <div className="flex-1" />

        <div className="flex items-center gap-2">
          {isDemo && (
            <Badge variant="secondary" className="hidden sm:inline-flex animate-pulse">
              Demo Mode
            </Badge>
          )}
          
          <NotificationBell />
          <AccessibilityMenu />
          <ThemeToggle />

          {/* Action buttons */}
          <div className="flex items-center gap-2 border-l pl-2 ml-2">
            <Button 
              onClick={handleStartForFree}
              className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
            >
              Start for Free
            </Button>
            
            {!user ? (
              <>
                <Button 
                  variant="outline" 
                  onClick={handleTryDemo}
                  className="hidden sm:inline-flex"
                >
                  Try Demo
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleSignUp}
                >
                  Sign Up
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleLogin}
                >
                  Login
                </Button>
              </>
            ) : (
              <LogoutButton variant="outline" size="default" />
            )}
          </div>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-r from-primary to-blue-600 flex items-center justify-center text-xs font-medium text-white">
                    {user.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-blue-600 flex items-center justify-center text-xs font-medium text-white">
                        {user.email?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-none truncate">
                          {user.user_metadata?.full_name || user.email}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    {isDemo && (
                      <Badge variant="secondary" className="w-fit text-xs">
                        Demo Account
                      </Badge>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/app')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/account')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Account Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/app/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>App Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/support')}>
                  <Bell className="mr-2 h-4 w-4" />
                  <span>Support & Help</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <LogoutButton variant="ghost" className="w-full justify-start text-red-600 focus:text-red-600" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" onClick={handleLogin}>
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
