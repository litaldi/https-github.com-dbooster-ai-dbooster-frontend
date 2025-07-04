
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { useNavigation } from '@/hooks/useNavigation';
import { EnhancedNavigationItems } from './EnhancedNavigationItems';
import { EnhancedUserMenu } from './EnhancedUserMenu';
import { NavigationLogo } from './NavigationLogo';
import { StandardizedButton } from '@/components/ui/standardized-button';
import { 
  publicNavItems, 
  authenticatedNavItems, 
  userMenuItems, 
  companyMenuItems, 
  legalMenuItems 
} from '@/config/navigation';

export function MainNav() {
  const {
    isOpen,
    toggleMenu,
    closeMenu,
    user,
    theme,
    handleLogout,
    toggleTheme,
    isCurrentRoute
  } = useNavigation();

  const navItems = user ? authenticatedNavItems : publicNavItems;

  return (
    <nav 
      className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      role="navigation"
      aria-label="Main navigation"
      dir="ltr"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <NavigationLogo user={user} />

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <EnhancedNavigationItems 
              items={navItems} 
              isCurrentRoute={isCurrentRoute}
            />
            <div className="mx-2 h-6 w-px bg-border" aria-hidden="true" />
            <EnhancedUserMenu
              user={user}
              userMenuItems={userMenuItems}
              isCurrentRoute={isCurrentRoute}
              theme={theme}
              toggleTheme={toggleTheme}
              handleLogout={handleLogout}
            />
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden">
            <Sheet open={isOpen} onOpenChange={toggleMenu}>
              <SheetTrigger asChild>
                <StandardizedButton 
                  variant="ghost" 
                  size="icon" 
                  aria-label="Open navigation menu"
                  aria-expanded={isOpen}
                >
                  <Menu className="h-5 w-5" />
                </StandardizedButton>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-6" dir="ltr">
                <div className="flex flex-col space-y-6">
                  <NavigationLogo user={user} />
                  
                  <div className="flex flex-col space-y-4">
                    <EnhancedNavigationItems 
                      items={navItems} 
                      mobile 
                      closeMenu={closeMenu}
                      isCurrentRoute={isCurrentRoute}
                    />
                    
                    {/* Company section */}
                    <div className="border-t pt-4 space-y-1">
                      <h4 className="text-sm font-medium text-muted-foreground px-3 mb-2">Learn More</h4>
                      <EnhancedNavigationItems 
                        items={companyMenuItems}
                        mobile
                        closeMenu={closeMenu}
                        isCurrentRoute={isCurrentRoute}
                      />
                    </div>
                    
                    {/* Legal section */}
                    <div className="border-t pt-4 space-y-1">
                      <h4 className="text-sm font-medium text-muted-foreground px-3 mb-2">Legal & Support</h4>
                      <EnhancedNavigationItems 
                        items={legalMenuItems}
                        mobile
                        closeMenu={closeMenu}
                        isCurrentRoute={isCurrentRoute}
                      />
                    </div>
                    
                    <EnhancedUserMenu
                      user={user}
                      userMenuItems={userMenuItems}
                      mobile
                      closeMenu={closeMenu}
                      isCurrentRoute={isCurrentRoute}
                      theme={theme}
                      toggleTheme={toggleTheme}
                      handleLogout={handleLogout}
                    />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
