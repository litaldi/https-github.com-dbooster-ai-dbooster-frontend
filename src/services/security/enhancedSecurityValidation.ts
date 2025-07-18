
import { productionLogger } from '@/utils/productionLogger';
import { supabase } from '@/integrations/supabase/client';

interface SecurityValidationResult {
  isValid: boolean;
  reason?: string;
  riskScore: number;
}

interface SessionValidationOptions {
  requireSecureContext?: boolean;
  checkDeviceFingerprint?: boolean;
  validateTimestamp?: boolean;
}

class EnhancedSecurityValidation {
  private static instance: EnhancedSecurityValidation;

  static getInstance(): EnhancedSecurityValidation {
    if (!EnhancedSecurityValidation.instance) {
      EnhancedSecurityValidation.instance = new EnhancedSecurityValidation();
    }
    return EnhancedSecurityValidation.instance;
  }

  async validateSupabaseSession(session: any): Promise<SecurityValidationResult> {
    let riskScore = 0;
    
    if (!session || !session.access_token) {
      return { isValid: false, reason: 'No valid session found', riskScore: 100 };
    }

    // Check if session is expired
    if (session.expires_at && Date.now() / 1000 > session.expires_at) {
      return { isValid: false, reason: 'Session expired', riskScore: 100 };
    }

    // Validate token format
    if (!this.isValidJWT(session.access_token)) {
      riskScore += 50;
      productionLogger.warn('Invalid JWT format detected');
    }

    // Check for secure context
    if (!window.isSecureContext) {
      riskScore += 30;
      productionLogger.warn('Session not in secure context');
    }

    // Validate session metadata
    if (session.user) {
      const userValidation = await this.validateUserMetadata(session.user);
      riskScore += userValidation.riskScore;
    }

    return {
      isValid: riskScore < 70,
      reason: riskScore >= 70 ? 'High risk session detected' : undefined,
      riskScore
    };
  }

  async enhancedDemoSessionValidation(
    sessionId: string, 
    token: string,
    options: SessionValidationOptions = {}
  ): Promise<SecurityValidationResult> {
    let riskScore = 0;

    // Enhanced device fingerprinting
    const currentFingerprint = await this.generateEnhancedFingerprint();
    
    // Server-side session validation (simulated for demo)
    const serverValidation = await this.validateSessionWithServer(sessionId, token);
    if (!serverValidation.isValid) {
      return { isValid: false, reason: 'Server session validation failed', riskScore: 100 };
    }

    // Check session binding
    const bindingValidation = await this.validateSessionBinding(sessionId, currentFingerprint);
    if (!bindingValidation.isValid) {
      riskScore += 60;
      productionLogger.warn('Session binding validation failed', { sessionId: sessionId.substring(0, 8) });
    }

    // Enhanced timestamp validation
    if (options.validateTimestamp) {
      const timestampValidation = this.validateSessionTimestamp(token);
      riskScore += timestampValidation.riskScore;
    }

    return {
      isValid: riskScore < 50,
      reason: riskScore >= 50 ? 'Enhanced demo session validation failed' : undefined,
      riskScore
    };
  }

