
import { productionLogger } from '@/utils/productionLogger';

interface IPValidationResult {
  ip: string;
  isValid: boolean;
  source: 'header' | 'webrtc' | 'external' | 'fallback';
  confidence: 'high' | 'medium' | 'low';
}

interface IPGeolocation {
  country?: string;
  region?: string;
  city?: string;
  isp?: string;
  isVpn?: boolean;
  isTor?: boolean;
}

class EnhancedIPValidation {
  private static instance: EnhancedIPValidation;
  private cachedIP: string | null = null;
  private lastIPCheck: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static getInstance(): EnhancedIPValidation {
    if (!EnhancedIPValidation.instance) {
      EnhancedIPValidation.instance = new EnhancedIPValidation();
    }
    return EnhancedIPValidation.instance;
  }

  async getClientIP(): Promise<IPValidationResult> {
    const now = Date.now();
    
    // Return cached IP if still valid
    if (this.cachedIP && (now - this.lastIPCheck) < this.CACHE_DURATION) {
      return {
        ip: this.cachedIP,
        isValid: true,
        source: 'header',
        confidence: 'high'
      };
    }

    try {
      // Try multiple methods in order of preference
      const methods = [
        () => this.getIPFromHeaders(),
        () => this.getIPFromWebRTC(),
        () => this.getIPFromExternalService()
      ];

      for (const method of methods) {
        try {
          const result = await method();
          if (result.isValid) {
            this.cachedIP = result.ip;
            this.lastIPCheck = now;
            return result;
          }
        } catch (error) {
          productionLogger.warn('IP detection method failed', error, 'EnhancedIPValidation');
          continue;
        }
      }

      // Fallback to unknown
      return {
        ip: 'unknown',
        isValid: false,
        source: 'fallback',
        confidence: 'low'
      };
    } catch (error) {
      productionLogger.error('All IP detection methods failed', error, 'EnhancedIPValidation');
      return {
        ip: 'unknown',
        isValid: false,
        source: 'fallback',
        confidence: 'low'
      };
    }
  }

  private async getIPFromHeaders(): Promise<IPValidationResult> {
    // This would be implemented server-side in a real application
    // For now, we'll simulate checking common headers
    return {
      ip: 'header-detected',
      isValid: false,
      source: 'header',
      confidence: 'low'
    };
  }

  private async getIPFromWebRTC(): Promise<IPValidationResult> {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        resolve({
          ip: 'webrtc-timeout',
          isValid: false,
          source: 'webrtc',
          confidence: 'low'
        });
      }, 3000);

      try {
        const rtcPeerConnection = new RTCPeerConnection({
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });

        rtcPeerConnection.createDataChannel('');
        
        rtcPeerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            const candidate = event.candidate.candidate;
            const ipMatch = candidate.match(/([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/);
            
            if (ipMatch && this.isValidIP(ipMatch[0])) {
              clearTimeout(timeout);
              rtcPeerConnection.close();
              resolve({
                ip: ipMatch[0],
                isValid: true,
                source: 'webrtc',
                confidence: 'medium'
              });
            }
          }
        };

        rtcPeerConnection.createOffer()
          .then(offer => rtcPeerConnection.setLocalDescription(offer))
          .catch(() => {
            clearTimeout(timeout);
            resolve({
              ip: 'webrtc-error',
              isValid: false,
              source: 'webrtc',
              confidence: 'low'
            });
          });
      } catch (error) {
        clearTimeout(timeout);
        resolve({
          ip: 'webrtc-unavailable',
          isValid: false,
          source: 'webrtc',
          confidence: 'low'
        });
      }
    });
  }

  private async getIPFromExternalService(): Promise<IPValidationResult> {
    try {
      // Only use external service as last resort and with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch('https://api.ipify.org?format=json', {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json'
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      const ip = data.ip;

      if (this.isValidIP(ip)) {
        return {
          ip,
          isValid: true,
          source: 'external',
          confidence: 'medium'
        };
      }

      throw new Error('Invalid IP format from external service');
    } catch (error) {
      return {
        ip: 'external-error',
        isValid: false,
        source: 'external',
        confidence: 'low'
      };
    }
  }

  private isValidIP(ip: string): boolean {
    // IPv4 validation
    const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    
    // IPv6 validation (simplified)
    const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    
    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
  }

  async analyzeIPSecurity(ip: string): Promise<{
    isHighRisk: boolean;
    riskFactors: string[];
    geolocation?: IPGeolocation;
  }> {
    const riskFactors: string[] = [];
    
    // Check for common VPN/Proxy IP ranges (simplified)
    if (this.isKnownVPNRange(ip)) {
      riskFactors.push('vpn_detected');
    }

    // Check for localhost/private IPs
    if (this.isPrivateIP(ip)) {
      riskFactors.push('private_ip');
    }

    // Check for suspicious patterns
    if (this.hasSuspiciousPattern(ip)) {
      riskFactors.push('suspicious_pattern');
    }

    return {
      isHighRisk: riskFactors.length > 0,
      riskFactors,
      geolocation: await this.getBasicGeolocation(ip)
    };
  }

  private isKnownVPNRange(ip: string): boolean {
    // This would check against known VPN/proxy IP ranges
    // For demo purposes, just check some common patterns
    const vpnPatterns = [
      /^10\./, // Private range often used by VPNs
      /^172\.16\./, // Private range
      /^192\.168\./ // Private range
    ];
    
    return vpnPatterns.some(pattern => pattern.test(ip));
  }

  private isPrivateIP(ip: string): boolean {
    const privateRanges = [
      /^127\./, // Loopback
      /^10\./, // Private Class A
      /^172\.(1[6-9]|2[0-9]|3[01])\./, // Private Class B
      /^192\.168\./, // Private Class C
      /^169\.254\./ // Link-local
    ];
    
    return privateRanges.some(range => range.test(ip));
  }

  private hasSuspiciousPattern(ip: string): boolean {
    // Check for patterns that might indicate scanning or attacks
    const suspiciousPatterns = [
      /\.0$/, // Network addresses
      /\.1$/, // Gateway addresses (sometimes)
      /\.255$/ // Broadcast addresses
    ];
    
    return suspiciousPatterns.some(pattern => pattern.test(ip));
  }

  private async getBasicGeolocation(ip: string): Promise<IPGeolocation | undefined> {
    // In a real implementation, this would call a geolocation service
    // For now, return undefined to avoid external dependencies
    return undefined;
  }

  clearCache(): void {
    this.cachedIP = null;
    this.lastIPCheck = 0;
  }
}

export const enhancedIPValidation = EnhancedIPValidation.getInstance();
