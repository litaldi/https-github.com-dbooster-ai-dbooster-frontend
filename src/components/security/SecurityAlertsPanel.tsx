
import React, { useState, useEffect } from 'react';
import { AlertTriangle, Shield, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { securityDashboardEnhanced } from '@/services/security/securityDashboardEnhanced';

interface SecurityAlert {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  message: string;
  timestamp: string;
  metadata?: any;
}

export function SecurityAlertsPanel() {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [expandedAlerts, setExpandedAlerts] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const alertsData = await securityDashboardEnhanced.getSecurityAlerts();
        setAlerts(alertsData);
      } catch (error) {
        console.error('Failed to load security alerts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAlerts();
    
    // Refresh alerts every 30 seconds
    const interval = setInterval(loadAlerts, 30000);
    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="h-4 w-4" />;
      case 'medium':
        return <Shield className="h-4 w-4" />;
      case 'low':
        return <Clock className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const toggleExpanded = (alertId: string) => {
    const newExpanded = new Set(expandedAlerts);
    if (newExpanded.has(alertId)) {
      newExpanded.delete(alertId);
    } else {
      newExpanded.add(alertId);
    }
    setExpandedAlerts(newExpanded);
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Security Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Security Alerts
        </CardTitle>
        <CardDescription>
          Real-time security alerts and threat notifications
        </CardDescription>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <Shield className="h-12 w-12 mx-auto text-green-500 mb-4" />
            <p className="text-muted-foreground">No security alerts at this time</p>
            <p className="text-sm text-muted-foreground">Your system is secure</p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="border rounded-lg p-4">
                <Collapsible>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant={getSeverityColor(alert.severity)} className="flex items-center gap-1">
                        {getSeverityIcon(alert.severity)}
                        {alert.severity.toUpperCase()}
                      </Badge>
                      <div>
                        <p className="font-medium">{alert.message}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatTimestamp(alert.timestamp)}
                        </p>
                      </div>
                    </div>
                    <CollapsibleTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExpanded(alert.id)}
                      >
                        {expandedAlerts.has(alert.id) ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  
                  <CollapsibleContent className="mt-4">
                    <div className="bg-muted/50 rounded p-3 space-y-2">
                      <div>
                        <span className="font-medium">Alert Type:</span> {alert.type}
                      </div>
                      <div>
                        <span className="font-medium">Alert ID:</span> {alert.id}
                      </div>
                      {alert.metadata && (
                        <div>
                          <span className="font-medium">Additional Details:</span>
                          <pre className="mt-1 text-xs bg-background p-2 rounded overflow-auto">
                            {JSON.stringify(alert.metadata, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
