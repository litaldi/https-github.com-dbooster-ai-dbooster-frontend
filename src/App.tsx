
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
import { NotFound } from '@/components/error/NotFound';

// Layout components
import { MainNav } from '@/components/navigation/MainNav';

function App() {
  useEffect(() => {
    const initializeSecureApp = async () => {
      try {
        // Initialize production console cleanup
        productionConsole.initializeConsoleCleanup();
        
        // Initialize production settings
        await productionInitializer.initialize();
        
        // Log successful initialization
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
          <div className="min-h-screen bg-background font-sans antialiased">
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
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
