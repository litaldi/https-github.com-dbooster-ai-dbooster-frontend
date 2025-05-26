
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Download, Search, CalendarIcon, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/components/ui/use-toast';

export default function AuditLog() {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

  const auditLogs = [
    {
      id: 1,
      timestamp: new Date('2024-01-15T10:30:00'),
      user: 'john.doe@company.com',
      action: 'Query Approved',
      target: 'user_service.py:45',
      details: 'Approved index optimization',
      ip: '192.168.1.100'
    },
    {
      id: 2,
      timestamp: new Date('2024-01-15T09:15:00'),
      user: 'jane.smith@company.com',
      action: 'Repository Added',
      target: 'my-app-backend',
      details: 'Added new repository for analysis',
      ip: '192.168.1.101'
    },
    {
      id: 3,
      timestamp: new Date('2024-01-14T16:45:00'),
      user: 'bob.wilson@company.com',
      action: 'Query Rejected',
      target: 'order_controller.js:78',
      details: 'Rejected optimization due to business logic concerns',
      ip: '192.168.1.102'
    },
    {
      id: 4,
      timestamp: new Date('2024-01-14T14:20:00'),
      user: 'alice.brown@company.com',
      action: 'Settings Modified',
      target: 'Notification preferences',
      details: 'Updated email notification settings',
      ip: '192.168.1.103'
    },
    {
      id: 5,
      timestamp: new Date('2024-01-14T11:30:00'),
      user: 'charlie.davis@company.com',
      action: 'Database Connected',
      target: 'production-db',
      details: 'Connected PostgreSQL database',
      ip: '192.168.1.104'
    }
  ];

  const filteredLogs = auditLogs.filter(log => 
    log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.target.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExport = () => {
    toast({
      title: "Exporting audit log",
      description: "Your CSV file will be downloaded shortly.",
    });
  };

  const getActionBadgeVariant = (action: string) => {
    switch (action) {
      case 'Query Approved':
        return 'default';
      case 'Query Rejected':
        return 'destructive';
      case 'Repository Added':
        return 'secondary';
      case 'Database Connected':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Audit Log</h1>
          <p className="text-muted-foreground">Track all user activities and system events</p>
        </div>
        <Button onClick={handleExport} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
          <CardDescription>
            Complete record of user actions and system events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y")} -{" "}
                        {format(dateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    "Pick a date range"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-sm">
                    {format(log.timestamp, 'MMM dd, yyyy HH:mm:ss')}
                  </TableCell>
                  <TableCell className="font-medium">{log.user}</TableCell>
                  <TableCell>
                    <Badge variant={getActionBadgeVariant(log.action)}>
                      {log.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm">{log.target}</TableCell>
                  <TableCell className="max-w-xs truncate">{log.details}</TableCell>
                  <TableCell className="font-mono text-sm">{log.ip}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredLogs.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No audit logs found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
