
import { useAuth } from '@/contexts/auth-context';
import { Navigate, useLocation } from 'react-router-dom';
import { PageLoading } from '@/components/ui/loading-states';
import { useConsolidatedSecurity } from '@/hooks/useConsolidatedSecurity';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, session, loading } = useAuth();
  const { validateSession, invalidateSession } = useConsolidatedSecurity();
  const location = useLocation();
  const [validatingSession, setValidatingSession] = useState(false);

  useEffect(() => {
    if (user && session) {
      setValidatingSession(true);
      validateSession()
        .then(isValid => {
          if (!isValid) {
            // Session is invalid, trigger logout
            invalidateSession().catch(() => {
              // Ignore errors during cleanup
            });
            // Let the auth context handle the redirect
          }
        })
        .catch(error => {
          // Use production logger here instead of console.error
          import('@/utils/cleanLogger').then(({ cleanLogger }) => {
            cleanLogger.error('Session validation failed', error, 'ProtectedRoute');
          });
        })
        .finally(() => {
          setValidatingSession(false);
        });
    }
  }, [user, session, validateSession, invalidateSession]);

  if (loading || validatingSession) {
    return <PageLoading message="Checking authentication..." />;
  }

  if (!user || !session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
