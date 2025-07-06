
import { useAuth } from '@/contexts/auth-context';

// Simplified demo component - no intrusive overlays
export function DemoWalkthrough() {
  const { isDemo } = useAuth();
  
  // Return null to remove the intrusive walkthrough completely
  // Users can explore the demo naturally without interruption
  return null;
}
