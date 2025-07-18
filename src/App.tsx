
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/auth-context";

// Layout Components
import { StandardPageLayout } from "@/components/layout/StandardPageLayout";
import Navigation from "@/components/navigation/Navigation";
import Footer from "@/components/navigation/Footer";

// Pages
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import DashboardPage from "./pages/app/DashboardPage";
import DemoPage from "./pages/DemoPage";
import TestingDashboard from "./pages/TestingDashboard";

// Import all other page components
import FeaturesPage from "./pages/FeaturesPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import AIStudioPage from "./pages/AIStudioPage";
import PricingPage from "./pages/PricingPage";
import ForDevelopersPage from "./pages/ForDevelopersPage";
import ForTeamsPage from "./pages/ForTeamsPage";
import ForEnterprisesPage from "./pages/ForEnterprisesPage";
import UseCasesPage from "./pages/UseCasesPage";
import LearnPage from "./pages/LearnPage";
import BlogPage from "./pages/BlogPage";
import FAQPage from "./pages/FAQPage";
import SupportPage from "./pages/SupportPage";
import StatusPage from "./pages/StatusPage";
import ChangelogPage from "./pages/ChangelogPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import PartnersPage from "./pages/PartnersPage";
import PressPage from "./pages/PressPage";
import CareersPage from "./pages/CareersPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import CookiesPage from "./pages/CookiesPage";
import SecurityPage from "./pages/SecurityPage";
import AccessibilityPage from "./pages/AccessibilityPage";
import LoginPage from "./pages/LoginPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
        <TooltipProvider>
          <BrowserRouter>
            <AuthProvider>
              <div className="min-h-screen flex flex-col">
                <Navigation />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/features" element={<FeaturesPage />} />
                    <Route path="/how-it-works" element={<HowItWorksPage />} />
                    <Route path="/ai-studio" element={<AIStudioPage />} />
                    <Route path="/demo" element={<DemoPage />} />
                    <Route path="/pricing" element={<PricingPage />} />
                    <Route path="/for-developers" element={<ForDevelopersPage />} />
                    <Route path="/for-teams" element={<ForTeamsPage />} />
                    <Route path="/for-enterprises" element={<ForEnterprisesPage />} />
                    <Route path="/use-cases" element={<UseCasesPage />} />
                    <Route path="/learn" element={<LearnPage />} />
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/faq" element={<FAQPage />} />
                    <Route path="/support" element={<SupportPage />} />
                    <Route path="/status" element={<StatusPage />} />
                    <Route path="/changelog" element={<ChangelogPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/partners" element={<PartnersPage />} />
                    <Route path="/press" element={<PressPage />} />
                    <Route path="/careers" element={<CareersPage />} />
                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/privacy" element={<PrivacyPage />} />
                    <Route path="/cookies" element={<CookiesPage />} />
                    <Route path="/security" element={<SecurityPage />} />
                    <Route path="/accessibility" element={<AccessibilityPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/app" element={<Dashboard />} />
                    <Route path="/app/dashboard-alt" element={<DashboardPage />} />
                    <Route path="/testing" element={<TestingDashboard />} />
                    <Route path="*" element={
                      <StandardPageLayout
                        title="Page Not Found"
                        subtitle="404 Error"
                        description="The page you're looking for doesn't exist."
                      >
                        <div className="text-center py-12">
                          <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                          <p className="text-gray-600 mb-8">Sorry, we couldn't find the page you're looking for.</p>
                          <a href="/" className="text-primary hover:underline">Go back home</a>
                        </div>
                      </StandardPageLayout>
                    } />
                  </Routes>
                </main>
                <Footer />
              </div>
              <Toaster />
              <Sonner />
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
