
import { Label } from '@/components/ui/label';
import { EnhancedInput } from '@/components/ui/enhanced-input';
import { formatPhoneNumber } from '@/utils/authValidation';

interface LoginTypeFieldsProps {
  loginType: 'email' | 'phone';
  formData: {
    email: string;
    phone: string;
  };
  errors: Record<string, string>;
  onInputChange: (field: string, value: string) => void;
  onBlur?: (field: string) => void;
  getFieldValidation?: (field: string) => {
    isValid: boolean;
    hasError: boolean;
    errorMessage?: string;
  };
}

export function LoginTypeFields({ 
  loginType, 
  formData, 
  errors, 
  onInputChange,
  onBlur,
  getFieldValidation
}: LoginTypeFieldsProps) {
  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    onInputChange('phone', formatted);
  };

  if (loginType === 'email') {
    const validation = getFieldValidation?.('email') || { isValid: false, hasError: !!errors.email, errorMessage: errors.email };
    
    return (
      <EnhancedInput
        id="email"
        type="email"
        label="Email Address"
        placeholder="Enter your email address"
        value={formData.email}
        onChange={(e) => onInputChange('email', e.target.value)}
        onBlur={() => onBlur?.('email')}
        error={validation.errorMessage}
        isValid={validation.isValid}
        showValidation={true}
        autoComplete="email"
        required
      />
    );
  }

  const validation = getFieldValidation?.('phone') || { isValid: false, hasError: !!errors.phone, errorMessage: errors.phone };

  return (
    <EnhancedInput
      id="phone"
      type="tel"
      label="Phone Number"
      placeholder="(555) 123-4567"
      value={formData.phone}
      onChange={(e) => handlePhoneChange(e.target.value)}
      onBlur={() => onBlur?.('phone')}
      error={validation.errorMessage}
      isValid={validation.isValid}
      showValidation={true}
      autoComplete="tel"
      helperText="We'll send you a verification code"
      required
    />
  );
}
