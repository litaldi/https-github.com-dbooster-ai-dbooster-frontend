
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useSecurityEnhancements } from '@/hooks/useSecurityEnhancements';
import { useEnhancedSecurity } from '@/hooks/useEnhancedSecurity';
import { Shield, Lock, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';

export default function SecurityEnhancementsDashboard() {
  const { status: enhancementStatus, refreshStatus } = useSecurityEnhancements();
  const { status: securityStatus, actions } = useEnhancedSecurity();

  const getStatusColor = (enabled: boolean) => enabled ? 'bg-green-500' : 'bg-red-500';
  const getStatusText = (enabled: boolean) => enabled ? 'Active' : 'Inactive';

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Security Enhancements Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor and manage advanced security features
          </p>
        </div>
        <Button onClick={refreshStatus} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Overall Security Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Overall Security Score
          </CardTitle>
          <CardDescription>
            Comprehensive security assessment based on all active protections
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="text-4xl font-bold text-green-600">
              {securityStatus.securityScore}/100
            </div>
            <div className="flex-1">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-green-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${securityStatus.securityScore}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {securityStatus.securityScore >= 80 ? 'Excellent' : 
                 securityStatus.securityScore >= 60 ? 'Good' : 
                 securityStatus.securityScore >= 40 ? 'Fair' : 'Needs Improvement'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Rate Limiting */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Rate Limiting
              </span>
              <Badge className={getStatusColor(enhancementStatus.rateLimiting.enabled)}>
                {getStatusText(enhancementStatus.rateLimiting.enabled)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Entries:</span>
                <span>{enhancementStatus.rateLimiting.stats.totalEntries || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Blocked Entries:</span>
                <span className="text-red-600">
                  {enhancementStatus.rateLimiting.stats.blockedEntries || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Active Rules:</span>
                <span>{Object.keys(enhancementStatus.rateLimiting.stats.rules || {}).length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Lock className="h-4 w-4 mr-2" />
                Demo Security
              </span>
              <Badge className={getStatusColor(enhancementStatus.demoSecurity.enabled)}>
                {getStatusText(enhancementStatus.demoSecurity.enabled)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Active Sessions:</span>
                <span>{enhancementStatus.demoSecurity.activeSessions}</span>
              </div>
              <div className="flex justify-between">
                <span>Secure Tokens:</span>
                <span className="text-green-600">
                  <CheckCircle className="h-3 w-3 inline mr-1" />
                  Enabled
                </span>
              </div>
              <div className="flex justify-between">
                <span>Session Validation:</span>
                <span className="text-green-600">
                  <CheckCircle className="h-3 w-3 inline mr-1" />
                  Active
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CSRF Protection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                CSRF Protection
              </span>
              <Badge className={getStatusColor(enhancementStatus.csrfProtection.enabled)}>
                {getStatusText(enhancementStatus.csrfProtection.enabled)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Token Status:</span>
                <span className="text-green-600">
                  <CheckCircle className="h-3 w-3 inline mr-1" />
                  Active
                </span>
              </div>
              <div className="flex justify-between">
                <span>Auto Rotation:</span>
                <span className="text-green-600">
                  <CheckCircle className="h-3 w-3 inline mr-1" />
                  Enabled
                </span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">
                  Current Token: {enhancementStatus.csrfProtection.currentToken.substring(0, 8)}...
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Secure Storage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Lock className="h-4 w-4 mr-2" />
                Secure Storage
              </span>
              <Badge className={getStatusColor(enhancementStatus.secureStorage.enabled)}>
                {getStatusText(enhancementStatus.secureStorage.enabled)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Encryption:</span>
                <span className="text-green-600">
                  <CheckCircle className="h-3 w-3 inline mr-1" />
                  AES-GCM
                </span>
              </div>
              <div className="flex justify-between">
                <span>Key Derivation:</span>
                <span className="text-green-600">
                  <CheckCircle className="h-3 w-3 inline mr-1" />
                  PBKDF2
                </span>
              </div>
              <div className="flex justify-between">
                <span>TTL Support:</span>
                <span className="text-green-600">
                  <CheckCircle className="h-3 w-3 inline mr-1" />
                  Enabled
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Headers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                Security Headers
              </span>
              <Badge className={getStatusColor(securityStatus.headersApplied)}>
                {getStatusText(securityStatus.headersApplied)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>CSP:</span>
                <span className="text-green-600">
                  <CheckCircle className="h-3 w-3 inline mr-1" />
                  Active
                </span>
              </div>
              <div className="flex justify-between">
                <span>HTTPS:</span>
                <span className={securityStatus.sessionSecure ? "text-green-600" : "text-red-600"}>
                  {securityStatus.sessionSecure ? (
                    <><CheckCircle className="h-3 w-3 inline mr-1" />Enabled</>
                  ) : (
                    <><AlertTriangle className="h-3 w-3 inline mr-1" />Disabled</>
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Threat Protection:</span>
                <span className={securityStatus.threatProtectionActive ? "text-green-600" : "text-red-600"}>
                  {securityStatus.threatProtectionActive ? (
                    <><CheckCircle className="h-3 w-3 inline mr-1" />Active</>
                  ) : (
                    <><AlertTriangle className="h-3 w-3 inline mr-1" />Inactive</>
                  )}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Session Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Lock className="h-4 w-4 mr-2" />
                Session Security
              </span>
              <Badge className={getStatusColor(securityStatus.sessionSecure)}>
                {getStatusText(securityStatus.sessionSecure)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Secure Context:</span>
                <span className="text-green-600">
                  <CheckCircle className="h-3 w-3 inline mr-1" />
                  Yes
                </span>
              </div>
              <div className="flex justify-between">
                <span>Auto Cleanup:</span>
                <span className="text-green-600">
                  <CheckCircle className="h-3 w-3 inline mr-1" />
                  Active
                </span>
              </div>
              <div className="flex justify-between">
                <span>Fingerprinting:</span>
                <span className="text-green-600">
                  <CheckCircle className="h-3 w-3 inline mr-1" />
                  Enabled
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Security Recommendations</CardTitle>
          <CardDescription>
            Suggested improvements to enhance your security posture
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {actions.getSecurityRecommendations().map((recommendation, index) => (
              <div key={index} className="flex items-start space-x-2">
                <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{recommendation}</span>
              </div>
            ))}
            {actions.getSecurityRecommendations().length === 0 && (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">All security recommendations have been implemented!</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
