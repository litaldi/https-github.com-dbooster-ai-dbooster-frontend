
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';
import { isDemoMode } from '@/services/demo';

export function DemoBadge() {
  if (!isDemoMode()) return null;

  return (
    <Badge 
      variant="secondary" 
      className="text-xs font-normal"
      aria-label="Demo mode active"
    >
      <Eye className="w-3 h-3 mr-1" />
      Demo
    </Badge>
  );
}
