
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Brain, Activity } from 'lucide-react';

interface AnomalyControlPanelProps {
  autoScanEnabled: boolean;
  setAutoScanEnabled: (enabled: boolean) => void;
  lastScan: Date | null;
  isScanning: boolean;
  onScan: () => void;
}

export const AnomalyControlPanel: React.FC<AnomalyControlPanelProps> = React.memo(({
  autoScanEnabled,
  setAutoScanEnabled,
  lastScan,
  isScanning,
  onScan
}) => {
  return (
    <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-red-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-6 w-6 text-orange-600" />
          Intelligent Anomaly Detector
          <Badge variant="secondary" className="ml-2">
            <Brain className="h-3 w-3 mr-1" />
            AI-Powered
          </Badge>
        </CardTitle>
        <CardDescription>
          Machine learning-based anomaly detection with predictive forecasting
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-sm font-medium">Auto-Scan Status</div>
            <div className={`text-xs ${autoScanEnabled ? 'text-green-600' : 'text-gray-600'}`}>
              {autoScanEnabled ? 'Active - Scanning every 5 minutes' : 'Disabled'}
            </div>
          </div>
          <Button
            variant={autoScanEnabled ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoScanEnabled(!autoScanEnabled)}
          >
            {autoScanEnabled ? 'Disable Auto-Scan' : 'Enable Auto-Scan'}
          </Button>
        </div>

        {lastScan && (
          <div className="text-sm text-muted-foreground">
            Last scan: {lastScan.toLocaleString()}
          </div>
        )}

        <Button 
          onClick={onScan} 
          disabled={isScanning}
          className="w-full"
          size="lg"
        >
          {isScanning ? (
            <>
              <Activity className="mr-2 h-4 w-4 animate-pulse" />
              Scanning for Anomalies...
            </>
          ) : (
            <>
              <Eye className="mr-2 h-4 w-4" />
              Scan Now
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
});

AnomalyControlPanel.displayName = 'AnomalyControlPanel';
