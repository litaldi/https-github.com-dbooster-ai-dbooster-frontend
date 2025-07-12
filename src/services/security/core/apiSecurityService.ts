
import { apiSecurity } from '../apiSecurityEnhancement';

export class ApiSecurityService {
  private static instance: ApiSecurityService;

  static getInstance(): ApiSecurityService {
    if (!ApiSecurityService.instance) {
      ApiSecurityService.instance = new ApiSecurityService();
    }
    return ApiSecurityService.instance;
  }

  async makeSecureApiRequest<T>(url: string, options?: RequestInit): Promise<T> {
    return apiSecurity.secureApiRequest<T>(url, options);
  }

  async makeSecureGitHubRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return apiSecurity.secureGitHubApiRequest<T>(endpoint, options);
  }
}
