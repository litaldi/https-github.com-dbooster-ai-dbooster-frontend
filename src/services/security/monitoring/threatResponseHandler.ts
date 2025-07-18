
import type { SecurityEvent } from '../types/securityEvent';
import { SecurityEventHandler } from './securityEventHandler';

export class ThreatResponseHandler {
  constructor(private eventHandler: SecurityEventHandler) {}

  setupAutomatedThreatResponse(): void {
    // Set up automated responses to certain threat types
    this.eventHandler.addEventListener('security_validation_threat_detected', async (event: SecurityEvent) => {
      // Safely access event_data properties
      const eventData = event.event_data as { threatTypes?: string[] } | null;
      const threatTypes = eventData?.threatTypes || [];
      
      if (threatTypes.includes('sql_injection') || threatTypes.includes('command_injection')) {
        // Immediate response for critical threats
        await this.eventHandler['handleThreatDetection'](event);
      }
    });
  }
}
