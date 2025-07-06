
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
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <NavigationLogo user={user} />

          {/* Desktop Navigation - Properly aligned LTR */}
          <div className="hidden lg:flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <EnhancedNavigationItems 
                items={navItems} 
                isCurrentRoute={isCurrentRoute}
              />
            </div>
            <div className="h-6 w-px bg-border mx-4" aria-hidden="true" />
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
                  className="min-h-[44px] min-w-[44px]"
                >
                  <Menu className="h-5 w-5" />
                </StandardizedButton>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-0">
                <div className="flex flex-col h-full">
                  <div className="p-6 border-b">
                    <NavigationLogo user={user} />
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-foreground mb-3 text-left">Navigation</h4>
                      <EnhancedNavigationItems 
                        items={navItems} 
                        mobile 
                        closeMenu={closeMenu}
                        isCurrentRoute={isCurrentRoute}
                      />
                    </div>
                    
                    {/* Company section */}
                    <div className="border-t pt-4 space-y-2">
                      <h4 className="text-sm font-semibold text-muted-foreground mb-3 text-left">Learn More</h4>
                      <EnhancedNavigationItems 
                        items={companyMenuItems}
                        mobile
                        closeMenu={closeMenu}
                        isCurrentRoute={isCurrentRoute}
                      />
                    </div>
                    
                    {/* Legal section */}
                    <div className="border-t pt-4 space-y-2">
                      <h4 className="text-sm font-semibold text-muted-foreground mb-3 text-left">Legal & Support</h4>
                      <EnhancedNavigationItems 
                        items={legalMenuItems}
                        mobile
                        closeMenu={closeMenu}
                        isCurrentRoute={isCurrentRoute}
                      />
                    </div>
                  </div>

                  <div className="border-t p-6">
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
