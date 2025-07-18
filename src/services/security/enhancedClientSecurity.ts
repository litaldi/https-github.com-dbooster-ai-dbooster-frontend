
import { productionLogger } from '@/utils/productionLogger';

interface SecurityMetrics {
  entropyScore: number;
  securityLevel: 'low' | 'medium' | 'high' | 'critical';
  vulnerabilities: string[];
  recommendations: string[];
}

interface EnhancedEntropy {
  data: string;
  score: number;
  sources: string[];
}

class EnhancedClientSecurity {
  private static instance: EnhancedClientSecurity;
  private readonly securityMetrics: SecurityMetrics;

  private constructor() {
    this.securityMetrics = {
      entropyScore: 0,
      securityLevel: 'medium',
      vulnerabilities: [],
      recommendations: []
    };
  }

  static getInstance(): EnhancedClientSecurity {
    if (!EnhancedClientSecurity.instance) {
      EnhancedClientSecurity.instance = new EnhancedClientSecurity();
    }
    return EnhancedClientSecurity.instance;
  }

  async generateSecureKey(): Promise<string> {
    try {
      // Use a simpler approach that doesn't require key extraction
      const array = new Uint8Array(32);
      crypto.getRandomValues(array);
      
      // Convert to hex string
      const hexString = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
      
      // Add additional entropy from browser environment
      const timestamp = Date.now().toString();
      const random = Math.random().toString(36).substring(2);
      const combined = `${hexString}-${timestamp}-${random}`;
      
      // Hash the combined string for additional security
      const encoder = new TextEncoder();
      const data = encoder.encode(combined);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (error) {
      productionLogger.error('Failed to generate secure key', error, 'EnhancedClientSecurity');
      
      // Fallback to simple random generation
      const array = new Uint8Array(32);
      crypto.getRandomValues(array);
      return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    }
  }

  async collectEnhancedEntropy(): Promise<EnhancedEntropy> {
    const sources: string[] = [];
    let entropyData = '';
    let score = 0;

    try {
      // System time
      const timestamp = Date.now();
      entropyData += timestamp.toString();
      sources.push('timestamp');
      score += 10;

      // Random values
      const randomArray = new Uint8Array(16);
      crypto.getRandomValues(randomArray);
      entropyData += Array.from(randomArray).join('');
      sources.push('crypto.getRandomValues');
      score += 20;

      // Browser fingerprinting
      const fingerprint = [
        navigator.userAgent,
        screen.width + 'x' + screen.height,
        navigator.language,
        new Date().getTimezoneOffset().toString()
      ].join('|');
      
      entropyData += fingerprint;
      sources.push('browser-fingerprint');
      score += 15;

      // Performance timing
      if (performance && performance.now) {
        entropyData += performance.now().toString();
        sources.push('performance');
        score += 5;
      }

    } catch (error) {
      productionLogger.warn('Error collecting entropy', error, 'EnhancedClientSecurity');
    }

    return {
      data: entropyData,
      score: Math.min(score, 100),
      sources
    };
  }

  async getSecurityMetrics(): Promise<SecurityMetrics> {
    const metrics: SecurityMetrics = {
      entropyScore: 75, // Base score
      securityLevel: 'high',
      vulnerabilities: [],
      recommendations: []
    };

    // Check for HTTPS
    if (location.protocol !== 'https:') {
      metrics.vulnerabilities.push('insecure-protocol');
      metrics.recommendations.push('Use HTTPS in production');
      metrics.securityLevel = 'medium';
    }

    // Check for crypto support
    if (!window.crypto || !window.crypto.subtle) {
      metrics.vulnerabilities.push('no-webcrypto');
      metrics.recommendations.push('Update browser for WebCrypto support');
      metrics.securityLevel = 'low';
    }

    // Adjust security level based on vulnerabilities
    if (metrics.vulnerabilities.length === 0) {
      metrics.securityLevel = 'critical';
      metrics.entropyScore = 95;
    } else if (metrics.vulnerabilities.length <= 2) {
      metrics.securityLevel = 'high';
      metrics.entropyScore = 80;
    } else {
      metrics.securityLevel = 'medium';
      metrics.entropyScore = 60;
    }

    return metrics;
  }

  validateInput(input: string, maxLength: number = 1000): boolean {
    if (!input || typeof input !== 'string') return false;
    if (input.length > maxLength) return false;
    
    // Check for suspicious patterns
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+\s*=/i,
      /<iframe/i,
      /eval\(/i
    ];

    return !suspiciousPatterns.some(pattern => pattern.test(input));
  }

  sanitizeString(input: string): string {
    if (!input || typeof input !== 'string') return '';
    
    return input
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .trim()
      .substring(0, 1000); // Limit length
  }
}

export const enhancedClientSecurity = EnhancedClientSecurity.getInstance();
