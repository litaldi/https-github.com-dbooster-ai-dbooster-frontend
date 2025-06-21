
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/contexts/auth-context';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';
import { PublicLayout } from '@/components/PublicLayout';
import { GlobalLoadingOverlay } from '@/components/ui/GlobalLoadingOverlay';

// Pages
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Features from '@/pages/Features';
import HowItWorks from '@/pages/HowItWorks';
import Pricing from '@/pages/Pricing';
import Learn from '@/pages/Learn';
import Blog from '@/pages/Blog';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Support from '@/pages/Support';
import Privacy from '@/pages/Privacy';
import Terms from '@/pages/Terms';
import Accessibility from '@/pages/Accessibility';
import { NotFound } from '@/components/error/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
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
            <GlobalLoadingOverlay />
            <Routes>
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
                <Route path="app/*" element={<Dashboard />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
            <Toaster />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
