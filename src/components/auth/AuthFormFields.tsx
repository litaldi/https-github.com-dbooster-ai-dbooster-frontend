
import { EnhancedInput } from '@/components/ui/enhanced-input';
import { PasswordField } from '@/components/auth/PasswordField';
import { LoginTypeSelector } from '@/components/auth/LoginTypeSelector';
import { formatPhoneNumber } from '@/utils/validation';
import type { AuthFormData, AuthMode, LoginType, ValidationResult } from '@/types/auth';

interface AuthFormFieldsProps {
  mode: AuthMode;
  loginType: LoginType;
  setLoginType: (type: LoginType) => void;
  formData: AuthFormData;
  errors: Partial<Record<keyof AuthFormData, string>>;
  onInputChange: (field: keyof AuthFormData, value: string) => void;
  onBlur: (field: keyof AuthFormData) => void;
  getFieldValidation: (field: keyof AuthFormData) => ValidationResult;
}

export function AuthFormFields({
  mode,
  loginType,
  setLoginType,
  formData,
  errors,
  onInputChange,
  onBlur,
  getFieldValidation
}: AuthFormFieldsProps) {
  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    onInputChange('phone', formatted);
  };

  return (
    <div className="space-y-4">
      <LoginTypeSelector 
        loginType={loginType} 
        onTypeChange={setLoginType} 
      />

      {/* Name field for signup */}
      {mode === 'signup' && (
        <EnhancedInput
          id="name"
          type="text"
          label="Full Name"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={(e) => onInputChange('name', e.target.value)}
          onBlur={() => onBlur('name')}
          error={getFieldValidation('name').errorMessage}
          isValid={getFieldValidation('name').isValid}
          showValidation={true}
          autoComplete="name"
          required
          aria-describedby={errors.name ? "name-error" : undefined}
        />
      )}

      {/* Email/Phone Field */}
      {loginType === 'email' ? (
        <EnhancedInput
          id="email"
          type="email"
          label="Email Address"
          placeholder="Enter your email address"
          value={formData.email}
          onChange={(e) => onInputChange('email', e.target.value)}
          onBlur={() => onBlur('email')}
          error={getFieldValidation('email').errorMessage}
          isValid={getFieldValidation('email').isValid}
          showValidation={true}
          autoComplete="email"
          required
          aria-describedby={errors.email ? "email-error" : undefined}
        />
      ) : (
        <EnhancedInput
          id="phone"
          type="tel"
          label="Phone Number"
          placeholder="(555) 123-4567"
          value={formData.phone}
          onChange={(e) => handlePhoneChange(e.target.value)}
          onBlur={() => onBlur('phone')}
          error={getFieldValidation('phone').errorMessage}
          isValid={getFieldValidation('phone').isValid}
          showValidation={true}
          autoComplete="tel"
          helperText="We'll send you a verification code"
          required
          aria-describedby={errors.phone ? "phone-error" : undefined}
        />
      )}

      {/* Password Field */}
      <PasswordField
        id="password"
        label="Password"
        value={formData.password}
        onChange={(value) => onInputChange('password', value)}
        placeholder={mode === 'login' ? 'Enter your password' : 'Create a strong password'}
        error={getFieldValidation('password').errorMessage}
        autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
        showStrength={mode === 'signup'}
      />

      {/* Confirm Password for signup */}
      {mode === 'signup' && (
        <PasswordField
          id="confirmPassword"
          label="Confirm Password"
          value={formData.confirmPassword}
          onChange={(value) => onInputChange('confirmPassword', value)}
          placeholder="Confirm your password"
          error={getFieldValidation('confirmPassword').errorMessage}
          autoComplete="new-password"
        />
      )}
    </div>
  );
}
