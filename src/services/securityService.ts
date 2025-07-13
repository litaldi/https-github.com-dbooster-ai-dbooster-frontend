
import { MonitoringService } from './security/core/monitoringService';

export const securityService = {
  async getEnhancedSecuritySummary() {
    const monitoringService = MonitoringService.getInstance();
    return await monitoringService.getEnhancedSecuritySummary();
  }
};
