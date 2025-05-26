
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Database, Upload, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export default function DbImport() {
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [dbConfig, setDbConfig] = useState({
    host: '',
    port: '5432',
    database: '',
    username: '',
    password: ''
  });

  const [tables, setTables] = useState([
    { name: 'users', columns: 8, indexes: 3, status: 'scanned' },
    { name: 'orders', columns: 12, indexes: 5, status: 'pending' },
    { name: 'products', columns: 15, indexes: 4, status: 'scanned' },
  ]);

  const handleConnect = async () => {
    setConnectionStatus('connecting');
    // Simulate connection
    setTimeout(() => {
      setConnectionStatus('connected');
      toast({
        title: "Database connected",
        description: "Successfully connected to your database.",
      });
    }, 2000);
  };

  const handleScan = () => {
    toast({
      title: "Scanning database",
      description: "Analyzing tables and indexes...",
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast({
        title: "File uploaded",
        description: `Processing ${file.name}...`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Database Import</h1>
        <p className="text-muted-foreground">Connect your database or upload schema files for analysis</p>
      </div>

      <Tabs defaultValue="connect" className="space-y-6">
        <TabsList>
          <TabsTrigger value="connect">Connect Database</TabsTrigger>
          <TabsTrigger value="upload">Upload JSON</TabsTrigger>
        </TabsList>

        <TabsContent value="connect" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Database Connection
              </CardTitle>
              <CardDescription>
                Connect to your PostgreSQL, MySQL, or other supported database
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Host"
                  value={dbConfig.host}
                  onChange={(e) => setDbConfig(prev => ({ ...prev, host: e.target.value }))}
                />
                <Input
                  placeholder="Port"
                  value={dbConfig.port}
                  onChange={(e) => setDbConfig(prev => ({ ...prev, port: e.target.value }))}
                />
              </div>
              <Input
                placeholder="Database Name"
                value={dbConfig.database}
                onChange={(e) => setDbConfig(prev => ({ ...prev, database: e.target.value }))}
              />
              <div className="grid grid-cols-2 gap-4">
                <Input
                  placeholder="Username"
                  value={dbConfig.username}
                  onChange={(e) => setDbConfig(prev => ({ ...prev, username: e.target.value }))}
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={dbConfig.password}
                  onChange={(e) => setDbConfig(prev => ({ ...prev, password: e.target.value }))}
                />
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  onClick={handleConnect}
                  disabled={connectionStatus === 'connecting'}
                >
                  {connectionStatus === 'connecting' && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
                  {connectionStatus === 'connected' ? 'Reconnect' : 'Connect'}
                </Button>
                {connectionStatus === 'connected' && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Connected
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload Schema File
              </CardTitle>
              <CardDescription>
                Upload a JSON file containing your database schema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
                <Upload className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
                <div className="space-y-2">
                  <p className="text-sm font-medium">Upload your schema file</p>
                  <p className="text-xs text-muted-foreground">JSON files up to 10MB</p>
                </div>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload">
                  <Button variant="outline" className="mt-4" asChild>
                    <span>Choose File</span>
                  </Button>
                </label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {connectionStatus === 'connected' && (
        <Card>
          <CardHeader>
            <CardTitle>Database Tables</CardTitle>
            <CardDescription>
              Preview of your database structure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm text-muted-foreground">
                {tables.length} tables found
              </p>
              <Button onClick={handleScan} size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Scan All
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Table Name</TableHead>
                  <TableHead>Columns</TableHead>
                  <TableHead>Indexes</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tables.map((table) => (
                  <TableRow key={table.name}>
                    <TableCell className="font-medium">{table.name}</TableCell>
                    <TableCell>{table.columns}</TableCell>
                    <TableCell>{table.indexes}</TableCell>
                    <TableCell>
                      <Badge variant={table.status === 'scanned' ? 'secondary' : 'outline'}>
                        {table.status === 'scanned' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {table.status === 'pending' && <AlertCircle className="w-3 h-3 mr-1" />}
                        {table.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        Scan
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
