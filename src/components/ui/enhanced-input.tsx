
import * as React from "react"
import { cn } from "@/lib/utils"
import { Eye, EyeOff, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "./button"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helpText?: string
  helperText?: string
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  variant?: 'default' | 'filled' | 'outline' | 'floating'
  showPasswordToggle?: boolean
  isValid?: boolean
  showValidation?: boolean
  loading?: boolean
  maxLength?: number
  showCharCount?: boolean
}

const EnhancedInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type, 
    label, 
    error, 
    helpText, 
    helperText, 
    startIcon, 
    endIcon, 
    variant = 'default', 
    id, 
    showPasswordToggle, 
    isValid, 
    showValidation, 
    loading,
    maxLength,
    showCharCount,
    value,
    ...props 
  }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const [isFocused, setIsFocused] = React.useState(false)
    const inputId = id || React.useId()
    const isPassword = type === 'password'
    const actualType = isPassword && showPassword ? 'text' : type
    const displayHelperText = helperText || helpText
    const currentLength = typeof value === 'string' ? value.length : 0

    const variantStyles = {
      default: "border-input bg-background focus:border-primary",
      filled: "border-transparent bg-muted focus:bg-background focus:border-primary",
      outline: "border-2 border-primary/20 bg-transparent focus:border-primary",
      floating: "border-input bg-transparent focus:border-primary pt-6"
    }

    const inputElement = (
      <div className="relative">
        {startIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            {startIcon}
          </div>
        )}
        
        {variant === 'floating' && label && (
          <label
            htmlFor={inputId}
            className={cn(
              "absolute left-3 transition-all duration-200 pointer-events-none",
              isFocused || value 
                ? "top-2 text-xs text-primary" 
                : "top-1/2 -translate-y-1/2 text-muted-foreground"
            )}
          >
            {label}
          </label>
        )}
        
        <input
          type={actualType}
          id={inputId}
          className={cn(
            "flex h-12 w-full rounded-lg border px-3 py-2 text-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            variantStyles[variant],
            error && "border-destructive focus-visible:ring-destructive pr-10",
            isValid && showValidation && "border-green-500 focus-visible:ring-green-500 pr-10",
            loading && "opacity-75",
            startIcon && "pl-10",
            (endIcon || (isPassword && showPasswordToggle) || error || (isValid && showValidation)) && "pr-10",
            className
          )}
          ref={ref}
          value={value}
          maxLength={maxLength}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={
            error ? `${inputId}-error` : displayHelperText ? `${inputId}-help` : undefined
          }
          {...props}
        />
        
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {loading && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary" />
          )}
          
          {error && (
            <AlertCircle className="h-4 w-4 text-destructive" />
          )}
          
          {isValid && showValidation && !error && (
            <CheckCircle className="h-4 w-4 text-green-500" />
          )}
          
          {isPassword && showPasswordToggle && (
            <Button
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
            </Button>
          )}
          
          {endIcon && !error && !(isValid && showValidation) && !loading && (
            <div className="text-muted-foreground">{endIcon}</div>
          )}
        </div>
      </div>
    )

    return (
      <div className="space-y-2">
        {variant !== 'floating' && label && (
          <label 
            htmlFor={inputId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}
        
        {inputElement}
        
        <div className="flex justify-between items-center">
          <div>
            {error && (
              <p id={`${inputId}-error`} className="text-sm text-destructive flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {error}
              </p>
            )}
            {displayHelperText && !error && (
              <p id={`${inputId}-help`} className="text-sm text-muted-foreground">
                {displayHelperText}
              </p>
            )}
          </div>
          
          {showCharCount && maxLength && (
            <p className="text-xs text-muted-foreground">
              {currentLength}/{maxLength}
            </p>
          )}
        </div>
      </div>
    )
  }
)
EnhancedInput.displayName = "EnhancedInput"

export { EnhancedInput }
export default EnhancedInput
