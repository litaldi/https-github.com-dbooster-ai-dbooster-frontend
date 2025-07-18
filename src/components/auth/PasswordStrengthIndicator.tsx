
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface PasswordStrengthIndicatorProps {
  password: string;
  validationResult?: {
    isValid: boolean;
    score: number;
    feedback: string[];
    breachInfo?: {
      isBreached: boolean;
      breachCount?: number;
    };
  };
}

export function PasswordStrengthIndicator({ password, validationResult }: PasswordStrengthIndicatorProps) {
  if (!password) return null;

  const getStrengthColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getStrengthText = (score: number) => {
    if (score >= 80) return 'Strong';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Weak';
  };

  const score = validationResult?.score || 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Password Strength:</span>
        <span className={`text-sm font-medium ${score >= 60 ? 'text-green-600' : 'text-red-600'}`}>
          {getStrengthText(score)}
        </span>
      </div>
      
      <Progress value={score} className="h-2" />
      
      {validationResult?.breachInfo?.isBreached && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <XCircle className="h-4 w-4" />
          <span>This password has been found in data breaches</span>
        </div>
      )}
      
      {validationResult?.feedback && validationResult.feedback.length > 0 && (
        <div className="space-y-1">
          {validationResult.feedback.map((feedback, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              {feedback.includes('must') ? (
                <XCircle className="h-3 w-3 text-red-500" />
              ) : (
                <AlertCircle className="h-3 w-3 text-yellow-500" />
              )}
              <span className="text-muted-foreground">{feedback}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
