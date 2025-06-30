
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { 
  Database, 
  TestTube, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Shield,
  Zap,
  Eye,
  Settings
} from 'lucide-react';
import { databaseConnectionManager, type DatabaseConnection } from '@/services/database/connectionManager';
import { enhancedToast } from '@/components/ui/enhanced-toast';
import { FadeIn, ScaleIn } from '@/components/ui/animations';

interface ConnectionConfig {
  name: string;
  type: DatabaseConnection['type'];
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl: boolean;
}

const DATABASE_TYPES = [
  { value: 'postgresql', label: 'PostgreSQL', icon: '🐘', port: 5432 },
  { value: 'mysql', label: 'MySQL', icon: '🐬', port: 3306 },
  { value: 'mssql', label: 'SQL Server', icon: '🏢', port: 1433 },
  { value: 'oracle', label: 'Oracle', icon: '🔴', port: 1521 },
  { value: 'mongodb', label: 'MongoDB', icon: '🍃', port: 27017 },
  { value: 'redis', label: 'Redis', icon: '🔴', port: 6379 }
];

export function EnhancedConnectionWizard() {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<ConnectionConfig>({
    name: '',
    type: 'postgresql',
    host: '',
    port: 5432,
    database: '',
    username: '',
    password: '',
    ssl: true
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionResult, setConnectionResult] = useState<{
    success: boolean;
    connection?: DatabaseConnection;
    error?: string;
    testResults?: any;
  } | null>(null);

  const handleTypeChange = (type: DatabaseConnection['type']) => {
    const dbType = DATABASE_TYPES.find(t => t.value === type);
    setConfig(prev => ({
      ...prev,
      type,
      port: dbType?.port || 5432
    }));
  };

  const handleInputChange = (field: keyof ConnectionConfig, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (stepNumber: number): boolean => {
    switch (stepNumber) {
      case 1:
        return config.name.trim() !== '' && config.type !== '';
      case 2:
        return config.host.trim() !== '' && config.port > 0 && config.database.trim() !== '';
      case 3:
        return config.username.trim() !== '' && config.password.trim() !== '';
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const testConnection = async () => {
    setIsConnecting(true);
    setConnectionResult(null);

    try {
      const connection = await databaseConnectionManager.createConnection(config);
      
      // Run additional tests
      const testResults = await runConnectionTests(connection.id);
      
      setConnectionResult({
        success: true,
        connection,
        testResults
      });

      enhancedToast.success({
        title: "Connection Successful!",
        description: `Successfully connected to ${config.name}`,
      });
    } catch (error) {
      setConnectionResult({
        success: false,
        error: error instanceof Error ? error.message : 'Connection failed'
      });

      enhancedToast.error({
        title: "Connection Failed",
        description: "Please check your connection details and try again.",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const runConnectionTests = async (connectionId: string) => {
    const tests = [
      { name: 'Basic Connectivity', test: () => databaseConnectionManager.testConnection(connectionId) },
      { name: 'Schema Access', test: () => databaseConnectionManager.introspectSchema(connectionId) },
      { name: 'Performance Check', test: () => databaseConnectionManager.getPerformanceMetrics(connectionId) }
    ];

    const results = [];
    for (const test of tests) {
      try {
        const result = await test.test();
        results.push({ name: test.name, success: true, result });
      } catch (error) {
        results.push({ name: test.name, success: false, error: error instanceof Error ? error.message : 'Test failed' });
      }
    }

    return results;
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Connection Name</Label>
        <Input
          id="name"
          placeholder="Production Database"
          value={config.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Database Type</Label>
        <Select value={config.type} onValueChange={handleTypeChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DATABASE_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                <div className="flex items-center gap-2">
                  <span>{type.icon}</span>
                  <span>{type.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          All connection details are encrypted and stored securely. We follow enterprise-grade security practices.
        </AlertDescription>
      </Alert>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="host">Host</Label>
          <Input
            id="host"
            placeholder="localhost"
            value={config.host}
            onChange={(e) => handleInputChange('host', e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="port">Port</Label>
          <Input
            id="port"
            type="number"
            value={config.port}
            onChange={(e) => handleInputChange('port', parseInt(e.target.value) || 0)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="database">Database Name</Label>
        <Input
          id="database"
          placeholder="myapp_production"
          value={config.database}
          onChange={(e) => handleInputChange('database', e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="ssl"
          checked={config.ssl}
          onChange={(e) => handleInputChange('ssl', e.target.checked)}
        />
        <Label htmlFor="ssl">Use SSL/TLS encryption</Label>
        <Badge variant="secondary">Recommended</Badge>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          placeholder="database_user"
          value={config.username}
          onChange={(e) => handleInputChange('username', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={config.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
        />
      </div>

      <Alert>
        <Eye className="h-4 w-4" />
        <AlertDescription>
          We recommend using a read-only database user for security. Write access is only needed for optimization operations.
        </AlertDescription>
      </Alert>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h3 className="text-lg font-semibold">Connection Summary</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-right font-medium">Name:</div>
          <div>{config.name}</div>
          <div className="text-right font-medium">Type:</div>
          <div>{DATABASE_TYPES.find(t => t.value === config.type)?.label}</div>
          <div className="text-right font-medium">Host:</div>
          <div>{config.host}:{config.port}</div>
          <div className="text-right font-medium">Database:</div>
          <div>{config.database}</div>
          <div className="text-right font-medium">Username:</div>
          <div>{config.username}</div>
          <div className="text-right font-medium">SSL:</div>
          <div>{config.ssl ? 'Enabled' : 'Disabled'}</div>
        </div>
      </div>

      <Button
        onClick={testConnection}
        disabled={isConnecting}
        className="w-full"
        size="lg"
      >
        {isConnecting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connecting...
          </>
        ) : (
          <>
            <TestTube className="mr-2 h-4 w-4" />
            Test Connection
          </>
        )}
      </Button>

      {connectionResult && (
        <ScaleIn delay={0.2}>
          <Card className={connectionResult.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-4">
                {connectionResult.success ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
                <span className="font-medium">
                  {connectionResult.success ? 'Connection Successful!' : 'Connection Failed'}
                </span>
              </div>

              {connectionResult.success && connectionResult.testResults && (
                <div className="space-y-2">
                  <div className="text-sm font-medium">Test Results:</div>
                  {connectionResult.testResults.map((test: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      {test.success ? (
                        <CheckCircle className="h-3 w-3 text-green-600" />
                      ) : (
                        <AlertCircle className="h-3 w-3 text-red-600" />
                      )}
                      <span>{test.name}</span>
                    </div>
                  ))}
                </div>
              )}

              {connectionResult.error && (
                <div className="text-sm text-red-600 mt-2">
                  {connectionResult.error}
                </div>
              )}
            </CardContent>
          </Card>
        </ScaleIn>
      )}
    </div>
  );

  return (
    <FadeIn>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-6 w-6" />
            Database Connection Wizard
          </CardTitle>
          <CardDescription>
            Connect to your database with enterprise-grade security and performance monitoring
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Indicator */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Step {step} of 4</span>
              <span>{Math.round((step / 4) * 100)}% Complete</span>
            </div>
            <Progress value={(step / 4) * 100} className="w-full" />
          </div>

          {/* Step Content */}
          <div className="min-h-[300px]">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            {step === 4 && renderStep4()}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
            >
              Back
            </Button>
            
            {step < 4 ? (
              <Button
                onClick={handleNext}
                disabled={!validateStep(step)}
              >
                Next
              </Button>
            ) : (
              connectionResult?.success && (
                <Button className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Complete Setup
                </Button>
              )
            )}
          </div>
        </CardContent>
      </Card>
    </FadeIn>
  );
}
