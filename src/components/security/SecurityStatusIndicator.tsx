
import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { securityInitializationManager } from '@/services/security/securityInitializationManager';
import { secureRateLimiting } from '@/services/security/secureRateLimiting';
import { httpsEnforcement } from '@/utils/security/httpsEnforcement';

interface SecurityStatus {
  overall: 'secure' | 'warning' | 'critical';
  score: number;
  checks: Array<{
    name: string;
    status: 'pass' | 'warn' | 'fail';
    message: string;
  }>;
}

export function SecurityStatusIndicator() {
  const [securityStatus, setSecurityStatus] = useState<SecurityStatus>({
    overall: 'warning',
    score: 0,
    checks: []
  });
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    checkSecurityStatus();
    
    // Refresh status every 30 seconds
    const interval = setInterval(checkSecurityStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkSecurityStatus = async () => {
    const checks = [];
    let score = 0;

    // Check initialization status
    const initStatus = securityInitializationManager.getInitializationStatus();
    checks.push({
      name: 'Security Initialization',
      status: initStatus.initialized ? 'pass' : 'fail' as const,
      message: initStatus.initialized ? 'Completed' : 'Not initialized'
    });
    if (initStatus.initialized) score += 25;

    // Check HTTPS
    const isHttps = location.protocol === 'https:' || !import.meta.env.PROD;
    checks.push({
      name: 'HTTPS',
      status: isHttps ? 'pass' : 'fail' as const,
      message: isHttps ? 'Secure connection' : 'Insecure connection'
    });
    if (isHttps) score += 25;

    // Check CSP
    const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    checks.push({
      name: 'Content Security Policy',
      status: cspMeta ? 'pass' : 'warn' as const,
      message: cspMeta ? 'Active' : 'Missing or misconfigured'
    });
    if (cspMeta) score += 20;

    // Check mixed content
    const mixedContentCheck = httpsEnforcement.checkMixedContentRisks();
    checks.push({
      name: 'Mixed Content',
      status: mixedContentCheck.hasRisks ? 'warn' : 'pass' as const,
      message: mixedContentCheck.hasRisks ? 
        `${mixedContentCheck.risks.length} potential issues` : 
        'No issues detected'
    });
    if (!mixedContentCheck.hasRisks) score += 15;

    // Check rate limiting
    const rateLimitStats = secureRateLimiting.getLocalStats();
    const hasExcessiveViolations = rateLimitStats.violations > 10;
    checks.push({
      name: 'Rate Limiting',
      status: hasExcessiveViolations ? 'warn' : 'pass' as const,
      message: hasExcessiveViolations ? 
        `${rateLimitStats.violations} violations detected` : 
        'Normal activity'
    });
    if (!hasExcessiveViolations) score += 15;

    // Determine overall status
    let overall: 'secure' | 'warning' | 'critical';
    if (score >= 85) overall = 'secure';
    else if (score >= 60) overall = 'warning';
    else overall = 'critical';

    setSecurityStatus({ overall, score, checks });
  };

  const getStatusIcon = () => {
    switch (securityStatus.overall) {
      case 'secure':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'critical':
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusColor = () => {
    switch (securityStatus.overall) {
      case 'secure':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
    }
  };

  const getCheckIcon = (status: 'pass' | 'warn' | 'fail') => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warn':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  if (!import.meta.env.PROD) {
    return null; // Don't show in development
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div 
        className={`border rounded-lg shadow-lg cursor-pointer transition-all ${getStatusColor()}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="p-3 flex items-center gap-2">
          <Shield className="h-5 w-5" />
          {getStatusIcon()}
          <span className="font-medium">Security: {securityStatus.score}%</span>
          {!isExpanded && (
            <span className="text-xs opacity-75">Click to expand</span>
          )}
        </div>

        {isExpanded && (
          <div className="border-t border-current/20 p-3 space-y-2">
            <div className="text-sm font-medium mb-2">Security Checks:</div>
            {securityStatus.checks.map((check, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                {getCheckIcon(check.status)}
                <span className="flex-1">{check.name}</span>
                <span className="opacity-75">{check.message}</span>
              </div>
            ))}
            <div className="text-xs opacity-75 mt-2">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
