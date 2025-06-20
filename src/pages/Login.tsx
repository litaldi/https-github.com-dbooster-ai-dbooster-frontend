
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { EnhancedAuthForm } from '@/components/auth/EnhancedAuthForm';

export default function Login() {
  const { user, isLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <EnhancedAuthForm 
        isLogin={isLogin} 
        onToggleMode={() => setIsLogin(!isLogin)} 
      />
    </div>
  );
}
