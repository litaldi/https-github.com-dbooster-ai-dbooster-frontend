
import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/auth-context';
import { ThemeProvider } from '@/components/theme-provider';
import { NotificationProvider } from '@/components/ui/enhanced-notification-system';

// Layouts
import { PublicLayout } from '@/components/PublicLayout';
import Layout from '@/components/layout';
import ProtectedRoute from '@/components/protected-route';

// Public Pages
import Home from '@/pages/Home';
import FeaturesPage from '@/pages/FeaturesPage';
import HowItWorksPage from '@/pages/HowItWorksPage';
import AIStudioPage from '@/pages/AIStudioPage';
import DemoPage from '@/pages/DemoPage';
import PricingPage from '@/pages/PricingPage';
import ForDevelopersPage from '@/pages/ForDevelopersPage';
import ForTeamsPage from '@/pages/ForTeamsPage';
import ForEnterprisesPage from '@/pages/ForEnterprisesPage';
import UseCasesPage from '@/pages/UseCasesPage';
import LearnPage from '@/pages/LearnPage';
import BlogPage from '@/pages/BlogPage';
import FAQPage from '@/pages/FAQPage';
import SupportPage from '@/pages/SupportPage';
import StatusPage from '@/pages/StatusPage';
import ChangelogPage from '@/pages/ChangelogPage';
import AboutPage from '@/pages/AboutPage';
import ContactPage from '@/pages/ContactPage';
import PartnersPage from '@/pages/PartnersPage';
import PressPage from '@/pages/PressPage';
import CareersPage from '@/pages/CareersPage';
import LoginPage from '@/pages/LoginPage';
import SearchPage from '@/pages/SearchPage';

// Legal Pages
import TermsPage from '@/pages/legal/TermsPage';
import PrivacyPage from '@/pages/legal/PrivacyPage';
import CookiesPage from '@/pages/legal/CookiesPage';
import SecurityPage from '@/pages/legal/SecurityPage';
import AccessibilityPage from '@/pages/legal/AccessibilityPage';

// Dashboard Pages
import Dashboard from '@/pages/Dashboard';
import AnalyticsPage from '@/pages/app/AnalyticsPage';
import QueriesPage from '@/pages/app/QueriesPage';
import RepositoriesPage from '@/pages/app/RepositoriesPage';
import AIStudioAppPage from '@/pages/app/AIStudioAppPage';
import ReportsPage from '@/pages/app/ReportsPage';
import MonitoringPage from '@/pages/app/MonitoringPage';
import SettingsPage from '@/pages/app/SettingsPage';
import AccountPage from '@/pages/app/AccountPage';
import DashboardPage from '@/pages/app/DashboardPage';

// Lazy load the security dashboard
const SecurityDashboardPage = React.lazy(() => 
  import('@/components/security/SecurityDashboardPage').then(m => ({
    default: m.SecurityDashboardPage
  }))
);

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="dbooster-ui-theme">
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<PublicLayout />}>
                  <Route index element={<Home />} />
                  <Route path="home" element={<Navigate to="/" replace />} />
                  
                  {/* Product Routes */}
                  <Route path="features" element={<FeaturesPage />} />
                  <Route path="how-it-works" element={<HowItWorksPage />} />
                  <Route path="ai-studio" element={<AIStudioPage />} />
                  <Route path="demo" element={<DemoPage />} />
                  <Route path="pricing" element={<PricingPage />} />
                  
                  {/* Solutions Routes */}
                  <Route path="for-developers" element={<ForDevelopersPage />} />
                  <Route path="for-teams" element={<ForTeamsPage />} />
                  <Route path="for-enterprises" element={<ForEnterprisesPage />} />
                  <Route path="use-cases" element={<UseCasesPage />} />
                  
                  {/* Resources Routes */}
                  <Route path="learn" element={<LearnPage />} />
                  <Route path="blog" element={<BlogPage />} />
                  <Route path="faq" element={<FAQPage />} />
                  <Route path="support" element={<SupportPage />} />
                  <Route path="status" element={<StatusPage />} />
                  <Route path="changelog" element={<ChangelogPage />} />
                  
                  {/* Company Routes */}
                  <Route path="about" element={<AboutPage />} />
                  <Route path="contact" element={<ContactPage />} />
                  <Route path="partners" element={<PartnersPage />} />
                  <Route path="press" element={<PressPage />} />
                  <Route path="careers" element={<CareersPage />} />
                  
                  {/* Legal Routes */}
                  <Route path="terms" element={<TermsPage />} />
                  <Route path="privacy" element={<PrivacyPage />} />
                  <Route path="cookies" element={<CookiesPage />} />
                  <Route path="security" element={<SecurityPage />} />
                  <Route path="accessibility" element={<AccessibilityPage />} />
                  
                  {/* Auth & Search */}
                  <Route path="login" element={<LoginPage />} />
                  <Route path="search" element={<SearchPage />} />
                </Route>

                {/* Protected Dashboard Routes */}
                <Route path="/app" element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }>
                  <Route index element={<Dashboard />} />
                  <Route path="dashboard-alt" element={<DashboardPage />} />
                  <Route path="analytics" element={<AnalyticsPage />} />
                  <Route path="queries" element={<QueriesPage />} />
                  <Route path="repositories" element={<RepositoriesPage />} />
                  <Route path="ai-studio" element={<AIStudioAppPage />} />
                  <Route path="reports" element={<ReportsPage />} />
                  <Route path="monitoring" element={<MonitoringPage />} />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="account" element={<AccountPage />} />
                  <Route path="security" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <SecurityDashboardPage />
                    </Suspense>
                  } />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
            <Toaster 
              position="top-right" 
              richColors 
              theme="dark"
              toastOptions={{
                style: {
                  background: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  color: 'hsl(var(--foreground))',
                },
              }}
            />
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
