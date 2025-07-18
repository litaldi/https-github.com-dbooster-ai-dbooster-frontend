
import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, Shield } from 'lucide-react';
import { enhancedPasswordValidator, PasswordValidationResult } from '@/services/security/enhancedPasswordValidation';

interface PasswordStrengthMeterProps {
  password: string;
  userInfo?: { email?: string; name?: string };
  onValidationChange?: (result: PasswordValidationResult) => void;
}

export function PasswordStrengthMeter({ password, userInfo, onValidationChange }: PasswordStrengthMeterProps) {
  const [validation, setValidation] = useState<PasswordValidationResult>({
    isValid: false,
    score: 0,
    feedback: []
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!password) {
      setValidation({ isValid: false, score: 0, feedback: [] });
      return;
    }

    const validatePassword = async () => {
      setIsLoading(true);
      try {
        const result = await enhancedPasswordValidator.validatePassword(password, userInfo);
        setValidation(result);
        onValidationChange?.(result);
      } catch (error) {
        console.error('Password validation error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(validatePassword, 300);
    return () => clearTimeout(debounceTimer);
  }, [password, userInfo, onValidationChange]);

  const getStrengthLabel = (score: number) => {
    if (score < 30) return 'Very Weak';
    if (score < 50) return 'Weak';
    if (score < 70) return 'Good';
    if (score < 90) return 'Strong';
    return 'Very Strong';
  };

  const getStrengthColor = (score: number) => {
    if (score < 30) return 'bg-red-500';
    if (score < 50) return 'bg-orange-500';
    if (score < 70) return 'bg-yellow-500';
    if (score < 90) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getBadgeVariant = (score: number) => {
    if (score < 30) return 'destructive';
    if (score < 50) return 'secondary';
    if (score < 70) return 'outline';
    return 'default';
  };

  if (!password) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Progress 
          value={validation.score} 
          className="flex-1 h-2"
        />
        <Badge variant={getBadgeVariant(validation.score)} className="text-xs">
          {getStrengthLabel(validation.score)}
        </Badge>
      </div>

      {validation.breachInfo?.isBreached && (
        <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-md">
          <Shield className="h-4 w-4 text-red-600" />
          <span className="text-sm text-red-800">
            Password found in {validation.breachInfo.breachCount} data breaches
          </span>
        </div>
      )}

      {validation.feedback.length > 0 && (
        <div className="space-y-1">
          {validation.feedback.map((item, index) => {
            const isError = item.includes('must') || item.includes('should') || item.includes('found in');
            const isWarning = item.includes('Consider') || item.includes('Avoid');
            
            return (
              <div key={index} className="flex items-center gap-2 text-sm">
                {isError ? (
                  <XCircle className="h-3 w-3 text-red-500" />
                ) : isWarning ? (
                  <AlertCircle className="h-3 w-3 text-yellow-500" />
                ) : (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                )}
                <span className={
                  isError ? 'text-red-700' : 
                  isWarning ? 'text-yellow-700' : 
                  'text-green-700'
                }>
                  {item}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {isLoading && (
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary"></div>
          Checking password security...
        </div>
      )}
    </div>
  );
}
