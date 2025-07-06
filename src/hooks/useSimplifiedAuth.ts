
import { useAuth as useAuthContext } from '@/contexts/auth-context';

export function useSimplifiedAuth() {
  return useAuthContext();
}

// Export the useAuth function directly for backward compatibility
export const useAuth = useAuthContext;
