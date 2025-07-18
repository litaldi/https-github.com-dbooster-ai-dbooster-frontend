
import { securityInitializationCore } from './security/core/securityInitializationCore';

export class SecurityInitializer {
  private static instance: SecurityInitializer;

  static getInstance(): SecurityInitializer {
    if (!SecurityInitializer.instance) {
      SecurityInitializer.instance = new SecurityInitializer();
    }
    return SecurityInitializer.instance;
  }

  async initializeComprehensiveSecurity(): Promise<void> {
    return securityInitializationCore.initializeComprehensiveSecurity();
  }
}

export const securityInitializer = SecurityInitializer.getInstance();
