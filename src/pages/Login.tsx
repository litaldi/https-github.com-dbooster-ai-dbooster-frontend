
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { LoginHeader } from '@/components/auth/LoginHeader';
import { LoginCard } from '@/components/auth/LoginCard';
import { LoginFooter } from '@/components/auth/LoginFooter';
import { DemoModeButton } from '@/components/auth/DemoModeButton';
import { EnhancedLoading } from '@/components/ui/enhanced-loading';
import { AccessibilityEnhancements } from '@/components/ui/accessibility-enhancements';
import { SkipLink } from '@/components/ui/accessibility-helpers';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';

export default function Login() {
  const { user, isLoading } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    // Clear any previous errors when component mounts
    const params = new URLSearchParams(window.location.search);
    if (params.get('error')) {
      // Remove error from URL without refresh
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Simulate page load for smooth entrance
    const timer = setTimeout(() => setIsPageLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  // Add keyboard navigation for mode switching
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        if (event.key === '1') {
          event.preventDefault();
          setAuthMode('login');
        } else if (event.key === '2') {
          event.preventDefault();
          setAuthMode('signup');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (isLoading || isPageLoading) {
    return (
      <EnhancedLoading 
        variant="full-screen" 
        text="Loading authentication..." 
        showProgress={true}
        progress={isPageLoading ? 50 : 90}
      />
    );
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <AccessibilityEnhancements />
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-4">
        <SkipLink href="#main-content">Skip to main content</SkipLink>
        <AnimatedBackground />
        <main id="main-content" className="w-full max-w-md space-y-6 animate-fade-in">
          <LoginHeader />
          <LoginCard authMode={authMode} onAuthModeChange={setAuthMode} />
          <DemoModeButton />
          <LoginFooter />
          
          {/* Keyboard shortcuts hint */}
          <div className="text-center text-xs text-muted-foreground opacity-75">
            Press Ctrl+1 for Login, Ctrl+2 for Signup
          </div>
        </main>
      </div>
    </>
  );
}
