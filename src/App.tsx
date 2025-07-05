
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Home from "./pages/Home";
import Features from "./pages/Features";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import EnhancedDashboard from "./pages/EnhancedDashboard";
import Queries from "./pages/Queries";
import Repositories from "./pages/Repositories";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Teams from "./pages/Teams";
import Support from "./pages/Support";
import Learn from "./pages/Learn";
import Blog from "./pages/Blog";
import HowItWorks from "./pages/HowItWorks";
import UseCases from "./pages/UseCases";
import Integrations from "./pages/Integrations";
import Enterprise from "./pages/Enterprise";
import Partners from "./pages/Partners";
import Careers from "./pages/Careers";
import Press from "./pages/Press";
import Status from "./pages/Status";
import Changelog from "./pages/Changelog";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Cookies from "./pages/Cookies";
import Accessibility from "./pages/Accessibility";
import AIFeatures from "./pages/AIFeatures";
import QueryOptimization from "./pages/QueryOptimization";
import DatabaseTypes from "./pages/DatabaseTypes";
import AIOptimizationStudio from "./pages/AIOptimizationStudio";
import Account from "./pages/Account";
import Approvals from "./pages/Approvals";
import AuditLog from "./pages/AuditLog";
import DbImport from "./pages/DbImport";
import DocsHelp from "./pages/DocsHelp";
import Sandbox from "./pages/Sandbox";
import Search from "./pages/Search";
import Error500 from "./pages/Error500";
import { PublicLayout } from "./components/PublicLayout";
import { EnhancedLayout } from "./components/layout/EnhancedLayout";
import { ProtectedRoute } from "./components/protected-route";
import { MaintenanceMode } from "./components/error/MaintenanceMode";
import { NotFound } from "./components/error/NotFound";
import { useSystemStatus } from "./hooks/useSystemStatus";

const queryClient = new QueryClient();

function App() {
  const { isMaintenanceMode } = useSystemStatus();

  if (isMaintenanceMode) {
    return <MaintenanceMode />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              {/* Public routes with PublicLayout */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/features" element={<Features />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/learn" element={<Learn />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/use-cases" element={<UseCases />} />
                <Route path="/integrations" element={<Integrations />} />
                <Route path="/enterprise" element={<Enterprise />} />
                <Route path="/partners" element={<Partners />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/press" element={<Press />} />
                <Route path="/status" element={<Status />} />
                <Route path="/changelog" element={<Changelog />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/cookies" element={<Cookies />} />
                <Route path="/accessibility" element={<Accessibility />} />
                <Route path="/ai-features" element={<AIFeatures />} />
                <Route path="/query-optimization" element={<QueryOptimization />} />
                <Route path="/database-types" element={<DatabaseTypes />} />
                <Route path="/support" element={<Support />} />
                <Route path="/search" element={<Search />} />
                <Route path="/500" element={<Error500 />} />
              </Route>

              {/* Protected routes with EnhancedLayout */}
              <Route element={<ProtectedRoute><EnhancedLayout /></ProtectedRoute>}>
                <Route path="/app" element={<EnhancedDashboard />} />
                <Route path="/queries" element={<Queries />} />
                <Route path="/repositories" element={<Repositories />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/teams" element={<Teams />} />
                <Route path="/ai-studio" element={<AIOptimizationStudio />} />
                <Route path="/account" element={<Account />} />
                <Route path="/approvals" element={<Approvals />} />
                <Route path="/audit-log" element={<AuditLog />} />
                <Route path="/db-import" element={<DbImport />} />
                <Route path="/docs-help" element={<DocsHelp />} />
                <Route path="/sandbox" element={<Sandbox />} />
              </Route>

              {/* 404 route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
