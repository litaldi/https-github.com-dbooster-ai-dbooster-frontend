
import { useAuth } from '@/contexts/auth-context';

// Clean demo component - no intrusive overlays
export function DemoWalkthrough() {
  const { isDemo } = useAuth();
  
  // Return null to remove any intrusive walkthrough
  // Users can explore the demo naturally without interruption
  return null;
}
