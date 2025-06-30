
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PasswordStrengthIndicatorProps {
  password: string;
  strengthResult: {
    score: number;
    feedback: string[];
    isValid: boolean;
  };
}

export function PasswordStrengthIndicator({ password, strengthResult }: PasswordStrengthIndicatorProps) {
  if (!password) return null;

  const { score, feedback, isValid } = strengthResult;
  
  const strengthLabels = {
    0: 'Very Weak',
    1: 'Weak',
    2: 'Fair',
    3: 'Good',
    4: 'Strong'
  };

  const strengthColors = {
    0: 'bg-red-500',
    1: 'bg-orange-500',
    2: 'bg-yellow-500',
    3: 'bg-blue-500',
    4: 'bg-green-500'
  };

  const progressValue = (score / 4) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Password Strength</span>
        <span className={cn(
          "text-sm font-medium",
          score <= 1 ? "text-red-600" : score <= 2 ? "text-orange-600" : score <= 3 ? "text-blue-600" : "text-green-600"
        )}>
          {strengthLabels[score as keyof typeof strengthLabels]}
        </span>
      </div>
      
      <Progress 
        value={progressValue} 
        className={cn(
          "h-2 transition-all duration-300",
          strengthColors[score as keyof typeof strengthColors]
        )}
      />
      
      {feedback.length > 0 && (
        <div className="space-y-1">
          {feedback.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <XCircle className="h-3 w-3 text-red-500 flex-shrink-0" />
              <span className="text-red-600">{item}</span>
            </div>
          ))}
        </div>
      )}
      
      {isValid && (
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle className="h-3 w-3 text-green-500" />
          <span className="text-green-600">Password meets security requirements</span>
        </div>
      )}
      
      {!isValid && score >= 2 && (
        <div className="flex items-center gap-2 text-sm">
          <AlertCircle className="h-3 w-3 text-orange-500" />
          <span className="text-orange-600">Almost there! Address the feedback above</span>
        </div>
      )}
    </div>
  );
}
