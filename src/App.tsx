import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/auth-context';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import Layout from '@/components/layout';
import ProtectedRoute from '@/components/protected-route';

// Pages
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Queries from '@/pages/Queries';
import QueryOptimization from '@/pages/QueryOptimization';
import Repositories from '@/pages/Repositories';
import Reports from '@/pages/Reports';
import Settings from '@/pages/Settings';
import Teams from '@/pages/Teams';
import Account from '@/pages/Account';
import Approvals from '@/pages/Approvals';
import AuditLog from '@/pages/AuditLog';
import Sandbox from '@/pages/Sandbox';
import DbImport from '@/pages/DbImport';
import HowItWorks from '@/pages/HowItWorks';
import Features from '@/pages/Features';
import Pricing from '@/pages/Pricing';
import Learn from '@/pages/Learn';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Support from '@/pages/Support';
import Blog from '@/pages/Blog';
import DocsHelp from '@/pages/DocsHelp';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';
import Accessibility from '@/pages/Accessibility';
import AIFeatures from '@/pages/AIFeatures';
import Error404 from '@/pages/Error404';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/features" element={<Features />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/support" element={<Support />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/docs" element={<DocsHelp />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/accessibility" element={<Accessibility />} />
              <Route path="/ai-features" element={<AIFeatures />} />

              {/* Protected routes */}
              <Route path="/app" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="queries" element={<Queries />} />
                <Route path="query-optimization" element={<QueryOptimization />} />
                <Route path="repositories" element={<Repositories />} />
                <Route path="reports" element={<Reports />} />
                <Route path="settings" element={<Settings />} />
                <Route path="teams" element={<Teams />} />
                <Route path="account" element={<Account />} />
                <Route path="approvals" element={<Approvals />} />
                <Route path="audit-log" element={<AuditLog />} />
                <Route path="sandbox" element={<Sandbox />} />
                <Route path="db-import" element={<DbImport />} />
              </Route>

              {/* 404 - Updated to use Error404 instead of NotFound */}
              <Route path="*" element={<Error404 />} />
            </Routes>
          </Router>
          <Toaster />
          <Sonner />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
