
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Mail, Phone } from 'lucide-react';
import type { LoginType } from '@/types/auth';

interface LoginTypeSelectorProps {
  loginType: LoginType;
  onTypeChange: (type: LoginType) => void;
}

export function LoginTypeSelector({ loginType, onTypeChange }: LoginTypeSelectorProps) {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium text-foreground">
        Sign in with
      </Label>
      <RadioGroup
        value={loginType}
        onValueChange={(value) => onTypeChange(value as LoginType)}
        className="flex space-x-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="email" id="email-option" />
          <Label htmlFor="email-option" className="flex items-center gap-2 cursor-pointer">
            <Mail className="h-4 w-4" />
            Email
          </Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="phone" id="phone-option" />
          <Label htmlFor="phone-option" className="flex items-center gap-2 cursor-pointer">
            <Phone className="h-4 w-4" />
            Phone
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}
