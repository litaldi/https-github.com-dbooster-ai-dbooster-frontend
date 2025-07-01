
import { comprehensiveInputValidation } from '@/services/security/comprehensiveInputValidation';
import { productionLogger } from '@/utils/productionLogger';
import { auditLogger } from '@/services/auditLogger';
import { ValidationResult } from './baseValidationRules';

export class FileValidationService {
  private static instance: FileValidationService;

  static getInstance(): FileValidationService {
    if (!FileValidationService.instance) {
      FileValidationService.instance = new FileValidationService();
    }
    return FileValidationService.instance;
  }

  async validateFileUpload(
    file: File,
    allowedTypes: string[] = [],
    maxSize: number = 5 * 1024 * 1024,
    context?: string
  ): Promise<ValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';

    try {
      // File size validation
      if (file.size > maxSize) {
        errors.push(`File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`);
        riskLevel = 'medium';
      }

      // File type validation
      if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
        errors.push(`File type ${file.type} is not allowed`);
        riskLevel = 'medium';
      }

      // Dangerous file extension check
      const dangerousExtensions = [
        '.exe', '.bat', '.cmd', '.scr', '.pif', '.com', '.vbs', '.js', '.jar',
        '.msi', '.dll', '.app', '.deb', '.rpm', '.dmg', '.pkg', '.sh', '.php'
      ];
      
      const fileName = file.name.toLowerCase();
      const hasDangerousExtension = dangerousExtensions.some(ext => fileName.endsWith(ext));
      
      if (hasDangerousExtension) {
        errors.push('File type not allowed for security reasons');
        riskLevel = 'critical';
      }

      // Filename validation
      const filenameValidation = comprehensiveInputValidation.validateInput(file.name, 'filename');
      if (!filenameValidation.isValid) {
        errors.push(...filenameValidation.errors);
        riskLevel = 'high';
      }

      // Double extension check (e.g., file.txt.exe)
      const extensionCount = (file.name.match(/\./g) || []).length;
      if (extensionCount > 1) {
        warnings.push('File has multiple extensions - please verify this is intentional');
        if (riskLevel === 'low') riskLevel = 'medium';
      }

      // Log high-risk file upload attempts
      if (riskLevel === 'critical' || riskLevel === 'high') {
        await auditLogger.logSecurityEvent({
          event_type: 'high_risk_file_upload',
          event_data: {
            fileName: file.name,
            fileType: file.type,
            fileSize: file.size,
            riskLevel,
            context: context || 'unknown',
            hasDangerousExtension,
            extensionCount
          }
        });
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        sanitizedValue: filenameValidation.sanitized,
        riskLevel
      };
    } catch (error) {
      productionLogger.error('File validation error', error, 'FileValidationService');
      return {
        isValid: false,
        errors: ['File validation failed'],
        warnings: [],
        sanitizedValue: file.name,
        riskLevel: 'medium'
      };
    }
  }
}

export const fileValidationService = FileValidationService.getInstance();
