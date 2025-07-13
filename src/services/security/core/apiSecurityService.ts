
import { enhancedSecurityHeaders } from '../enhancedSecurityHeaders';
import { productionLogger } from '@/utils/productionLogger';

export class ApiSecurityService {
  private static instance: ApiSecurityService;

  static getInstance(): ApiSecurityService {
    if (!ApiSecurityService.instance) {
      ApiSecurityService.instance = new ApiSecurityService();
    }
    return ApiSecurityService.instance;
  }

  async makeSecureApiRequest<T>(url: string, options?: RequestInit): Promise<T> {
    try {
      const urlValidation = enhancedSecurityHeaders.validateSecureUrl(url);
      if (!urlValidation.isValid) {
        throw new Error(`Insecure URL: ${urlValidation.reason}`);
      }

      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      productionLogger.error('Secure API request failed', error, 'ApiSecurityService');
      throw error;
    }
  }

  async makeSecureGitHubRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const githubUrl = `https://api.github.com${endpoint}`;
    return this.makeSecureApiRequest<T>(githubUrl, options);
  }
}
