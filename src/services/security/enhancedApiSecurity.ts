import { productionLogger } from '@/utils/productionLogger';
import { rateLimitService } from './rateLimitService';

interface ApiSecurityConfig {
  maxRequestSize: number;
  requestTimeout: number;
  maxRetries: number;
  allowedMethods: string[];
  trustedDomains: string[];
}

interface ApiRequest {
  url: string;
  method: string;
  timestamp: number;
  success: boolean;
  responseTime: number;
  statusCode?: number;
}

export class EnhancedApiSecurity {
  private static instance: EnhancedApiSecurity;
  private apiRequests: ApiRequest[] = [];
  private suspiciousPatterns: Set<string> = new Set();

  static getInstance(): EnhancedApiSecurity {
    if (!EnhancedApiSecurity.instance) {
      EnhancedApiSecurity.instance = new EnhancedApiSecurity();
    }
    return EnhancedApiSecurity.instance;
  }

  private readonly config: ApiSecurityConfig = {
    maxRequestSize: 10 * 1024 * 1024, // 10MB
    requestTimeout: 30000, // 30 seconds
    maxRetries: 3,
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    trustedDomains: [
      'sxcbpmqsbcpsljwwwwyv.supabase.co',
      'api.github.com',
      'fonts.googleapis.com',
      'fonts.gstatic.com'
    ]
  };

