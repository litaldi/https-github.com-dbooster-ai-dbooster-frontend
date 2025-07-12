
import type { SecurityEvent } from '../types/securityEvent';
import { SecurityEventHandler } from './securityEventHandler';

export class ThreatResponseHandler {
  constructor(private eventHandler: SecurityEventHandler) {}

  setupAutomatedThreatResponse(): void {
    // Set up automated responses to certain threat types
    this.eventHandler.addEventListener('security_validation_threat_detected', async (event: SecurityEvent) => {
      const threatTypes = event.event_data?.threatTypes || [];
      
      if (threatTypes.includes('sql_injection') || threatTypes.includes('command_injection')) {
        // Immediate response for critical threats
        await this.eventHandler['handleThreatDetection'](event);
      }
    });
  }
}
