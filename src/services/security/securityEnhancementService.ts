
import { inputValidationService } from './inputValidationService';
import { authSecurityService } from './authSecurityService';
import { sessionSecurityService } from './sessionSecurityService';
import { repositorySecurityService } from './repositorySecurityService';

interface SecurityValidationResult {
  isValid: boolean;
  errors: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

export class SecurityEnhancementService {
  private static instance: SecurityEnhancementService;

  static getInstance(): SecurityEnhancementService {
    if (!SecurityEnhancementService.instance) {
      SecurityEnhancementService.instance = new SecurityEnhancementService();
    }
    return SecurityEnhancementService.instance;
  }

  async validateUserInput(input: any, context: string): Promise<SecurityValidationResult> {
    return inputValidationService.validateUserInput(input, context);
  }

  async validateAuthenticationSecurity(email: string): Promise<{ allowed: boolean; reason?: string }> {
    return authSecurityService.validateAuthenticationSecurity(email);
  }

  async validateSessionSecurity(): Promise<boolean> {
    return sessionSecurityService.validateSessionSecurity();
  }

  async validateRepositoryAccess(repositoryId: string, action: 'read' | 'write' | 'delete'): Promise<boolean> {
    return repositorySecurityService.validateRepositoryAccess(repositoryId, action);
  }
}

export const securityEnhancementService = SecurityEnhancementService.getInstance();
