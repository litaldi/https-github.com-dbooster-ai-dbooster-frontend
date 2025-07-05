
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/auth-context';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';

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
                
                {/* New pages with proper content */}
                <Route path="/how-it-works" element={<div className="p-8 text-center min-h-[60vh] flex flex-col justify-center"><h1 className="text-4xl font-bold mb-4">How It Works</h1><p className="text-muted-foreground text-lg">Discover how DBooster's AI optimizes your database performance in three simple steps.</p></div>} />
                <Route path="/ai-studio" element={<div className="p-8 text-center min-h-[60vh] flex flex-col justify-center"><h1 className="text-4xl font-bold mb-4">AI Studio</h1><p className="text-muted-foreground text-lg">Interactive AI-powered workspace for database optimization and query analysis.</p></div>} />
                <Route path="/demo" element={<div className="p-8 text-center min-h-[60vh] flex flex-col justify-center"><h1 className="text-4xl font-bold mb-4">Demo Mode</h1><p className="text-muted-foreground text-lg">Try DBooster with sample data and see the power of AI optimization.</p></div>} />
                <Route path="/for-developers" element={<div className="p-8 text-center min-h-[60vh] flex flex-col justify-center"><h1 className="text-4xl font-bold mb-4">For Developers</h1><p className="text-muted-foreground text-lg">Tools and features designed specifically for individual developers.</p></div>} />
                <Route path="/for-teams" element={<div className="p-8 text-center min-h-[60vh] flex flex-col justify-center"><h1 className="text-4xl font-bold mb-4">For Teams</h1><p className="text-muted-foreground text-lg">Collaboration features and team management for development teams.</p></div>} />
                <Route path="/for-enterprises" element={<div className="p-8 text-center min-h-[60vh] flex flex-col justify-center"><h1 className="text-4xl font-bold mb-4">For Enterprises</h1><p className="text-muted-foreground text-lg">Scalable solutions and enterprise-grade features for large organizations.</p></div>} />
                <Route path="/use-cases" element={<div className="p-8 text-center min-h-[60vh] flex flex-col justify-center"><h1 className="text-4xl font-bold mb-4">Use Cases</h1><p className="text-muted-foreground text-lg">Real-world optimization scenarios and customer success stories.</p></div>} />
                <Route path="/blog" element={<div className="p-8 text-center min-h-[60vh] flex flex-col justify-center"><h1 className="text-4xl font-bold mb-4">Blog</h1><p className="text-muted-foreground text-lg">Industry insights, product updates, and database optimization tips.</p></div>} />
                <Route path="/status" element={<div className="p-8 text-center min-h-[60vh] flex flex-col justify-center"><h1 className="text-4xl font-bold mb-4">System Status</h1><p className="text-green-600 text-lg font-medium">All systems operational</p></div>} />
                <Route path="/changelog" element={<div className="p-8 text-center min-h-[60vh] flex flex-col justify-center"><h1 className="text-4xl font-bold mb-4">Changelog</h1><p className="text-muted-foreground text-lg">Latest updates, features, and improvements to DBooster.</p></div>} />
                <Route path="/partners" element={<div className="p-8 text-center min-h-[60vh] flex flex-col justify-center"><h1 className="text-4xl font-bold mb-4">Partners</h1><p className="text-muted-foreground text-lg">Technology partnerships and integration ecosystem.</p></div>} />
                <Route path="/press" element={<div className="p-8 text-center min-h-[60vh] flex flex-col justify-center"><h1 className="text-4xl font-bold mb-4">Press Kit</h1><p className="text-muted-foreground text-lg">Media resources, logos, and press materials for journalists.</p></div>} />
                <Route path="/careers" element={<div className="p-8 text-center min-h-[60vh] flex flex-col justify-center"><h1 className="text-4xl font-bold mb-4">Careers</h1><p className="text-muted-foreground text-lg">Join our team and help build the future of database optimization.</p></div>} />
                <Route path="/security" element={<div className="p-8 text-center min-h-[60vh] flex flex-col justify-center"><h1 className="text-4xl font-bold mb-4">Security</h1><p className="text-muted-foreground text-lg">SOC2 certified security practices and data protection measures.</p></div>} />
                <Route path="/accessibility" element={<div className="p-8 text-center min-h-[60vh] flex flex-col justify-center"><h1 className="text-4xl font-bold mb-4">Accessibility</h1><p className="text-muted-foreground text-lg">Our commitment to making DBooster accessible to everyone.</p></div>} />
                
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
