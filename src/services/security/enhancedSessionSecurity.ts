import { productionLogger } from '@/utils/productionLogger';
import { enhancedClientSecurity } from './enhancedClientSecurity';
import { secureStorageService } from './secureStorageService';

interface SessionSecurityMetrics {
  deviceFingerprint: string;
  securityScore: number;
  lastValidation: number;
  anomalyDetected: boolean;
  validationHistory: Array<{
    timestamp: number;
    score: number;
    fingerprint: string;
  }>;
}

interface SessionValidationResult {
  isValid: boolean;
  reason?: string;
  shouldReauthenticate: boolean;
  securityScore: number;
}

class EnhancedSessionSecurity {
  private static instance: EnhancedSessionSecurity;
  private sessionMetrics = new Map<string, SessionSecurityMetrics>();
  private readonly VALIDATION_INTERVAL = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_VALIDATION_HISTORY = 10;
  private readonly ANOMALY_THRESHOLD = 0.7; // 70% similarity threshold

  static getInstance(): EnhancedSessionSecurity {
    if (!EnhancedSessionSecurity.instance) {
      EnhancedSessionSecurity.instance = new EnhancedSessionSecurity();
    }
    return EnhancedSessionSecurity.instance;
  }

  async validateSession(sessionId: string, userId: string): Promise<SessionValidationResult> {
    try {
      const currentFingerprint = await this.generateSessionFingerprint();
      const securityMetrics = await enhancedClientSecurity.getSecurityMetrics();
      
      let metrics = this.sessionMetrics.get(sessionId);
      
      if (!metrics) {
        // First validation - establish baseline
        metrics = {
          deviceFingerprint: currentFingerprint,
          securityScore: securityMetrics.entropyScore,
          lastValidation: Date.now(),
          anomalyDetected: false,
          validationHistory: []
        };
        this.sessionMetrics.set(sessionId, metrics);
        
        return {
          isValid: true,
          shouldReauthenticate: false,
          securityScore: securityMetrics.entropyScore
        };
      }

      // Check if validation is needed
      const timeSinceLastValidation = Date.now() - metrics.lastValidation;
      if (timeSinceLastValidation < this.VALIDATION_INTERVAL) {
        return {
          isValid: true,
          shouldReauthenticate: false,
          securityScore: metrics.securityScore
        };
      }

      // Perform anomaly detection
      const anomalyResult = await this.detectSessionAnomaly(metrics, currentFingerprint, securityMetrics);
      
      // Update metrics
      metrics.lastValidation = Date.now();
      metrics.anomalyDetected = anomalyResult.anomalyDetected;
      metrics.validationHistory.push({
        timestamp: Date.now(),
        score: securityMetrics.entropyScore,
        fingerprint: currentFingerprint
      });

      // Keep only recent history
      if (metrics.validationHistory.length > this.MAX_VALIDATION_HISTORY) {
        metrics.validationHistory = metrics.validationHistory.slice(-this.MAX_VALIDATION_HISTORY);
      }

      if (anomalyResult.anomalyDetected) {
        productionLogger.warn('Session anomaly detected', {
          sessionId: sessionId.substring(0, 8),
          userId: userId.substring(0, 8),
          reason: anomalyResult.reason,
          securityScore: securityMetrics.entropyScore
        }, 'EnhancedSessionSecurity');

        return {
          isValid: false,
          reason: anomalyResult.reason,
          shouldReauthenticate: true,
          securityScore: securityMetrics.entropyScore
        };
      }

      return {
        isValid: true,
        shouldReauthenticate: false,
        securityScore: securityMetrics.entropyScore
      };
    } catch (error) {
      productionLogger.error('Session validation failed', error, 'EnhancedSessionSecurity');
      return {
        isValid: false,
        reason: 'Validation error occurred',
        shouldReauthenticate: true,
        securityScore: 0
      };
    }
  }

  private async detectSessionAnomaly(
    metrics: SessionSecurityMetrics,
    currentFingerprint: string,
    securityMetrics: any
  ): Promise<{ anomalyDetected: boolean; reason?: string }> {
    // Check device fingerprint similarity
    const fingerprintSimilarity = this.calculateSimilarity(
      metrics.deviceFingerprint,
      currentFingerprint
    );

    if (fingerprintSimilarity < this.ANOMALY_THRESHOLD) {
      return {
        anomalyDetected: true,
        reason: 'Device fingerprint mismatch detected'
      };
    }

    // Check for significant security score degradation
    const scoreDegradation = metrics.securityScore - securityMetrics.entropyScore;
    if (scoreDegradation > 50) {
      return {
        anomalyDetected: true,
        reason: 'Significant security score degradation'
      };
    }

    // Check validation history for patterns
    if (metrics.validationHistory.length >= 3) {
      const recentValidations = metrics.validationHistory.slice(-3);
      const fingerprintChanges = recentValidations.map(v => 
        this.calculateSimilarity(metrics.deviceFingerprint, v.fingerprint)
      );
      
      const averageSimilarity = fingerprintChanges.reduce((a, b) => a + b, 0) / fingerprintChanges.length;
      if (averageSimilarity < this.ANOMALY_THRESHOLD) {
        return {
          anomalyDetected: true,
          reason: 'Consistent device fingerprint anomalies detected'
        };
      }
    }

    return { anomalyDetected: false };
  }

  private async generateSessionFingerprint(): Promise<string> {
    const components = [
      navigator.userAgent,
      screen.width + 'x' + screen.height,
      navigator.language,
      navigator.platform,
      new Date().getTimezoneOffset().toString(),
      navigator.hardwareConcurrency?.toString() || '0'
    ];

    // Add WebGL fingerprint if available
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl');
      if (gl) {
        const renderer = gl.getParameter(gl.RENDERER);
        const vendor = gl.getParameter(gl.VENDOR);
        components.push(`${vendor}|${renderer}`);
      }
    } catch {
      components.push('webgl-unavailable');
    }

    const combined = components.join('|');
    const encoder = new TextEncoder();
    const data = encoder.encode(combined);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  private calculateSimilarity(str1: string, str2: string): number {
    if (str1 === str2) return 1.0;
    
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) return 1.0;
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  async invalidateSession(sessionId: string): Promise<void> {
    this.sessionMetrics.delete(sessionId);
    await secureStorageService.removeSecureItem(`session_${sessionId}`);
    productionLogger.info('Session invalidated', { sessionId: sessionId.substring(0, 8) }, 'EnhancedSessionSecurity');
  }

  getSessionMetrics(sessionId: string): SessionSecurityMetrics | null {
    return this.sessionMetrics.get(sessionId) || null;
  }
}

export const enhancedSessionSecurity = EnhancedSessionSecurity.getInstance();
