
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/auth-context';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';
import { CleanLayout } from '@/components/layout/CleanLayout';
import { NotFound } from '@/components/common/NotFound';
import Layout from '@/components/layout';
import ProtectedRoute from '@/components/protected-route';
import { ROUTES } from '@/utils/constants';

// Lazy load pages for better performance
import { lazy, Suspense } from 'react';

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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function PageLoading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="dbooster-ui-theme">
        <AuthProvider>
          <Router>
            <Suspense fallback={<PageLoading />}>
              <Routes>
                {/* Public routes with clean layout */}
                <Route path="/" element={<CleanLayout />}>
                  <Route index element={<EnhancedHome />} />
                  <Route path={ROUTES.LOGIN} element={<Login />} />
                  <Route path={ROUTES.FEATURES} element={<Features />} />
                  <Route path={ROUTES.HOW_IT_WORKS} element={<HowItWorks />} />
                  <Route path={ROUTES.PRICING} element={<Pricing />} />
                  <Route path={ROUTES.LEARN} element={<Learn />} />
                  <Route path={ROUTES.BLOG} element={<Blog />} />
                  <Route path={ROUTES.ABOUT} element={<About />} />
                  <Route path={ROUTES.CONTACT} element={<Contact />} />
                  <Route path={ROUTES.SUPPORT} element={<Support />} />
                  <Route path={ROUTES.PRIVACY} element={<Privacy />} />
                  <Route path={ROUTES.TERMS} element={<Terms />} />
                  <Route path={ROUTES.ACCESSIBILITY} element={<Accessibility />} />
                  <Route path={ROUTES.AI_STUDIO} element={<AIOptimizationStudio />} />
                </Route>
                
                {/* Protected authenticated routes */}
                <Route path={ROUTES.APP} element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                  <Route index element={<EnhancedDashboard />} />
                </Route>
                
                <Route path={ROUTES.QUERIES} element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                  <Route index element={<Queries />} />
                </Route>
                
                <Route path={ROUTES.REPOSITORIES} element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                  <Route index element={<Repositories />} />
                </Route>
                
                <Route path={ROUTES.REPORTS} element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                  <Route index element={<Reports />} />
                </Route>

                <Route path={ROUTES.SECURITY} element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                  <Route index element={<SecurityDashboardPage />} />
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
  );
}

export default App;
