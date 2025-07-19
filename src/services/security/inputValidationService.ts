
import { supabase } from '@/integrations/supabase/client';
import { productionLogger } from '@/utils/productionLogger';
import DOMPurify from 'dompurify';

interface ValidationResult {
  isValid: boolean;
  sanitizedInput: string;
  threatTypes: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  blocked: boolean;
}

export class InputValidationService {
  private static instance: InputValidationService;
  
  // Comprehensive threat patterns
  private readonly SQL_INJECTION_PATTERNS = [
    /(\bUNION\b|\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b|\bCREATE\b|\bALTER\b)/i,
    /(\bOR\s+1\s*=\s*1\b|\bAND\s+1\s*=\s*1\b)/i,
    /(--|\/\*|\*\/|;)/,
    /(\bEXEC\b|\bEXECUTE\b|\bsp_\w+)/i
  ];

  private readonly XSS_PATTERNS = [
    /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi,
    /<object[\s\S]*?>[\s\S]*?<\/object>/gi,
    /<embed[\s\S]*?>/gi,
    /vbscript:/gi,
    /data:text\/html/gi
  ];

  private readonly COMMAND_INJECTION_PATTERNS = [
    /(\||&|;|\$\(|\`)/,
    /(\bcat\b|\bls\b|\bpwd\b|\bwhoami\b|\bnetstat\b)/i,
    /(\.\.\/|\.\.\\)/,
    /(\beval\b|\bexec\b|\bsystem\b)/i
  ];

  private readonly PATH_TRAVERSAL_PATTERNS = [
    /(\.\.\/|\.\.\\)/,
    /(%2e%2e%2f|%2e%2e%5c)/i,
    /(\.\.\%2f|\.\.\%5c)/i
  ];

  static getInstance(): InputValidationService {
    if (!InputValidationService.instance) {
      InputValidationService.instance = new InputValidationService();
    }
    return InputValidationService.instance;
  }

  async validateInput(input: string, context: string = 'general'): Promise<ValidationResult> {
    const threatTypes: string[] = [];
    let riskLevel: ValidationResult['riskLevel'] = 'low';
    let blocked = false;

    try {
      // SQL Injection Detection
      if (this.detectSQLInjection(input)) {
        threatTypes.push('sql_injection');
        riskLevel = 'critical';
        blocked = true;
      }

      // XSS Detection
      if (this.detectXSS(input)) {
        threatTypes.push('xss');
        if (riskLevel !== 'critical') riskLevel = 'high';
        blocked = true;
      }

      // Command Injection Detection
      if (this.detectCommandInjection(input)) {
        threatTypes.push('command_injection');
        if (riskLevel === 'low') riskLevel = 'high';
        blocked = true;
      }

      // Path Traversal Detection
      if (this.detectPathTraversal(input)) {
        threatTypes.push('path_traversal');
        if (riskLevel === 'low') riskLevel = 'medium';
      }

      // Content-specific validation
      if (context === 'email' && !this.isValidEmail(input)) {
        threatTypes.push('invalid_email');
        if (riskLevel === 'low') riskLevel = 'medium';
      }

      if (context === 'url' && !this.isValidURL(input)) {
        threatTypes.push('invalid_url');
        if (riskLevel === 'low') riskLevel = 'medium';
      }

      // Sanitize input
      const sanitizedInput = this.sanitizeInput(input, context);

      const result: ValidationResult = {
        isValid: threatTypes.length === 0,
        sanitizedInput,
        threatTypes,
        riskLevel,
        blocked
      };

      // Log validation results
      await this.logValidation(input, context, result);

      return result;
    } catch (error) {
      productionLogger.error('Input validation failed', error, 'InputValidationService');
      return {
        isValid: false,
        sanitizedInput: '',
        threatTypes: ['validation_error'],
        riskLevel: 'critical',
        blocked: true
      };
    }
  }

  private detectSQLInjection(input: string): boolean {
    return this.SQL_INJECTION_PATTERNS.some(pattern => pattern.test(input));
  }

  private detectXSS(input: string): boolean {
    return this.XSS_PATTERNS.some(pattern => pattern.test(input));
  }

  private detectCommandInjection(input: string): boolean {
    return this.COMMAND_INJECTION_PATTERNS.some(pattern => pattern.test(input));
  }

  private detectPathTraversal(input: string): boolean {
    return this.PATH_TRAVERSAL_PATTERNS.some(pattern => pattern.test(input));
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  private isValidURL(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  }

  private sanitizeInput(input: string, context: string): string {
    let sanitized = input;

    // Basic HTML sanitization
    if (context === 'html' || context === 'rich_text') {
      sanitized = DOMPurify.sanitize(sanitized, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
        ALLOWED_ATTR: []
      });
    } else {
      // Strip all HTML for non-HTML contexts
      sanitized = DOMPurify.sanitize(sanitized, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
    }

    // Remove null bytes and control characters
    sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, '');

    // Normalize whitespace
    sanitized = sanitized.replace(/\s+/g, ' ').trim();

    // Length limits based on context
    const maxLengths: Record<string, number> = {
      email: 254,
      password: 128,
      username: 50,
      title: 200,
      description: 1000,
      general: 500
    };

    const maxLength = maxLengths[context] || maxLengths.general;
    if (sanitized.length > maxLength) {
      sanitized = sanitized.substring(0, maxLength);
    }

    return sanitized;
  }

  private async logValidation(
    originalInput: string, 
    context: string, 
    result: ValidationResult
  ): Promise<void> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      if (result.threatTypes.length > 0 || result.riskLevel !== 'low') {
        await supabase.rpc('log_input_validation', {
          p_user_id: user.user?.id,
          p_context: context,
          p_validation_result: {
            isValid: result.isValid,
            threatTypes: result.threatTypes,
            riskLevel: result.riskLevel,
            blocked: result.blocked,
            sanitizedInput: result.sanitizedInput,
            inputLength: originalInput.length
          },
          p_ip_address: await this.getUserIP()
        });
      }
    } catch (error) {
      productionLogger.error('Failed to log input validation', error, 'InputValidationService');
    }
  }

  private async getUserIP(): Promise<string> {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip || 'unknown';
    } catch {
      return 'unknown';
    }
  }

  // Batch validation for multiple inputs
  async validateBatch(inputs: Array<{ value: string; context: string }>): Promise<ValidationResult[]> {
    const results = await Promise.all(
      inputs.map(({ value, context }) => this.validateInput(value, context))
    );
    
    return results;
  }

  // Real-time validation for forms
  validateRealTime(input: string, context: string): { valid: boolean; message: string } {
    // Quick client-side validation without logging
    const threats: string[] = [];
    
    if (this.detectSQLInjection(input)) threats.push('SQL injection detected');
    if (this.detectXSS(input)) threats.push('Cross-site scripting detected');
    if (this.detectCommandInjection(input)) threats.push('Command injection detected');
    
    if (threats.length > 0) {
      return {
        valid: false,
        message: `Security threat detected: ${threats.join(', ')}`
      };
    }
    
    return { valid: true, message: 'Input is valid' };
  }
}

export const inputValidationService = InputValidationService.getInstance();
