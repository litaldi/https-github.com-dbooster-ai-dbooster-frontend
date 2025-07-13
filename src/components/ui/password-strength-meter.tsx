
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { enhancedPasswordValidation } from '@/services/security/enhancedPasswordValidation';

interface PasswordStrengthMeterProps {
  password: string;
  email?: string;
  userData?: {
    name?: string;
    username?: string;
  };
  className?: string;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password,
  email,
  userData,
  className = ''
}) => {
  const [validation, setValidation] = React.useState<{
    score: number;
    feedback: string[];
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
  } | null>(null);

  React.useEffect(() => {
    if (!password) {
      setValidation(null);
      return;
    }

    const validatePassword = async () => {
      const result = await enhancedPasswordValidation.validatePassword(password, email, userData);
      setValidation({
        score: result.score,
        feedback: result.feedback,
        riskLevel: result.riskLevel
      });
    };

    const debounceTimer = setTimeout(validatePassword, 300);
    return () => clearTimeout(debounceTimer);
  }, [password, email, userData]);

  if (!password || !validation) {
    return null;
  }

  const strengthLabel = enhancedPasswordValidation.getPasswordStrengthLabel(validation.score);
  const strengthColor = enhancedPasswordValidation.getPasswordStrengthColor(validation.score);
  const progressValue = (validation.score / 8) * 100;

  const getProgressColor = () => {
    if (validation.score >= 7) return 'bg-green-500';
    if (validation.score >= 5) return 'bg-blue-500';
    if (validation.score >= 3) return 'bg-yellow-500';
    if (validation.score >= 1) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-center text-sm">
        <span className="text-muted-foreground">Password Strength:</span>
        <span className={strengthColor}>{strengthLabel}</span>
      </div>
      
      <Progress 
        value={progressValue} 
        className="h-2"
        style={{
          '--progress-foreground': validation.score >= 7 ? 'hsl(142 76% 36%)' :
                                  validation.score >= 5 ? 'hsl(221 83% 53%)' :
                                  validation.score >= 3 ? 'hsl(48 96% 53%)' :
                                  validation.score >= 1 ? 'hsl(25 95% 53%)' :
                                  'hsl(0 84% 60%)'
        } as React.CSSProperties}
      />
      
      {validation.feedback.length > 0 && (
        <div className="text-xs text-muted-foreground space-y-1">
          {validation.feedback.map((feedback, index) => (
            <div key={index} className="flex items-start gap-1">
              <span className="text-red-500 mt-0.5">•</span>
              <span>{feedback}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
