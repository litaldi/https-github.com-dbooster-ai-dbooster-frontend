
import React, { ReactNode } from 'react';
import { consolidatedInputValidation } from '@/services/security/consolidatedInputValidation';
import { productionLogger } from '@/utils/productionLogger';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface SecureFormWrapperProps {
  children: ReactNode;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  className?: string;
}

export function SecureFormWrapper({ children, onSubmit, className = '' }: SecureFormWrapperProps) {
  const handleSecureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const validationErrors: string[] = [];
      
      // Validate all form inputs
      for (const [key, value] of formData.entries()) {
        if (typeof value === 'string' && value.trim()) {
          const context = key.includes('email') ? 'email' : 
                        key.includes('url') ? 'url' : 
                        key.includes('file') ? 'filename' : 'general';
          
          const result = consolidatedInputValidation.validateAndSanitize(value, context);
          
          if (!result.isValid) {
            validationErrors.push(`${key}: ${result.errors.join(', ')}`);
            
            if (result.riskLevel === 'critical') {
              productionLogger.error('Critical security threat detected in form', {
                field: key,
                riskLevel: result.riskLevel,
                errors: result.errors
              }, 'SecureFormWrapper');
              
              alert('Your submission contains potentially dangerous content and has been blocked for security reasons.');
              return;
            }
          }
        }
      }
      
      if (validationErrors.length > 0) {
        productionLogger.warn('Form validation failed', { errors: validationErrors }, 'SecureFormWrapper');
        return;
      }
      
      await onSubmit(e);
    } catch (error) {
      productionLogger.error('Secure form submission error', error, 'SecureFormWrapper');
      throw error;
    }
  };

  return (
    <form onSubmit={handleSecureSubmit} className={className}>
      {children}
    </form>
  );
}
