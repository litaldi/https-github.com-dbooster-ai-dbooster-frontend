
import * as React from "react"
import { cn } from "@/lib/utils"

const inputVariants = {
  base: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm transition-all duration-150",
  focus: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
  disabled: "disabled:cursor-not-allowed disabled:opacity-50",
  file: "file:border-0 file:bg-transparent file:text-sm file:font-medium",
  placeholder: "placeholder:text-muted-foreground",
  states: "hover:border-input/80"
}

const inputClassName = cn(
  inputVariants.base,
  inputVariants.focus,
  inputVariants.disabled,
  inputVariants.file,
  inputVariants.placeholder,
  inputVariants.states
)

export interface InputProps extends React.ComponentProps<"input"> {
  error?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          inputClassName,
          error && "border-destructive focus-visible:ring-destructive",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