  async secureApiRequest<T>(
    url: string, 
    options: RequestInit = {},
    bypassRateLimit: boolean = false
  ): Promise<T> {
    const startTime = Date.now();
    const method = options.method?.toUpperCase() || 'GET';
    
    try {
      // Rate limiting check
      if (!bypassRateLimit) {
        const rateLimitResult = await rateLimitService.checkRateLimit(
          `api:${this.extractDomain(url)}`, 
          'api'
        );
        
        if (!rateLimitResult.allowed) {
          throw new Error(`Rate limit exceeded for ${this.extractDomain(url)}`);
        }
      }

      // URL security validation
      const urlValidation = this.validateSecureUrl(url);
      if (!urlValidation.isValid) {
        throw new Error(`Unsafe URL rejected: ${urlValidation.reason}`);
      }

      // Method validation
      if (!this.config.allowedMethods.includes(method)) {
        throw new Error(`HTTP method ${method} not allowed`);
      }

      // Request size validation
      if (options.body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        const bodySize = new Blob([options.body as string]).size;
        if (bodySize > this.config.maxRequestSize) {
          throw new Error(`Request body too large: ${bodySize} bytes (max: ${this.config.maxRequestSize})`);
        }
      }

      // Create secure request options
      const secureOptions: RequestInit = {
        ...options,
        method,
        signal: AbortSignal.timeout(this.config.requestTimeout),
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'X-Frame-Options': 'DENY',
          'X-Content-Type-Options': 'nosniff',
          ...options.headers
        }
      };

      let lastError: Error;
      
      // Implement retry logic with exponential backoff
      for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
        try {
          productionLogger.info('Making secure API request', {
            url: this.sanitizeUrl(url),
            method,
            attempt,
            domain: this.extractDomain(url)
          }, 'ApiSecurity');

          const response = await fetch(url, secureOptions);
          const responseTime = Date.now() - startTime;
          
          this.logApiRequest({
            url: this.sanitizeUrl(url),
            method,
            timestamp: startTime,
            success: response.ok,
            responseTime,
            statusCode: response.status
          });
          
          if (!response.ok) {
            const errorText = await this.sanitizeErrorResponse(response);
            throw new Error(`HTTP ${response.status}: ${errorText}`);
          }

          // Validate response content type
          const contentType = response.headers.get('content-type');
          if (contentType && !contentType.includes('application/json') && !contentType.includes('text/')) {
            productionLogger.warn('Unexpected content type in API response', {
              contentType,
              url: this.sanitizeUrl(url)
            }, 'ApiSecurity');
          }

          const data = await response.json();
          return this.sanitizeApiResponse(data);
          
        } catch (error) {
          lastError = error as Error;
          
          this.logApiRequest({
            url: this.sanitizeUrl(url),
            method,
            timestamp: startTime,
            success: false,
            responseTime: Date.now() - startTime
          });
          
          productionLogger.warn('API request failed', {
            url: this.sanitizeUrl(url),
            method,
            attempt,
            error: error instanceof Error ? error.message : 'Unknown error'
          }, 'ApiSecurity');

          if (attempt === this.config.maxRetries) {
            break;
          }

          // Exponential backoff: 1s, 2s, 4s
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt - 1) * 1000));
        }
      }

      throw new Error(`API request failed after ${this.config.maxRetries} attempts: ${lastError.message}`);
      
    } catch (error) {
      this.detectSuspiciousActivity(url, method, error as Error);
      throw error;
    }
  }

  validateSecureUrl(url: string): { isValid: boolean; reason?: string; sanitizedUrl?: string } {
    try {
      const urlObj = new URL(url);
      
      // Protocol check
      if (urlObj.protocol !== 'https:' && urlObj.protocol !== 'http:') {
        return { isValid: false, reason: 'Only HTTP/HTTPS protocols allowed' };
      }
      
      // Localhost exception for development
      const isLocalhost = urlObj.hostname === 'localhost' || urlObj.hostname === '127.0.0.1';
      
      if (urlObj.protocol === 'http:' && !isLocalhost) {
        return { isValid: false, reason: 'HTTP not allowed for external requests' };
      }
      
      // Domain whitelist check (optional - can be disabled for flexibility)
      const domain = urlObj.hostname;
      const isTrustedDomain = this.config.trustedDomains.some(trusted => 
        domain === trusted || domain.endsWith('.' + trusted)
      );
      
      // Log but don't block untrusted domains - allow flexibility
      if (!isTrustedDomain && !isLocalhost) {
        productionLogger.info('Request to untrusted domain', { domain }, 'ApiSecurity');
      }
      
      // Check for suspicious patterns
      const suspiciousPatterns = [
        /[<>'"]/,  // HTML/JS injection attempts
        /\.\./,    // Path traversal
        /[\x00-\x1f\x7f]/  // Control characters
      ];
      
      for (const pattern of suspiciousPatterns) {
        if (pattern.test(url)) {
          return { isValid: false, reason: 'Suspicious characters in URL' };
        }
      }
      
      return { 
        isValid: true, 
        sanitizedUrl: urlObj.toString() 
      };
      
    } catch (error) {
      return { isValid: false, reason: 'Invalid URL format' };
    }
  }

  private async sanitizeErrorResponse(response: Response): Promise<string> {
    try {
      const text = await response.text();
      // Remove potentially sensitive information from error messages
      return text
        .replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, '[IP_REDACTED]')
        .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL_REDACTED]')
        .replace(/\b[A-F0-9]{8}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{12}\b/gi, '[UUID_REDACTED]')
        .replace(/password|token|secret|key|api_key/gi, '[SENSITIVE_DATA]')
        .substring(0, 500); // Limit error message length
    } catch {
      return 'Request failed';
    }
  }

  private sanitizeApiResponse<T>(data: any): T {
    if (typeof data === 'object' && data !== null) {
      const sensitiveFields = [
        'password', 'token', 'secret', 'key', 'apiKey', 'privateKey',
        'accessToken', 'refreshToken', 'sessionToken', 'authToken'
      ];
      
      const sanitized = { ...data };
      
      const sanitizeObject = (obj: any): any => {
        if (Array.isArray(obj)) {
          return obj.map(sanitizeObject);
        }
        
        if (typeof obj === 'object' && obj !== null) {
          const result: any = {};
          for (const [key, value] of Object.entries(obj)) {
            if (sensitiveFields.some(field => key.toLowerCase().includes(field.toLowerCase()))) {
              result[key] = '[REDACTED]';
            } else {
              result[key] = sanitizeObject(value);
            }
          }
          return result;
        }
        
        return obj;
      };
      
      return sanitizeObject(sanitized);
    }
    
    return data;
  }

  private logApiRequest(request: ApiRequest): void {
    this.apiRequests.push(request);
    
    // Keep only last 1000 requests
    if (this.apiRequests.length > 1000) {
      this.apiRequests = this.apiRequests.slice(-1000);
    }
    
    productionLogger.secureInfo('API request logged', {
      method: request.method,
      success: request.success,
      responseTime: request.responseTime,
      statusCode: request.statusCode
    }, 'ApiSecurity');
  }

  private detectSuspiciousActivity(url: string, method: string, error: Error): void {
    const pattern = `${method}:${this.extractDomain(url)}`;
    
    // Count recent failures for this pattern
    const recentFailures = this.apiRequests.filter(req => 
      req.url.includes(this.extractDomain(url)) &&
      req.method === method &&
      !req.success &&
      Date.now() - req.timestamp < 300000 // Last 5 minutes
    ).length;
    
    if (recentFailures >= 5) {
      this.suspiciousPatterns.add(pattern);
      
      productionLogger.warn('Suspicious API activity detected', {
        pattern,
        recentFailures,
        error: error.message
      }, 'ApiSecurity');
    }
  }

  private extractDomain(url: string): string {
    try {
      return new URL(url).hostname;
    } catch {
      return 'unknown';
    }
  }

  private sanitizeUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      // Remove query parameters that might contain sensitive data
      urlObj.search = '';
      return urlObj.toString();
    } catch {
      return 'invalid-url';
    }
  }

  getApiSecurityStats(): {
    totalRequests: number;
    successfulRequests: number;
    failedRequests: number;
    averageResponseTime: number;
    suspiciousPatterns: number;
    topDomains: Array<{ domain: string; count: number }>;
  } {
    const total = this.apiRequests.length;
    const successful = this.apiRequests.filter(r => r.success).length;
    const failed = total - successful;
    
    const totalResponseTime = this.apiRequests.reduce((sum, req) => sum + req.responseTime, 0);
    const averageResponseTime = total > 0 ? Math.round(totalResponseTime / total) : 0;
    
    // Count requests by domain
    const domainCounts = new Map<string, number>();
    this.apiRequests.forEach(req => {
      const domain = this.extractDomain(req.url);
      domainCounts.set(domain, (domainCounts.get(domain) || 0) + 1);
    });
    
    const topDomains = Array.from(domainCounts.entries())
      .map(([domain, count]) => ({ domain, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    return {
      totalRequests: total,
      successfulRequests: successful,
      failedRequests: failed,
      averageResponseTime,
      suspiciousPatterns: this.suspiciousPatterns.size,
      topDomains
    };
  }
}

export const enhancedApiSecurity = EnhancedApiSecurity.getInstance();
