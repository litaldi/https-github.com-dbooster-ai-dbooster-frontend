
import { useAuth } from '@/contexts/auth-context';
import { Navigate, useLocation } from 'react-router-dom';
import { PageLoading } from '@/components/ui/loading-states';
import { useConsolidatedSecurity } from '@/hooks/useConsolidatedSecurity';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, session, isLoading } = useAuth();
  const { validateSession } = useConsolidatedSecurity();
  const location = useLocation();

  useEffect(() => {
    if (user && session) {
      validateSession();
    }
  }, [user, session, validateSession]);

  if (isLoading) {
    return <PageLoading text="Checking authentication..." />;
  }

  if (!user || !session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
