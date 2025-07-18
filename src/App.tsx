import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { Navigation } from "@/components/Navigation";
import Index from "./pages/Index";
import { SecurityStatusIndicator } from "@/components/security/SecurityStatusIndicator";

// Import enhanced security initialization
import "@/services/security/securityInitializationManager";
import AuthRoutes from "./routes/AuthRoutes";
import ProfilePage from "./pages/app/ProfilePage";
import SettingsPage from "./pages/app/SettingsPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import MonitoringPage from "./pages/app/MonitoringPage";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { AppRoutes } from "./routes/AppRoutes";
import { GuestRoutes } from "./routes/GuestRoutes";
import { useConsolidatedSecurity } from "@/hooks/useConsolidatedSecurity";
import { SecurityDashboardPage } from "./components/security/SecurityDashboardPage";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <div className="min-h-screen bg-background">
              <Navigation />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth/*" element={<AuthRoutes />} />

                {/* App Routes - Protected */}
                <Route element={<AppRoutes />}>
                  <Route path="/app/profile" element={<ProfilePage />} />
                  <Route path="/app/settings" element={<SettingsPage />} />
                  <Route path="/app/monitoring" element={<MonitoringPage />} />
                  <Route path="/app/security" element={<SecurityDashboardPage />} />
                </Route>

                {/* Admin Routes - Protected */}
                <Route element={<AppRoutes requireAdmin={true} />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                </Route>

                {/* Guest Routes - No Auth Required */}
                <Route element={<GuestRoutes />}>
                  {/* Add guest-only routes here if needed */}
                </Route>
              </Routes>
              <SecurityStatusIndicator />
            </div>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
