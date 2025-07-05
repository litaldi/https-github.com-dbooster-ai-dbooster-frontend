
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/auth-context';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';
import { EnhancedErrorBoundary } from '@/components/ui/enhanced-error-boundary';
import { PublicLayout } from '@/components/PublicLayout';
import { GlobalLoadingOverlay } from '@/components/ui/GlobalLoadingOverlay';
import { UpdateBanner } from '@/components/ui/update-banner';
import Layout from '@/components/layout';
import ProtectedRoute from '@/components/protected-route';
import { ResourcePreloader, CriticalCSSLoader } from '@/components/ui/critical-css-loader';
import { appInitializer } from '@/utils/appInitializer';
import { useEffect } from 'react';

// Lazy load pages for better performance
import { lazy, Suspense } from 'react';
import { PageLoading } from '@/components/ui/loading-states';

// Critical pages (loaded immediately)
import EnhancedHome from '@/pages/EnhancedHome';
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

// New pages
const Documentation = lazy(() => import('@/pages/Documentation'));
const Status = lazy(() => import('@/pages/Status'));
const ReleaseNotes = lazy(() => import('@/pages/ReleaseNotes'));
const Components = lazy(() => import('@/pages/Components'));
const FAQ = lazy(() => import('@/pages/FAQ'));
const Account = lazy(() => import('@/pages/Account'));
const Settings = lazy(() => import('@/pages/Settings'));
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
              <CriticalCSSLoader />
              <ResourcePreloader />
              <GlobalLoadingOverlay />
              <UpdateBanner />
              
              <Suspense fallback={<PageLoading />}>
                <Routes>
                  {/* Public routes with PublicLayout */}
                  <Route path="/" element={<PublicLayout />}>
                    <Route index element={<EnhancedHome />} />
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
                    
                    {/* New documentation and utility pages */}
                    <Route path="docs" element={<Documentation />} />
                    <Route path="status" element={<Status />} />
                    <Route path="releases" element={<ReleaseNotes />} />
                    <Route path="components" element={<Components />} />
                    <Route path="faq" element={<FAQ />} />
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

                  {/* User settings routes */}
                  <Route path="/account" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                    <Route index element={<Account />} />
                  </Route>
                  
                  <Route path="/settings" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                    <Route index element={<Settings />} />
                  </Route>
                  
                  {/* 404 fallback */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
              
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
