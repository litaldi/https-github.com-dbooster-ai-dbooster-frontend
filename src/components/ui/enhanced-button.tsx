
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Loader2, Check } from "lucide-react"
import { motion } from "framer-motion"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:shadow-lg border-0",
        destructive: "bg-destructive text-destructive-foreground shadow-md hover:bg-destructive/90 hover:shadow-lg",
        outline: "border-2 border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground hover:border-accent-foreground/20",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80 hover:shadow-md",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80",
        gradient: "bg-gradient-to-r from-primary via-primary to-purple-600 text-primary-foreground shadow-lg hover:shadow-xl hover:from-primary/90 hover:to-purple-600/90",
        glow: "bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:shadow-primary/25",
        success: "bg-green-600 text-white shadow-md hover:bg-green-700 hover:shadow-lg",
        warning: "bg-yellow-600 text-white shadow-md hover:bg-yellow-700 hover:shadow-lg",
      },
      size: {
        default: "h-11 px-6",
        sm: "h-9 rounded-md px-4 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg font-semibold",
        icon: "h-11 w-11",
        "icon-sm": "h-9 w-9",
        "icon-lg": "h-12 w-12",
      },
      elevation: {
        flat: "shadow-none",
        low: "shadow-sm hover:shadow-md",
        medium: "shadow-md hover:shadow-lg",
        high: "shadow-lg hover:shadow-xl",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      elevation: "medium",
    },
  }
)

export interface EnhancedButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  loadingText?: string
  success?: boolean
  successText?: string
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
  animated?: boolean
  ripple?: boolean
}

const EnhancedButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    elevation,
    asChild = false, 
    loading, 
    loadingText, 
    success,
    successText,
    disabled, 
    children,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    animated = true,
    ripple = false,
    onClick,
    ...props 
  }, ref) => {
    const [isClicked, setIsClicked] = React.useState(false);
    const Comp = asChild ? Slot : "button"
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (ripple) {
        setIsClicked(true);
        setTimeout(() => setIsClicked(false), 300);
      }
      onClick?.(e);
    };

    const buttonContent = () => {
      if (loading) {
        return (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            <span>{loadingText || "Loading..."}</span>
          </>
        );
      }
      
      if (success) {
        return (
          <>
            <Check className="h-4 w-4" aria-hidden="true" />
            <span>{successText || "Success!"}</span>
          </>
        );
      }
      
      return (
        <>
          {icon && iconPosition === 'left' && <span className="[&_svg]:size-4">{icon}</span>}
          {children}
          {icon && iconPosition === 'right' && <span className="[&_svg]:size-4">{icon}</span>}
        </>
      );
    };

    const buttonEl = (
      <Comp
        className={cn(
          buttonVariants({ variant, size, elevation, className }),
          fullWidth && "w-full",
          (loading || success) && "cursor-default",
          "group"
        )}
        ref={ref}
        disabled={disabled || loading}
        onClick={handleClick}
        {...props}
      >
        {buttonContent()}
        
        {/* Ripple effect */}
        {ripple && isClicked && (
          <motion.span
            className="absolute inset-0 bg-white/20 rounded-full"
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 4, opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
        
        {/* Shine effect for gradient buttons */}
        {variant === 'gradient' && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        )}
      </Comp>
    );

    if (animated && !asChild) {
      return (
        <motion.div
          whileHover={{ scale: disabled ? 1 : 1.02, y: disabled ? 0 : -1 }}
          whileTap={{ scale: disabled ? 1 : 0.98 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {buttonEl}
        </motion.div>
      );
    }

    return buttonEl;
  }
)
EnhancedButton.displayName = "EnhancedButton"

export { EnhancedButton, buttonVariants }
