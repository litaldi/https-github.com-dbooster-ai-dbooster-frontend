
import { productionLogger } from '@/utils/productionLogger';
import { SecurityEventHandler } from './monitoring/securityEventHandler';
import { PatternDetector } from './monitoring/patternDetector';
import { ThreatResponseHandler } from './monitoring/threatResponseHandler';
import { RealtimeMonitor } from './monitoring/realtimeMonitor';
import { SecuritySummaryService } from './monitoring/securitySummaryService';
import type { SecuritySummary } from './types/securityEvent';

export class EnhancedSecurityMonitor {
  private static instance: EnhancedSecurityMonitor;
  private isMonitoring = false;
  private eventHandler: SecurityEventHandler;
  private patternDetector: PatternDetector;
  private threatResponseHandler: ThreatResponseHandler;
  private realtimeMonitor: RealtimeMonitor;
  private summaryService: SecuritySummaryService;

  private constructor() {
    this.eventHandler = new SecurityEventHandler();
    this.patternDetector = new PatternDetector();
    this.threatResponseHandler = new ThreatResponseHandler(this.eventHandler);
    this.realtimeMonitor = new RealtimeMonitor(this.eventHandler);
    this.summaryService = new SecuritySummaryService();
  }

  static getInstance(): EnhancedSecurityMonitor {
    if (!EnhancedSecurityMonitor.instance) {
      EnhancedSecurityMonitor.instance = new EnhancedSecurityMonitor();
    }
    return EnhancedSecurityMonitor.instance;
  }

  async startMonitoring(): Promise<void> {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    productionLogger.info('Enhanced security monitoring started');

    // Monitor for real-time security events
    this.realtimeMonitor.setupRealtimeSecurityMonitoring();
    
    // Monitor for suspicious patterns
    this.setupPatternDetection();
    
    // Setup automated threat response
    this.threatResponseHandler.setupAutomatedThreatResponse();
  }

  private setupPatternDetection(): void {
    // Monitor for suspicious patterns in user behavior
    setInterval(async () => {
      await this.patternDetector.analyzeSecurityPatterns();
    }, 60000); // Check every minute
  }

  addEventListener(eventType: string, callback: Function): void {
    this.eventHandler.addEventListener(eventType, callback);
  }

  removeEventListener(eventType: string, callback: Function): void {
    this.eventHandler.removeEventListener(eventType, callback);
  }

  async getSecuritySummary(): Promise<SecuritySummary> {
    return this.summaryService.getSecuritySummary();
  }
}

export const enhancedSecurityMonitor = EnhancedSecurityMonitor.getInstance();
