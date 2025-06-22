
export class SecurityPatternsService {
  private static instance: SecurityPatternsService;

  static getInstance(): SecurityPatternsService {
    if (!SecurityPatternsService.instance) {
      SecurityPatternsService.instance = new SecurityPatternsService();
    }
    return SecurityPatternsService.instance;
  }

  // Suspicious user agent patterns
  readonly SUSPICIOUS_USER_AGENTS = [
    /bot|crawler|spider|scraper/i,
    /curl|wget|python|java|perl/i,
    /sqlmap|nmap|nikto|burp/i,
    /^-?$/,
    /^.{0,10}$/,
    /mozilla\/4\.0$/i
  ];

  // Suspicious email patterns
  readonly SUSPICIOUS_EMAIL_PATTERNS = [
    /\+.*\+/,  // Multiple + signs
    /\.{2,}/,  // Multiple consecutive dots
    /@.*@/,    // Multiple @ signs
    /[<>]/,    // Angle brackets
    /javascript:/i,
    /vbscript:/i
  ];

  // Common SQL injection patterns
  readonly SQL_INJECTION_PATTERNS = [
    /('|('')|;|--|\/\*|\*\/)/i,
    /(union|select|insert|update|delete|drop|create|alter|exec|execute)\s/i,
    /(\bor\b|\band\b)\s+\d+\s*=\s*\d+/i,
    /(sleep|benchmark|waitfor)\s*\(/i
  ];

  // XSS patterns
  readonly XSS_PATTERNS = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe[^>]*>/gi,
    /<object[^>]*>/gi,
    /<embed[^>]*>/gi,
    /eval\s*\(/gi,
    /expression\s*\(/gi
  ];

  // Command injection patterns
  readonly COMMAND_INJECTION_PATTERNS = [
    /[;&|`$(){}[\]]/,
    /(curl|wget|nc|netcat|bash|sh|cmd|powershell|exec)/i,
    /\$\{.*\}/,
    /`.*`/
  ];
}

export const securityPatternsService = SecurityPatternsService.getInstance();
