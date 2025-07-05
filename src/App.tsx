
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/auth-context';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { productionConsole } from '@/utils/productionConsoleCleanup';
import { productionInitializer } from '@/utils/productionInit';
import { productionLogger } from '@/utils/productionLogger';

// Page imports
import HomePage from '@/pages/Home';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import About from '@/pages/About';
import Contact from '@/pages/Contact';
import Features from '@/pages/Features';
import Pricing from '@/pages/Pricing';
import Learn from '@/pages/Learn';
import FAQ from '@/pages/FAQ';
import Support from '@/pages/Support';
import Terms from '@/pages/Terms';
import Privacy from '@/pages/Privacy';
import Cookies from '@/pages/Cookies';
import NotFound from '@/pages/NotFound';

// Layout components
import { MainNav } from '@/components/navigation/MainNav';
import { EnhancedFooter } from '@/components/navigation/EnhancedFooter';

function App() {
  useEffect(() => {
    const initializeSecureApp = async () => {
      try {
        productionConsole.initializeConsoleCleanup();
        await productionInitializer.initialize();
        
        productionLogger.info('Application initialized successfully', {
          environment: import.meta.env.MODE,
          timestamp: new Date().toISOString()
        }, 'App');
      } catch (error) {
        productionLogger.error('Application initialization failed', error, 'App');
      }
    };

    initializeSecureApp();
  }, []);

  return (
    <ThemeProvider defaultTheme="system" storageKey="dbooster-theme">
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background font-sans antialiased flex flex-col">
            <MainNav />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/app" element={<Dashboard />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/features" element={<Features />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/learn" element={<Learn />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/support" element={<Support />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/cookies" element={<Cookies />} />
                
                {/* Placeholder routes for new pages */}
                <Route path="/how-it-works" element={<div className="p-8 text-center"><h1 className="text-2xl font-bold">How It Works</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
                <Route path="/ai-studio" element={<div className="p-8 text-center"><h1 className="text-2xl font-bold">AI Studio</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
                <Route path="/demo" element={<div className="p-8 text-center"><h1 className="text-2xl font-bold">Demo Mode</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
                <Route path="/for-developers" element={<div className="p-8 text-center"><h1 className="text-2xl font-bold">For Developers</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
                <Route path="/for-teams" element={<div className="p-8 text-center"><h1 className="text-2xl font-bold">For Teams</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
                <Route path="/for-enterprises" element={<div className="p-8 text-center"><h1 className="text-2xl font-bold">For Enterprises</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
                <Route path="/use-cases" element={<div className="p-8 text-center"><h1 className="text-2xl font-bold">Use Cases</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
                <Route path="/blog" element={<div className="p-8 text-center"><h1 className="text-2xl font-bold">Blog</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
                <Route path="/status" element={<div className="p-8 text-center"><h1 className="text-2xl font-bold">System Status</h1><p className="text-muted-foreground">All systems operational</p></div>} />
                <Route path="/changelog" element={<div className="p-8 text-center"><h1 className="text-2xl font-bold">Changelog</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
                <Route path="/partners" element={<div className="p-8 text-center"><h1 className="text-2xl font-bold">Partners</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
                <Route path="/press" element={<div className="p-8 text-center"><h1 className="text-2xl font-bold">Press Kit</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
                <Route path="/careers" element={<div className="p-8 text-center"><h1 className="text-2xl font-bold">Careers</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
                <Route path="/security" element={<div className="p-8 text-center"><h1 className="text-2xl font-bold">Security</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
                <Route path="/accessibility" element={<div className="p-8 text-center"><h1 className="text-2xl font-bold">Accessibility</h1><p className="text-muted-foreground">Coming soon...</p></div>} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <EnhancedFooter />
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
