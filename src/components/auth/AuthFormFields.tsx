
import { EnhancedInput } from '@/components/ui/enhanced-input';
import { PasswordField } from '@/components/auth/PasswordField';
import { LoginTypeFields } from '@/components/auth/LoginTypeFields';

interface AuthFormFieldsProps {
  mode: 'login' | 'signup';
  loginType: 'email' | 'phone';
  formData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  };
  errors: Record<string, string>;
  onInputChange: (field: string, value: string) => void;
  onBlur: (field: string) => void;
  getFieldValidation: (field: string) => {
    isValid: boolean;
    hasError: boolean;
    errorMessage?: string;
  };
}

export function AuthFormFields({
  mode,
  loginType,
  formData,
  errors,
  onInputChange,
  onBlur,
  getFieldValidation
}: AuthFormFieldsProps) {
  return (
    <>
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
          aria-describedby="name-help"
        />
      )}

      {/* Email/Phone Fields */}
      <LoginTypeFields
        loginType={loginType}
        formData={formData}
        errors={errors}
        onInputChange={onInputChange}
        onBlur={onBlur}
        getFieldValidation={getFieldValidation}
      />

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
    </>
  );
}
