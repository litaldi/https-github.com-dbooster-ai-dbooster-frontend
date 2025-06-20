
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/auth-context";
import { EnhancedSecurityHeaders } from "@/middleware/enhancedSecurityHeaders";
import { SecurityEnhancementBanner } from "@/components/security/SecurityEnhancementBanner";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import ProtectedRoute from "./components/protected-route";
import { useEffect } from "react";

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    // Apply enhanced security headers on app load
    EnhancedSecurityHeaders.applyToDocument();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <SecurityEnhancementBanner />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Login />} />
              <Route 
                path="/app/*" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
