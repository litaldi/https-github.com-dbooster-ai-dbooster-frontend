
export class SecurityPatternsService {
  private static instance: SecurityPatternsService;

  // Enhanced suspicious user agent patterns
  readonly SUSPICIOUS_USER_AGENTS = [
    /bot|crawler|spider|scraper/i,
    /sqlmap|nmap|nikto|burp|owasp|acunetix/i,
    /python-requests|curl|wget|postman/i,
    /^$/,
    /.{0,10}$|.{500,}$/,
    /masscan|zmap|gobuster|dirb/i
  ];

  // Enhanced suspicious email patterns
  readonly SUSPICIOUS_EMAIL_PATTERNS = [
    /^(admin|root|test|demo|null|undefined|system|service)@/i,
    /\+.*\+.*@/,
    /@(temp|trash|guerrilla|10minute|throwaway|disposable)/i,
    /\d{10,}@/,
    /(.)\1{5,}@/,
    /@[0-9]+\./,
    /\.(tk|ml|ga|cf)$/i
  ];

  static getInstance(): SecurityPatternsService {
    if (!SecurityPatternsService.instance) {
      SecurityPatternsService.instance = new SecurityPatternsService();
    }
    return SecurityPatternsService.instance;
  }
}

export const securityPatternsService = SecurityPatternsService.getInstance();
