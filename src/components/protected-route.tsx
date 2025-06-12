
import { useAuth } from '@/contexts/auth-context';
import { Navigate } from 'react-router-dom';
import { PageLoading } from '@/components/ui/loading-states';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, session, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoading message="Checking authentication..." />;
  }

  if (!user || !session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
