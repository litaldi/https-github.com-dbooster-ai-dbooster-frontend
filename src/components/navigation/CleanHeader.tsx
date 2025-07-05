
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Logo } from '@/components/common/Logo';
import { cn } from '@/lib/utils';

const navigationItems = [
  { name: 'Features', href: '/features' },
  { name: 'How it Works', href: '/how-it-works' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export function CleanHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Button
                  key={item.name}
                  variant="ghost"
                  asChild
                  className={cn(
                    "font-medium transition-colors hover:text-primary",
                    isActive && "bg-accent text-accent-foreground"
                  )}
                >
                  <Link to={item.href}>{item.name}</Link>
                </Button>
              );
            })}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button variant="ghost" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link to="/login">Get Started Free</Link>
            </Button>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <span className="sr-only">Open menu</span>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 p-6">
                <div className="flex flex-col space-y-6">
                  <Logo />
                  
                  <nav className="flex flex-col space-y-2">
                    {navigationItems.map((item) => {
                      const isActive = location.pathname === item.href;
                      return (
                        <Button
                          key={item.name}
                          variant="ghost"
                          asChild
                          className={cn(
                            "justify-start",
                            isActive && "bg-accent text-accent-foreground"
                          )}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Link to={item.href}>{item.name}</Link>
                        </Button>
                      );
                    })}
                  </nav>
                  
                  <div className="space-y-2 pt-4 border-t">
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                        Sign In
                      </Link>
                    </Button>
                    <Button className="w-full" asChild>
                      <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                        Get Started Free
                      </Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
