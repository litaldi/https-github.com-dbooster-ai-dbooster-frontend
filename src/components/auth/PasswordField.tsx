import { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { validatePasswordStrength } from '@/utils/authValidation';

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
  autoComplete?: string;
  showStrength?: boolean;
}

export function PasswordField({
  id,
  label,
  value,
  onChange,
  placeholder,
  error,
  autoComplete,
  showStrength = false
}: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const strength = showStrength ? validatePasswordStrength(value) : null;

  const getStrengthColor = (score: number) => {
    if (score <= 2) return 'bg-red-500';
    if (score <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = (score: number) => {
    if (score <= 2) return 'Weak';
    if (score <= 3) return 'Medium';
    return 'Strong';
  };

  return (
    <div className="space-y-1 relative group">
      <Label htmlFor={id} className={error ? "text-destructive font-semibold" : ""}>
        {label}
      </Label>
      <div className="relative">
        <Input
          ref={inputRef}
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`
            pr-10
            transition-all duration-150
            focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
            ${error ? "border-destructive" : ""}
          `}
        />
        <button
          type="button"
          tabIndex={0}
          aria-label={showPassword ? "Hide password" : "Show password"}
          className="
            absolute inset-y-0 right-2 flex items-center px-1
            text-muted-foreground hover:text-primary
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
            transition-transform duration-150 active:scale-90
          "
          onClick={() => setShowPassword(v => !v)}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
        {/* Animated valid/invalid state if needed */}
      </div>
      
      {showStrength && value && strength && (
        <div className="mt-1 flex items-center gap-2">
          <div className="flex-1 bg-muted rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(strength.score)}`}
              style={{ width: `${(strength.score / 5) * 100}%` }}
            />
          </div>
          <span className="text-xs font-medium">
            {getStrengthText(strength.score)}
          </span>
        </div>
      )}
      
      {error && (
        <p id={`${id}-error`} className="text-xs text-destructive font-medium mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
