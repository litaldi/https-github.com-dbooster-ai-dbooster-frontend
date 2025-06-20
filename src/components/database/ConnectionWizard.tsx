import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Database, CheckCircle, AlertCircle, Loader2, Shield } from 'lucide-react';
import { enhancedToast } from '@/components/ui/enhanced-toast';

interface ConnectionConfig {
  type: string;
  host: string;
  port: string;
  database: string;
  username: string;
  password: string;
  ssl: boolean;
}

export function ConnectionWizard() {
  const [step, setStep] = useState(1);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionResult, setConnectionResult] = useState<'success' | 'error' | null>(null);
  const [config, setConfig] = useState<ConnectionConfig>({
    type: '',
    host: '',
    port: '',
    database: '',
    username: '',
    password: '',
    ssl: true
  });

  const databaseTypes = [
    { value: 'postgresql', label: 'PostgreSQL', port: '5432' },
    { value: 'mysql', label: 'MySQL', port: '3306' },
    { value: 'mongodb', label: 'MongoDB', port: '27017' },
    { value: 'redis', label: 'Redis', port: '6379' },
    { value: 'sqlserver', label: 'SQL Server', port: '1433' },
    { value: 'oracle', label: 'Oracle', port: '1521' }
  ];

  const handleTypeChange = (type: string) => {
    const dbType = databaseTypes.find(db => db.value === type);
    setConfig(prev => ({
      ...prev,
      type,
      port: dbType?.port || ''
    }));
  };

  const testConnection = async () => {
    setIsConnecting(true);
    setConnectionResult(null);

    // Simulate connection test
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Random success/failure for demo
    const success = Math.random() > 0.3;
    setConnectionResult(success ? 'success' : 'error');
    setIsConnecting(false);

    if (success) {
      enhancedToast.success({
        title: "Connection successful!",
        description: "Your database connection has been established.",
      });
    } else {
      enhancedToast.error({
        title: "Connection failed",
        description: "Please check your credentials and try again.",
      });
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="db-type">Database Type</Label>
        <Select value={config.type} onValueChange={handleTypeChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select database type" />
          </SelectTrigger>
          <SelectContent>
            {databaseTypes.map(db => (
              <SelectItem key={db.value} value={db.value}>
                {db.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="host">Host</Label>
          <Input
            id="host"
            placeholder="localhost"
            value={config.host}
            onChange={(e) => setConfig(prev => ({ ...prev, host: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="port">Port</Label>
          <Input
            id="port"
            placeholder="5432"
            value={config.port}
            onChange={(e) => setConfig(prev => ({ ...prev, port: e.target.value }))}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="database">Database Name</Label>
        <Input
          id="database"
          placeholder="myapp_production"
          value={config.database}
          onChange={(e) => setConfig(prev => ({ ...prev, database: e.target.value }))}
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          placeholder="username"
          value={config.username}
          onChange={(e) => setConfig(prev => ({ ...prev, username: e.target.value }))}
        />
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={config.password}
          onChange={(e) => setConfig(prev => ({ ...prev, password: e.target.value }))}
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="ssl"
          checked={config.ssl}
          onChange={(e) => setConfig(prev => ({ ...prev, ssl: e.target.checked }))}
          className="rounded border-gray-300"
        />
        <Label htmlFor="ssl" className="flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Use SSL connection
        </Label>
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Your credentials are encrypted and stored securely. DBooster uses read-only access to analyze your database.
        </AlertDescription>
      </Alert>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="text-center space-y-4">
        {isConnecting && (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p>Testing connection...</p>
          </div>
        )}

        {connectionResult === 'success' && (
          <div className="flex flex-col items-center gap-2 text-green-600">
            <CheckCircle className="h-8 w-8" />
            <p className="font-medium">Connection successful!</p>
            <p className="text-sm text-muted-foreground">
              Your database is ready for optimization analysis.
            </p>
          </div>
        )}

        {connectionResult === 'error' && (
          <div className="flex flex-col items-center gap-2 text-red-600">
            <AlertCircle className="h-8 w-8" />
            <p className="font-medium">Connection failed</p>
            <p className="text-sm text-muted-foreground">
              Please check your credentials and network settings.
            </p>
          </div>
        )}

        {!isConnecting && !connectionResult && (
          <div className="space-y-4">
            <h3 className="font-medium">Review Connection Settings</h3>
            <div className="bg-muted p-4 rounded-lg space-y-2 text-left">
              <div><strong>Type:</strong> {databaseTypes.find(db => db.value === config.type)?.label}</div>
              <div><strong>Host:</strong> {config.host}:{config.port}</div>
              <div><strong>Database:</strong> {config.database}</div>
              <div><strong>Username:</strong> {config.username}</div>
              <div className="flex items-center gap-2">
                <strong>SSL:</strong> 
                <Badge variant={config.ssl ? "default" : "secondary"}>
                  {config.ssl ? "Enabled" : "Disabled"}
                </Badge>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Connection Wizard
        </CardTitle>
        <CardDescription>
          Connect your database to start optimizing queries with AI-powered insights
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress indicator */}
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                stepNumber <= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                {stepNumber}
              </div>
              {stepNumber < 3 && (
                <div className={`w-12 h-1 mx-2 ${
                  stepNumber < step ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}

        {/* Navigation buttons */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
          >
            Previous
          </Button>

          {step < 3 ? (
            <Button
              onClick={() => setStep(step + 1)}
              disabled={step === 1 && !config.type}
            >
              Next
            </Button>
          ) : (
            <div className="space-x-2">
              {connectionResult === 'error' && (
                <Button variant="outline" onClick={() => setStep(2)}>
                  Edit Settings
                </Button>
              )}
              <Button
                onClick={testConnection}
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Testing...
                  </>
                ) : connectionResult === 'success' ? (
                  'Connected'
                ) : (
                  'Test Connection'
                )}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
