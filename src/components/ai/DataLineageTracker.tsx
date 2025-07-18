
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { GitBranch, Search, Database, ArrowRight, Shield, Eye } from 'lucide-react';

export function DataLineageTracker() {
  const [searchTerm, setSearchTerm] = useState('');
  const [lineageData, setLineageData] = useState<any>(null);
  const [isTracking, setIsTracking] = useState(false);

  const mockLineageData = {
    source: 'users_raw',
    transformations: [
      { step: 1, name: 'Data Cleaning', description: 'Remove null values and duplicates', table: 'users_clean' },
      { step: 2, name: 'Enrichment', description: 'Add demographic data', table: 'users_enriched' },
      { step: 3, name: 'Aggregation', description: 'Calculate user metrics', table: 'user_metrics' }
    ],
    destinations: ['reporting_db.user_summary', 'analytics_warehouse.user_facts'],
    compliance: {
      gdpr: true,
      pii_fields: ['email', 'phone', 'address'],
      retention_policy: '7 years'
    },
    impact_analysis: {
      affected_reports: 5,
      downstream_systems: 3,
      estimated_impact: 'Medium'
    }
  };

  const trackLineage = () => {
    if (!searchTerm.trim()) return;
    
    setIsTracking(true);
    
    setTimeout(() => {
      setLineageData(mockLineageData);
      setIsTracking(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5 text-primary" />
            Intelligent Data Lineage Tracker
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter table name, column, or data element..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button onClick={trackLineage} disabled={isTracking || !searchTerm.trim()}>
              <Search className="h-4 w-4 mr-2" />
              {isTracking ? 'Tracking...' : 'Track Lineage'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {lineageData && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Flow Visualization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <Badge variant="outline">{lineageData.source}</Badge>
                    <div className="text-xs text-muted-foreground mt-1">Source</div>
                  </div>
                  
                  {lineageData.transformations.map((transform: any, index: number) => (
                    <React.Fragment key={index}>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <div className="text-center">
                        <Badge variant="secondary">{transform.table}</Badge>
                        <div className="text-xs text-muted-foreground mt-1">{transform.name}</div>
                      </div>
                    </React.Fragment>
                  ))}
                  
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  
                  <div className="text-center">
                    <div className="space-y-1">
                      {lineageData.destinations.map((dest: string, index: number) => (
                        <Badge key={index} variant="default" className="block">{dest}</Badge>
                      ))}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Destinations</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Compliance Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>GDPR Compliant</span>
                  <Badge variant={lineageData.compliance.gdpr ? "default" : "destructive"}>
                    {lineageData.compliance.gdpr ? "Yes" : "No"}
                  </Badge>
                </div>
                <div>
                  <span className="text-sm font-medium">PII Fields:</span>
                  <div className="flex gap-1 mt-1">
                    {lineageData.compliance.pii_fields.map((field: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">{field}</Badge>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span>Retention Policy</span>
                  <Badge variant="outline">{lineageData.compliance.retention_policy}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Impact Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Affected Reports</span>
                  <Badge variant="outline">{lineageData.impact_analysis.affected_reports}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Downstream Systems</span>
                  <Badge variant="outline">{lineageData.impact_analysis.downstream_systems}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Estimated Impact</span>
                  <Badge variant={lineageData.impact_analysis.estimated_impact === 'High' ? 'destructive' : 'secondary'}>
                    {lineageData.impact_analysis.estimated_impact}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
