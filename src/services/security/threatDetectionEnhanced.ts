
interface ThreatDetectionResult {
  shouldBlock: boolean;
  threatTypes: string[];
  riskScore: number;
  details?: Record<string, any>;
}

interface ThreatDetectionContext {
  inputType?: string;
  userAgent?: string;
  ip?: string;
  timestamp?: number;
}

export class EnhancedThreatDetection {
  private static instance: EnhancedThreatDetection;

  static getInstance(): EnhancedThreatDetection {
    if (!EnhancedThreatDetection.instance) {
      EnhancedThreatDetection.instance = new EnhancedThreatDetection();
    }
    return EnhancedThreatDetection.instance;
  }

  async detectThreats(
    input: string,
    context: ThreatDetectionContext = {}
  ): Promise<ThreatDetectionResult> {
    const threatTypes: string[] = [];
    let riskScore = 0;
    const details: Record<string, any> = {};

    // XSS Detection
    if (this.detectXSS(input)) {
      threatTypes.push('XSS');
      riskScore += 8;
      details.xssPatterns = this.getXSSPatterns(input);
    }

    // SQL Injection Detection
    if (this.detectSQLInjection(input)) {
      threatTypes.push('SQL_INJECTION');
      riskScore += 9;
      details.sqlPatterns = this.getSQLPatterns(input);
    }

    // Command Injection Detection
    if (this.detectCommandInjection(input)) {
      threatTypes.push('COMMAND_INJECTION');
      riskScore += 7;
    }

    // Malicious Email Patterns
    if (context.inputType === 'email' && this.detectMaliciousEmail(input)) {
      threatTypes.push('MALICIOUS_EMAIL');
      riskScore += 5;
    }

    // Path Traversal
    if (this.detectPathTraversal(input)) {
      threatTypes.push('PATH_TRAVERSAL');
      riskScore += 6;
    }

    return {
      shouldBlock: riskScore >= 7,
      threatTypes,
      riskScore,
      details: Object.keys(details).length > 0 ? details : undefined
    };
  }

  private detectXSS(input: string): boolean {
    const xssPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe[^>]*>/gi,
      /<object[^>]*>/gi,
      /<embed[^>]*>/gi,
      /<svg[^>]*onload/gi
    ];

    return xssPatterns.some(pattern => pattern.test(input));
  }

  private detectSQLInjection(input: string): boolean {
    const sqlPatterns = [
      /(\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\b)/gi,
      /(\b(or|and)\s+\d+\s*=\s*\d+)/gi,
      /(';\s*(drop|delete|insert|update))/gi,
      /(\/\*|\*\/|--)/g,
      /(\bxp_|\bsp_)/gi
    ];

    return sqlPatterns.some(pattern => pattern.test(input));
  }

  private detectCommandInjection(input: string): boolean {
    const commandPatterns = [
      /(\||;|&|`|\$\(|\${)/g,
      /\b(cat|ls|pwd|whoami|id|uname|ps|netstat|ifconfig)\b/gi,
      /(\.\.\/|\.\.\\)/g
    ];

    return commandPatterns.some(pattern => pattern.test(input));
  }

  private detectMaliciousEmail(email: string): boolean {
    const maliciousPatterns = [
      /\+script/gi,
      /javascript:/gi,
      /<[^>]*>/g,
      /\.(exe|bat|cmd|scr|pif|com)$/gi
    ];

    return maliciousPatterns.some(pattern => pattern.test(email));
  }

  private detectPathTraversal(input: string): boolean {
    const traversalPatterns = [
      /(\.\.\/|\.\.\\)/g,
      /(%2e%2e%2f|%2e%2e%5c)/gi,
      /(\.\.\%2f|\.\.\%5c)/gi
    ];

    return traversalPatterns.some(pattern => pattern.test(input));
  }

  private getXSSPatterns(input: string): string[] {
    const patterns: string[] = [];
    if (/<script/gi.test(input)) patterns.push('script_tag');
    if (/javascript:/gi.test(input)) patterns.push('javascript_protocol');
    if (/on\w+\s*=/gi.test(input)) patterns.push('event_handler');
    return patterns;
  }

  private getSQLPatterns(input: string): string[] {
    const patterns: string[] = [];
    if (/union/gi.test(input)) patterns.push('union_select');
    if (/(or|and)\s+\d+\s*=\s*\d+/gi.test(input)) patterns.push('boolean_injection');
    if (/(--|\*\/)/g.test(input)) patterns.push('comment_injection');
    return patterns;
  }
}

export const enhancedThreatDetection = EnhancedThreatDetection.getInstance();
