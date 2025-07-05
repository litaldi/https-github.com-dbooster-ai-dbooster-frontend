import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/auth-context';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';
import { EnhancedErrorBoundary } from '@/components/ui/enhanced-error-boundary';
import { PublicLayout } from '@/components/PublicLayout';
import { GlobalLoadingOverlay } from '@/components/ui/GlobalLoadingOverlay';
import { UpdateBanner } from '@/components/ui/update-banner';
import { SkipToMainContent } from '@/components/ui/accessibility-enhanced';
import Layout from '@/components/layout';
import ProtectedRoute from '@/components/protected-route';
import { ResourcePreloader, CriticalCSSLoader } from '@/components/ui/critical-css-loader';
import { appInitializer } from '@/utils/appInitializer';
import { useEffect } from 'react';

// Lazy load pages for better performance
import { lazy, Suspense } from 'react';
import { PageLoading } from '@/components/ui/loading-states';

// Critical pages (loaded immediately)
import Home from '@/pages/Home';
import Login from '@/pages/Login';

// Non-critical pages (lazy loaded)
const Features = lazy(() => import('@/pages/Features'));
const HowItWorks = lazy(() => import('@/pages/HowItWorks'));
const Pricing = lazy(() => import('@/pages/Pricing'));
const Learn = lazy(() => import('@/pages/Learn'));
const Blog = lazy(() => import('@/pages/Blog'));
const About = lazy(() => import('@/pages/About'));
const Contact = lazy(() => import('@/pages/Contact'));
const Support = lazy(() => import('@/pages/Support'));
const Privacy = lazy(() => import('@/pages/Privacy'));
const Terms = lazy(() => import('@/pages/Terms'));
const Accessibility = lazy(() => import('@/pages/Accessibility'));
const AIOptimizationStudio = lazy(() => import('@/pages/AIOptimizationStudio'));
const EnhancedDashboard = lazy(() => import('@/pages/EnhancedDashboard'));
const Queries = lazy(() => import('@/pages/Queries'));
const Repositories = lazy(() => import('@/pages/Repositories'));
const Reports = lazy(() => import('@/pages/Reports'));
const SecurityDashboardPage = lazy(() => import('@/components/security/SecurityDashboardPage').then(module => ({ default: module.SecurityDashboardPage })));
const Search = lazy(() => import('@/pages/Search'));

// New pages
const Enterprise = lazy(() => import('@/pages/Enterprise'));
const DatabaseTypes = lazy(() => import('@/pages/DatabaseTypes'));
const UseCases = lazy(() => import('@/pages/UseCases'));
const Integrations = lazy(() => import('@/pages/Integrations'));
const Status = lazy(() => import('@/pages/Status'));
const Changelog = lazy(() => import('@/pages/Changelog'));
const Partners = lazy(() => import('@/pages/Partners'));
const Press = lazy(() => import('@/pages/Press'));
const Cookies = lazy(() => import('@/pages/Cookies'));
const NotFound = lazy(() => import('@/components/error/NotFound').then(module => ({ default: module.NotFound })));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false, // Reduce unnecessary requests
    },
  },
});

function App() {
  useEffect(() => {
    // Initialize app with performance optimizations
    appInitializer.initialize();
  }, []);

  return (
    <EnhancedErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system" storageKey="dbooster-ui-theme">
          <AuthProvider>
            <Router>
              <SkipToMainContent />
              <CriticalCSSLoader />
              <ResourcePreloader />
              <GlobalLoadingOverlay />
              <UpdateBanner />
              
              <div id="main-content">
                <Suspense fallback={<PageLoading />}>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<PublicLayout />}>
                      <Route index element={<Home />} />
                      <Route path="login" element={<Login />} />
                      <Route path="features" element={<Features />} />
                      <Route path="how-it-works" element={<HowItWorks />} />
                      <Route path="pricing" element={<Pricing />} />
                      <Route path="learn" element={<Learn />} />
                      <Route path="blog" element={<Blog />} />
                      <Route path="about" element={<About />} />
                      <Route path="contact" element={<Contact />} />
                      <Route path="support" element={<Support />} />
                      <Route path="privacy" element={<Privacy />} />
                      <Route path="terms" element={<Terms />} />
                      <Route path="accessibility" element={<Accessibility />} />
                      <Route path="ai-studio" element={<AIOptimizationStudio />} />
                      <Route path="search" element={<Search />} />
                      
                      {/* New public pages (removed careers route) */}
                      <Route path="enterprise" element={<Enterprise />} />
                      <Route path="database-types" element={<DatabaseTypes />} />
                      <Route path="use-cases" element={<UseCases />} />
                      <Route path="integrations" element={<Integrations />} />
                      <Route path="status" element={<Status />} />
                      <Route path="changelog" element={<Changelog />} />
                      <Route path="partners" element={<Partners />} />
                      <Route path="press" element={<Press />} />
                      <Route path="cookies" element={<Cookies />} />
                    </Route>
                    
                    {/* Protected authenticated routes */}
                    <Route path="/app" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                      <Route index element={<EnhancedDashboard />} />
                    </Route>
                    
                    <Route path="/queries" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                      <Route index element={<Queries />} />
                    </Route>
                    
                    <Route path="/repositories" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                      <Route index element={<Repositories />} />
                    </Route>
                    
                    <Route path="/reports" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                      <Route index element={<Reports />} />
                    </Route>

                    <Route path="/security" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                      <Route index element={<SecurityDashboardPage />} />
                    </Route>
                    
                    {/* 404 fallback */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </div>
              
              <Toaster 
                position="top-right"
                expand={true}
                richColors
                closeButton
              />
            </Router>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </EnhancedErrorBoundary>
  );
}

export default App;
