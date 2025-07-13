
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { useConsolidatedSecurity } from '@/hooks/useConsolidatedSecurity';

interface PasswordFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showStrengthIndicator?: boolean;
  className?: string;
}

export function PasswordField({ 
  value, 
  onChange, 
  placeholder = "Enter password",
  showStrengthIndicator = true,
  className = ""
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [strengthData, setStrengthData] = useState<{
    isValid: boolean;
    score: number;
    feedback: string[];
  } | null>(null);

  const { checkPasswordStrength } = useConsolidatedSecurity();

  const handlePasswordChange = async (newPassword: string) => {
    onChange(newPassword);
    
    if (showStrengthIndicator && newPassword.length > 0) {
      const strength = await checkPasswordStrength(newPassword);
      setStrengthData(strength);
    } else {
      setStrengthData(null);
    }
  };

  const getStrengthLabel = (score: number) => {
    if (score <= 2) return { label: 'Weak', color: 'bg-red-500' };
    if (score <= 4) return { label: 'Fair', color: 'bg-yellow-500' };
    if (score <= 5) return { label: 'Good', color: 'bg-blue-500' };
    return { label: 'Strong', color: 'bg-green-500' };
  };

  const strengthInfo = strengthData ? getStrengthLabel(strengthData.score) : null;

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => handlePasswordChange(e.target.value)}
          placeholder={placeholder}
          className={`pr-10 ${className}`}
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Eye className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </div>

      {showStrengthIndicator && value.length > 0 && strengthData && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Password Strength</span>
            <Badge 
              variant="outline" 
              className={`text-xs ${
                strengthInfo?.label === 'Strong' ? 'bg-green-50 text-green-700 border-green-200' :
                strengthInfo?.label === 'Good' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                strengthInfo?.label === 'Fair' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                'bg-red-50 text-red-700 border-red-200'
              }`}
            >
              {strengthInfo?.label}
            </Badge>
          </div>
          
          <Progress 
            value={(strengthData.score / 6) * 100} 
            className="h-2"
          />

          {strengthData.feedback.length > 0 && (
            <div className="space-y-1">
              {strengthData.feedback.map((feedback, index) => (
                <div key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Lock className="h-3 w-3" />
                  <span>{feedback}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
