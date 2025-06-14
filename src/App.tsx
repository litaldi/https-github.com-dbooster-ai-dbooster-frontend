
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/auth-context';
import ProtectedRoute from '@/components/protected-route';
import { EnhancedErrorBoundary } from '@/components/ui/enhanced-error-boundary';
import { ThemeProvider } from '@/components/theme-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import './App.css';

// Pages
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import About from '@/pages/About';
import Features from '@/pages/Features';
import Pricing from '@/pages/Pricing';
import Contact from '@/pages/Contact';
import HowItWorks from '@/pages/HowItWorks';
import Learn from '@/pages/Learn';
import Blog from '@/pages/Blog';
import Support from '@/pages/Support';
import DocsHelp from '@/pages/DocsHelp';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';
import NotFound from '@/pages/NotFound';
import Repositories from '@/pages/Repositories';
import Queries from '@/pages/Queries';
import QueryOptimization from '@/pages/QueryOptimization';
import AIFeatures from '@/pages/AIFeatures';
import Reports from '@/pages/Reports';
import Settings from '@/pages/Settings';
import Account from '@/pages/Account';
import Teams from '@/pages/Teams';
import Approvals from '@/pages/Approvals';
import AuditLog from '@/pages/AuditLog';
import DbImport from '@/pages/DbImport';
import Sandbox from '@/pages/Sandbox';

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
            <Router>
              <div className="min-h-screen bg-background text-foreground">
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/features" element={<Features />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/how-it-works" element={<HowItWorks />} />
                  <Route path="/learn" element={<Learn />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/docs" element={<DocsHelp />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/privacy" element={<Privacy />} />

                  {/* Protected routes */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } />
                  <Route path="/repositories" element={
                    <ProtectedRoute>
                      <Repositories />
                    </ProtectedRoute>
                  } />
                  <Route path="/queries" element={
                    <ProtectedRoute>
                      <Queries />
                    </ProtectedRoute>
                  } />
                  <Route path="/optimization" element={
                    <ProtectedRoute>
                      <QueryOptimization />
                    </ProtectedRoute>
                  } />
                  <Route path="/ai" element={
                    <ProtectedRoute>
                      <AIFeatures />
                    </ProtectedRoute>
                  } />
                  <Route path="/reports" element={
                    <ProtectedRoute>
                      <Reports />
                    </ProtectedRoute>
                  } />
                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  } />
                  <Route path="/account" element={
                    <ProtectedRoute>
                      <Account />
                    </ProtectedRoute>
                  } />
                  <Route path="/teams" element={
                    <ProtectedRoute>
                      <Teams />
                    </ProtectedRoute>
                  } />
                  <Route path="/approvals" element={
                    <ProtectedRoute>
                      <Approvals />
                    </ProtectedRoute>
                  } />
                  <Route path="/audit" element={
                    <ProtectedRoute>
                      <AuditLog />
                    </ProtectedRoute>
                  } />
                  <Route path="/import" element={
                    <ProtectedRoute>
                      <DbImport />
                    </ProtectedRoute>
                  } />
                  <Route path="/sandbox" element={
                    <ProtectedRoute>
                      <Sandbox />
                    </ProtectedRoute>
                  } />

                  {/* 404 route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
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
