
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  AlertTriangle, 
  Eye, 
  Lock,
  Skull,
  Globe,
  Clock,
  RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';

interface SecurityThreat {
  id: string;
  type: 'sql_injection' | 'brute_force' | 'privilege_escalation' | 'data_exfiltration' | 'anomalous_access';
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  sourceIp: string;
  targetResource: string;
  attackVector: string;
  detectedAt: Date;
  status: 'active' | 'blocked' | 'investigating';
  riskScore: number;
  mitigation: string;
}

export function SecurityThreatDetector() {
  const [threats, setThreats] = useState<SecurityThreat[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [securityLevel, setSecurityLevel] = useState('high');

  const mockThreats: SecurityThreat[] = [
    {
      id: '1',
      type: 'sql_injection',
      severity: 'critical',
      title: 'SQL Injection Attempt Detected',
      description: 'Multiple malicious SQL queries detected from suspicious IP address',
      sourceIp: '192.168.1.100',
      targetResource: '/api/users/search',
      attackVector: 'HTTP Parameter Injection',
      detectedAt: new Date(Date.now() - 1000 * 60 * 15),
      status: 'blocked',
      riskScore: 95,
      mitigation: 'IP blocked automatically. Review parameterized queries implementation.'
    },
    {
      id: '2',
      type: 'brute_force',
      severity: 'high',
      title: 'Brute Force Login Attack',
      description: 'Repeated failed login attempts from multiple IP addresses',
      sourceIp: '203.45.67.89',
      targetResource: '/auth/login',
      attackVector: 'Credential Stuffing',
      detectedAt: new Date(Date.now() - 1000 * 60 * 45),
      status: 'active',
      riskScore: 78,
      mitigation: 'Consider implementing rate limiting and CAPTCHA verification.'
    },
    {
      id: '3',
      type: 'anomalous_access',
      severity: 'medium',
      title: 'Unusual Data Access Pattern',
      description: 'User accessing large amounts of sensitive data outside normal hours',
      sourceIp: '10.0.0.25',
      targetResource: 'customer_data table',
      attackVector: 'Insider Threat',
      detectedAt: new Date(Date.now() - 1000 * 60 * 120),
      status: 'investigating',
      riskScore: 65,
      mitigation: 'Review user permissions and implement data access monitoring.'
    }
  ];

  const scanSecurityThreats = async () => {
    setIsScanning(true);
    
    // Simulate API call
    setTimeout(() => {
      setThreats(mockThreats);
      setSecurityLevel(Math.random() > 0.3 ? 'high' : 'medium');
      setIsScanning(false);
    }, 2000);
  };

  const getThreatIcon = (type: string) => {
    switch (type) {
      case 'sql_injection': return <Skull className="h-4 w-4 text-red-600" />;
      case 'brute_force': return <Lock className="h-4 w-4 text-orange-600" />;
      case 'privilege_escalation': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'data_exfiltration': return <Eye className="h-4 w-4 text-purple-600" />;
      case 'anomalous_access': return <Globe className="h-4 w-4 text-yellow-600" />;
      default: return <Shield className="h-4 w-4" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-red-600';
      case 'blocked': return 'text-green-600';
      case 'investigating': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getSecurityLevelColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const formatTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60));
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-600" />
              Security Threat Detector
            </CardTitle>
            <Button 
              onClick={scanSecurityThreats} 
              disabled={isScanning}
              variant="outline"
            >
              {isScanning ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 mr-2" />
                  Scan for Threats
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Security Level */}
            <Card className="bg-gradient-to-r from-red-50 to-orange-50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Shield className="h-6 w-6 text-red-600" />
                      <h3 className="text-lg font-semibold">Security Status</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-2xl font-bold capitalize ${getSecurityLevelColor(securityLevel)}`}>
                        {securityLevel} Risk
                      </span>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="text-sm text-muted-foreground">Active Threats</div>
                    <div className="text-2xl font-bold text-red-600">
                      {threats.filter(t => t.status === 'active').length}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Threats List */}
            {threats.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Detected Security Threats</h3>
                {threats.map((threat) => (
                  <Alert key={threat.id} className="border-l-4 border-l-red-500">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        {getThreatIcon(threat.type)}
                        <Badge variant={getSeverityColor(threat.severity) as any}>
                          {threat.severity}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {threat.type.replace('_', ' ')}
                        </Badge>
                        <div className="flex items-center gap-1 ml-auto">
                          <div className={`w-2 h-2 rounded-full ${
                            threat.status === 'active' ? 'bg-red-500' : 
                            threat.status === 'blocked' ? 'bg-green-500' : 'bg-yellow-500'
                          }`} />
                          <span className={`text-sm font-medium capitalize ${getStatusColor(threat.status)}`}>
                            {threat.status}
                          </span>
                        </div>
                      </div>
                      
                      <AlertDescription>
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium">{threat.title}</h4>
                            <p className="text-sm text-muted-foreground">{threat.description}</p>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="space-y-2">
                              <div>
                                <span className="font-medium">Source IP: </span>
                                <span className="font-mono text-red-600">{threat.sourceIp}</span>
                              </div>
                              <div>
                                <span className="font-medium">Target: </span>
                                <span className="font-mono">{threat.targetResource}</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div>
                                <span className="font-medium">Attack Vector: </span>
                                <span>{threat.attackVector}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span className="font-medium">Detected: </span>
                                <span>{formatTimeAgo(threat.detectedAt)}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">Risk Score:</span>
                              <div className={`px-2 py-1 rounded text-xs font-bold ${
                                threat.riskScore >= 80 ? 'bg-red-100 text-red-800' :
                                threat.riskScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {threat.riskScore}/100
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-red-50 p-3 rounded-lg">
                            <div className="text-sm">
                              <span className="font-medium text-red-800">Mitigation: </span>
                              <span className="text-red-700">{threat.mitigation}</span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              Investigate
                            </Button>
                            <Button size="sm" variant="destructive">
                              Block Source
                            </Button>
                            {threat.status === 'active' && (
                              <Button size="sm">
                                Mitigate Threat
                              </Button>
                            )}
                          </div>
                        </div>
                      </AlertDescription>
                    </div>
                  </Alert>
                ))}
              </div>
            )}

            {threats.length === 0 && !isScanning && (
              <div className="text-center py-8">
                <Shield className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2 text-green-600">No Active Threats Detected</h3>
                <p className="text-muted-foreground">
                  Your database security is currently in good standing
                </p>
              </div>
            )}
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}
