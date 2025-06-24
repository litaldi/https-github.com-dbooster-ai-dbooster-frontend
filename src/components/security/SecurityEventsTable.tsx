
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';
import type { Json } from '@/integrations/supabase/types';

interface SecurityEvent {
  id: string;
  event_type: string;
  event_data: Json;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

interface SecurityEventsTableProps {
  events: SecurityEvent[];
}

export function SecurityEventsTable({ events }: SecurityEventsTableProps) {
  const getEventIcon = (eventType: string) => {
    if (eventType.includes('violation') || eventType.includes('failure') || eventType.includes('suspicious')) {
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    }
    if (eventType.includes('rate_limit')) {
      return <Clock className="h-4 w-4 text-yellow-500" />;
    }
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  const getEventBadgeVariant = (eventType: string): "default" | "secondary" | "destructive" | "outline" => {
    if (eventType.includes('violation') || eventType.includes('failure') || eventType.includes('suspicious')) {
      return 'destructive';
    }
    if (eventType.includes('rate_limit')) {
      return 'secondary';
    }
    return 'default';
  };

  const formatEventData = (eventData: Json): string => {
    if (!eventData) return 'N/A';
    
    try {
      if (typeof eventData === 'string') return eventData.slice(0, 100);
      if (typeof eventData === 'object') return JSON.stringify(eventData).slice(0, 100) + '...';
      return String(eventData).slice(0, 100);
    } catch {
      return 'Invalid data';
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Event</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Details</TableHead>
          <TableHead>IP Address</TableHead>
          <TableHead>Timestamp</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((event) => (
          <TableRow key={event.id}>
            <TableCell className="flex items-center gap-2">
              {getEventIcon(event.event_type)}
              <span className="font-medium">{event.event_type.replace(/_/g, ' ')}</span>
            </TableCell>
            <TableCell>
              <Badge variant={getEventBadgeVariant(event.event_type)}>
                {event.event_type.split('_')[0]}
              </Badge>
            </TableCell>
            <TableCell className="max-w-xs">
              <div className="truncate">
                {formatEventData(event.event_data)}
              </div>
            </TableCell>
            <TableCell className="font-mono text-sm">
              {event.ip_address || 'N/A'}
            </TableCell>
            <TableCell>
              {format(new Date(event.created_at), 'MMM dd, HH:mm:ss')}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
