
import * as React from "react"
import { Button, ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface EnhancedButtonProps extends ButtonProps {
  loading?: boolean;
}

const EnhancedButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ className, loading, disabled, children, ...props }, ref) => {
    return (
      <Button
        className={cn(className)}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {children}
      </Button>
    )
  }
)
EnhancedButton.displayName = "EnhancedButton"

export { EnhancedButton }
