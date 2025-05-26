
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/auth-context";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Repositories from "./pages/Repositories";
import Queries from "./pages/Queries";
import QueryOptimization from "./pages/QueryOptimization";
import Account from "./pages/Account";
import Settings from "./pages/Settings";
import Reports from "./pages/Reports";
import Teams from "./pages/Teams";
import ProtectedRoute from "./components/protected-route";
import Layout from "./components/layout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="dbooster-theme">
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="repositories" element={<Repositories />} />
                <Route path="queries" element={<Queries />} />
                <Route path="queries/:id" element={<QueryOptimization />} />
                <Route path="account" element={<Account />} />
                <Route path="settings" element={<Settings />} />
                <Route path="reports" element={<Reports />} />
                <Route path="teams" element={<Teams />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
