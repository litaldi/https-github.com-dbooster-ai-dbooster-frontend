
import { Badge } from '@/components/ui/badge';
import { TestTube } from 'lucide-react';
import { isDemoMode } from '@/services/demo';

export function DemoBadge() {
  if (!isDemoMode()) return null;

  return (
    <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
      <TestTube className="w-3 h-3 mr-1" />
      Demo Mode
    </Badge>
  );
}
