
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/auth-context";
import { EnhancedMainNav } from "@/components/navigation/EnhancedMainNav";
import { SecurityStatusIndicator } from "@/components/security/SecurityStatusIndicator";

// Import enhanced security initialization
import "@/services/security/securityInitializationManager";
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
              <EnhancedMainNav />
              <Routes>
                <Route path="/" element={<SecurityDashboardPage />} />
                <Route path="/app/security" element={<SecurityDashboardPage />} />
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
