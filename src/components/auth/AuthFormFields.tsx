
import { EnhancedInput } from '@/components/ui/enhanced-input';
import { PasswordField } from '@/components/auth/PasswordField';

interface AuthFormFieldsProps {
  mode: 'login' | 'signup';
  formData: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  errors: Record<string, string>;
  onChange: (field: string, value: string) => void;
}

export function AuthFormFields({ mode, formData, errors, onChange }: AuthFormFieldsProps) {
  return (
    <div className="space-y-4">
      {mode === 'signup' && (
        <EnhancedInput
          id="name"
          type="text"
          label="Full Name"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={(e) => onChange('name', e.target.value)}
          error={errors.name}
          required
        />
      )}

      <EnhancedInput
        id="email"
        type="email"
        label="Email Address"
        placeholder="Enter your email address"
        value={formData.email}
        onChange={(e) => onChange('email', e.target.value)}
        error={errors.email}
        required
      />

      <PasswordField
        id="password"
        label="Password"
        value={formData.password}
        onChange={(value) => onChange('password', value)}
        placeholder={mode === 'login' ? 'Enter your password' : 'Create a strong password'}
        error={errors.password}
        showStrength={mode === 'signup'}
      />

      {mode === 'signup' && (
        <PasswordField
          id="confirmPassword"
          label="Confirm Password"
          value={formData.confirmPassword}
          onChange={(value) => onChange('confirmPassword', value)}
          placeholder="Confirm your password"
          error={errors.confirmPassword}
        />
      )}
    </div>
  );
}
