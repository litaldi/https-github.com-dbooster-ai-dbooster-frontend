
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, Database, CheckCircle, AlertTriangle, FileText, Loader2 } from 'lucide-react';
import { ConnectionWizard } from '@/components/database/ConnectionWizard';
import { useToast } from '@/hooks/use-toast';

interface ImportStep {
  id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  description: string;
  details?: string;
}

export default function DbImport() {
  const { toast } = useToast();
  const [showWizard, setShowWizard] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [isImporting, setIsImporting] = useState(false);
  const [importSteps, setImportSteps] = useState<ImportStep[]>([
    {
      id: '1',
      title: 'Database Connection',
      status: 'pending',
      description: 'Establishing secure connection to database',
    },
    {
      id: '2',
      title: 'Schema Analysis',
      status: 'pending',
      description: 'Analyzing database schema and structure',
    },
    {
      id: '3',
      title: 'Query Extraction',
      status: 'pending',
      description: 'Extracting and cataloging SQL queries',
    },
    {
      id: '4',
      title: 'Performance Baseline',
      status: 'pending',
      description: 'Establishing performance benchmarks',
    },
    {
      id: '5',
      title: 'Optimization Analysis',
      status: 'pending',
      description: 'Identifying optimization opportunities',
    }
  ]);

  const simulateImport = async () => {
    setIsImporting(true);
    setImportProgress(0);

    for (let i = 0; i < importSteps.length; i++) {
      // Update current step to in-progress
      setImportSteps(prev => prev.map((step, index) => 
        index === i ? { ...step, status: 'in-progress' } : step
      ));

      // Simulate step duration
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Complete current step
      setImportSteps(prev => prev.map((step, index) => 
        index === i ? { 
          ...step, 
          status: 'completed',
          details: `Step ${i + 1} completed successfully`
        } : step
      ));

      setImportProgress(((i + 1) / importSteps.length) * 100);
    }

    setIsImporting(false);
    toast({
      title: "Import completed!",
      description: "Your database has been successfully imported and analyzed.",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress':
        return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <div className="w-4 h-4 rounded-full border-2 border-gray-300" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  if (showWizard) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Database Import</h1>
            <p className="text-muted-foreground">
              Connect and import your database for AI-powered optimization
            </p>
          </div>
          <Button variant="outline" onClick={() => setShowWizard(false)}>
            Back to Import
          </Button>
        </div>
        <ConnectionWizard />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Database Import</h1>
        <p className="text-muted-foreground">
          Import your database to start optimizing queries with AI-powered insights
        </p>
      </div>

      {/* Quick Start Options */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setShowWizard(true)}>
          <CardHeader className="text-center">
            <Database className="h-12 w-12 mx-auto mb-2 text-blue-600" />
            <CardTitle className="text-lg">Connect Database</CardTitle>
            <CardDescription>
              Connect to your existing database using our guided wizard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full">
              Start Connection Wizard
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow opacity-50">
          <CardHeader className="text-center">
            <Upload className="h-12 w-12 mx-auto mb-2 text-green-600" />
            <CardTitle className="text-lg">Upload SQL File</CardTitle>
            <CardDescription>
              Upload SQL dump or schema files for analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow opacity-50">
          <CardHeader className="text-center">
            <FileText className="h-12 w-12 mx-auto mb-2 text-purple-600" />
            <CardTitle className="text-lg">Import from Git</CardTitle>
            <CardDescription>
              Analyze SQL files directly from your Git repository
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Import Progress */}
      {(isImporting || importProgress > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Import Progress
            </CardTitle>
            <CardDescription>
              {isImporting ? 'Importing and analyzing your database...' : 'Import completed successfully'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span>{Math.round(importProgress)}%</span>
              </div>
              <Progress value={importProgress} className="w-full" />
            </div>

            <div className="space-y-4">
              {importSteps.map((step) => (
                <div key={step.id} className="flex items-center gap-4 p-3 rounded-lg border">
                  {getStatusIcon(step.status)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{step.title}</h4>
                      {getStatusBadge(step.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                    {step.details && (
                      <p className="text-xs text-green-600 mt-1">{step.details}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {!isImporting && importProgress === 100 && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Database import completed successfully! You can now view optimization suggestions and performance insights.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Demo Import */}
      {!isImporting && importProgress === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Demo Import</CardTitle>
            <CardDescription>
              Try our import process with sample data to see how it works
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Experience the full import workflow with our sample e-commerce database. 
                This demo will show you how DBooster analyzes your database structure, 
                identifies optimization opportunities, and provides actionable insights.
              </p>
              <Button onClick={simulateImport} disabled={isImporting}>
                {isImporting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Database className="mr-2 h-4 w-4" />
                    Start Demo Import
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Previous Imports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Imports</CardTitle>
          <CardDescription>
            Your previously imported databases and their current status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No databases imported yet</h3>
            <p className="text-muted-foreground mb-4">
              Start by connecting your first database using the wizard above.
            </p>
            <Button onClick={() => setShowWizard(true)}>
              Import Your First Database
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
