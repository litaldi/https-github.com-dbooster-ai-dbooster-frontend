
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatPhoneNumber } from '@/utils/authValidation';

interface LoginTypeFieldsProps {
  loginType: 'email' | 'phone';
  formData: {
    email: string;
    phone: string;
  };
  errors: Record<string, string>;
  onInputChange: (field: string, value: string) => void;
}

export function LoginTypeFields({ 
  loginType, 
  formData, 
  errors, 
  onInputChange 
}: LoginTypeFieldsProps) {
  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    onInputChange('phone', formatted);
  };

  if (loginType === 'email') {
    return (
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email address"
          value={formData.email}
          onChange={(e) => onInputChange('email', e.target.value)}
          className={errors.email ? "border-destructive" : ""}
          aria-describedby={errors.email ? "email-error" : undefined}
          autoComplete="email"
          required
        />
        {errors.email && (
          <p id="email-error" className="text-sm text-destructive" role="alert">
            {errors.email}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="phone">Phone Number</Label>
      <Input
        id="phone"
        type="tel"
        placeholder="(555) 123-4567"
        value={formData.phone}
        onChange={(e) => handlePhoneChange(e.target.value)}
        className={errors.phone ? "border-destructive" : ""}
        aria-describedby={errors.phone ? "phone-error" : undefined}
        autoComplete="tel"
        required
      />
      {errors.phone && (
        <p id="phone-error" className="text-sm text-destructive" role="alert">
          {errors.phone}
        </p>
      )}
    </div>
  );
}
