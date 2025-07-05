
import { enhancedSecurityHeaders } from './enhancedSecurityHeaders';
import { productionLogger } from '@/utils/productionLogger';

export interface ApiSecurityConfig {
  maxRequestSize: number;
  requestTimeout: number;
  maxRetries: number;
  allowedMethods: string[];
}

export class ApiSecurityEnhancement {
  private static instance: ApiSecurityEnhancement;

  static getInstance(): ApiSecurityEnhancement {
    if (!ApiSecurityEnhancement.instance) {
      ApiSecurityEnhancement.instance = new ApiSecurityEnhancement();
    }
    return ApiSecurityEnhancement.instance;
  }

  private readonly config: ApiSecurityConfig = {
    maxRequestSize: 10 * 1024 * 1024, // 10MB
    requestTimeout: 30000, // 30 seconds
    maxRetries: 3,
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
  };

  async secureApiRequest<T>(
    url: string, 
    options: RequestInit = {}
  ): Promise<T> {
    // Validate URL security
    const urlValidation = enhancedSecurityHeaders.validateSecureUrl(url);
    if (!urlValidation.isValid) {
      throw new Error(`Unsafe URL rejected: ${urlValidation.reason}`);
    }

    // Validate HTTP method
    const method = options.method?.toUpperCase() || 'GET';
    if (!this.config.allowedMethods.includes(method)) {
      throw new Error(`HTTP method ${method} not allowed`);
    }

    // Create secure request options
    const secureOptions: RequestInit = {
      ...options,
      method,
      signal: AbortSignal.timeout(this.config.requestTimeout),
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...options.headers
      }
    };

    // Add request size validation for POST/PUT requests
    if (options.body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      const bodySize = new Blob([options.body as string]).size;
      if (bodySize > this.config.maxRequestSize) {
        throw new Error(`Request body too large: ${bodySize} bytes (max: ${this.config.maxRequestSize})`);
      }
    }

    let lastError: Error;
    
    // Implement retry logic with exponential backoff
    for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
      try {
        productionLogger.info('Making secure API request', {
          url: urlValidation.sanitizedUrl,
          method,
          attempt
        }, 'ApiSecurity');

        const response = await fetch(urlValidation.sanitizedUrl!, secureOptions);
        
        if (!response.ok) {
          const errorText = await this.sanitizeErrorResponse(response);
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        return this.sanitizeApiResponse(data);
      } catch (error) {
        lastError = error as Error;
        
        productionLogger.warn('API request failed', {
          url: urlValidation.sanitizedUrl,
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
  }

  private async sanitizeErrorResponse(response: Response): Promise<string> {
    try {
      const text = await response.text();
      // Remove potentially sensitive information from error messages
      return text
        .replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, '[IP_REDACTED]')
        .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL_REDACTED]')
        .replace(/\b[A-F0-9]{8}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{12}\b/gi, '[UUID_REDACTED]')
        .substring(0, 500); // Limit error message length
    } catch {
      return 'Request failed';
    }
  }

  private sanitizeApiResponse<T>(data: any): T {
    // Remove potentially sensitive fields from API responses
    if (typeof data === 'object' && data !== null) {
      const sensitiveFields = ['password', 'token', 'secret', 'key', 'apiKey', 'privateKey'];
      const sanitized = { ...data };
      
      sensitiveFields.forEach(field => {
        if (field in sanitized) {
          delete sanitized[field];
        }
      });
      
      return sanitized;
    }
    
    return data;
  }

  // GitHub API specific security enhancements
  async secureGitHubApiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const githubUrl = `https://api.github.com${endpoint}`;
    
    // Add GitHub-specific headers
    const githubOptions: RequestInit = {
      ...options,
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'DBooster-Security-Enhanced',
        ...options.headers
      }
    };

    return this.secureApiRequest<T>(githubUrl, githubOptions);
  }
}

export const apiSecurity = ApiSecurityEnhancement.getInstance();
