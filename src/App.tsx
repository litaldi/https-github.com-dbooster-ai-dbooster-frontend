
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { EnhancedErrorBoundary } from '@/components/ui/enhanced-error-boundary';
import { ThemeProvider } from '@/components/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/auth-context';
import { AccessibilityEnhancements } from '@/components/ui/accessibility-enhancements';
import { lazy, Suspense } from 'react';
import { GlobalLoadingOverlay } from '@/components/ui/GlobalLoadingOverlay';
import ProtectedRoute from '@/components/protected-route';
import Layout from '@/components/layout';
import { PublicLayout } from '@/components/layout/PublicLayout';
import './App.css';

// Lazy load components for better performance
const Home = lazy(() => import('@/pages/Home'));
const Login = lazy(() => import('@/pages/Login'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const About = lazy(() => import('@/pages/About'));
const Features = lazy(() => import('@/pages/Features'));
const Pricing = lazy(() => import('@/pages/Pricing'));
const Contact = lazy(() => import('@/pages/Contact'));
const HowItWorks = lazy(() => import('@/pages/HowItWorks'));
const Learn = lazy(() => import('@/pages/Learn'));
const Blog = lazy(() => import('@/pages/Blog'));
const Support = lazy(() => import('@/pages/Support'));
const DocsHelp = lazy(() => import('@/pages/DocsHelp'));
const Terms = lazy(() => import('@/pages/Terms'));
const Privacy = lazy(() => import('@/pages/Privacy'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const Repositories = lazy(() => import('@/pages/Repositories'));
const Queries = lazy(() => import('@/pages/Queries'));
const QueryOptimization = lazy(() => import('@/pages/QueryOptimization'));
const AIFeatures = lazy(() => import('@/pages/AIFeatures'));
const Reports = lazy(() => import('@/pages/Reports'));
const Settings = lazy(() => import('@/pages/Settings'));
const Account = lazy(() => import('@/pages/Account'));
const Teams = lazy(() => import('@/pages/Teams'));
const Approvals = lazy(() => import('@/pages/Approvals'));
const AuditLog = lazy(() => import('@/pages/AuditLog'));
const DbImport = lazy(() => import('@/pages/DbImport'));
const Sandbox = lazy(() => import('@/pages/Sandbox'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
});

function App() {
  return (
    <EnhancedErrorBoundary>
      <ThemeProvider defaultTheme="system" storageKey="dbooster-theme">
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <AccessibilityEnhancements />
            <Router>
              <div className="min-h-screen bg-background text-foreground">
                <Suspense fallback={<GlobalLoadingOverlay />}>
                  <Routes>
                    {/* Public routes with public layout */}
                    <Route path="/" element={<PublicLayout />}>
                      <Route index element={<Home />} />
                      <Route path="login" element={<Login />} />
                      <Route path="about" element={<About />} />
                      <Route path="features" element={<Features />} />
                      <Route path="pricing" element={<Pricing />} />
                      <Route path="contact" element={<Contact />} />
                      <Route path="how-it-works" element={<HowItWorks />} />
                      <Route path="learn" element={<Learn />} />
                      <Route path="blog" element={<Blog />} />
                      <Route path="support" element={<Support />} />
                      <Route path="docs" element={<DocsHelp />} />
                      <Route path="terms" element={<Terms />} />
                      <Route path="privacy" element={<Privacy />} />
                    </Route>

                    {/* Protected routes with authenticated layout */}
                    <Route path="/" element={
                      <ProtectedRoute>
                        <Layout />
                      </ProtectedRoute>
                    }>
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="repositories" element={<Repositories />} />
                      <Route path="queries" element={<Queries />} />
                      <Route path="optimization" element={<QueryOptimization />} />
                      <Route path="ai" element={<AIFeatures />} />
                      <Route path="reports" element={<Reports />} />
                      <Route path="settings" element={<Settings />} />
                      <Route path="account" element={<Account />} />
                      <Route path="teams" element={<Teams />} />
                      <Route path="approvals" element={<Approvals />} />
                      <Route path="audit" element={<AuditLog />} />
                      <Route path="import" element={<DbImport />} />
                      <Route path="sandbox" element={<Sandbox />} />
                    </Route>

                    {/* 404 route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </div>
              <Toaster />
            </Router>
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </EnhancedErrorBoundary>
  );
}

export default App;
