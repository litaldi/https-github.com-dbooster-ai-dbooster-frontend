
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SecurityHealthMonitor } from '@/components/security/SecurityHealthMonitor';
import { Shield, Activity, AlertTriangle, Lock } from 'lucide-react';
import { useConsolidatedSecurity } from '@/hooks/useConsolidatedSecurity';
import { useState, useEffect } from 'react';

export function SecurityDashboardPage() {
  const { validateSession, loading } = useConsolidatedSecurity();
  const [sessionValid, setSessionValid] = useState<boolean | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const isValid = await validateSession();
      setSessionValid(isValid);
    };
    checkSession();
  }, [validateSession]);

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Security Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage your application's security status</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Session Status</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? 'Checking...' : sessionValid ? 'Valid' : 'Invalid'}
            </div>
            <p className="text-xs text-muted-foreground">
              Current authentication session
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Level</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">High</div>
            <p className="text-xs text-muted-foreground">
              Enhanced security enabled
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rate Limiting</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground">
              Protection against abuse
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Threats Blocked</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Last 24 hours
            </p>
          </CardContent>
        </Card>
      </div>

      <SecurityHealthMonitor />
    </div>
  );
}
