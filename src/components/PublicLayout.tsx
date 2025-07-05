
import React from 'react';
import { EnhancedHeader } from './layout/enhanced-header';
import { AccessibilityEnhancements } from './ui/accessibility-enhancements';
import { AccessibilityFloatingButton } from './ui/accessibility-menu';
import { PerformanceWidget } from './ui/performance-widget';
import { SkipLink } from './ui/accessibility-helpers';
import { usePerformanceOptimization } from '@/hooks/usePerformanceOptimization';
import { Home, Zap, Shield, BarChart3, BookOpen, Users } from 'lucide-react';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  // Initialize performance optimization
  usePerformanceOptimization({
    preloadResources: true,
    measureTimings: true,
    enableWebVitals: true
  });

  const navigation = [
    { name: 'Home', href: '/', icon: <Home className="h-4 w-4" /> },
    { name: 'Features', href: '/features', icon: <Zap className="h-4 w-4" />, badge: 'New' },
    { name: 'How It Works', href: '/how-it-works', icon: <BarChart3 className="h-4 w-4" /> },
    { name: 'Pricing', href: '/pricing', icon: <Shield className="h-4 w-4" /> },
    { name: 'Learn', href: '/learn', icon: <BookOpen className="h-4 w-4" /> },
    { name: 'About', href: '/about', icon: <Users className="h-4 w-4" /> }
  ];

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      {/* Accessibility Enhancements */}
      <AccessibilityEnhancements />
      
      {/* Skip Link for keyboard navigation */}
      <SkipLink href="#main-content">
        Skip to main content
      </SkipLink>
      
      {/* Header */}
      <EnhancedHeader 
        navigation={navigation}
        searchEnabled={true}
        ctaButton={{
          text: 'Get Started',
          onClick: () => window.location.href = '/login'
        }}
      />
      
      {/* Main Content */}
      <main id="main-content" className="flex-1">
        {children}
      </main>
      
      {/* Accessibility Controls */}
      <AccessibilityFloatingButton />
      
      {/* Performance Widget (development only) */}
      <PerformanceWidget />
    </div>
  );
}
