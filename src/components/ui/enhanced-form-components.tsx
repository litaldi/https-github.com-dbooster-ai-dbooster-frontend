import React from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  AlertCircle,
  Info,
  Search,
  Lock,
  Mail,
  User,
  Phone
} from 'lucide-react';

// Enhanced Input with validation states
export interface EnhancedInputProps extends React.ComponentProps<'input'> {
  label?: string;
  description?: string;
  error?: string;
  success?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showCharacterCount?: boolean;
  maxLength?: number;
}

export const EnhancedInput = React.forwardRef<HTMLInputElement, EnhancedInputProps>(
  ({ 
    className, 
    label, 
    description, 
    error, 
    success, 
    loading,
    leftIcon,
    rightIcon,
    showCharacterCount,
    maxLength,
    id,
    ...props 
  }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const descriptionId = `${inputId}-description`;
    const errorId = `${inputId}-error`;
    
    return (
      <div className="space-y-2">
        {label && (
          <Label 
            htmlFor={inputId}
            className="text-sm font-medium text-foreground"
          >
            {label}
            {props.required && (
              <span className="text-destructive ml-1" aria-label="required">*</span>
            )}
          </Label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </div>
          )}
          
          <Input
            id={inputId}
            ref={ref}
            className={cn(
              'transition-all duration-200',
              leftIcon && 'pl-10',
              (rightIcon || success || error || loading) && 'pr-10',
              error && 'border-destructive focus-visible:ring-destructive',
              success && 'border-success focus-visible:ring-success',
              className
            )}
            aria-describedby={[
              description ? descriptionId : '',
              error ? errorId : ''
            ].filter(Boolean).join(' ') || undefined}
            aria-invalid={error ? 'true' : undefined}
            maxLength={maxLength}
            {...props}
          />
          
          {/* Right side indicators */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
            {loading && (
              <div className="animate-spin h-4 w-4 border-2 border-muted-foreground border-t-transparent rounded-full" />
            )}
            {success && !loading && (
              <Check className="h-4 w-4 text-success" aria-hidden="true" />
            )}
            {error && !loading && (
              <AlertCircle className="h-4 w-4 text-destructive" aria-hidden="true" />
            )}
            {rightIcon && !loading && !success && !error && rightIcon}
          </div>
        </div>
        
        {/* Character count */}
        {showCharacterCount && maxLength && (
          <div className="text-xs text-muted-foreground text-right">
            {(props.value as string)?.length || 0} / {maxLength}
          </div>
        )}
        
        {/* Description */}
        {description && (
          <p id={descriptionId} className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
        
        {/* Error message */}
        {error && (
          <p id={errorId} role="alert" className="text-sm text-destructive flex items-center gap-2">
            <AlertCircle className="h-4 w-4" aria-hidden="true" />
            {error}
          </p>
        )}
      </div>
    );
  }
);

EnhancedInput.displayName = 'EnhancedInput';

// Password Input with strength indicator
export interface PasswordInputProps extends Omit<EnhancedInputProps, 'type'> {
  showStrengthIndicator?: boolean;
  strengthRules?: Array<{
    test: (password: string) => boolean;
    message: string;
  }>;
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ showStrengthIndicator, strengthRules, value, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const password = value as string || '';
    
    const defaultRules = [
      { test: (p: string) => p.length >= 8, message: 'At least 8 characters' },
      { test: (p: string) => /[A-Z]/.test(p), message: 'One uppercase letter' },
      { test: (p: string) => /[a-z]/.test(p), message: 'One lowercase letter' },
      { test: (p: string) => /\d/.test(p), message: 'One number' },
      { test: (p: string) => /[!@#$%^&*(),.?":{}|<>]/.test(p), message: 'One special character' },
    ];
    
    const rules = strengthRules || defaultRules;
    const passedRules = rules.filter(rule => rule.test(password)).length;
    const strength = passedRules / rules.length;
    
    const getStrengthColor = () => {
      if (strength < 0.4) return 'bg-destructive';
      if (strength < 0.7) return 'bg-warning';
      return 'bg-success';
    };
    
    const getStrengthText = () => {
      if (strength < 0.4) return 'Weak';
      if (strength < 0.7) return 'Medium';
      return 'Strong';
    };
    
    return (
      <div className="space-y-3">
        <EnhancedInput
          {...props}
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          value={value}
          leftIcon={<Lock className="h-4 w-4" />}
          rightIcon={
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          }
        />
        
        {showStrengthIndicator && password && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={cn('h-full transition-all duration-300', getStrengthColor())}
                  style={{ width: `${strength * 100}%` }}
                />
              </div>
              <span className="text-xs font-medium text-muted-foreground">
                {getStrengthText()}
              </span>
            </div>
            
            <div className="grid grid-cols-1 gap-1">
              {rules.map((rule, index) => {
                const passed = rule.test(password);
                return (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    {passed ? (
                      <Check className="h-3 w-3 text-success" />
                    ) : (
                      <X className="h-3 w-3 text-muted-foreground" />
                    )}
                    <span className={passed ? 'text-success' : 'text-muted-foreground'}>
                      {rule.message}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

// Enhanced Textarea with auto-resize
export interface EnhancedTextareaProps extends React.ComponentProps<'textarea'> {
  label?: string;
  description?: string;
  error?: string;
  autoResize?: boolean;
  maxRows?: number;
  minRows?: number;
  showCharacterCount?: boolean;
}

export const EnhancedTextarea = React.forwardRef<HTMLTextAreaElement, EnhancedTextareaProps>(
  ({ 
    className, 
    label, 
    description, 
    error, 
    autoResize,
    maxRows = 10,
    minRows = 3,
    showCharacterCount,
    id,
    ...props 
  }, ref) => {
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);
    const inputId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const descriptionId = `${inputId}-description`;
    const errorId = `${inputId}-error`;
    
    React.useImperativeHandle(ref, () => textareaRef.current!);
    
    React.useEffect(() => {
      if (autoResize && textareaRef.current) {
        const textarea = textareaRef.current;
        const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
        
        const resize = () => {
          textarea.style.height = 'auto';
          const scrollHeight = textarea.scrollHeight;
          const maxHeight = lineHeight * maxRows;
          textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
        };
        
        resize();
        textarea.addEventListener('input', resize);
        
        return () => textarea.removeEventListener('input', resize);
      }
    }, [autoResize, maxRows]);
    
    return (
      <div className="space-y-2">
        {label && (
          <Label 
            htmlFor={inputId}
            className="text-sm font-medium text-foreground"
          >
            {label}
            {props.required && (
              <span className="text-destructive ml-1" aria-label="required">*</span>
            )}
          </Label>
        )}
        
        <Textarea
          id={inputId}
          ref={textareaRef}
          className={cn(
            'transition-all duration-200 resize-none',
            error && 'border-destructive focus-visible:ring-destructive',
            className
          )}
          style={{ minHeight: `${minRows * 1.5}rem` }}
          aria-describedby={[
            description ? descriptionId : '',
            error ? errorId : ''
          ].filter(Boolean).join(' ') || undefined}
          aria-invalid={error ? 'true' : undefined}
          {...props}
        />
        
        {/* Character count */}
        {showCharacterCount && props.maxLength && (
          <div className="text-xs text-muted-foreground text-right">
            {(props.value as string)?.length || 0} / {props.maxLength}
          </div>
        )}
        
        {/* Description */}
        {description && (
          <p id={descriptionId} className="text-sm text-muted-foreground">
            {description}
          </p>
        )}
        
        {/* Error message */}
        {error && (
          <p id={errorId} role="alert" className="text-sm text-destructive flex items-center gap-2">
            <AlertCircle className="h-4 w-4" aria-hidden="true" />
            {error}
          </p>
        )}
      </div>
    );
  }
);

EnhancedTextarea.displayName = 'EnhancedTextarea';

// Smart Email Input with validation
export const EmailInput = React.forwardRef<HTMLInputElement, EnhancedInputProps>(
  (props, ref) => {
    const [isValid, setIsValid] = React.useState<boolean | null>(null);
    
    const validateEmail = (email: string) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value) {
        setIsValid(validateEmail(value));
      } else {
        setIsValid(null);
      }
      props.onChange?.(e);
    };
    
    return (
      <EnhancedInput
        {...props}
        ref={ref}
        type="email"
        onChange={handleChange}
        leftIcon={<Mail className="h-4 w-4" />}
        success={isValid === true}
        error={isValid === false ? 'Please enter a valid email address' : props.error}
      />
    );
  }
);

EmailInput.displayName = 'EmailInput';

// Phone Input with formatting
export const PhoneInput = React.forwardRef<HTMLInputElement, EnhancedInputProps>(
  (props, ref) => {
    const formatPhoneNumber = (value: string) => {
      const phoneNumber = value.replace(/[^\d]/g, '');
      const phoneNumberLength = phoneNumber.length;
      
      if (phoneNumberLength < 4) return phoneNumber;
      if (phoneNumberLength < 7) {
        return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
      }
      return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = formatPhoneNumber(e.target.value);
      e.target.value = formatted;
      props.onChange?.(e);
    };
    
    return (
      <EnhancedInput
        {...props}
        ref={ref}
        type="tel"
        onChange={handleChange}
        leftIcon={<Phone className="h-4 w-4" />}
        placeholder="123-456-7890"
      />
    );
  }
);

PhoneInput.displayName = 'PhoneInput';

// Search Input with enhanced UX
export interface SearchInputProps extends EnhancedInputProps {
  onClear?: () => void;
  suggestions?: string[];
  onSuggestionSelect?: (suggestion: string) => void;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onClear, suggestions, onSuggestionSelect, ...props }, ref) => {
    const [showSuggestions, setShowSuggestions] = React.useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = React.useState<string[]>([]);
    
    React.useEffect(() => {
      if (suggestions && props.value) {
        const filtered = suggestions.filter(suggestion =>
          suggestion.toLowerCase().includes((props.value as string).toLowerCase())
        );
        setFilteredSuggestions(filtered.slice(0, 5));
      } else {
        setFilteredSuggestions([]);
      }
    }, [suggestions, props.value]);
    
    const handleSuggestionClick = (suggestion: string) => {
      onSuggestionSelect?.(suggestion);
      setShowSuggestions(false);
    };
    
    return (
      <div className="relative">
        <EnhancedInput
          {...props}
          ref={ref}
          type="search"
          leftIcon={<Search className="h-4 w-4" />}
          rightIcon={
            props.value && onClear ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={onClear}
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </Button>
            ) : undefined
          }
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        />
        
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50">
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                className="w-full px-3 py-2 text-left hover:bg-accent/50 first:rounded-t-lg last:rounded-b-lg transition-colors"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
);

SearchInput.displayName = 'SearchInput';