
import { useAuth as useAuthContext } from '@/contexts/auth-context';

// Simplified auth hook that just re-exports the main auth context
export function useSimplifiedAuth() {
  return useAuthContext();
}

// Export the useAuth function directly for backward compatibility
export const useAuth = useAuthContext;
