
import * as React from "react"
import { cn } from "@/lib/utils"
import { Eye, EyeOff, Check, AlertCircle, Info } from "lucide-react"
import { EnhancedButton } from "./enhanced-button"

interface FormFieldProps {
  children: React.ReactNode;
  label?: string;
  description?: string;
  error?: string;
  success?: string;
  required?: boolean;
  className?: string;
}

export function FormField({ 
  children, 
  label, 
  description, 
  error, 
  success, 
  required, 
  className 
}: FormFieldProps) {
  const fieldId = React.useId();

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label 
          htmlFor={fieldId}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1"
        >
          {label}
          {required && <span className="text-destructive" aria-label="required">*</span>}
        </label>
      )}
      
      <div className="relative">
        {React.cloneElement(children as React.ReactElement, { 
          id: fieldId,
          'aria-describedby': description || error || success ? `${fieldId}-description` : undefined,
          'aria-invalid': error ? 'true' : undefined,
        })}
        
        {(success || error) && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {success && <Check className="h-4 w-4 text-green-600" />}
            {error && <AlertCircle className="h-4 w-4 text-destructive" />}
          </div>
        )}
      </div>

      {(description || error || success) && (
        <div id={`${fieldId}-description`} className="space-y-1">
          {description && (
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Info className="h-3 w-3" />
              {description}
            </p>
          )}
          {success && (
            <p className="text-sm text-green-600 flex items-center gap-1">
              <Check className="h-3 w-3" />
              {success}
            </p>
          )}
          {error && (
            <p className="text-sm text-destructive flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

interface EnhancedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'filled' | 'outline';
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  isPassword?: boolean;
  showValidation?: boolean;
  isValid?: boolean;
}

export const EnhancedInput = React.forwardRef<HTMLInputElement, EnhancedInputProps>(
  ({ 
    className, 
    type, 
    variant = 'default', 
    startIcon, 
    endIcon, 
    isPassword, 
    showValidation,
    isValid,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const actualType = isPassword && showPassword ? 'text' : type;

    const variantStyles = {
      default: "border-input bg-background hover:border-primary/50 focus:border-primary",
      filled: "border-transparent bg-muted hover:bg-muted/80 focus:bg-background focus:border-primary",
      outline: "border-2 border-primary/20 bg-transparent hover:border-primary/40 focus:border-primary"
    };

    return (
      <div className="relative">
        {startIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none">
            {startIcon}
          </div>
        )}
        
        <input
          type={actualType}
          className={cn(
            "flex h-12 w-full rounded-lg border px-3 py-2 text-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            variantStyles[variant],
            startIcon && "pl-10",
            (endIcon || isPassword) && "pr-10",
            showValidation && isValid && "border-green-500 focus:border-green-500 focus-visible:ring-green-500",
            className
          )}
          ref={ref}
          {...props}
        />
        
        {(endIcon || isPassword) && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {isPassword ? (
              <EnhancedButton
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </EnhancedButton>
            ) : (
              <div className="text-muted-foreground">{endIcon}</div>
            )}
          </div>
        )}
      </div>
    );
  }
);
EnhancedInput.displayName = "EnhancedInput";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'default' | 'filled' | 'outline';
  showValidation?: boolean;
  isValid?: boolean;
}

export const EnhancedTextarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant = 'default', showValidation, isValid, ...props }, ref) => {
    const variantStyles = {
      default: "border-input bg-background hover:border-primary/50 focus:border-primary",
      filled: "border-transparent bg-muted hover:bg-muted/80 focus:bg-background focus:border-primary",
      outline: "border-2 border-primary/20 bg-transparent hover:border-primary/40 focus:border-primary"
    };

    return (
      <textarea
        className={cn(
          "flex min-h-[120px] w-full rounded-lg border px-3 py-2 text-sm transition-all duration-200 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-vertical",
          variantStyles[variant],
          showValidation && isValid && "border-green-500 focus:border-green-500 focus-visible:ring-green-500",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
EnhancedTextarea.displayName = "EnhancedTextarea";
