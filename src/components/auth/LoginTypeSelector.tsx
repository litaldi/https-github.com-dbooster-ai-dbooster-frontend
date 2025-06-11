
import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Phone } from 'lucide-react';

interface LoginTypeSelectorProps {
  loginType: 'email' | 'phone';
  onTypeChange: (type: 'email' | 'phone') => void;
}

export function LoginTypeSelector({ loginType, onTypeChange }: LoginTypeSelectorProps) {
  return (
    <TabsList className="grid w-full grid-cols-2 mb-4">
      <TabsTrigger 
        value="email" 
        onClick={() => onTypeChange('email')}
        className="flex items-center gap-2"
        aria-label="Sign in with email"
      >
        <Mail className="h-4 w-4" />
        Email
      </TabsTrigger>
      <TabsTrigger 
        value="phone" 
        onClick={() => onTypeChange('phone')}
        className="flex items-center gap-2"
        aria-label="Sign in with phone"
      >
        <Phone className="h-4 w-4" />
        Phone
      </TabsTrigger>
    </TabsList>
  );
}
