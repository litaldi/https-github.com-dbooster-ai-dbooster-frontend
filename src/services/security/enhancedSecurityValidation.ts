
import { supabase } from '@/integrations/supabase/client';
import { productionLogger } from '@/utils/productionLogger';

export interface SecurityValidationResult {
  isValid: boolean;
  hasThreats: boolean;
  threatTypes: string[];
  sanitizedInput: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  blocked: boolean;
}

export interface ValidationConfig {
  maxLength?: number;
  allowHtml?: boolean;
  strictMode?: boolean;
  context?: string;
}

export class EnhancedSecurityValidation {
  private static instance: EnhancedSecurityValidation;

  static getInstance(): EnhancedSecurityValidation {
    if (!EnhancedSecurityValidation.instance) {
      EnhancedSecurityValidation.instance = new EnhancedSecurityValidation();
    }
    return EnhancedSecurityValidation.instance;
  }

  async validateAndSanitizeInput(
    input: string, 
    config: ValidationConfig = {}
  ): Promise<SecurityValidationResult> {
    const { maxLength = 10000, allowHtml = false, strictMode = true, context = 'general' } = config;
    
    let sanitizedInput = input;
    const threatTypes: string[] = [];
    let riskLevel: SecurityValidationResult['riskLevel'] = 'low';
    let blocked = false;

    try {
      // Length validation
      if (input.length > maxLength) {
        threatTypes.push('excessive_length');
        sanitizedInput = input.substring(0, maxLength);
        riskLevel = 'medium';
      }

      // XSS Detection and Prevention
      const xssPatterns = [
        /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi,
        /<object[\s\S]*?>[\s\S]*?<\/object>/gi,
        /<embed[\s\S]*?>/gi,
        /vbscript:/gi,
        /data:text\/html/gi
      ];

      for (const pattern of xssPatterns) {
        if (pattern.test(input)) {
          threatTypes.push('xss_attempt');
          sanitizedInput = sanitizedInput.replace(pattern, '');
          riskLevel = 'high';
          if (strictMode) blocked = true;
        }
      }

      // SQL Injection Detection
      const sqlPatterns = [
        /(\bUNION\b|\bSELECT\b|\bINSERT\b|\bUPDATE\b|\bDELETE\b|\bDROP\b|\bCREATE\b|\bALTER\b)[\s\S]*?(\bFROM\b|\bINTO\b|\bSET\b|\bWHERE\b|\bTABLE\b)/gi,
        /['"];?\s*(\bOR\b|\bAND\b)\s+['"]?\d+['"]?\s*=\s*['"]?\d+/gi,
        /['"];?\s*(\bOR\b|\bAND\b)\s+['"]?1['"]?\s*=\s*['"]?1/gi,
        /\/\*[\s\S]*?\*\//gi,
        /--[\s\S]*?$/gm
      ];

      for (const pattern of sqlPatterns) {
        if (pattern.test(input)) {
          threatTypes.push('sql_injection');
          sanitizedInput = sanitizedInput.replace(pattern, '');
          riskLevel = 'critical';
          blocked = true;
        }
      }

      // Command Injection Detection
      const commandPatterns = [
        /[;&|`$(){}[\]]/g,
        /\b(exec|eval|system|shell_exec|passthru|popen|proc_open)\b/gi
      ];

      for (const pattern of commandPatterns) {
        if (pattern.test(input)) {
          threatTypes.push('command_injection');
          sanitizedInput = sanitizedInput.replace(pattern, '');
          riskLevel = 'critical';
          blocked = true;
        }
      }

      // Path Traversal Detection
      const pathTraversalPatterns = [
        /\.\.[\/\\]/g,
        /[\/\\]etc[\/\\]/gi,
        /[\/\\]proc[\/\\]/gi,
        /[\/\\]sys[\/\\]/gi
      ];

      for (const pattern of pathTraversalPatterns) {
        if (pattern.test(input)) {
          threatTypes.push('path_traversal');
          sanitizedInput = sanitizedInput.replace(pattern, '');
          riskLevel = 'high';
          blocked = true;
        }
      }

      // HTML sanitization if not allowed
      if (!allowHtml) {
        const htmlPattern = /<[^>]*>/g;
        if (htmlPattern.test(sanitizedInput)) {
          threatTypes.push('html_content');
          sanitizedInput = sanitizedInput.replace(htmlPattern, '');
          if (riskLevel === 'low') riskLevel = 'medium';
        }
      }

      // Additional sanitization
      sanitizedInput = sanitizedInput
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // Remove control characters
        .trim();

      const result: SecurityValidationResult = {
        isValid: threatTypes.length === 0,
        hasThreats: threatTypes.length > 0,
        threatTypes,
        sanitizedInput,
        riskLevel,
        blocked
      };

      // Log validation results for high-risk inputs
      if (riskLevel === 'high' || riskLevel === 'critical' || blocked) {
        await this.logSecurityValidation(result, context);
      }

      return result;
    } catch (error) {
      productionLogger.error('Security validation failed', error, 'EnhancedSecurityValidation');
      return {
        isValid: false,
        hasThreats: true,
        threatTypes: ['validation_error'],
        sanitizedInput: '',
        riskLevel: 'critical',
        blocked: true
      };
    }
  }

  async validateCMSContent(content: any, contentType: string): Promise<SecurityValidationResult> {
    if (typeof content === 'string') {
      return this.validateAndSanitizeInput(content, {
        allowHtml: contentType === 'rich_text',
        strictMode: true,
        context: `cms_${contentType}`,
        maxLength: contentType === 'title' ? 200 : 50000
      });
    }

    if (typeof content === 'object' && content !== null) {
      const results: SecurityValidationResult[] = [];
      
      for (const [key, value] of Object.entries(content)) {
        if (typeof value === 'string') {
          const result = await this.validateAndSanitizeInput(value, {
            allowHtml: key.includes('content') || key.includes('body'),
            context: `cms_${contentType}_${key}`,
            maxLength: key === 'title' ? 200 : 10000
          });
          results.push(result);
        }
      }

      // Aggregate results
      const hasThreats = results.some(r => r.hasThreats);
      const blocked = results.some(r => r.blocked);
      const maxRiskLevel = this.getMaxRiskLevel(results.map(r => r.riskLevel));
      
      return {
        isValid: !hasThreats,
        hasThreats,
        threatTypes: [...new Set(results.flatMap(r => r.threatTypes))],
        sanitizedInput: JSON.stringify(content), // This would need more sophisticated handling
        riskLevel: maxRiskLevel,
        blocked
      };
    }

    return {
      isValid: true,
      hasThreats: false,
      threatTypes: [],
      sanitizedInput: String(content),
      riskLevel: 'low',
      blocked: false
    };
  }

  private async logSecurityValidation(result: SecurityValidationResult, context: string): Promise<void> {
    try {
      const { data: user } = await supabase.auth.getUser();
      
      await supabase.rpc('log_input_validation', {
        p_user_id: user.user?.id || null,
        p_context: context,
        p_validation_result: {
          isValid: result.isValid,
          hasThreats: result.hasThreats,
          threatTypes: result.threatTypes,
          sanitizedInput: result.sanitizedInput,
          riskLevel: result.riskLevel,
          blocked: result.blocked
        },
        p_ip_address: await this.getUserIP()
      });
    } catch (error) {
      productionLogger.error('Failed to log security validation', error, 'EnhancedSecurityValidation');
    }
  }

  private getMaxRiskLevel(levels: SecurityValidationResult['riskLevel'][]): SecurityValidationResult['riskLevel'] {
    const priority = { critical: 4, high: 3, medium: 2, low: 1 };
    const maxLevel = levels.reduce((max, level) => 
      priority[level] > priority[max] ? level : max, 'low'
    );
    return maxLevel;
  }

  private async getUserIP(): Promise<string> {
    // Client-side IP collection removed; rely on server headers
    return 'unknown';
  }
}

export const enhancedSecurityValidation = EnhancedSecurityValidation.getInstance();
