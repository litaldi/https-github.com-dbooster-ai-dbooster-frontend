import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { QueryClient } from '@tanstack/react-query';

import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Profile from '@/pages/Profile';
import Admin from '@/pages/Admin';
import NotFound from '@/pages/NotFound';
import Unauthorized from '@/pages/Unauthorized';
import RequireAuth from '@/components/RequireAuth';
import ProtectedRoute from '@/components/protected-route';
import { SecurityHeadersProvider } from '@/components/SecurityHeadersProvider';

function App() {
  return (
    <QueryClient>
      <BrowserRouter>
        <SecurityHeadersProvider>
          <div className="min-h-screen bg-background">
            <Toaster />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <RequireAuth>
                      <Profile />
                    </RequireAuth>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <RequireAuth requiredRole="admin">
                      <Admin />
                    </RequireAuth>
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </SecurityHeadersProvider>
      </BrowserRouter>
    </QueryClient>
  );
}

export default App;
