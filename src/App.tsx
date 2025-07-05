
import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/auth-context';
import { MainLayout } from '@/components/layout/MainLayout';
import { Skeleton } from '@/components/ui/loading-skeleton';
import { ErrorBoundary } from 'react-error-boundary';

// Lazy load components for better performance
const Home = lazy(() => import('@/pages/Home'));
const EnhancedHome = lazy(() => import('@/pages/EnhancedHome'));
const EnhancedDashboard = lazy(() => import('@/pages/EnhancedDashboard'));
const Features = lazy(() => import('@/pages/Features'));
const HowItWorks = lazy(() => import('@/pages/HowItWorks'));
const Pricing = lazy(() => import('@/pages/Pricing'));
const Learn = lazy(() => import('@/pages/Learn'));
const Blog = lazy(() => import('@/pages/Blog'));
const About = lazy(() => import('@/pages/About'));
const Contact = lazy(() => import('@/pages/Contact'));
const Support = lazy(() => import('@/pages/Support'));
const Terms = lazy(() => import('@/pages/Terms'));
const Privacy = lazy(() => import('@/pages/Privacy'));
const Accessibility = lazy(() => import('@/pages/Accessibility'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const QueryOptimizer = lazy(() => import('@/pages/QueryOptimizer'));
const Repositories = lazy(() => import('@/pages/Repositories'));
const Reports = lazy(() => import('@/pages/Reports'));
const AIStudio = lazy(() => import('@/pages/AIStudio'));
const Queries = lazy(() => import('@/pages/Queries'));

// Create query client with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
      retry: (failureCount, error: any) => {
        if (error?.status === 404 || error?.status === 403) return false;
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
    },
  },
});

// Loading component for Suspense
function PageLoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-40 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Error fallback component
function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-destructive">Something went wrong</h1>
        <p className="text-muted-foreground">We apologize for the inconvenience. Please try again.</p>
        <button
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-background font-sans antialiased">
              <Routes>
                <Route path="/" element={<MainLayout />}>
                  <Route 
                    index 
                    element={
                      <Suspense fallback={<PageLoadingSkeleton />}>
                        <EnhancedHome />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="app" 
                    element={
                      <Suspense fallback={<PageLoadingSkeleton />}>
                        <EnhancedDashboard />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="features" 
                    element={
                      <Suspense fallback={<PageLoadingSkeleton />}>
                        <Features />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="how-it-works" 
                    element={
                      <Suspense fallback={<PageLoadingSkeleton />}>
                        <HowItWorks />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="pricing" 
                    element={
                      <Suspense fallback={<PageLoadingSkeleton />}>
                        <Pricing />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="learn" 
                    element={
                      <Suspense fallback={<PageLoadingSkeleton />}>
                        <Learn />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="blog" 
                    element={
                      <Suspense fallback={<PageLoadingSkeleton />}>
                        <Blog />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="about" 
                    element={
                      <Suspense fallback={<PageLoadingSkeleton />}>
                        <About />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="contact" 
                    element={
                      <Suspense fallback={<PageLoadingSkeleton />}>
                        <Contact />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="support" 
                    element={
                      <Suspense fallback={<PageLoadingSkeleton />}>
                        <Support />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="terms" 
                    element={
                      <Suspense fallback={<PageLoadingSkeleton />}>
                        <Terms />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="privacy" 
                    element={
                      <Suspense fallback={<PageLoadingSkeleton />}>
                        <Privacy />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="accessibility" 
                    element={
                      <Suspense fallback={<PageLoadingSkeleton />}>
                        <Accessibility />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="optimizer" 
                    element={
                      <Suspense fallback={<PageLoadingSkeleton />}>
                        <QueryOptimizer />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="repositories" 
                    element={
                      <Suspense fallback={<PageLoadingSkeleton />}>
                        <Repositories />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="reports" 
                    element={
                      <Suspense fallback={<PageLoadingSkeleton />}>
                        <Reports />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="ai-studio" 
                    element={
                      <Suspense fallback={<PageLoadingSkeleton />}>
                        <AIStudio />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="queries" 
                    element={
                      <Suspense fallback={<PageLoadingSkeleton />}>
                        <Queries />
                      </Suspense>
                    } 
                  />
                  <Route 
                    path="*" 
                    element={
                      <Suspense fallback={<PageLoadingSkeleton />}>
                        <NotFound />
                      </Suspense>
                    } 
                  />
                </Route>
              </Routes>
              <Toaster />
            </div>
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
