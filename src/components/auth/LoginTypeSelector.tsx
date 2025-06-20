
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Phone } from 'lucide-react';
import type { LoginType } from '@/types/auth';

interface LoginTypeSelectorProps {
  loginType: LoginType;
  onTypeChange: (type: LoginType) => void;
}

export function LoginTypeSelector({ loginType, onTypeChange }: LoginTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Sign in with</p>
      <div className="flex space-x-2">
        <Button
          type="button"
          variant={loginType === 'email' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onTypeChange('email')}
          className="flex-1"
        >
          <Mail className="w-4 h-4 mr-2" />
          Email
        </Button>
        <Button
          type="button"
          variant={loginType === 'phone' ? 'default' : 'outline'}
          size="sm"
          onClick={() => onTypeChange('phone')}
          className="flex-1"
        >
          <Phone className="w-4 h-4 mr-2" />
          Phone
        </Button>
      </div>
    </div>
  );
}
