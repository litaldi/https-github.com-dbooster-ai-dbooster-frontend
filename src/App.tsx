
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Suspense, lazy, useEffect } from 'react';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/auth-context';
import { GlobalLoadingOverlay } from '@/components/ui/GlobalLoadingOverlay';
import { AccessibilityEnhancements } from '@/components/ui/accessibility-enhancements';
import { AccessibilityFloatingButton } from '@/components/ui/accessibility-menu';
import { PerformanceMonitor } from '@/components/ui/performance-monitor';
import { CriticalCSSLoader, ResourcePreloader } from '@/components/ui/critical-css-loader';
import { performanceMonitor } from '@/utils/advancedPerformanceMonitor';
import { SEOHead } from '@/components/seo/SEOHead';
import { SkipLink } from '@/components/ui/accessibility-helpers';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import './App.css';
import './styles/accessibility.css';

// Lazy load components for better performance
const Home = lazy(() => import('@/pages/Home'));
const AppPage = lazy(() => import('@/pages/EnhancedDashboard'));
const Login = lazy(() => import('@/pages/Login'));
const Features = lazy(() => import('@/pages/Features'));

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function AppContent() {
  useEffect(() => {
    // Initialize performance monitoring
    performanceMonitor.startMonitoring();

    return () => {
      performanceMonitor.stopMonitoring();
    };
  }, []);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <ErrorBoundary>
              {/* Critical resource loading */}
              <CriticalCSSLoader />
              <ResourcePreloader />
              
              {/* Accessibility enhancements */}
              <AccessibilityEnhancements />
              
              {/* Global SEO defaults */}
              <SEOHead />
              
              {/* Skip navigation for accessibility */}
              <SkipLink href="#main-content">
                Skip to main content
              </SkipLink>

              {/* Main application content */}
              <main id="main-content" role="main">
                <Suspense fallback={<GlobalLoadingOverlay />}>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/app/*" element={<AppPage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/features" element={<Features />} />
                  </Routes>
                </Suspense>
              </main>

              {/* Global UI components */}
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: 'hsl(var(--background))',
                    color: 'hsl(var(--foreground))',
                    border: '1px solid hsl(var(--border))',
                  },
                }}
              />
              
              {/* Accessibility floating menu */}
              <AccessibilityFloatingButton />
              
              {/* Performance monitoring in development */}
              <PerformanceMonitor />
            </ErrorBoundary>
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default AppContent;