  private async generateEnhancedFingerprint(): Promise<string> {
    const components = [
      navigator.userAgent,
      navigator.language,
      navigator.languages?.join(',') || '',
      screen.width + 'x' + screen.height + 'x' + screen.colorDepth,
      new Date().getTimezoneOffset().toString(),
      navigator.hardwareConcurrency?.toString() || '0',
      navigator.cookieEnabled.toString(),
      navigator.doNotTrack || 'unknown',
      navigator.platform,
      // Hardware entropy when available
      (navigator as any).deviceMemory?.toString() || '0',
      (navigator as any).connection?.effectiveType || 'unknown'
    ];

    // Add canvas fingerprint for additional entropy
    const canvasFingerprint = await this.generateCanvasFingerprint();
    components.push(canvasFingerprint);

    const fingerprint = components.join('|');
    const encoder = new TextEncoder();
    const data = encoder.encode(fingerprint);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private async generateCanvasFingerprint(): Promise<string> {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return 'no-canvas';

      canvas.width = 200;
      canvas.height = 50;
      
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillStyle = '#f60';
      ctx.fillRect(125, 1, 62, 20);
      ctx.fillStyle = '#069';
      ctx.fillText('Security fingerprint', 2, 15);
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
      ctx.fillText('Enhanced validation', 4, 17);

      const dataURL = canvas.toDataURL();
      const encoder = new TextEncoder();
      const data = encoder.encode(dataURL);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16);
    } catch {
      return 'canvas-error';
    }
  }

  private async validateSessionWithServer(sessionId: string, token: string): Promise<SecurityValidationResult> {
    // In a real implementation, this would make a server call
    // For now, we'll simulate server-side validation
    const isValidFormat = sessionId.length === 64 && token.length === 64;
    const isValidChars = /^[a-f0-9]+$/.test(sessionId) && /^[a-f0-9]+$/.test(token);
    
    return {
      isValid: isValidFormat && isValidChars,
      riskScore: isValidFormat && isValidChars ? 0 : 100
    };
  }

  private async validateSessionBinding(sessionId: string, fingerprint: string): Promise<SecurityValidationResult> {
    // Check if session is properly bound to device
    try {
      const storedBinding = localStorage.getItem(`session_binding_${sessionId}`);
      if (!storedBinding) {
        // First time binding
        localStorage.setItem(`session_binding_${sessionId}`, fingerprint);
        return { isValid: true, riskScore: 0 };
      }

      const isMatching = storedBinding === fingerprint;
      return {
        isValid: isMatching,
        riskScore: isMatching ? 0 : 70
      };
    } catch {
      return { isValid: false, riskScore: 50 };
    }
  }

  private validateSessionTimestamp(token: string): { riskScore: number } {
    try {
      // Basic timestamp validation for demo tokens
      const tokenAge = Date.now() - parseInt(token.substring(0, 13), 16);
      const maxAge = 60 * 60 * 1000; // 1 hour
      
      if (tokenAge > maxAge) {
        return { riskScore: 40 };
      }
      
      return { riskScore: 0 };
    } catch {
      return { riskScore: 20 };
    }
  }

  private async validateUserMetadata(user: any): Promise<SecurityValidationResult> {
    let riskScore = 0;

    // Check for suspicious user metadata
    if (!user.email_confirmed_at && !user.phone_confirmed_at) {
      riskScore += 20;
    }

    // Check for recent account creation
    if (user.created_at) {
      const accountAge = Date.now() - new Date(user.created_at).getTime();
      const minAge = 5 * 60 * 1000; // 5 minutes
      
      if (accountAge < minAge) {
        riskScore += 10;
      }
    }

    return { isValid: riskScore < 30, riskScore };
  }

  private isValidJWT(token: string): boolean {
    const parts = token.split('.');
    return parts.length === 3 && parts.every(part => part.length > 0);
  }

  async performSecurityHealthCheck(): Promise<{
    overall: 'healthy' | 'warning' | 'critical';
    checks: Array<{ name: string; status: 'pass' | 'fail'; details?: string }>;
  }> {
    const checks = [];

    // Check HTTPS
    checks.push({
      name: 'HTTPS Connection',
      status: location.protocol === 'https:' ? 'pass' : 'fail',
      details: location.protocol === 'https:' ? undefined : 'Application not served over HTTPS'
    });

    // Check secure context
    checks.push({
      name: 'Secure Context',
      status: window.isSecureContext ? 'pass' : 'fail',
      details: window.isSecureContext ? undefined : 'Not running in secure context'
    });

    // Check crypto availability
    checks.push({
      name: 'Crypto API',
      status: 'crypto' in window && 'subtle' in crypto ? 'pass' : 'fail',
      details: 'crypto' in window && 'subtle' in crypto ? undefined : 'Crypto API not available'
    });

    // Check CSP
    const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    checks.push({
      name: 'Content Security Policy',
      status: cspMeta ? 'pass' : 'fail',
      details: cspMeta ? undefined : 'CSP not configured'
    });

    const failedChecks = checks.filter(check => check.status === 'fail').length;
    const overall = failedChecks === 0 ? 'healthy' : failedChecks <= 2 ? 'warning' : 'critical';

    return { overall, checks };
  }
}

export const enhancedSecurityValidation = EnhancedSecurityValidation.getInstance();
