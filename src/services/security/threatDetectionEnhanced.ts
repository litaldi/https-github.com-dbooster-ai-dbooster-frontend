
import { productionLogger } from '@/utils/productionLogger';

interface ThreatDetectionResult {
  shouldBlock: boolean;
  threatTypes: string[];
  confidence: number;
}

export class EnhancedThreatDetection {
  async detectThreats(input: string, context: { inputType: string; userAgent?: string; ip?: string }): Promise<ThreatDetectionResult> {
    const threatTypes: string[] = [];
    let shouldBlock = false;

    // Basic SQL injection detection
    if (/(\bunion\b|\bselect\b|\binsert\b|\bupdate\b|\bdelete\b|\bdrop\b)/i.test(input)) {
      threatTypes.push('sql_injection');
      shouldBlock = true;
    }

    // XSS detection
    if (/<script|javascript:|on\w+=/i.test(input)) {
      threatTypes.push('xss');
      shouldBlock = true;
    }

    // Email format validation for email inputs
    if (context.inputType === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)) {
      threatTypes.push('invalid_email');
    }

    return {
      shouldBlock,
      threatTypes,
      confidence: threatTypes.length > 0 ? 0.8 : 0.1
    };
  }
}

export const enhancedThreatDetection = new EnhancedThreatDetection();
