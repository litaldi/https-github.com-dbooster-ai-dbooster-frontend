
import { useAuth } from '@/contexts/auth-context';
import { Badge } from '@/components/ui/badge';
import { TestTube } from 'lucide-react';

export function DemoBadge() {
  const { isDemo } = useAuth();

  if (!isDemo) return null;

  return (
    <Badge variant="secondary" className="animate-pulse">
      <TestTube className="h-3 w-3 mr-1" />
      Demo Mode
    </Badge>
  );
}
