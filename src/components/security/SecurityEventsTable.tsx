
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { SecurityEvent } from '@/hooks/useSecurityEvents';

interface SecurityEventsTableProps {
  events: SecurityEvent[];
}

export function SecurityEventsTable({ events }: SecurityEventsTableProps) {
  const getEventBadgeVariant = (eventType: string) => {
    if (eventType.includes('violation') || eventType.includes('threat') || eventType.includes('suspicious')) {
      return 'destructive';
    }
    if (eventType.includes('blocked') || eventType.includes('rate_limit')) {
      return 'secondary';
    }
    return 'default';
  };

  const formatEventType = (eventType: string) => {
    return eventType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event Type</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>User</TableHead>
            <TableHead>IP Address</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell className="font-medium">
                {formatEventType(event.event_type)}
              </TableCell>
              <TableCell>
                {new Date(event.created_at).toLocaleString()}
              </TableCell>
              <TableCell>
                {event.user_id ? `User: ${event.user_id.slice(0, 8)}...` : 'System'}
              </TableCell>
              <TableCell>
                {event.ip_address || 'N/A'}
              </TableCell>
              <TableCell>
                <Badge variant={getEventBadgeVariant(event.event_type)}>
                  {event.event_type.includes('violation') || event.event_type.includes('threat') 
                    ? 'Threat' 
                    : event.event_type.includes('blocked')
                    ? 'Blocked'
                    : 'Info'
                  }
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
