
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, AlertTriangle, CheckCircle, FileText, Search, Download } from 'lucide-react';

export function ComplianceAuditor() {
  const [databaseName, setDatabaseName] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResults, setAuditResults] = useState<any>(null);

  const mockAuditResults = {
    overallScore: 78,
    complianceStandards: [
      {
        name: 'GDPR',
        status: 'Compliant',
        score: 85,
        issues: [
          { severity: 'medium', description: 'Missing data retention policies for user_logs table' },
          { severity: 'low', description: 'Consider adding explicit consent tracking' }
        ],
        recommendations: [
          'Implement automated data deletion after retention period',
          'Add consent_given column to users table'
        ]
      },
      {
        name: 'SOX',
        status: 'Partial',
        score: 72,
        issues: [
          { severity: 'high', description: 'Audit trail missing for financial_transactions table' },
          { severity: 'medium', description: 'Insufficient access controls on sensitive data' }
        ],
        recommendations: [
          'Enable database audit logging for all financial tables',
          'Implement role-based access controls'
        ]
      },
      {
        name: 'HIPAA',
        status: 'Non-Compliant',
        score: 45,
        issues: [
          { severity: 'critical', description: 'PHI data not encrypted at rest' },
          { severity: 'high', description: 'Missing access logs for patient_records' }
        ],
        recommendations: [
          'Enable transparent data encryption (TDE)',
          'Implement comprehensive audit logging'
        ]
      },
      {
        name: 'PCI-DSS',
        status: 'Compliant',
        score: 90,
        issues: [
          { severity: 'low', description: 'Consider implementing tokenization for stored card data' }
        ],
        recommendations: [
          'Implement payment tokenization system'
        ]
      }
    ],
    sensitiveDataFound: [
      { table: 'users', column: 'ssn', type: 'Social Security Number', encrypted: false },
      { table: 'users', column: 'email', type: 'Email Address', encrypted: false },
      { table: 'payment_methods', column: 'card_number', type: 'Credit Card', encrypted: true },
      { table: 'patient_records', column: 'medical_record', type: 'Medical Information', encrypted: false }
    ]
  };

  const runAudit = () => {
    if (!databaseName.trim()) return;
    
    setIsAuditing(true);
    
    setTimeout(() => {
      setAuditResults(mockAuditResults);
      setIsAuditing(false);
    }, 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Compliant': return 'default';
      case 'Partial': return 'secondary';
      case 'Non-Compliant': return 'destructive';
      default: return 'outline';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Database Compliance Auditor
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter database name to audit..."
              value={databaseName}
              onChange={(e) => setDatabaseName(e.target.value)}
              className="flex-1"
            />
            <Button onClick={runAudit} disabled={isAuditing || !databaseName.trim()}>
              {isAuditing ? (
                <>
                  <Search className="h-4 w-4 mr-2 animate-spin" />
                  Auditing...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Run Compliance Audit
                </>
              )}
            </Button>
          </div>

          {isAuditing && (
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">Scanning database for compliance violations...</div>
              <Progress value={60} className="w-full" />
              <div className="text-xs text-muted-foreground">
                Checking GDPR, SOX, HIPAA, PCI-DSS standards...
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {auditResults && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Compliance Overview</span>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{auditResults.overallScore}%</span>
                  <Badge variant={auditResults.overallScore >= 80 ? 'default' : auditResults.overallScore >= 60 ? 'secondary' : 'destructive'}>
                    {auditResults.overallScore >= 80 ? 'Good' : auditResults.overallScore >= 60 ? 'Fair' : 'Poor'}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={auditResults.overallScore} className="w-full" />
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4">
            {auditResults.complianceStandards.map((standard: any, index: number) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{standard.name}</span>
                    <Badge variant={getStatusColor(standard.status)}>{standard.status}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Compliance Score</span>
                    <span className="font-semibold">{standard.score}%</span>
                  </div>
                  <Progress value={standard.score} className="w-full" />
                  
                  <div className="space-y-2">
                    <h5 className="font-medium text-sm">Issues Found:</h5>
                    {standard.issues.map((issue: any, issueIndex: number) => (
                      <div key={issueIndex} className="flex items-start gap-2 text-sm">
                        <AlertTriangle className={`h-4 w-4 mt-0.5 ${
                          issue.severity === 'critical' || issue.severity === 'high' ? 'text-red-500' :
                          issue.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                        }`} />
                        <div className="flex-1">
                          <Badge variant={getSeverityColor(issue.severity)} className="text-xs mb-1">
                            {issue.severity}
                          </Badge>
                          <p>{issue.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-2">
                    <h5 className="font-medium text-sm">Recommendations:</h5>
                    {standard.recommendations.map((rec: string, recIndex: number) => (
                      <div key={recIndex} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 mt-0.5 text-green-500" />
                        <p>{rec}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sensitive Data Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Table</th>
                      <th className="text-left p-2">Column</th>
                      <th className="text-left p-2">Data Type</th>
                      <th className="text-left p-2">Encrypted</th>
                      <th className="text-left p-2">Action Required</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditResults.sensitiveDataFound.map((data: any, index: number) => (
                      <tr key={index} className="border-b">
                        <td className="p-2 font-mono">{data.table}</td>
                        <td className="p-2 font-mono">{data.column}</td>
                        <td className="p-2">{data.type}</td>
                        <td className="p-2">
                          <Badge variant={data.encrypted ? 'default' : 'destructive'}>
                            {data.encrypted ? 'Yes' : 'No'}
                          </Badge>
                        </td>
                        <td className="p-2">
                          {!data.encrypted && (
                            <Badge variant="outline" className="text-xs">
                              Encrypt
                            </Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Export Compliance Report
                </Button>
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Remediation Plan
                </Button>
                <Button variant="outline">
                  Schedule Regular Audits
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
