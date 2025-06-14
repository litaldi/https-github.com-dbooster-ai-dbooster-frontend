
import * as React from "react"
import { cn } from "@/lib/utils"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "./button"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helpText?: string
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  variant?: 'default' | 'filled' | 'outline'
  showPasswordToggle?: boolean
  isValid?: boolean
  showValidation?: boolean
}

const EnhancedInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, helpText, startIcon, endIcon, variant = 'default', id, showPasswordToggle, isValid, showValidation, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const inputId = id || React.useId()
    const isPassword = type === 'password'
    const actualType = isPassword && showPassword ? 'text' : type

    const variantStyles = {
      default: "border-input bg-background",
      filled: "border-transparent bg-muted",
      outline: "border-2 border-primary/20 bg-transparent"
    }

    const inputElement = (
      <div className="relative">
        {startIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            {startIcon}
          </div>
        )}
        
        <input
          type={actualType}
          id={inputId}
          className={cn(
            "flex h-12 w-full rounded-lg border px-3 py-2 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            variantStyles[variant],
            error && "border-destructive focus-visible:ring-destructive",
            startIcon && "pl-10",
            (endIcon || (isPassword && showPasswordToggle)) && "pr-10",
            className
          )}
          ref={ref}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={
            error ? `${inputId}-error` : helpText ? `${inputId}-help` : undefined
          }
          {...props}
        />
        
        {(endIcon || (isPassword && showPasswordToggle)) && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {isPassword && showPasswordToggle ? (
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
            ) : (
              <div className="text-muted-foreground">{endIcon}</div>
            )}
          </div>
        )}
      </div>
    )

    if (!label && !error && !helpText) {
      return inputElement
    }

    return (
      <div className="space-y-2">
        {label && (
          <label 
            htmlFor={inputId}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}
        {inputElement}
        {error && (
          <p id={`${inputId}-error`} className="text-sm text-destructive">
            {error}
          </p>
        )}
        {helpText && !error && (
          <p id={`${inputId}-help`} className="text-sm text-muted-foreground">
            {helpText}
          </p>
        )}
      </div>
    )
  }
)
EnhancedInput.displayName = "EnhancedInput"

// Export both names for compatibility
export { EnhancedInput, EnhancedInput as Input }
