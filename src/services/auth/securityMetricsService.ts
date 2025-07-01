
import { enhancedSecurityMonitoring } from '@/services/security/enhancedSecurityMonitoring';

export class SecurityMetricsService {
  static async getSecurityMetrics() {
    return await enhancedSecurityMonitoring.getSecurityMetrics();
  }
}
